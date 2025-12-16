// utils/marketClock.js
import { restClient } from '@polygon.io/client-js'
import { DateTime } from 'luxon'

const POLY_KEY = process.env.POLYGON_API_KEY
const rest = restClient(POLY_KEY) // base: https://api.polygon.io

// cache holidays for a bit to reduce calls
let holidaysCache = { data: [], fetchedAt: 0 }
let lastWarnedKey = null   // 'YYYY-MM-DD' ET for closingSoon
let lastClosedKey = null   // 'YYYY-MM-DD' ET for closed

async function getUpcomingHolidays() {
    const now = Date.now()
    if (now - holidaysCache.fetchedAt < 6 * 60 * 60 * 1000 && holidaysCache.data?.length) {
        return holidaysCache.data
    }
    const res = await rest.getMarketHolidays() // GET /v1/marketstatus/upcoming
    holidaysCache = { data: Array.isArray(res) ? res : (res?.results ?? []), fetchedAt: now }
    return holidaysCache.data
}

function toET(dt = DateTime.utc()) {
    return dt.setZone('America/New_York')
}
function todayETISO(now = DateTime.utc()) {
    return toET(now).toISODate()
}

// Build today's session for US stocks (NYSE/NASDAQ).
// Weekends → closed. If an early-close/closed holiday is listed for today, use its times.
async function getTodayScheduleET() {
    const holidays = await getUpcomingHolidays()
    const dateET = todayETISO()
    const day = DateTime.fromISO(dateET, { zone: 'America/New_York' })

    // weekend
    if (day.weekday === 6 || day.weekday === 7) {
        return { status: 'closed', dateET }
    }

    // holiday match: prefer NYSE/NASDAQ
    const hol = holidays.find(h =>
        h.date === dateET && (h.exchange === 'NYSE' || h.exchange === 'NASDAQ')
    )
    if (hol?.status === 'closed') {
        return { status: 'closed', dateET, holidayName: hol.name }
    }
    if (hol?.status === 'early-close') {
        // polygon returns ISO strings (UTC); convert to ET
        const openET = DateTime.fromISO(hol.open, { zone: 'utc' }).setZone('America/New_York')
        const closeET = DateTime.fromISO(hol.close, { zone: 'utc' }).setZone('America/New_York')
        return { status: 'open', openET, closeET, dateET, holidayName: hol.name, earlyClose: true }
    }

    // normal session 09:30–16:00 ET
    const openET = day.set({ hour: 9, minute: 30, second: 0, millisecond: 0 })
    const closeET = day.set({ hour: 16, minute: 0, second: 0, millisecond: 0 })
    return { status: 'open', openET, closeET, dateET, earlyClose: false }
}

function summarizeNow(schedule) {
    const nowET = toET()

    if (schedule.status !== 'open') {
        return {
            active: false,
            closed: true,
            closingSoon: false,
            hasOpened: false,
            hasClosed: false,
            nowISO: nowET.toISO(),
            dateET: schedule.dateET,
            earlyClose: false,
            holidayName: schedule.holidayName || null,
        }
    }

    const { openET, closeET } = schedule
    const hasOpened = nowET >= openET
    const hasClosed = nowET >= closeET
    const active = hasOpened && !hasClosed

    const msToClose = Math.max(0, closeET.toMillis() - nowET.toMillis())
    const closingSoon = active && msToClose <= 4 * 60 * 60 * 1000 // 4 hours

    return {
        active,
        closed: hasClosed,
        closingSoon,
        minutesToClose: Math.floor(msToClose / 60000),
        opensAtISO: openET.toISO(),
        closesAtISO: closeET.toISO(),
        hasOpened,
        hasClosed,
        earlyClose: !!schedule.earlyClose,
        holidayName: schedule.holidayName || null,
        nowISO: nowET.toISO(),
        dateET: schedule.dateET,
    }
}

// public: one-shot status (for REST or adhoc checks)
export async function getMarketStatusSummary() {
    const schedule = await getTodayScheduleET()
    return summarizeNow(schedule)
}

// background: emit events via Socket.IO when closingSoon/closed
export function startMarketClock(io) {
    async function tick() {
        try {
            const schedule = await getTodayScheduleET()
            const summary = summarizeNow(schedule)

            // 4h warning (emit once per ET date)
            if (summary.closingSoon) {
                if (lastWarnedKey !== summary.dateET) {
                    lastWarnedKey = summary.dateET
                    const payload = {
                        closesAt: summary.closesAtISO,
                        minutesLeft: summary.minutesToClose,
                        earlyClose: summary.earlyClose,
                        holidayName: summary.holidayName,
                    }
                    io.of('/real').emit('market:closingSoon', payload)
                    io.of('/demo').emit('market:closingSoon', payload)
                    io.of('/bonus').emit('market:closingSoon', payload)
                }
            }

            // closed event: only AFTER the actual close time, and once per ET date
            if (summary.hasClosed && lastClosedKey !== summary.dateET) {
                lastClosedKey = summary.dateET
                const payload = {
                    closedAt: summary.closesAtISO,
                    earlyClose: summary.earlyClose,
                    holidayName: summary.holidayName,
                }
                io.of('/real').emit('market:closed', payload)
                io.of('/demo').emit('market:closed', payload)
                io.of('/bonus').emit('market:closed', payload)
            }
        } catch (e) {
            console.error('[marketClock] error:', e?.message || e)
        } finally {
            // Check every 60s — light on rate limits and accurate enough
            setTimeout(tick, 60_000)
        }
    }
    tick()
}
