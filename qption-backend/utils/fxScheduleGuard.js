// fxCloseGuard.js
import { restClient } from '@polygon.io/client-js';

const POLYGON_KEY = process.env.POLYGON_API_KEY;
const rest = restClient(POLYGON_KEY, 'https://api.polygon.io');

// Toggle: also block when US equities are closed/early-close (default false)
const RESPECT_EQUITY_HOLIDAYS_FOR_FX = process.env.FX_RESPECT_EQUITY_HOLIDAYS === '1';

// cache holidays for a while (6h)
const cache = { holidays: null, fetchedAt: 0, ttlMs: 6 * 60 * 60 * 1000 };

// --- ET helpers (FX weekend rule uses New York time) ---
const ET_TZ = 'America/New_York';
function partsET(ts) {
    const dtf = new Intl.DateTimeFormat('en-US', {
        timeZone: ET_TZ, weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    });
    const out = {};
    for (const p of dtf.formatToParts(new Date(ts))) out[p.type] = p.value;
    out.hour = Number(out.hour);
    return out; // {weekday:'Fri'.., year:'2025', month:'11', day:'27', hour:..}
}
function ymdET(ts) {
    const p = partsET(ts);
    return `${p.year}-${p.month}-${p.day}`; // YYYY-MM-DD in ET
}

// FX true closure = Fri >= 17:00 ET through Sun < 17:00 ET (plus all Saturday)
export function isFxWeekendClosedAt(ts) {
    const p = partsET(ts);
    const h = p.hour;
    if (p.weekday === 'Sat') return true;
    if (p.weekday === 'Sun' && h < 17) return true;
    if (p.weekday === 'Fri' && h >= 17) return true;
    return false;
}

// --- Polygon holidays (equities) via client-js ---
async function getEquitiesHolidays() {
    const now = Date.now();
    if (cache.holidays && now - cache.fetchedAt < cache.ttlMs) return cache.holidays;

    let rows = [];
    try {
        const resp = await rest.getMarketHolidays();
        // client-js returns { data } in most versions; be defensive:
        rows = resp?.data ?? resp ?? [];
    } catch (e) {
        // soft-fail: empty list
        rows = [];
    }
    cache.holidays = rows;
    cache.fetchedAt = now;
    return rows;
}

/**
 * Check if a proposed FX trade ending at `closeTs` (ms) should be blocked.
 * - Always enforces FX weekend rule (ET).
 * - Optionally (env) respects US equities holidays/early-closes.
 * Returns { allowed, reason }
 */
export async function isFxCloseAllowed(closeTs) {
    if (!Number.isFinite(closeTs)) {
        return { allowed: false, reason: 'Invalid close time' };
    }

    // 1) Weekend closure (authoritative for FX)
    if (isFxWeekendClosedAt(closeTs)) {
        return { allowed: false, reason: 'Forex is closed on weekends (ET).' };
    }

    // 2) Optional: treat US equities holidays as closed for FX (business choice)
    if (RESPECT_EQUITY_HOLIDAYS_FOR_FX) {
        const ymd = ymdET(closeTs);
        const rows = await getEquitiesHolidays();

        // Only consider standard US venues (as in your samples)
        const eqExchanges = new Set(['NYSE', 'NASDAQ', 'OTC']);
        const sameDay = rows.filter(r => r?.date === ymd && eqExchanges.has(r?.exchange));

        // Full-day closed?
        if (sameDay.some(r => String(r?.status).toLowerCase() === 'closed')) {
            const name = sameDay.find(r => r?.name)?.name || 'Market holiday';
            return { allowed: false, reason: `Holiday (${name}): trading unavailable for the selected close time.` };
        }

        // Early-close? Block if your closeTs is at/after the listed close
        const early = sameDay.find(r => String(r?.status).toLowerCase().includes('early'));
        if (early?.close) {
            const closeCutoff = Date.parse(early.close); // ISO is UTC; safe to compare with ms
            if (Number.isFinite(closeCutoff) && closeTs >= closeCutoff) {
                const name = early.name || 'Early close';
                return { allowed: false, reason: `${name}: early close in effect for the selected close time.` };
            }
        }

        // (Optional) If an 'open' is provided and your closeTs is before it, also block:
        const delayedOpen = sameDay.find(r => r?.open);
        if (delayedOpen?.open) {
            const openTs = Date.parse(delayedOpen.open);
            if (Number.isFinite(openTs) && closeTs < openTs) {
                const name = delayedOpen.name || 'Holiday schedule';
                return { allowed: false, reason: `${name}: delayed open; selected close time is before trading hours.` };
            }
        }
    }

    return { allowed: true, reason: null };
}
