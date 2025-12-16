import User from '../models/User.js'
import TradingRoom from '../models/TradingRoom.js'
import catchAsync from '../utils/catchAsync.js'


const pct = (curr, prev) => (prev === 0 ? (curr > 0 ? 100 : 0) : Number((((curr - prev) / prev) * 100).toFixed(2)))
const countInRange = (startExpr, endExpr) =>
    User.aggregate([
        ...baseStages,
        {
            $match: {
                $expr: {
                    $and: [
                        { $gte: ['$createdAt', startExpr] },
                        { $lt: ['$createdAt', endExpr] },
                    ]
                }
            }
        },
        { $count: 'n' }
    ]).then(rows => rows[0]?.n || 0)

export const list = catchAsync(async (req, res) => {
    const { page = 1, limit = 20, q } = req.query
    const filter = q ? { $or: [{ email: new RegExp(q, 'i') }, { name: new RegExp(q, 'i') }] } : {}
    const data = await User.find(filter).skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 })
    const total = await User.countDocuments(filter)
    res.json({ data, total, page: Number(page), limit: Number(limit) })
})

export const getOne = catchAsync(async (req, res) => {
    const u = await User.findById(req.params.id)
    if (!u) return res.status(404).json({ message: 'User not found' })
    res.json(u)
})

export const update = catchAsync(async (req, res) => {
    const u = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!u) return res.status(404).json({ message: 'User not found' })
    res.json(u)
})
export const verfyUnverifyEmail = catchAsync(async (req, res) => {
    const u = await User.findByIdAndUpdate(req.params.id, { isEmailVerified: !req.body.isEmailVerified })
    if (!u) return res.status(404).json({ message: 'User not found' })
    res.json(u)
})

const baseStages = [
    { $unwind: '$trades' },
    {
        $addFields: {
            tradeDate: {
                $ifNull: [
                    '$trades.createdAt',
                    {
                        $toDate: {
                            $cond: [
                                { $lt: ['$trades.openTime', 1000000000000] }, // seconds -> ms
                                { $multiply: ['$trades.openTime', 1000] },
                                '$trades.openTime'
                            ]
                        }
                    }
                ]
            }
        }
    }
]

export const usersCountInformation = async (req, res) => {
    try {
        const tz = (req.query.tz || 'Europe/Sofia').toString()

        // Build reusable expressions (all evaluated server-side in Mongo)
        const dayStart = { $dateTrunc: { date: '$$NOW', unit: 'day', timezone: tz } }
        const dayNext = { $dateAdd: { startDate: dayStart, unit: 'day', amount: 1 } }
        const dayPrev = { $dateAdd: { startDate: dayStart, unit: 'day', amount: -1 } }

        const monStart = { $dateTrunc: { date: '$$NOW', unit: 'month', timezone: tz } }
        const monNext = { $dateAdd: { startDate: monStart, unit: 'month', amount: 1 } }
        const monPrev = { $dateAdd: { startDate: monStart, unit: 'month', amount: -1 } }

        // run in parallel
        const [totalUsers, addedToday, addedYesterday, addedThisMonth, addedLastMonth] = await Promise.all([
            User.countDocuments({}),
            countInRange(dayStart, dayNext),
            countInRange(dayPrev, dayStart),
            countInRange(monStart, monNext),
            countInRange(monPrev, monStart),
        ])

        const growth = {
            dayPct: pct(addedToday, addedYesterday),
            monthPct: pct(addedThisMonth, addedLastMonth),
        }

        res.json({ totalUsers, addedToday, addedThisMonth, growth })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'Failed to compute usersCountInformation' })
    }
}

