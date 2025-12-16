import Deposit from "../models/Deposit.js"
import mongoose from 'mongoose'

export const userDepositHistory = async (req, res) => {
    const user = req.user
    let { page, limit, sortColumn, sortDirection, searchColumns } = req.query

    // Parse page and limit as numbers
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10

    // If searchColumns is provided as a JSON string, parse it.
    if (typeof searchColumns === 'string') {
        try {
            searchColumns = JSON.parse(searchColumns)
        } catch (error) {
            searchColumns = []
        }
    }

    // Build the base filter (always filter by the user)
    let filter = { userId: user._id }

    // Append additional filter conditions from searchColumns array
    if (Array.isArray(searchColumns)) {
        searchColumns.forEach((sc) => {
            if (sc.column && sc.value) {
                // For string values, use a case-insensitive regex match,
                // otherwise, use equality.
                if (typeof sc.value === 'string') {
                    filter[sc.column] = { $regex: sc.value, $options: 'i' }
                } else {
                    filter[sc.column] = sc.value
                }
            }
        })
    }

    // Build the sort object
    let sortOption = {}
    if (sortColumn) {
        sortOption[sortColumn] = sortDirection === 'asc' ? 1 : -1
    } else {
        // Default sort by updatedAt (descending)
        sortOption.updatedAt = -1
    }

    try {
        // Calculate the count of documents matching the filters (before pagination)
        const count = await Deposit.countDocuments(filter)

        // Find, sort, and then apply pagination to the deposits
        const deposits = await Deposit.find(filter)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit)

        return res.status(200).json({ deposits, count })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const depositsCountPeriodlically = async (req, res) => {
    try {
        const { period } = req.query
        const tz = (req.query.tz || 'UTC').toString()

        if (!['daily', 'monthly'].includes(period)) {
            return res.status(400).json({ error: "Query param 'period' must be 'daily' or 'monthly'." })
        }

        // Build time window
        const now = new Date()
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

        // ---- Filters from query (all optional) ----
        const match = { createdAt: { $gte: startUTC } }

        if (req.query.payment_status) match.payment_status = req.query.payment_status.toString()
        if (req.query.paidCurrency) match.paidCurrency = req.query.paidCurrency.toString()
        if (req.query.amountCurrency) match.amountCurrency = req.query.amountCurrency.toString()
        if (req.query.type) match.type = req.query.type.toString()
        if (req.query.userId) {
            try { match.userId = new mongoose.Types.ObjectId(req.query.userId.toString()) }
            catch { return res.status(400).json({ error: 'Invalid userId' }) }
        }

        // ---- Aggregation ----
        const agg = await Deposit.aggregate([
            { $match: match },
            {
                $group: {
                    _id: {
                        slot: {
                            $dateTrunc: { date: '$createdAt', unit, timezone: tz }
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $project: { _id: 0, slot: '$_id.slot', count: 1 } },
            { $sort: { slot: 1 } }
        ])

        // ---- Fill missing slots with 0, and shape output as {dates:[{key}], counts:[{count}]} ----
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
        res.status(500).json({ error: 'Failed to compute deposit stats' })
    }
}

const pctDeposit = (curr, prev) =>
    prev === 0 ? (curr > 0 ? 100 : 0) : Number((((curr - prev) / prev) * 100).toFixed(2))

// Build status filter: default 'confirmed'; allow 'all' or comma-separated list
function buildMatch(statusParam) {
    const status = (statusParam || '').toString().trim()

    // Default → only credited deposits
    if (!status) return { credited: true }

    // all / any → no status filter
    if (/^(all|any)$/i.test(status)) return {}

    // special virtual status "credited"
    if (/^credited$/i.test(status)) return { credited: true }

    const arr = status
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)

    return arr.length > 1
        ? { payment_status: { $in: arr } }
        : { payment_status: arr[0] }
}

// Count docs in [startExpr, endExpr) with timezone-aware server-side bounds
const countInRangeDeposit = (match, startExpr, endExpr) =>
    Deposit.aggregate([
        { $match: match },
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
export const usersDepositsInformation = async (req, res) => {
    try {
        const tz = (req.query.tz || 'Europe/Sofia').toString()
        const match = buildMatch(req.query.status)

        // MongoDB 5+: timezone-aware anchors
        const dayStart = { $dateTrunc: { date: '$$NOW', unit: 'day', timezone: tz } }
        const dayNext = { $dateAdd: { startDate: dayStart, unit: 'day', amount: 1 } }
        const dayPrev = { $dateAdd: { startDate: dayStart, unit: 'day', amount: -1 } }

        const monStart = { $dateTrunc: { date: '$$NOW', unit: 'month', timezone: tz } }
        const monNext = { $dateAdd: { startDate: monStart, unit: 'month', amount: 1 } }
        const monPrev = { $dateAdd: { startDate: monStart, unit: 'month', amount: -1 } }

        const [totalDeposits, addedToday, addedYesterday, addedThisMonth, addedLastMonth] = await Promise.all([
            Deposit.countDocuments(match),
            countInRangeDeposit(match, dayStart, dayNext),
            countInRangeDeposit(match, dayPrev, dayStart),
            countInRangeDeposit(match, monStart, monNext),
            countInRangeDeposit(match, monPrev, monStart),
        ])

        const growth = {
            dayPct: pctDeposit(addedToday, addedYesterday),
            monthPct: pctDeposit(addedThisMonth, addedLastMonth),
        }

        res.json({
            totalDeposits,
            addedToday,
            addedThisMonth,
            growth,
            filters: { tz, status: req.query.status || 'credited' }
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'Failed to compute depositsCountInformation' })
    }
}

export const list = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            paidCurrencyTitle,
            payment_status,
            userId,
        } = req.query

        const SORT_FIELDS = new Set(['amount', 'createdAt'])
        const sortField = SORT_FIELDS.has(String(sortBy)) ? String(sortBy) : 'createdAt'
        const sortDir = String(sortOrder).toLowerCase() === 'asc' ? 1 : -1
        const sort = { [sortField]: sortDir }

        const filter = {}
        if (paidCurrencyTitle) {
            filter.paidCurrencyTitle = { $regex: String(paidCurrencyTitle), $options: 'i' }
        }
        if (payment_status) filter.payment_status = String(payment_status)
        if (userId) {
            if (!mongoose.isValidObjectId(userId)) {
                return res.status(400).json({ message: 'Invalid userId' })
            }
            filter.userId = new mongoose.Types.ObjectId(userId)
        }

        const pageNum = Math.max(parseInt(page, 10) || 1, 1)
        const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 200)
        const skip = (pageNum - 1) * limitNum
        const [docs, total] = await Promise.all([
            Deposit.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limitNum)
                // populate username only (and _id), prevent loading large user fields
                .populate({ path: 'userId', select: 'username _id', options: { lean: true } })
                .lean() // lean for speed, returns plain objects
                .exec(),
            Deposit.countDocuments(filter),
        ])

        // Flatten: add top-level `username` & `userId` for each item
        const data = docs.map(d => ({
            ...d,
            userId: d.userId?._id ?? d.userId, // if populated -> Object, else remains as ObjectId
            username: d.userId?.username ?? null,
        }))

        return res.json({
            data,
            meta: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum) || 1,
                sortBy: sortField,
                sortOrder: sortDir === 1 ? 'asc' : 'desc',
                filters: { paidCurrencyTitle, payment_status, userId },
            },
        })
    } catch (err) {
        console.error('GET /api/deposits error:', err)
        return res.status(500).json({ message: 'Server error' })
    }
}
export const getDepositById = async (req, res) => {
    try {
        const { id } = req.query

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid deposit id' })
        }

        const deposit = await Deposit.findById(id).lean()

        if (!deposit) {
            return res.status(404).json({ success: false, message: 'Deposit not found' })
        }

        return res.status(200).json({
            success: true,
            data: deposit,
        })

    } catch (e) {
        console.error('getDepositById error:', e)
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching deposit',
        })
    }
}