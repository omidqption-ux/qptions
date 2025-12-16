import '../config/env.js'
// watchers/tronWatcher.js
import axios from 'axios';
import TronWebLib from 'tronweb'; // ESM export can be object; we only use static helpers
import ChainCursor from '../models/ChainCursor.js';
import Wallet from '../models/wallet/Wallet.js';
import Transaction from '../models/wallet/Transaction.js';
import { applyConfirmedDepositUSD } from '../services/depositsUSD.js';

// ---- Env / Config ----
const TRON_RPC = process.env.TRON_RPC || 'https://api.trongrid.io';
const TRONGRID_KEY = process.env.TRONGRID_KEY || '';
const USDT_TRON = (process.env.USDT_TRON_ADDRESS || '').trim(); // base58 T...
const TRON_CONFIRMATIONS = Math.max(0, Number(process.env.TRON_CONFIRMATIONS ?? 20));

if (!USDT_TRON) throw new Error('USDT_TRON_ADDRESS missing');

// axios client
const http = axios.create({
    baseURL: TRON_RPC,
    headers: TRONGRID_KEY ? { 'TRON-PRO-API-KEY': TRONGRID_KEY } : undefined,
});

// Window tuning (timestamp ms)
const MAX_INITIAL_WINDOW_MS = 60_000;   // 1m
const MAX_WINDOW_MS = 10 * 60_000;      // 10m
const MIN_WINDOW_MS = 10_000;           // 10s
const SLEEP_MS = 400;
const ADDR_REFRESH_MS = 60_000;
const PAGE_LIMIT = 200;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const nowMs = () => Date.now();

// ---- Tron address helpers (no constructor needed) ----
const TW = TronWebLib?.TronWeb || TronWebLib || {};
function toBase58(addr) {
    try {
        // accept hex or base58; normalize to base58
        const hex = TW.address?.toHex ? TW.address.toHex(addr) : null;
        if (hex && TW.address?.fromHex) return TW.address.fromHex(hex);
    } catch { }
    return addr; // best effort
}

// ---- Address caches ----
let _addrSet = null;
let _addrNextRefresh = 0;
let _addrToUser = new Map();

async function refreshAddressCaches() {
    const docs = await Wallet.find({
        chain: 'TRON',
        type: 'deposit',
        isActive: true,
    }).select({ address: 1, userId: 1 }).lean();

    const set = new Set();
    const map = new Map();

    for (const d of docs) {
        const base = toBase58((d.address || '').trim());
        if (!base) continue;
        set.add(base);
        map.set(base, d.userId);
    }

    _addrSet = set;
    _addrToUser = map;
    _addrNextRefresh = nowMs() + ADDR_REFRESH_MS;

    console.log(`[TRON] Loaded ${set.size} deposit addresses`);
}

async function getAddrSet() {
    if (_addrSet && nowMs() < _addrNextRefresh) return _addrSet;
    await refreshAddressCaches();
    return _addrSet;
}
const getUserIdByAddress = (a) => _addrToUser.get(a) || null;

// ---- Tx row idempotency ----
async function ensurePendingTx({ chain, txHash, blockNumber, to, amountMicros, session }) {
    const existing = await Transaction.findOne({ chain, txHash }, null, { session });
    if (existing) return existing._id;

    const [created] = await Transaction.create([{
        chain,
        token: 'USDT',
        asset: 'USDT-TRC20',
        status: 'pending',
        txHash,
        to,
        amountMicros: Number(amountMicros),
        blockNumber,
        createdAt: new Date(),
    }], { session });

    return created._id;
}

// ---- Chain heads / events ----
async function getHeadBlockNumber() {
    const { data } = await http.post('/wallet/getnowblock', {});
    return data?.block_header?.raw_data?.number ?? 0;
}

async function fetchTransferEvents({ contract, minTs, maxTs, fingerprint = null }) {
    const url = new URL(`/v1/contracts/${contract}/events`, TRON_RPC);
    url.searchParams.set('event_name', 'Transfer');
    url.searchParams.set('only_confirmed', 'true');
    url.searchParams.set('min_block_timestamp', String(minTs));
    url.searchParams.set('max_block_timestamp', String(maxTs));
    url.searchParams.set('limit', String(PAGE_LIMIT));
    url.searchParams.set('order_by', 'block_timestamp,asc');
    if (fingerprint) url.searchParams.set('fingerprint', fingerprint);

    const { data } = await http.get(url.toString().replace(TRON_RPC, '')); // http has baseURL
    const events = Array.isArray(data?.data) ? data.data : [];
    const next = data?.next?.fingerprint || null;
    return { events, next };
}