export const customersPerCountry = async (req, res) => {
    try {
        const { active, minCount } = req.query
        const min = Number.isFinite(Number(minCount)) ? Number(minCount) : 0

        // Optional filter (e.g., only active customers)
        const baseMatch = {}
        if (active === 'true') baseMatch.isActive = true

        const agg = await User.aggregate([
            { $match: { ...baseMatch, country: { $type: 'string' } } },
            {
                $project: {
                    countryNorm: { $toUpper: { $trim: { input: '$country' } } },
                    country: 1
                }
            },
            { $match: { countryNorm: { $ne: '' } } },
            {
                $group: {
                    _id: '$countryNorm',
                    count: { $sum: 1 },
                    sample: { $first: '$country' } // a sample for display fallback
                }
            },
            { $sort: { count: -1 } }
        ])

        const totalCustomers = agg.reduce((s, r) => s + r.count, 0) || 0

        const countries = agg
            .filter(r => r.count >= min)
            .map(r => {
                const norm = r._id
                const name = r.sample
                const latLng = COUNTRY_CENTROIDS[norm] || null
                const percentage = totalCustomers
                    ? Math.round((r.count / totalCustomers) * 10000) / 100 // 2 decimals
                    : 0
                return { name, count: r.count, percentage, latLng }
            })

        const markers = countries
            .filter(c => Array.isArray(c.latLng))
            .map(c => ({
                latLng: c.latLng,
                name: c.name,
            }))

        res.json({ totalCustomers, countries, markers })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to compute country stats' })
    }
}

export const mostProfitableCustumersVolumeCount = async (req, res) => {
    try {
        const rawPeriod = (req.query.period || '').toString()
        const PERIODS = ['This-24H', 'This-Month', 'This-Year', 'All-The-Time']
        const period = PERIODS.find(p => p.toLowerCase() === rawPeriod.toLowerCase())
        if (!period) {
            return res.status(400).json({ error: "period must be one of: This-24H, This-Month, This-Year, All-The-Time" })
        }

        const tz = (req.query.tz || 'UTC').toString()
        const limit = Math.max(1, Math.min(parseInt(req.query.limit) || 10, 50))
        const mode = req.query.mode ? req.query.mode.toString() : null          // real|demo|bonus
        const pair = req.query.pair ? req.query.pair.toString() : null
        const status = (req.query.status || 'closed').toString()                // default closed

        // Time window
        let timeExpr = null
        if (period !== 'All-The-Time') {
            let startExpr, endExpr
            if (period === 'This-24H') {
                startExpr = { $dateAdd: { startDate: '$$NOW', unit: 'hour', amount: -24 } }
                endExpr = '$$NOW'
            } else if (period === 'This-Month') {
                const startMonth = { $dateTrunc: { date: '$$NOW', unit: 'month', timezone: tz } }
                startExpr = startMonth
                endExpr = { $dateAdd: { startDate: startMonth, unit: 'month', amount: 1 } }
            } else { // This-Year
                const startYear = { $dateTrunc: { date: '$$NOW', unit: 'year', timezone: tz } }
                startExpr = startYear
                endExpr = { $dateAdd: { startDate: startYear, unit: 'year', amount: 1 } }
            }
            timeExpr = {
                $expr: {
                    $and: [
                        { $gte: ['$trades.createdAt', startExpr] },
                        { $lt: ['$trades.createdAt', endExpr] },
                    ]
                }
            }
        }

        const matchAnd = []
        if (timeExpr) matchAnd.push(timeExpr)
        if (status && status !== 'all') matchAnd.push({ 'trades.status': status })
        if (pair) matchAnd.push({ 'trades.pair': pair })
        if (mode) {
            matchAnd.push({
                $expr: { $or: [{ $eq: ['$trades.mode', mode] }, { $eq: ['$mode', mode] }] }
            })
        }

        // Profit per trade: prefer winamount, fallback to netProfit, else 0
        const profitExpr = { $ifNull: ['$trades.winamount', { $ifNull: ['$trades.netProfit', 0] }] }

        const pipeline = [
            { $unwind: '$trades' },
            ...(matchAnd.length ? [{ $match: { $and: matchAnd } }] : []),

            // Summaries per user
            {
                $group: {
                    _id: '$userId',
                    tradesCount: { $sum: 1 },
                    profit: { $sum: profitExpr },
                    winAmount: { $sum: { $cond: [{ $gt: [profitExpr, 0] }, profitExpr, 0] } },
                    loseAmount: { $sum: { $cond: [{ $lt: [profitExpr, 0] }, { $multiply: [profitExpr, -1] }, 0] } },
                    winsCount: { $sum: { $cond: [{ $gt: [profitExpr, 0] }, 1, 0] } }, // <-- totalWin
                }
            },

            // Join user info
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },

            // Final shape with safe defaults
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    username: { $ifNull: ['$user.username', ''] },
                    name: {
                        $let: {
                            vars: {
                                fn: { $ifNull: ['$user.firstName', ''] },
                                ln: { $ifNull: ['$user.lastName', ''] }
                            },
                            in: { $trim: { input: { $concat: ['$$fn', ' ', '$$ln'] } } }
                        }
                    },
                    country: { $ifNull: ['$user.country', ''] },
                    profit: 1,
                    winAmount: 1,
                    loseAmount: 1,
                    totalTrade: '$tradesCount',
                    totalWin: '$winsCount',
                }
            },

            // Ensure empty strings for name if both first/last are missing
            {
                $addFields: {
                    name: { $ifNull: ['$name', ''] }
                }
            },

            // Three leaderboards
            {
                $facet: {
                    topProfitable: [
                        { $sort: { profit: -1, winAmount: -1 } },
                        { $limit: limit }
                    ],
                    topWinners: [
                        { $sort: { winAmount: -1, profit: -1 } },
                        { $limit: limit }
                    ],
                    topLosers: [
                        { $sort: { loseAmount: -1, profit: 1 } },
                        { $limit: limit }
                    ]
                }
            }
        ]

        const [result] = await TradingRoom.aggregate(pipeline)

        res.json({
            period,
            tz,
            topProfitable: result?.topProfitable ?? [],
            topWinners: result?.topWinners ?? [],
            topLosers: result?.topLosers ?? [],
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to compute profit leaderboard' })
    }
}

