// jobs/tronSweeper.js
import '../config/env.js'
import TronWebLib from 'tronweb';
import Bottleneck from 'bottleneck';
import pRetry from 'p-retry';
import { initMongo, getSweepCandidates, decryptPkOrThrow, minSweep } from './common.js';

const TronWeb = TronWebLib?.TronWeb || TronWebLib;
const USDT_DEC = 6;
const DEBUG = process.env.SWEEPER_DEBUG === '1';

// Minimal TRC20 ABI so tronWeb won't fetch ABI from the node (avoids extra RPC)
const TRC20_ABI = [
    {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'Function',
    },
    {
        constant: false,
        inputs: [{ name: '_to', type: 'address' }, { name: '_value', type: 'uint256' }],
        name: 'transfer',
        outputs: [{ name: 'success', type: 'bool' }],
        type: 'Function',
    },
];

// ---- Rate limiter & global cooldown ----
// Start *very* conservative for TronGrid (1 request every ~2s, 1 concurrent)
const tronLimiter = new Bottleneck({
    reservoir: Number(process.env.TRON_RESERVOIR || 1),
    reservoirRefreshAmount: Number(process.env.TRON_REFRESH || 1),
    reservoirRefreshInterval: Number(process.env.TRON_INTERVAL_MS || 2000), // 2s refill
    maxConcurrent: Number(process.env.TRON_CONCURRENT || 1),
    minTime: Number(process.env.TRON_MIN_GAP_MS || 1500), // 1.5s minimum gap
});

let globalPauseUntil = 0;
const GLOBAL_PAUSE_MS = Number(process.env.TRON_GLOBAL_PAUSE_MS || 90_000); // 90s

function withRetry(fn, { retries = 7, min = 1500, max = 9000 } = {}) {
    return pRetry(() => fn(), {
        retries,
        factor: 1.9,
        minTimeout: min,
        maxTimeout: max,
        randomize: true,
        onFailedAttempt: (e) => {
            const code = e?.response?.status ?? e?.code;
            const msg = (e?.message || '').toLowerCase();
            const is429 = code === 429 || /too many|rate|throttle/.test(msg);
            const isNet = /timeout|timed out|econnreset|network/.test(msg);
            if (is429) {
                globalPauseUntil = Date.now() + GLOBAL_PAUSE_MS;
                DEBUG && console.warn('[TRON] 429 detected → global cooldown engaged for', GLOBAL_PAUSE_MS, 'ms');
            }
            if (!is429 && !isNet) throw e; // non-retryable
        },
    });
}

// sugar: run a function through limiter that runs with retry
const scheduleRetry = (fn) => tronLimiter.schedule(() => withRetry(fn));

// Per-address backoff to avoid hammering the same wallet after errors
const addrBackoff = new Map(); // address -> timestamp(ms)

// Build a TronWeb with optional API key header
function makeTron(fullHost, apiKey, pk) {
    const t = new TronWeb({ fullHost, privateKey: pk });
    if (apiKey) t.setHeader({ 'TRON-PRO-API-KEY': apiKey });
    return t;
}