// ---- Main watcher ----
export async function runTronWatcher() {
    // Cursor is timestamp-based
    let cursor = await ChainCursor.findOne({ chain: 'TRON', contract: USDT_TRON });
    const startFromEnv = Number(process.env.TRON_START_TS || 0); // epoch ms
    let fromTs;

    if (!cursor) {
        const defaultStart = startFromEnv > 0 ? startFromEnv : (nowMs() - 2 * 60_000);
        cursor = await ChainCursor.create({
            chain: 'TRON',
            network: 'tron',
            contract: USDT_TRON,
            cursorType: 'event',
            lastProcessedBlock: 0,
            lastProcessedTs: new Date(defaultStart),
        });
        fromTs = defaultStart;
    } else {
        fromTs = cursor.lastProcessedTs
            ? new Date(cursor.lastProcessedTs).getTime()
            : (startFromEnv || (nowMs() - 2 * 60_000));
    }

    let windowMs = MAX_INITIAL_WINDOW_MS;
    console.log(`[TRON] start scanning from ts=${fromTs} (${new Date(fromTs).toISOString()})`);

    // prime address cache
    await refreshAddressCaches();

    while (true) {
        try {
            const headBlock = await getHeadBlockNumber();
            const headTs = nowMs();
            const toTs = Math.min(fromTs + windowMs, headTs);

            const addrSet = await getAddrSet();
            if (!addrSet || addrSet.size === 0) {
                await ChainCursor.updateOne(
                    { _id: cursor._id },
                    { $set: { lastProcessedTs: new Date(toTs) } }
                );
                cursor.lastProcessedTs = new Date(toTs);
                fromTs = toTs + 1;
                await sleep(1000);
                continue;
            }

            let totalEvents = 0;
            let fingerprint = null;
            let lastEventTs = fromTs;

            do {
                const { events, next } = await fetchTransferEvents({
                    contract: USDT_TRON,
                    minTs: fromTs,
                    maxTs: toTs,
                    fingerprint,
                });

                fingerprint = next;
                totalEvents += events.length;

                for (const ev of events) {
                    const toBase58 = ev?.result?.to;
                    if (!toBase58) continue;
                    if (!addrSet.has(toBase58)) continue;

                    const valueStr = ev?.result?.value ?? '0'; // integer string (6 decimals)
                    const txHash = ev?.transaction_id;
                    const blockNumber = ev?.block_number ?? 0;
                    const eventTs = ev?.block_timestamp ?? toTs;

                    const confirmations = Math.max(0, headBlock - blockNumber);
                    if (confirmations < TRON_CONFIRMATIONS) continue;

                    const userId = getUserIdByAddress(toBase58);
                    if (!userId) continue;

                    await ensurePendingTx({
                        chain: 'TRON',
                        txHash,
                        blockNumber,
                        to: toBase58,
                        amountMicros: valueStr,
                        session: null,
                    });

                    await applyConfirmedDepositUSD({
                        userId,
                        chain: 'TRON',
                        asset: 'USDT-TRC20',
                        amountMicros: Number(valueStr),
                        txHash,
                        confirmations,
                    });

                    if (eventTs > lastEventTs) lastEventTs = eventTs;
                }
            } while (fingerprint);

            const newCursorTs = Math.max(lastEventTs, toTs);
            await ChainCursor.updateOne(
                { _id: cursor._id },
                { $set: { lastProcessedTs: new Date(newCursorTs), lastProcessedBlock: headBlock } }
            );
            cursor.lastProcessedTs = new Date(newCursorTs);

            // tune window
            if (totalEvents < PAGE_LIMIT / 2 && windowMs < MAX_WINDOW_MS) {
                windowMs = Math.min(Math.floor(windowMs * 1.25), MAX_WINDOW_MS);
            } else if (totalEvents >= PAGE_LIMIT * 2 && windowMs > MIN_WINDOW_MS) {
                windowMs = Math.max(MIN_WINDOW_MS, Math.floor(windowMs / 2));
            }

            fromTs = newCursorTs + 1;
            await sleep(SLEEP_MS);
        } catch (err) {
            const msg = err?.response?.data || err?.message || String(err);
            if (/rate|limit|Too Many|timeout|ETIMEDOUT|ECONNRESET/i.test(msg)) {
                console.warn('[TRON] transient issue; backoff 1s');
                await sleep(1000);
                continue;
            }
            console.error('[TRON] fatal error:', msg);
            throw err;
        }
    }
}