export const customersCountPeriodlically = async (req, res) => {
    try {
        const { period } = req.query
        const tz = (req.query.tz || 'UTC').toString()
        const now = new Date()

        if (period === 'daily') {
            // last 30 calendar days (including today)
            const startDayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
            startDayUTC.setUTCDate(startDayUTC.getUTCDate() - 29)

            const agg = await User.aggregate([
                { $match: { createdAt: { $gte: startDayUTC } } },
                {
                    $group: {
                        _id: { d: { $dateTrunc: { date: '$createdAt', unit: 'day', timezone: tz } } },
                        count: { $sum: 1 }
                    }
                },
                { $project: { _id: 0, date: '$_id.d', count: 1 } },
                { $sort: { date: 1 } }
            ])

            // fill missing days
            const map = new Map(agg.map(d => [new Date(d.date).toISOString().slice(0, 10), d.count]))
            const dates = []
            const counts = []
            const cursor = new Date(startDayUTC)
            for (let i = 0; i < 30; i++) {
                const key = cursor.toISOString().slice(0, 10)
                dates.push({ key })
                counts.push({ count: map.get(key) ?? 0 })
                cursor.setUTCDate(cursor.getUTCDate() + 1)
            }
            return res.json({ period, dates, counts })
        }

        // monthly: last 12 calendar months (including current)
        const startMonthUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
        startMonthUTC.setUTCMonth(startMonthUTC.getUTCMonth() - 11)

        const agg = await User.aggregate([
            { $match: { createdAt: { $gte: startMonthUTC } } },
            {
                $group: {
                    _id: { m: { $dateTrunc: { date: '$createdAt', unit: 'month', timezone: tz } } },
                    count: { $sum: 1 }
                }
            },
            { $project: { _id: 0, month: '$_id.m', count: 1 } },
            { $sort: { month: 1 } }
        ])

        // fill missing months
        const map = new Map(
            agg.map(m => {
                const d = new Date(m.month)
                return [`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`, m.count]
            })
        )
        const dates = []
        const counts = []
        const cursor = new Date(startMonthUTC)
        for (let i = 0; i < 12; i++) {
            const key = `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, '0')}`
            dates.push({ key })
            counts.push({ count: map.get(key) ?? 0 })
            cursor.setUTCMonth(cursor.getUTCMonth() + 1)
        }
        res.status(200).json({ period, dates, counts })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to compute user stats' })
    }
}

export const verifyUserEmail = async (req, res) => {
    const { userId, isVerify } = req.body
    try {
        await User.findByIdAndUpdate(userId, { isEmailVerified: isVerify })
        return res.status(200).json({
            message: `User email is ${isVerify ? 'verified' : 'unverified'
                } `,
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const verifyUserPhone = async (req, res) => {
    const { userId, isVerify } = req.body
    try {
        await User.findByIdAndUpdate(userId, { isPhoneVerified: isVerify })
        return res.status(200).json({
            message: `User phone is ${isVerify ? 'verified' : 'unverified'
                } `,
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}