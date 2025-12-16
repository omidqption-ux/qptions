// watchers/ethWatcher.js
import '../config/env.js';
import { ethers } from 'ethers';
import ChainCursor from '../models/ChainCursor.js';
import Wallet from '../models/wallet/Wallet.js';
import Transaction from '../models/wallet/Transaction.js';
import { applyConfirmedDepositUSD } from '../services/depositsUSD.js';

/** ========= ENV / CONFIG ========= */
const ETH_RPC = process.env.ETH_RPC;
const ETH_RPC_ALT = process.env.ETH_RPC_ALT || ''; // optional (reads only)
const ETH_NETWORK = (process.env.ETH_NETWORK || 'mainnet').toLowerCase(); // 'mainnet'|'sepolia'...
const USDT = (process.env.USDT_ETH_ADDRESS || '').toLowerCase(); // 0xdAC17F... on mainnet
const CONFIRMATIONS_REQUIRED = Math.max(0, Number(process.env.ETH_CONFIRMATIONS ?? 2));
const DEBUG = process.env.WATCHER_DEBUG === '1' || process.env.SWEEPER_DEBUG === '1';

if (!ETH_RPC || !USDT) throw new Error('ETH_RPC or USDT_ETH_ADDRESS missing');

/** Scan tuning (override via env if you like) */
const START_SPAN = Number(process.env.WATCHER_ETH_START_SPAN || 500);
const MIN_SPAN = Number(process.env.WATCHER_ETH_MIN_SPAN || 64);
const MAX_SPAN = Number(process.env.WATCHER_ETH_MAX_SPAN || 5000);
const TARGET_LOGS = Number(process.env.WATCHER_ETH_TARGET_LOGS || 2000);
const MAX_LOGS = Number(process.env.WATCHER_ETH_MAX_LOGS || 5000);
const REORG_OVERLAP = Number(process.env.WATCHER_ETH_REORG_OVERLAP || 6);
const SLEEP_MS = Number(process.env.WATCHER_ETH_SLEEP_MS || 400);

const ADDR_BATCH_SIZE = Number(process.env.WATCHER_ETH_ADDR_BATCH || 50);
const ADDR_REFRESH_MS = Number(process.env.WATCHER_ETH_ADDR_REFRESH_MS || 60_000);

/** ========= HELPERS ========= */
const CHAIN_ID_MAP = { mainnet: 1, homestead: 1, sepolia: 11155111 };
const CHAIN_ID = CHAIN_ID_MAP[ETH_NETWORK] ?? 1;

const TRANSFER_SIG = ethers.id('Transfer(address,address,uint256)'); // v6

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function toTopicAddress(addr) {
    const checksummed = ethers.getAddress(addr);
    return ethers.zeroPadValue(checksummed, 32).toLowerCase();
}

/** Provider stack (pin chainId; alt is read-only fallback) */
function makeProvider(url) { return new ethers.JsonRpcProvider(url, CHAIN_ID); }
const READ_STACK = [ETH_RPC, ETH_RPC_ALT, 'https://cloudflare-eth.com'].filter(Boolean).map(makeProvider);
let readIdx = 0;
function currentRead() { return READ_STACK[readIdx]; }
async function getLogsWithRotate(filter) {
    const tries = READ_STACK.length || 1;
    for (let i = 0; i < tries; i++) {
        const p = READ_STACK[readIdx];
        try { return await p.getLogs(filter); }
        catch (e) {
            const msg = (e?.message || '').toLowerCase();
            const code = e?.code ?? e?.status;
            const auth = code === 401 || code === 403 || msg.includes('authenticated') || msg.includes('forbidden');
            const rate = code === -32005 || code === 429 || msg.includes('too many') || msg.includes('rate') || msg.includes('limit');
            if ((auth || rate) && READ_STACK.length > 1) {
                readIdx = (readIdx + 1) % READ_STACK.length; // rotate
                DEBUG && console.warn('[ETH] rotating read provider due to:', code || msg);
                continue;
            }
            throw e;
        }
    }
    throw new Error('All ETH RPCs failed for getLogs');
}

/** ========= Address cache (deposit wallets) ========= */
let _addrBatches = null;
let _addrNextRefresh = 0;
let _addrToUserCache = new Map();

