// massiveApis.js (or keep the same filename if you prefer)
import axios from "../config/polyGonAxios.js" // just make sure this baseURL => https://api.massive.com

// You can keep POLYGON_API_KEY env if you want; Massive accepts the same key.
// Or switch to MASSIVE_API_KEY and update here + your env.
const massiveKey = process.env.MASSIVE_API_KEY || process.env.POLYGON_API_KEY;
const MAX_LIMIT = 50000; //// Massive v2 aggs max limit (same as old Polygon)

/**
 * Aggregate 1s rows into bigger OHLC buckets (5s, 10s, 30s, 60s, etc.)
 */
function aggregateToOHLC(rows, bucketSec) {
    const out = [];
    if (!rows || rows.length === 0) return out;

    const STEP = bucketSec * 1000;
    const snapSec = (ms) => Math.floor(ms / 1000) * 1000;
    const snapToStepDown = (ms) => Math.floor(ms / STEP) * STEP;

    // Make sure last bucket has at least `bucketSec` items so live data does not
    // visually "start" above the history.
    while (rows.length % bucketSec) {
        rows.shift();
    }

    // Normalize & sort
    const data = rows
        .map(r => ({ ...r, t: snapSec(Number(r.t)) }))
        .sort((a, b) => a.t - b.t);

    const firstT = data[0].t;
    const lastT = data[data.length - 1].t;

    let bucketStart = snapToStepDown(firstT);
    const end = snapToStepDown(lastT);

    let i = 0;
    let prevClose = null; // last known close to flat-fill empty buckets

    while (bucketStart <= end) {
        const bucketEnd = bucketStart + STEP;
        let open = null, high = -Infinity, low = Infinity, close = null;
        let hadData = false;

        // Consume all rows in [bucketStart, bucketEnd)
        while (i < data.length && data[i].t >= bucketStart && data[i].t < bucketEnd) {
            const r = data[i];
            if (!hadData) {
                open = r.o;
                high = r.h;
                low = r.l;
                close = r.c;
                hadData = true;
            } else {
                if (Number.isFinite(r.h)) high = Math.max(high, r.h);
                if (Number.isFinite(r.l)) low = Math.min(low, r.l);
                if (Number.isFinite(r.c)) close = r.c;
            }
            i++;
        }

        if (hadData) {
            out.push({ time: bucketStart, open, high, low, close });
            prevClose = close;
        } else {
            // Empty bucket → flat fill from prevClose if available
            if (prevClose == null) {
                out.push({
                    time: bucketStart,
                    open: null,
                    high: null,
                    low: null,
                    close: null,
                    _empty: true,
                });
            } else {
                out.push({
                    time: bucketStart,
                    open: prevClose,
                    high: prevClose,
                    low: prevClose,
                    close: prevClose,
                    _empty: true,
                });
            }
        }

        bucketStart = bucketEnd;
    }

    return out;
}

/**
 * Fetch recent 1-second bars from Massive v2 aggs and return ONE bucketed OHLC
 * timeframe (e.g. 10s candles, 30s candles).
 *
 * symbol: "C:EURUSD" or "X:BTCUSD"
 * bucket: bucket size in seconds (10, 30, 60, etc.)
 * endTime: ms epoch
 * seconds: how many seconds back
 */
export async function fetchRecentPolygonAggs(
    symbol,
    bucket = 10,
    endTime = Date.now(),
    seconds = 600
) {
    const span = Math.min(seconds, MAX_LIMIT);
    const to = endTime;
    const from = to - span * 1000;

    // This is literally the Massive "Custom Bars (OHLC)" endpoint:
    // /v2/aggs/ticker/{ticker}/range/1/second/{from}/{to}
    const url =
        `/v2/aggs/ticker/${symbol}/range/1/second/${from}/${to}` +
        `?adjusted=true&sort=asc&limit=${MAX_LIMIT}&apiKey=${massiveKey}`;

    const res = await axios.get(url);
    const results = res?.results || [];

    const ohlc = aggregateToOHLC(results, bucket);
    return ohlc;
}

/**
 * Convenience wrapper: get candles for a given timeframe (sec).
 * Returns [{ time, open, high, low, close, volume? }]
 */
export async function fetchRecentPolygonCandles(
    symbol,
    timeframeSec = 10,
    endTime = Date.now(),
    seconds = 600
) {
    const ohlc = await fetchRecentPolygonAggs(
        symbol,
        timeframeSec,
        endTime,
        seconds
    );
    return ohlc;
}

/**
 * Historical 1-second closes as { time, value } – used by PriceFeed.getPriceOfTs
 * for "missed" ticks near expiry.
 */
export async function fetchRecentPolygon(
    symbol,
    endTime = Date.now(),
    rows = 600
) {
    const to = endTime;
    const span = Math.min(rows, MAX_LIMIT);
    const from = to - span * 1000;

    const url =
        `/v2/aggs/ticker/${symbol}/range/1/second/${from}/${to}` +
        `?adjusted=true&sort=asc&limit=${span}&apiKey=${massiveKey}`;

    const data = await axios.get(url);

    const results = data?.results || [];

    return results.map(k => ({
        time: k.t,
        value: k.c,
    }));
}
