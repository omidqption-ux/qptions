// ESM script. Ensure "type":"module" in package.json or run with: node --input-type=module
import '../config/env.js'
import mongoose, { Types } from 'mongoose'
import TradingRoom from '../models/TradingRoom.js'   // <-- your model path

/** ---------- CONFIG ---------- */
const USERS = [
    '6881e825f320c353067aaa09',
    '68da66e2f2f326976a285a26',
]
const MODES = ['real', 'demo', 'bonus']             // choose which modes to seed
const YEARS_BACK = 3                                 // how many years back to generate
const AVG_TRADES_PER_DAY = 6                         // average trades per day (tweak as you like)
const MAX_TRADES_PER_DAY = 12                        // cap for sanity
const CHUNK_SIZE = 500                               // push size per update
const PAIRS = ['BTCUSD', 'ETHUSD', 'EURUSD', 'XAUUSD', 'GBPUSD', 'SOLUSD', 'ADAUSD', 'TRXUSD']

/** ---------- UTILITIES ---------- */
const rand = (min, max) => Math.random() * (max - min) + min
const randInt = (min, max) => Math.floor(rand(min, max + 1))
const choice = (arr) => arr[Math.floor(Math.random() * arr.length)]

// very small random-walk base prices to keep initial/final realistic-ish
const basePrice = {
    BTCUSD: 40000, ETHUSD: 2500, EURUSD: 1.08, XAUUSD: 1900, GBPUSD: 1.27, SOLUSD: 35, ADAUSD: 0.38, TRXUSD: 0.10
}

/** evolves the base price a bit day to day */
function nudgeBasePrices(dayIndex) {
    for (const k of PAIRS) {
        const vol = { BTCUSD: 0.015, ETHUSD: 0.02, XAUUSD: 0.005 }[k] ?? 0.01
        const drift = (Math.random() - 0.5) * vol
        basePrice[k] *= (1 + drift)
    }
}

/** Create N trades distributed across the given local day */
function makeTradesForDay(dayDate, n, mode) {
    const trades = []
    const dayStart = new Date(dayDate)
    dayStart.setHours(0, 0, 0, 0)
    const dayMs = dayStart.getTime()

    for (let i = 0; i < n; i++) {
        const pair = choice(PAIRS)
        const buyOrSell = Math.random() < 0.5 ? 'buy' : 'sell'
        const amount = Math.round(rand(5, 250) / 5) * 5   // $5 steps
        const openOffsetSec = randInt(0, 86400 - 120)     // open sometime today
        const durationSec = randInt(30, 900)              // 0.5–15 minutes
        const openTime = dayMs + openOffsetSec * 1000
        const closeTime = openTime + durationSec * 1000

        // price model: small intraday move
        const p0 = basePrice[pair] * (1 + (Math.random() - 0.5) * 0.01)
        // move direction loosely correlated to buy/sell for some trades
        const bias = (buyOrSell === 'buy' ? 1 : -1) * (Math.random() < 0.6 ? 1 : -1)
        const relMove = bias * rand(0.0005, 0.01)   // 0.05% to 1%
        const p1 = p0 * (1 + relMove)

        // result: ~55% win rate
        const isWin = Math.random() < 0.55 ? true : false
        // payout % (win positive, loss is -100%)
        const payout = isWin ? randInt(60, 90) : -100
        const netProfit = Number((amount * (payout / 100)).toFixed(2))

        trades.push({
            openTime,
            closeTime,
            amount,
            buyOrSell,
            isWin,
            initialPrice: Number(p0.toFixed(6)),
            finalPrice: Number(p1.toFixed(6)),
            percentage: payout,             // your schema allows +/-; analytics uses netProfit anyway
            pair,
            netProfit,
            isCopy: Math.random() < 0.1 ? { leadTraderId: new Types.ObjectId(), factor: (Math.random() < 0.5 ? '1.0' : '1.5') } : undefined,
            status: 'closed',
            mode,
            // IMPORTANT: set subdocument timestamps manually (aggregate uses trades.createdAt)
            createdAt: new Date(openTime),
            updatedAt: new Date(closeTime),
        })
    }
    return trades
}

/** Ensure trading room doc exists (unique per user+mode) */
async function ensureRoom(userId, mode) {
    const res = await TradingRoom.findOneAndUpdate(
        { userId, mode },
        { $setOnInsert: { userId, mode, trades: [] } },
        { upsert: true, new: true }
    )
    return res
}

async function seedForUser(userIdStr) {
    const userId = new Types.ObjectId(userIdStr)
    const now = new Date()
    const start = new Date()
    start.setFullYear(now.getFullYear() - YEARS_BACK)
    start.setHours(0, 0, 0, 0)

    const daysTotal = Math.ceil((now.getTime() - start.getTime()) / (24 * 3600 * 1000))
    console.log(`\nSeeding user ${userIdStr}: ~${daysTotal} days from ${start.toISOString().slice(0, 10)} to ${now.toISOString().slice(0, 10)}`)

    for (const mode of MODES) {
        const room = await ensureRoom(userId, mode)
        console.log(`  Mode ${mode}: room ${room._id}`)

        let batch = []
        let inserted = 0

        for (let d = 0; d < daysTotal; d++) {
            const dayDate = new Date(start.getTime() + d * 24 * 3600 * 1000)
            // Poisson-like scatter around AVG_TRADES_PER_DAY
            const n = Math.min(MAX_TRADES_PER_DAY, Math.max(0, Math.round(rand(AVG_TRADES_PER_DAY * 0.4, AVG_TRADES_PER_DAY * 1.8))))
            nudgeBasePrices(d)
            const trades = makeTradesForDay(dayDate, n, mode)
            batch.push(...trades)

            // push in chunks
            if (batch.length >= CHUNK_SIZE || d === daysTotal - 1) {
                if (batch.length) {
                    await TradingRoom.updateOne(
                        { _id: room._id },
                        { $push: { trades: { $each: batch } } }
                    )
                    inserted += batch.length
                    batch = []
                }
            }
            // log a dot sometimes
            if (d % 60 === 0) process.stdout.write('.')
        }
        console.log(`\n  -> Inserted ~${inserted} trades for mode ${mode}`)
    }
}

/** ---------- MAIN ---------- */
async function main() {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI
    if (!uri) {
        console.error('Missing MONGO_URI (or MONGODB_URI). Put it in .env or run with DOTENV_CONFIG_PATH=./.env.local')
        process.exit(1)
    }

    await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 })
    console.log('Connected to MongoDB')

    // optional: ensure helpful indexes for analytics on subdocs
    try {
        await TradingRoom.collection.createIndex({ 'trades.createdAt': 1 })
        await TradingRoom.collection.createIndex({ 'trades.pair': 1, 'trades.createdAt': 1 })
        await TradingRoom.collection.createIndex({ 'trades.mode': 1, 'trades.createdAt': 1 })
        await TradingRoom.collection.createIndex({ userId: 1, mode: 1 }, { unique: true })
    } catch (e) {
        // ignore if they already exist
    }

    for (const uid of USERS) {
        await seedForUser(uid)
    }

    await mongoose.disconnect()
    console.log('Done.')
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})