async function refreshAddrCaches() {
    const docs = await Wallet.find({
        chain: 'ETH', type: 'deposit', isActive: true,
    }).select({ address: 1, userId: 1 }).lean();

    const topicAddrs = [];
    const map = new Map();

    for (const d of docs) {
        const lower = (d.address || '').toLowerCase();
        if (!lower) continue;
        topicAddrs.push(toTopicAddress(lower));
        map.set(lower, d.userId);
    }

    // batch for topics OR
    const batches = [];
    for (let i = 0; i < topicAddrs.length; i += ADDR_BATCH_SIZE) {
        batches.push(topicAddrs.slice(i, i + ADDR_BATCH_SIZE));
    }

    _addrBatches = batches;
    _addrToUserCache = map;
    _addrNextRefresh = Date.now() + ADDR_REFRESH_MS;

    if (batches.length === 0) {
        console.warn('[ETH] No active deposit addresses found; watcher will idle.');
    } else {
        console.log(`[ETH] Loaded ${map.size} deposit addresses in ${batches.length} batches`);
    }
}

async function getAddressBatches() {
    const now = Date.now();
    if (!_addrBatches || now >= _addrNextRefresh) await refreshAddrCaches();
    return _addrBatches || [];
}

async function getUserIdByAddress(addressLower) {
    // cache first
    if (_addrToUserCache.size === 0) await refreshAddrCaches();
    const uid = _addrToUserCache.get(addressLower);
    if (uid) return uid;

    // fallback slow path (and cache)
    const doc = await Wallet.findOne({
        chain: 'ETH', type: 'deposit', isActive: true,
        address: new RegExp(`^${addressLower}$`, 'i'),
    }).select({ userId: 1 }).lean();

    if (doc?.userId) {
        _addrToUserCache.set(addressLower, doc.userId);
        return doc.userId;
    }
    return null;
}

/** ========= Log decoding & crediting ========= */
const iface = new ethers.Interface([
    'event Transfer(address indexed from, address indexed to, uint256 value)',
]);

async function ensurePendingTx({ chain, txHash, blockNumber, to, amountMicros, session }) {
    const existing = await Transaction.findOne({ chain, txHash }, null, { session });
    if (existing) return existing._id;

    const [created] = await Transaction.create([{
        chain,
        token: 'USDT',
        asset: 'USDT-ERC20',
        status: 'pending',
        txHash,
        to,
        amountMicros: Number(amountMicros), // USDT uses 6 decimals; your service can handle it
        blockNumber,
        createdAt: new Date(),
    }], { session });

    return created._id;
}

async function handleTransferLog(headBlock, log) {
    // validate event
    if ((log.topics?.[0] || '').toLowerCase() !== TRANSFER_SIG.toLowerCase()) return;

    // parse
    const parsed = iface.parseLog(log);
    const toLower = parsed.args.to.toLowerCase();
    const value = parsed.args.value; // BigInt
    const amountMicros = value.toString();

    // confirmations
    const confirmations = Math.max(0, headBlock - log.blockNumber);
    if (confirmations < CONFIRMATIONS_REQUIRED) return;

    // resolve user
    const userId = await getUserIdByAddress(toLower);
    if (!userId) return; // not ours (shouldn’t happen due to filter)

    // ensure a pending row for idempotency
    await ensurePendingTx({
        chain: 'ETH',
        txHash: log.transactionHash,
        blockNumber: log.blockNumber,
        to: toLower,
        amountMicros,
        session: null,
    });

    // atomic credit (your service should be idempotent)
    await applyConfirmedDepositUSD({
        userId,
        chain: 'ETH',
        asset: 'USDT-ERC20',
        amountMicros: Number(amountMicros),
        txHash: log.transactionHash,
        confirmations,
    });
}

