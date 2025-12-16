import Admin from '../models/Admin.js'
import TradingRoom from '../models/TradingRoom.js'
import Deposit from "../models/Deposit.js"
import Withdraw from "../models/Withdraw.js"
import bcrypt from 'bcryptjs'

export const getAllAdmins = async (req, res) => {
    const { page, limit } = req.query
    try {
        const totalCount = await Admin.countDocuments({
            role: { $nin: ['superAdmin'] }, // Excludes these roles
        })
        const adminsList = await Admin.find({
            role: { $nin: ['superAdmin'] },
        })
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })

        return res.status(200).json({ adminsList, totalCount })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const getAdminProfile = async (req, res) => {
    const admin = req.admin
    if (admin) {
        return res.status(200).json(admin)
    } else {
        return res.status(404).json({ message: 'Admin not found' })
    }
}
export const changeName = async (req, res) => {
    const admin = req.admin
    try {
        admin.fullName = req.body.fullName
        await admin.save()
        return res.status(200).json({ admin })
    } catch (e) {
        return res.status(404).json({ message: e.message })
    }

}
export const deActivate = async (req, res) => {
    const { username, active } = req.body
    try {
        const admin = await Admin.findOne({ username })
        admin.isActive = active
        await admin.save()
        return res.status(200).json({
            message: `${active ? 'Activated' : 'Deactivated'} successfully `,
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const updateName = async (req, res) => {
    const { username, fullName } = req.body
    try {
        const admin = await Admin.findOneAndUpdate({ username }, { fullName })
        return res.status(200).json({ fullName: admin.fullName })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const changePassword = async (req, res) => {
    const { username, password } = req.body
    try {
        const salt = await bcrypt.genSalt(10)
        const pass = await bcrypt.hash(password, salt)
        await Admin.findOneAndUpdate({ username }, { password: pass })
        return res.status(200).json({ message: 'pass changed' })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const updateAdminRole = async (req, res) => {
    const { username, role } = req.body
    try {
        const admin = await Admin.findOneAndUpdate({ username }, { role })
        return res.status(200).json({
            message: `${role} assigned successfully `,

        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const addNewAdmin = async (req, res) => {
    const { admin } = req.body
    try {
        if (!admin.password || !admin.username) {
            return res
                .status(400)
                .json({ message: 'password and username are required' })
        }
        const newAdmin = await Admin.create(admin)
        return res.status(200).json({
            message: 'created successfully ',
            admin: newAdmin,
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const removeAdmin = async (req, res) => {
    const { adminId } = req.body
    try {
        await Admin.findOneAndDelete({ _id: adminId })
        return res.status(200).json({ message: 'Deleted successfully ' })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const revenue = async (req, res) => {
    try {
        // period: 'Yesterday' | 'This-Month' | 'This-Year' | 'All-The-Time'
        const rawPeriod = (req.query.period || '').toString();
        const PERIODS = ['Yesterday', 'This-Month', 'This-Year', 'All-The-Time'];
        const period = PERIODS.find(p => p.toLowerCase() === rawPeriod.toLowerCase());
        if (!period) {
            return res.status(400).json({ error: "Query param 'period' must be one of: Yesterday, This-Month, This-Year, All-The-Time" });
        }

        const tz = (req.query.tz || 'UTC').toString();

        // Defaults (you can override via query)
        const depositStatuses = (req.query.depositStatus
            ? req.query.depositStatus.split(',').map(s => s.trim()).filter(Boolean)
            : ['confirmed', 'finished']);

        const withdrawStatuses = (req.query.withdrawStatus
            ? req.query.withdrawStatus.split(',').map(s => s.trim()).filter(Boolean)
            : ['confirmed']);

        // Base filters
        const depMatch = {};
        const wdrMatch = {};
        if (depositStatuses.length) depMatch.payment_status = { $in: depositStatuses };
        if (withdrawStatuses.length) wdrMatch.status = { $in: withdrawStatuses };

        if (req.query.paidCurrency) depMatch.paidCurrency = req.query.paidCurrency.toString();
        if (req.query.amountCurrency) depMatch.amountCurrency = req.query.amountCurrency.toString();

        if (req.query.methodCode) wdrMatch['method.code'] = req.query.methodCode.toString();
        if (req.query.methodTitle) wdrMatch['method.title'] = req.query.methodTitle.toString();
        if (req.query.walletAddress) wdrMatch.walletAddress = req.query.walletAddress.toString();

        if (req.query.userId) {
            try {
                const uid = new mongoose.Types.ObjectId(req.query.userId.toString());
                depMatch.userId = uid;
                wdrMatch.userId = uid;
            } catch {
                return res.status(400).json({ error: 'Invalid userId' });
            }
        }

        // Time window for the requested period
        let timeExpr = null;
        if (period !== 'All-The-Time') {
            let startExpr, endExpr;
            if (period === 'Yesterday') {
                const startToday = { $dateTrunc: { date: '$$NOW', unit: 'day', timezone: tz } };
                startExpr = { $dateAdd: { startDate: startToday, unit: 'day', amount: -1 } };
                endExpr = startToday;
            } else if (period === 'This-Month') {
                const startMonth = { $dateTrunc: { date: '$$NOW', unit: 'month', timezone: tz } };
                startExpr = startMonth;
                endExpr = { $dateAdd: { startDate: startMonth, unit: 'month', amount: 1 } };
            } else { // This-Year
                const startYear = { $dateTrunc: { date: '$$NOW', unit: 'year', timezone: tz } };
                startExpr = startYear;
                endExpr = { $dateAdd: { startDate: startYear, unit: 'year', amount: 1 } };
            }
            timeExpr = {
                $expr: {
                    $and: [
                        { $gte: ['$createdAt', startExpr] },
                        { $lt: ['$createdAt', endExpr] },
                    ]
                }
            };
        }

        // Period-limited pipelines
        const depositPeriodPipeline = [
            { $match: depMatch },
            ...(timeExpr ? [{ $match: timeExpr }] : []),
            { $group: { _id: null, total: { $sum: '$amount' } } },
            { $project: { _id: 0, total: 1 } }
        ];
        const withdrawPeriodPipeline = [
            { $match: wdrMatch },
            ...(timeExpr ? [{ $match: timeExpr }] : []),
            { $group: { _id: null, total: { $sum: '$amount' } } },
            { $project: { _id: 0, total: 1 } }
        ];

        // All-time pipelines (same filters, no timeExpr)
        const depositAllTimePipeline = [
            { $match: depMatch },
            { $group: { _id: null, total: { $sum: '$amount' } } },
            { $project: { _id: 0, total: 1 } }
        ];
        const withdrawAllTimePipeline = [
            { $match: wdrMatch },
            { $group: { _id: null, total: { $sum: '$amount' } } },
            { $project: { _id: 0, total: 1 } }
        ];

        const [depAgg, wdrAgg, depAllAgg, wdrAllAgg] = await Promise.all([
            Deposit.aggregate(depositPeriodPipeline),
            Withdraw.aggregate(withdrawPeriodPipeline),
            Deposit.aggregate(depositAllTimePipeline),
            Withdraw.aggregate(withdrawAllTimePipeline),
        ]);

        const deposits = depAgg[0]?.total ?? 0;
        const withdrawals = wdrAgg[0]?.total ?? 0;
        const revenue = Number(deposits) - Number(withdrawals);

        const totalDeposits = depAllAgg[0]?.total ?? 0;
        const totalWithdrawals = wdrAllAgg[0]?.total ?? 0;
        const totalRevenue = Number(totalDeposits) - Number(totalWithdrawals);

        res.json({
            period,
            tz,
            totals: { deposits, withdrawals }, // requested period
            revenue,                           // requested period
            totalRevenue,                      // lifetime (always returned)
            totalTotals: {
                deposits: totalDeposits,
                withdrawals: totalWithdrawals
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to compute revenue' });
    }
}
export const ordersCountPeriodlically = async (req, res) => {
    try {
        const { period } = req.query
        const tz = (req.query.tz || 'UTC').toString()
        const mode = req.query.mode ? req.query.mode.toString() : null // real|demo|bonus
        const status = req.query.status ? req.query.status.toString() : null // opened|inprocess|closed

        if (!['daily', 'monthly'].includes(period)) {
            return res.status(400).json({ error: "Query param 'period' must be 'daily' or 'monthly'." })
        }

        const now = new Date()

        // Build time window
        let startUTC, unit, totalSlots
        if (period === 'daily') {
            unit = 'day'
            totalSlots = 30
            startUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
            startUTC.setUTCDate(startUTC.getUTCDate() - (totalSlots - 1)) // include today
        } else {
            unit = 'month'
            totalSlots = 12
            startUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
            startUTC.setUTCMonth(startUTC.getUTCMonth() - (totalSlots - 1)) // include current month
        }

        // Build filters for trades
        const matchAnd = []

        // Unwind trades first; we will match on trades fields after $unwind
        // Time window on trades.createdAt
        matchAnd.push({ 'trades.createdAt': { $gte: startUTC } })

        // Optional filters
        if (mode) {
            // match either trade mode or room mode (some data might have only one of them set)
            matchAnd.push({
                $expr: {
                    $or: [
                        { $eq: ['$trades.mode', mode] },
                        { $eq: ['$mode', mode] } // room-level mode fallback
                    ]
                }
            })
        }
        if (status) {
            matchAnd.push({ 'trades.status': status })
        }

        // Build pipeline
        const pipeline = [
            { $unwind: '$trades' },
            { $match: { $and: matchAnd } },
            {
                $group: {
                    _id: {
                        slot: {
                            $dateTrunc: {
                                date: '$trades.createdAt',
                                unit,
                                timezone: tz
                            }
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $project: { _id: 0, slot: '$_id.slot', count: 1 } },
            { $sort: { slot: 1 } }
        ]

        const agg = await TradingRoom.aggregate(pipeline)

        // Fill missing slots with 0 to match your `{ dates: [{key}], counts: [{count}] }` output
        const map = new Map(
            agg.map(row => {
                const d = new Date(row.slot)
                if (period === 'daily') {
                    return [d.toISOString().slice(0, 10), row.count] // YYYY-MM-DD
                }
                const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}` // YYYY-MM
                return [key, row.count]
            })
        )

        const dates = []
        const counts = []
        const cursor = new Date(startUTC)

        if (period === 'daily') {
            for (let i = 0; i < totalSlots; i++) {
                const key = cursor.toISOString().slice(0, 10)
                dates.push({ key })
                counts.push({ count: map.get(key) ?? 0 })
                cursor.setUTCDate(cursor.getUTCDate() + 1)
            }
        } else {
            for (let i = 0; i < totalSlots; i++) {
                const key = `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, '0')}`
                dates.push({ key })
                counts.push({ count: map.get(key) ?? 0 })
                cursor.setUTCMonth(cursor.getUTCMonth() + 1)
            }
        }

        res.status(200).json({ period, dates, counts })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to compute trade stats' })
    }
}
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

const pct = (curr, prev) =>
    prev === 0 ? (curr > 0 ? 100 : 0) : Number((((curr - prev) / prev) * 100).toFixed(2))
// Count trades in [startExpr, endExpr)
const countInRangeTrade = (startExpr, endExpr) =>
    TradingRoom.aggregate([
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
export const tradesInformation = async (req, res) => {
    try {
        const tz = (req.query.tz || 'Europe/Sofia').toString()

        // Reusable date expressions (server-side, timezone-aware)
        const dayStart = { $dateTrunc: { date: '$$NOW', unit: 'day', timezone: tz } }
        const dayNext = { $dateAdd: { startDate: dayStart, unit: 'day', amount: 1 } }
        const dayPrev = { $dateAdd: { startDate: dayStart, unit: 'day', amount: -1 } }

        const monStart = { $dateTrunc: { date: '$$NOW', unit: 'month', timezone: tz } }
        const monNext = { $dateAdd: { startDate: monStart, unit: 'month', amount: 1 } }
        const monPrev = { $dateAdd: { startDate: monStart, unit: 'month', amount: -1 } }

        // All-time total orders
        const totalOrdersP = TradingRoom.aggregate([
            { $unwind: '$trades' },
            { $group: { _id: null, n: { $sum: 1 } } }
        ]).then(rows => rows[0]?.n || 0)

        // Parallel counts
        const [totalOrders, addedToday, addedYesterday, addedThisMonth, addedLastMonth] = await Promise.all([
            totalOrdersP,
            countInRangeTrade(dayStart, dayNext),
            countInRangeTrade(dayPrev, dayStart),
            countInRangeTrade(monStart, monNext),
            countInRangeTrade(monPrev, monStart),
        ])

        const growth = {
            dayPct: pct(addedToday, addedYesterday),
            monthPct: pct(addedThisMonth, addedLastMonth),
        }

        res.json({ totalOrders, addedToday, addedThisMonth, growth })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'Failed to compute tradesCountInformation' })
    }
}
