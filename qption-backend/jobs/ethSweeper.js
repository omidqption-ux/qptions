// jobs/ethSweeper.js
import Bottleneck from 'bottleneck';
import pRetry from 'p-retry';
import { ethers } from 'ethers';
import ERC20 from '../utils/erc20Abi.js';
import { initMongo, getSweepCandidates, decryptPkOrThrow, minSweep } from './common.js';

const USDT_DEC = 6;
const MULTICALL3 = '0xcA11bde05977b3631167028862bE2a173976CA11'; // mainnet
const DEBUG = process.env.SWEEPER_DEBUG === '1';
const FORCE = process.env.ETH_SWEEP_FORCE === '1';

// ----- Rate limit + retry helpers -----
const ethLimiter = new Bottleneck({
    reservoir: Number(process.env.ETH_RESERVOIR || 20),
    reservoirRefreshAmount: Number(process.env.ETH_REFRESH || 20),
    reservoirRefreshInterval: Number(process.env.ETH_INTERVAL_MS || 1000),
    maxConcurrent: Number(process.env.ETH_CONCURRENT || 2),
    minTime: Number(process.env.ETH_MIN_GAP_MS || 75),
});

function withRetry(fn, { retries = 6, min = 300, max = 2500 } = {}) {
    return pRetry(() => fn(), {
        retries,
        factor: 1.8,
        minTimeout: min,
        maxTimeout: max,
        randomize: true,
        onFailedAttempt: (e) => {
            const code = e?.code ?? e?.status;
            const msg = (e?.message || '').toLowerCase();
            const retryable =
                code === -32005 || code === 429 ||
                msg.includes('too many requests') ||
                msg.includes('rate') || msg.includes('throttle') ||
                msg.includes('timeout') || msg.includes('timed out') ||
                msg.includes('econnreset') || msg.includes('network');
            if (!retryable) throw e;
        }
    });
}

// sugar: schedule a job through the limiter with retry
const scheduleRetry = (fn) => ethLimiter.schedule(() => withRetry(fn));

// Fallback provider stack for read-only calls
function makeProviderStack(urls, chainId = 1) {
    const stack = urls.filter(Boolean).map(u => new ethers.JsonRpcProvider(u, chainId));
    if (!stack.length) throw new Error('No ETH RPC URLs provided');
    let idx = 0;
    return {
        async call(tx) {
            for (let i = 0; i < stack.length; i++) {
                const p = stack[(idx + i) % stack.length];
                try {
                    const res = await p.call(tx);
                    idx = (idx + i) % stack.length;
                    return res;
                } catch (e) {
                    const m = (e?.message || '').toLowerCase();
                    if (!m.includes('-32005') && !m.includes('too many') && !m.includes('rate')) throw e;
                    // try next provider
                }
            }
            throw new Error('All ETH RPCs rate-limited/unavailable');
        },
        current() { return stack[idx]; },  // for reads like getBalance
        first() { return stack[0]; },    // for sending txs
    };
}

// Multicall3 aggregate for USDT balances
const erc20Iface = new ethers.Interface(['function balanceOf(address) view returns (uint256)']);
const mcIface = new ethers.Interface([
    'function aggregate((address target, bytes callData)[]) returns (uint256 blockNumber, bytes[] returnData)'
]);

async function fetchUsdtBalancesMulticall(providerStack, usdtAddr, addresses, chunkSize = 250) {
    const out = [];
    for (let i = 0; i < addresses.length; i += chunkSize) {
        const slice = addresses.slice(i, i + chunkSize);
        const calls = slice.map(a => [usdtAddr, erc20Iface.encodeFunctionData('balanceOf', [a])]);
        const data = mcIface.encodeFunctionData('aggregate', [calls]);

        const raw = await scheduleRetry(() => providerStack.call({ to: MULTICALL3, data }));
        const [, returnData] = mcIface.decodeFunctionResult('aggregate', raw);

        for (let j = 0; j < slice.length; j++) {
            const dec = erc20Iface.decodeFunctionResult('balanceOf', returnData[j])[0]; // BigInt-like
            out.push({ address: slice[j], balance: dec });
        }
    }
    return out;
}

// Per-address backoff (skip addresses that errored recently)
const addrBackoff = new Map(); // address -> timestamp(ms)