/** ========= Main watcher loop ========= */
export async function runEthWatcher() {
    // pin chainId to avoid “failed to detect network”
    const provider = new ethers.JsonRpcProvider(ETH_RPC, CHAIN_ID);

    // init cursor
    let cursor = await ChainCursor.findOne({ chain: 'ETH', contract: USDT });
    const latest = await provider.getBlockNumber();
    const startFromEnv = Number(process.env.ETH_START_BLOCK || 0);
    const initialFrom = cursor?.lastProcessedBlock
        ? cursor.lastProcessedBlock + 1
        : (startFromEnv > 0 ? startFromEnv : Math.max(0, latest - 5000));

    if (!cursor) {
        cursor = await ChainCursor.create({
            chain: 'ETH',
            network: ETH_NETWORK,
            contract: USDT,
            cursorType: 'event',
            lastProcessedBlock: initialFrom - 1,
            lastProcessedTs: new Date(),
        });
    }

    console.log(`[ETH] start scanning from ${initialFrom} (latest ${latest})`);
    let fromBlock = initialFrom;
    let span = Math.min(MAX_SPAN, Math.max(MIN_SPAN, START_SPAN));

    // prime caches
    await refreshAddrCaches();

    while (true) {
        try {
            const head = await currentRead().getBlockNumber();
            if (fromBlock > head) { await sleep(1200); continue; }
            let toBlock = Math.min(fromBlock + span - 1, head);

            const batches = await getAddressBatches();
            if (batches.length === 0) {
                // advance cursor gently to keep up
                await ChainCursor.updateOne(
                    { _id: cursor._id },
                    { $set: { lastProcessedBlock: toBlock, lastProcessedTs: new Date() } }
                );
                cursor.lastProcessedBlock = toBlock;
                fromBlock = toBlock + 1;
                await sleep(1500);
                continue;
            }

            let totalLogs = 0;

            for (const batch of batches) {
                // topics: [Transfer, from(any)=null, to(in batch)]
                const filter = {
                    address: USDT,
                    fromBlock,
                    toBlock,
                    topics: [TRANSFER_SIG, null, batch],
                };

                let logs;
                try {
                    logs = await getLogsWithRotate(filter);
                } catch (e) {
                    // Adaptive shrink on “too many logs / response size”
                    const msg = (e?.message || '').toLowerCase();
                    const code = e?.code ?? e?.status;
                    const tooMany = /10000 results|response size|result window is too large|log response size exceeded/.test(msg);
                    const rate = code === -32005 || code === 429 || /too many requests|rate|throttle/.test(msg);
                    if (tooMany) {
                        span = Math.max(MIN_SPAN, Math.floor(span / 2));
                        console.warn(`[ETH] too many logs (provider error); halving span to ${span}`);
                        // retry whole window with smaller span
                        toBlock = Math.min(fromBlock + span - 1, head);
                        // restart batch loop for new toBlock
                        continue;
                    }
                    if (rate) {
                        console.warn('[ETH] rate limited; backing off 1s');
                        await sleep(1000);
                        // retry same filter
                        const retry = await getLogsWithRotate({ ...filter });
                        logs = retry;
                    } else {
                        throw e;
                    }
                }

                totalLogs += logs.length;
                if (totalLogs >= MAX_LOGS) {
                    // cut window if a single big batch returned too much (paranoia)
                    span = Math.max(MIN_SPAN, Math.floor(span / 2));
                    console.warn(`[ETH] too many logs (${totalLogs}); halving span to ${span}`);
                    // restart window
                    toBlock = Math.min(fromBlock + span - 1, head);
                    totalLogs = 0;
                    break;
                }

                if (DEBUG) {
                    console.log(`[ETH] [${fromBlock}, ${toBlock}] batch logs=${logs.length} (span=${span})`);
                }

                for (const log of logs) {
                    try {
                        await handleTransferLog(head, log);
                    } catch (e) {
                        console.error('[ETH] deposit handler error:', e?.message || e);
                    }
                }
            }

            // Advance cursor after processing the window; keep overlap for reorgs
            await ChainCursor.updateOne(
                { _id: cursor._id },
                { $set: { lastProcessedBlock: toBlock, lastProcessedTs: new Date() } }
            );
            cursor.lastProcessedBlock = toBlock;
            fromBlock = toBlock - REORG_OVERLAP + 1;

            // grow span when quiet
            if (totalLogs < Math.max(1, Math.floor(TARGET_LOGS / 4)) && span < MAX_SPAN) {
                span = Math.min(MAX_SPAN, Math.floor(span * 1.5));
            }

            await sleep(SLEEP_MS);

        } catch (err) {
            const code = err?.error?.code ?? err?.code;
            const data = err?.error?.data;
            const msg = err?.error?.message || err?.message || '';

            if (code === -32005 && data?.from && data?.to) {
                // Some providers return a suggested 'to'
                const suggestedTo = Number(BigInt(data.to));
                const newSpan = Math.max(MIN_SPAN, suggestedTo - fromBlock + 1);
                span = Math.min(newSpan, span); // shrink only
                console.warn(`[ETH] provider suggested shrink; next span=${span} (to=${suggestedTo})`);
                continue;
            }
            if (/10000 results|too many|response size|result window is too large/i.test(msg)) {
                span = Math.max(MIN_SPAN, Math.floor(span / 2));
                console.warn(`[ETH] too many logs; halving span to ${span}`);
                continue;
            }
            if (/rate|limit|busy|timeout|econnreset|etimedout/i.test(msg)) {
                console.warn('[ETH] transient RPC issue; backing off 1s');
                await sleep(1000);
                continue;
            }

            console.error('[ETH] fatal getLogs error:', err);
            throw err; // let the runner log & exit; PM2/systemd restarts
        }
    }
}
