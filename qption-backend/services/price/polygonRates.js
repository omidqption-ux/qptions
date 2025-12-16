// services/price/polygonRates.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.polygon.io',
    timeout: 8000,
});

const TICKER_MAP = {
    // stablecoins (direct 1:1)
    'USDT-ERC20': { type: 'fixed', value: 1 },
    'USDT-TRC20': { type: 'fixed', value: 1 },
    USDT: { type: 'fixed', value: 1 },
    USDC: { type: 'fixed', value: 1 },

    // crypto → Polygon crypto tickers
    BTC: { type: 'crypto', ticker: 'X:BTCUSD' },
    ETH: { type: 'crypto', ticker: 'X:ETHUSD' },
    SOL: { type: 'crypto', ticker: 'X:SOLUSD' },
    BNB: { type: 'crypto', ticker: 'X:BNBUSD' },
    XRP: { type: 'crypto', ticker: 'X:XRPUSD' },
};

// tiny in-memory cache to avoid hammering the API
const cache = new Map();
const TTL_MS = 10_000; // 10s

function setCache(key, value) {
    cache.set(key, { value, exp: Date.now() + TTL_MS });
}
function getCache(key) {
    const hit = cache.get(key);
    if (hit && hit.exp > Date.now()) return hit.value;
    cache.delete(key);
    return null;
}

/**
 * Normalize asset key – accept inputs like 'BTC', 'ETH', 'USDT-ERC20', etc.
 */
function normKey(asset) {
    return String(asset || '').trim().toUpperCase();
}

/**
 * Try Polygon Single Ticker Snapshot first:
 *   GET /v2/snapshot/locale/global/markets/crypto/tickers/{ticker}
 * Fallback to Last Trade:
 *   GET /v1/last/crypto/{from}/{to}
 */
async function fetchCryptoUsd(ticker) {
    const apiKey = process.env.POLYGON_API_KEY;
    if (!apiKey) throw new Error('POLYGON_API_KEY is missing');

    // 1) Single Ticker Snapshot
    try {
        const { data } = await api.get(
            `/v2/snapshot/locale/global/markets/crypto/tickers/${encodeURIComponent(ticker)}`,
            { params: { apiKey } }
        );
        // Snapshot shape includes lastTrade price; use that as the spot
        const px =
            data?.ticker?.lastTrade?.price ??
            data?.ticker?.lastTrade?.p ??
            data?.lastTrade?.price ??
            data?.lastTrade?.p;

        if (px && Number.isFinite(Number(px))) return Number(px);
    } catch (_) {
        // continue to fallback
    }

    // 2) Last Trade fallback (e.g., /v1/last/crypto/BTC/USD)
    try {
        const [base, quote] = ticker.replace('X:', '').split(/(?=[A-Z]{3}$)/); // "BTCUSD" -> ["BTC","USD"]
        const { data } = await api.get(`/v1/last/crypto/${base}/${quote}`, { params: { apiKey } });
        const px = data?.price ?? data?.last?.price;
        if (px && Number.isFinite(Number(px))) return Number(px);
    } catch (_) {
        // throw below
    }

    throw new Error(`Polygon price not available for ${ticker}`);
}

/**
 * Public: getUsdRate({ asset })
 * Supports:
 *  - 'USDT-ERC20' | 'USDT-TRC20' | 'USDT' -> 1.0
 *  - 'BTC' | 'ETH' | 'SOL' | 'BNB' | 'XRP' -> live USD price via Polygon
 */
export async function getUsdRate({ asset }) {
    const key = normKey(asset);
    const cached = getCache(key);
    if (cached) return cached;

    const map = TICKER_MAP[key];
    if (!map) throw new Error(`Unsupported asset for USD rate: ${key}`);

    let rate;
    if (map.type === 'fixed') {
        rate = map.value;
    } else {
        rate = await fetchCryptoUsd(map.ticker);
    }

    setCache(key, rate);
    return rate;
}