export async function runTronSweeper() {
    await initMongo();

    const fullHost = process.env.TRON_RPC;                 // e.g. https://api.trongrid.io
    const tronKey = process.env.TRONGRID_KEY;             // required for usable limits
    const altHost = process.env.TRON_RPC_ALT || '';       // optional fallback
    const altKey = process.env.TRONGRID_KEY_ALT || '';
    const usdtAddr = process.env.USDT_TRON_ADDRESS;        // e.g. TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
    const mainWallet = process.env.MAIN_WALLET_TRON;         // collector
    const funderPk = process.env.FUNDER_TRON_PRIVATE_KEY;  // drip TRX
    const feeLimit = Number(process.env.TRON_FEE_LIMIT || 20_000_000); // 20 TRX

    if (!fullHost || !usdtAddr || !mainWallet || !funderPk) {
        throw new Error('TRON env vars missing');
    }

    // Clients
    const tronWebFunder = makeTron(fullHost, tronKey, funderPk);
    const tronWebPrimary = makeTron(fullHost, tronKey, funderPk);
    const tronWebAlt = altHost ? makeTron(altHost, altKey, funderPk) : null;

    // Read-only contract handles *without* network ABI fetch
    const usdtROPrimary = tronWebPrimary.contract(TRC20_ABI, usdtAddr);
    const usdtROAlt = tronWebAlt ? tronWebAlt.contract(TRC20_ABI, usdtAddr) : null;

    const minUsdt = minSweep('TRON');

    const wallets = await getSweepCandidates('TRON');
    console.log(`[TRON] Sweep candidates: ${wallets.length}`);

    // Global cooldown: if active, skip this cycle entirely
    if (Date.now() < globalPauseUntil) {
        const waitSec = Math.ceil((globalPauseUntil - Date.now()) / 1000);
        console.warn(`[TRON] Global cooldown active (${waitSec}s left). Skipping cycle.`);
        return;
    }

    // Filter addresses currently under per-address backoff
    const now = Date.now();
    const toProcess = wallets.filter((w) => (addrBackoff.get(w.address) ?? 0) <= now);
    const skipped = wallets.filter((w) => (addrBackoff.get(w.address) ?? 0) > now);
    if (DEBUG && skipped.length) console.log('[TRON] Backoff skip:', skipped.map((x) => x.address));

    for (const w of toProcess) {
        try {
            // If cooldown was engaged mid-loop, use alt read-only client if available
            const inCooldown = Date.now() < globalPauseUntil;
            const roWeb = (inCooldown && tronWebAlt) ? tronWebAlt : tronWebPrimary;
            const usdtRO = (inCooldown && usdtROAlt) ? usdtROAlt : usdtROPrimary;

            // --- 1) Get USDT balance (constant call) ---
            const toHex = roWeb.address.toHex(w.address);
            const balRes = await scheduleRetry(() => usdtRO.balanceOf(toHex).call());

            const balRaw = typeof balRes === 'object' && balRes !== null
                ? (balRes._hex ?? balRes.hex ?? balRes)
                : balRes;
            const balUnits = BigInt(
                typeof balRaw === 'string'
                    ? (balRaw.startsWith('0x') ? balRaw : '0x' + balRaw)
                    : balRaw
            );
            const balUsdt = Number(balUnits) / 10 ** USDT_DEC;
            DEBUG && console.log(`[TRON] ${w.address} USDT=${balUsdt.toFixed(6)} (min=${minUsdt})`);

            if (balUsdt < minUsdt) {
                await new Promise((r) => setTimeout(r, 250)); // gentle spacing
                continue;
            }

            // --- 2) Ensure TRX for energy/bandwidth ---
            const trxBal = await scheduleRetry(() => roWeb.trx.getBalance(w.address));
            DEBUG && console.log(`[TRON] ${w.address} TRX=${(Number(trxBal) / 1e6).toFixed(6)} (need ≈2.000000)`);
            const hasGas = Number(trxBal) > 2_000_000; // ~2 TRX in sun

            if (!hasGas) {
                const fundTx = await scheduleRetry(() => tronWebFunder.trx.sendTransaction(w.address, 3_000_000)); // 3 TRX
                if (!fundTx?.result) {
                    console.warn(`[TRON] funding failed for ${w.address}`);
                    addrBackoff.set(w.address, Date.now() + Number(process.env.TRON_ADDR_BACKOFF_MS || 30_000));
                    continue;
                }
                // allow node to reflect new balance
                await new Promise((r) => setTimeout(r, 700));
            }

            // --- 3) Transfer USDT to main wallet (write via primary client) ---
            const pk = decryptPkOrThrow(w.encPrivateKey);
            tronWebPrimary.setPrivateKey(pk);
            const usdtSigner = tronWebPrimary.contract(TRC20_ABI, usdtAddr);

            const txid = await scheduleRetry(() =>
                usdtSigner.transfer(mainWallet, balUnits).send({ feeLimit })
            );

            console.log(`[TRON] Sweep ${w.address} -> ${mainWallet} ${balUsdt} USDT | tx=${txid}`);
            await new Promise((r) => setTimeout(r, 300)); // spacing between sends

        } catch (e) {
            const ms = Number(process.env.TRON_ADDR_BACKOFF_MS || 30_000);
            addrBackoff.set(w.address, Date.now() + ms);
            console.warn(`[TRON] Sweep error for ${w.address}:`, e?.message || e);
        }
    }

    console.log('[TRON] Sweep cycle done.');
}