export async function runEthSweeper() {
    await initMongo();

    const rpcPrimary = process.env.ETH_RPC;                      // e.g. Infura
    const rpcAlt = process.env.ETH_RPC_ALT;                  // e.g. Alchemy/QuickNode
    const rpcFree = 'https://cloudflare-eth.com';             // free fallback
    const usdtAddr = process.env.USDT_ETH_ADDRESS;             // mainnet USDT
    const mainWallet = process.env.MAIN_WALLET_ETH;              // collection wallet
    const funderPk = process.env.FUNDER_ETH_PRIVATE_KEY;

    if (!rpcPrimary || !usdtAddr || !mainWallet || !funderPk) {
        throw new Error('ETH env vars missing');
    }

    // Read stack (multicall & misc reads)
    const stack = makeProviderStack([rpcPrimary, rpcAlt, rpcFree], 1)

    // Writer for sending txs (stick to primary)
    const writeProvider = new ethers.JsonRpcProvider(rpcPrimary, 1);
    const funder = new ethers.Wallet(funderPk, writeProvider);

    const minUsdt = minSweep('ETH');
    const gasMinEth = process.env.ETH_GAS_MIN_ETH || '0.0002';
    const gasDripEth = process.env.ETH_GAS_DRIP_ETH || '0.0005';

    const wallets = await getSweepCandidates('ETH');
    console.log(`[ETH] Sweep candidates: ${wallets.length}`);

    // Build a quick map for PK lookup
    const pkMap = new Map(wallets.map(w => [w.address, w.encPrivateKey]));

    // Filter by backoff
    const now = Date.now();
    const candidates = wallets
        .map(w => w.address)
        .filter(a => (addrBackoff.get(a) ?? 0) <= now);

    const skipped = wallets.filter(w => (addrBackoff.get(w.address) ?? 0) > now);
    if (DEBUG && skipped.length) {
        console.log('[ETH] Backoff skip:', skipped.map(x => x.address));
    }

    if (!candidates.length) {
        console.log('[ETH] No candidates after backoff filter.');
        return;
    }

    // 1) Batch-fetch USDT balances via Multicall
    const balances = await fetchUsdtBalancesMulticall(
        stack,
        usdtAddr,
        candidates,
        Number(process.env.ETH_MC_CHUNK || 250)
    );

    // 2) Build work list (addresses with >= minUsdt) — with DEBUG and FORCE support
    const work = [];
    for (const { address, balance } of balances) {
        const tokenBal = BigInt(balance.toString()); // normalize
        const tokenBalUsdt = Number(tokenBal) / 10 ** USDT_DEC;
        if (DEBUG) console.log(`[ETH] ${address} USDT=${tokenBalUsdt.toFixed(6)} (min=${minUsdt})`);
        if (tokenBal === 0n) continue; // always skip zero
        if (tokenBalUsdt >= minUsdt || FORCE) {
            work.push({ address, tokenBal, tokenBalUsdt });
        }
    }
    console.log(`[ETH] Non-zero selected: ${work.length}${FORCE ? ' (FORCED)' : ''}`);

    // 3) Sweep each address (rate-limited + retries around reads/writes)
    for (const w of work) {
        try {
            // Ensure native gas (ETH) exists
            const ethBal = await scheduleRetry(() => stack.current().getBalance(w.address));
            if (DEBUG) {
                console.log(`[ETH] ${w.address} ETH=${ethers.formatEther(ethBal)} (need >= ${gasMinEth})`);
            }
            const hasGas = ethBal > ethers.parseEther(gasMinEth);

            if (!hasGas) {
                const drip = ethers.parseEther(gasDripEth);
                const tx = await scheduleRetry(() =>
                    funder.sendTransaction({ to: w.address, value: drip })
                );
                await scheduleRetry(() => tx.wait());
            }

            // Send USDT transfer from deposit address to main
            const encPk = pkMap.get(w.address);
            const pk = decryptPkOrThrow(encPk);
            const signer = new ethers.Wallet(pk, writeProvider);
            const usdtSigner = new ethers.Contract(usdtAddr, ERC20, signer);

            const tx2 = await scheduleRetry(() =>
                usdtSigner.transfer(mainWallet, w.tokenBal)
            );

            console.log(`[ETH] Sweep ${w.address} -> ${mainWallet} ${w.tokenBalUsdt} USDT | tx=${tx2.hash}`);

            await scheduleRetry(() => tx2.wait());

        } catch (e) {
            const ms = Number(process.env.ETH_ADDR_BACKOFF_MS || 20_000);
            addrBackoff.set(w.address, Date.now() + ms);
            console.warn(`[ETH] Sweep error for ${w.address}:`, e.message || e);
        }
    }

    console.log('[ETH] Sweep cycle done.');
}
