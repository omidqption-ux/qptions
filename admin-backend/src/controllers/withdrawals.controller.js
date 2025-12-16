import Withdraw from '../models/Withdraw.js'
import mongoose from 'mongoose'
import Notification from '../models/Notification.js'

export const userWithdrawHistory = async (req, res) => {
    const user = req.user
    let { page, limit, sortColumn, sortDirection, searchColumns } = req.query

    // Parse pagination parameters
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10

    // If searchColumns is passed as a JSON string, try parsing it.
    if (typeof searchColumns === 'string') {
        try {
            searchColumns = JSON.parse(searchColumns)
        } catch (error) {
            searchColumns = []
        }
    }

    // Build the base filter: only withdrawals for the current user
    let filter = { userId: user._id }

    // Append additional filter criteria from searchColumns array.
    if (Array.isArray(searchColumns)) {
        searchColumns.forEach((sc) => {
            if (sc.column && sc.value) {
                // For strings, use a case-insensitive regex search.
                if (typeof sc.value === 'string') {
                    filter[sc.column] = { $regex: sc.value, $options: 'i' }
                } else {
                    // For non-string values, apply a direct equality
                    filter[sc.column] = sc.value
                }
            }
        })
    }

    // Build the sort option
    let sortOption = {}
    if (sortColumn) {
        sortOption[sortColumn] = sortDirection === 'asc' ? 1 : -1
    } else {
        // Default: sort by updatedAt (descending)
        sortOption.updatedAt = -1
    }

    try {
        // Count the total number of documents matching the filter (before pagination)
        const count = await Withdraw.countDocuments(filter)

        // Apply the filter, sorting, and pagination on the Withdraw model
        const withdrawals = await Withdraw.find(filter)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit)

        return res.status(200).json({ withdrawals, count })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const withdrawalsCountPeriodlically = async (req, res) => {
    try {
        const { period } = req.query
        const tz = (req.query.tz || 'UTC').toString()

        if (!['daily', 'monthly'].includes(period)) {
            return res.status(400).json({ error: "Query param 'period' must be 'daily' or 'monthly'." })
        }

        // --- Time window ---
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

        // --- Filters ---
        const match = { createdAt: { $gte: startUTC } }

        if (req.query.status) match.status = req.query.status.toString()            // waiting|confirmed|rejected
        if (req.query.methodCode) match['method.code'] = req.query.methodCode.toString()
        if (req.query.methodTitle) match['method.title'] = req.query.methodTitle.toString()
        if (req.query.walletAddress) match.walletAddress = req.query.walletAddress.toString()
        if (req.query.userId) {
            try { match.userId = new mongoose.Types.ObjectId(req.query.userId.toString()) }
            catch { return res.status(400).json({ error: 'Invalid userId' }) }
        }

        // --- Aggregation ---
        const agg = await Withdraw.aggregate([
            { $match: match },
            {
                $group: {
                    _id: {
                        slot: { $dateTrunc: { date: '$createdAt', unit, timezone: tz } }
                    },
                    count: { $sum: 1 }
                }
            },
            { $project: { _id: 0, slot: '$_id.slot', count: 1 } },
            { $sort: { slot: 1 } }
        ])

        // --- Fill missing slots and shape output ---
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
        res.status(500).json({ error: 'Failed to compute withdrawal stats' })
    }
}
function buildMatch(statusParam) {
    const status = (statusParam || '').toString()
    if (!status) return { payment_status: 'confirmed' }
    if (/^(all|any)$/i.test(status)) return {}
    const arr = status.split(',').map(s => s.trim()).filter(Boolean)
    return arr.length > 1 ? { payment_status: { $in: arr } } : { payment_status: arr[0] }
}
const pct = (curr, prev) =>
    prev === 0 ? (curr > 0 ? 100 : 0) : Number((((curr - prev) / prev) * 100).toFixed(2))
const countInRangeWithdraw = (match, startExpr, endExpr) =>
    Withdraw.aggregate([
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
export const usersWithdrawalsInformation = async (req, res) => {
    try {
        const tz = (req.query.tz || 'Europe/Sofia').toString()
        const match = buildMatch(req.query.status)

        // MongoDB 5+: timezone-aware anchors using server time
        const dayStart = { $dateTrunc: { date: '$$NOW', unit: 'day', timezone: tz } }
        const dayNext = { $dateAdd: { startDate: dayStart, unit: 'day', amount: 1 } }
        const dayPrev = { $dateAdd: { startDate: dayStart, unit: 'day', amount: -1 } }

        const monStart = { $dateTrunc: { date: '$$NOW', unit: 'month', timezone: tz } }
        const monNext = { $dateAdd: { startDate: monStart, unit: 'month', amount: 1 } }
        const monPrev = { $dateAdd: { startDate: monStart, unit: 'month', amount: -1 } }

        const [totalWithdrawals, addedToday, addedYesterday, addedThisMonth, addedLastMonth] = await Promise.all([
            Withdraw.countDocuments(match),
            countInRangeWithdraw(match, dayStart, dayNext),
            countInRangeWithdraw(match, dayPrev, dayStart),
            countInRangeWithdraw(match, monStart, monNext),
            countInRangeWithdraw(match, monPrev, monStart),
        ])

        const growth = {
            dayPct: pct(addedToday, addedYesterday),
            monthPct: pct(addedThisMonth, addedLastMonth),
        }

        res.json({
            totalWithdrawals,
            addedToday,
            addedThisMonth,
            growth,
            filters: { tz, status: req.query.status || 'confirmed' }
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'Failed to compute withdrawalsCountInformation' })
    }
}
export const list = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            methodTitle,
            methodCode,
            status,
            userId,
            amountMin,
            amountMax,
        } = req.query

        const SORT_FIELDS = new Set(['createdAt', 'amount'])
        const sortField = SORT_FIELDS.has(String(sortBy)) ? String(sortBy) : 'createdAt'
        const sortDir = String(sortOrder).toLowerCase() === 'asc' ? 1 : -1
        const sort = { [sortField]: sortDir }

        const filter = {}

        // method.title / method.code partial match
        if (methodTitle) {
            filter['method.title'] = { $regex: String(methodTitle), $options: 'i' }
        }
        if (methodCode) {
            filter['method.code'] = { $regex: String(methodCode), $options: 'i' }
        }

        // status exact
        if (status) filter.status = String(status)

        // userId
        if (userId) {
            if (!mongoose.isValidObjectId(userId)) {
                return res.status(400).json({ message: 'Invalid userId' })
            }
            filter.userId = new mongoose.Types.ObjectId(userId)
        }

        // amount range
        if (amountMin || amountMax) {
            filter.amount = {}
            if (amountMin) filter.amount.$gte = Number(amountMin)
            if (amountMax) filter.amount.$lte = Number(amountMax)
        }

        const pageNum = Math.max(parseInt(page, 10) || 1, 1)
        const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 200)
        const skip = (pageNum - 1) * limitNum

        const [docs, total] = await Promise.all([
            Withdraw.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limitNum)
                .populate({ path: 'userId', select: 'username _id', options: { lean: true } })
                .lean()
                .exec(),
            Withdraw.countDocuments(filter),
        ])

        // Flatten username + ensure userId is ObjectId at top level
        const data = docs.map(d => ({
            ...d,
            userId: d.userId?._id ?? d.userId,
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
                filters: { methodTitle, methodCode, status, userId, amountMin, amountMax },
            },
        })
    } catch (err) {
        console.error('GET /api/withdrawals error:', err)
        return res.status(500).json({ message: 'Server error' })
    }
}

export const getWithdrawStatsCounts = async (req, res) => {
    try {
        const { userId, from, to } = req.query
        const match = {}

        if (userId) {
            if (!mongoose.isValidObjectId(userId)) {
                return res.status(400).json({ message: 'Invalid userId' })
            }
            match.userId = new mongoose.Types.ObjectId(userId)
        }
        if (from || to) {
            match.createdAt = {}
            if (from) match.createdAt.$gte = new Date(from)
            if (to) match.createdAt.$lte = new Date(to)
        }

        const agg = await Withdraw.aggregate([
            { $match: match },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ])

        const statuses = ['waiting', 'confirmed', 'rejected']
        const byStatus = Object.fromEntries(statuses.map(s => [s, 0]))
        for (const r of agg) if (r?._id) byStatus[r._id] = r.count
        const total = statuses.reduce((sum, s) => sum + (byStatus[s] || 0), 0)

        return res.json({
            total,
            waiting: byStatus.waiting,
            confirmed: byStatus.confirmed,
            rejected: byStatus.rejected,
        })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const SORT_FIELDS = new Set(['createdAt', 'updatedAt'])
const STATUS_ENUM = new Set(['waiting', 'confirmed', 'rejected'])
export const listWithdrawals = async (req, res) => {
    try {
        const {
            status,            // 'waiting' | 'confirmed' | 'rejected' (optional)
            userId,            // optional filter by user
            from, to,          // optional ISO date range (createdAt)
            page = 1,
            limit = 20,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = req.query

        // paging + sorting
        const PAGE = Math.max(parseInt(page, 10) || 1, 1)
        const LIMIT = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 500)
        const sortField = SORT_FIELDS.has(String(sortBy)) ? String(sortBy) : 'createdAt'
        const sortDir = String(sortOrder).toLowerCase() === 'asc' ? 1 : -1

        // filters
        const filter = {}
        if (status) {
            if (!STATUS_ENUM.has(status)) {
                return res.status(400).json({ message: 'Invalid status' })
            }
            filter.status = status
        }
        if (userId) {
            if (!mongoose.isValidObjectId(userId)) {
                return res.status(400).json({ message: 'Invalid userId' })
            }
            filter.userId = new mongoose.Types.ObjectId(userId)
        }
        if (from || to) {
            filter.createdAt = {}
            if (from) filter.createdAt.$gte = new Date(from)
            if (to) filter.createdAt.$lte = new Date(to)
        }

        const [items, total] = await Promise.all([
            Withdraw.find(filter)
                .sort({ [sortField]: sortDir })
                .skip((PAGE - 1) * LIMIT)
                .limit(LIMIT)
                .populate({ path: 'userId', select: 'username' })
                .lean(),
            Withdraw.countDocuments(filter),
        ])

        const totalPages = Math.max(Math.ceil(total / LIMIT), 1)

        return res.json({
            meta: {
                page: PAGE,
                limit: LIMIT,
                total,
                totalPages,
                hasPrevPage: PAGE > 1,
                hasNextPage: PAGE < totalPages,
                sortBy: sortField,
                sortOrder: sortDir === 1 ? 'asc' : 'desc',
                status: status ?? 'all',
            },
            data: items.map(w => ({ ...w, username: w.userId?.username ?? null })),
        })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}
export const getWitdhdrawById = async (req, res) => {
    try {
        const { id } = req.query

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid withdraw id' })
        }

        // Base filter
        const filter = { _id: id }

        const withdraw = await Withdraw.findOne(filter).lean()

        if (!withdraw) {
            return res.status(404).json({ message: 'Withdrawal not found' })
        }

        return res.status(200).json({
            success: true,
            data: withdraw,
        })
    } catch (e) {
        console.error('getWitdhdrawById error:', e)
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching withdrawal',
        })
    }
}
export const approveWithdraw = async (req, res) => {
    try {
        const { id } = req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid withdraw id' })
        }

        const withdraw = await Withdraw.findById(id)

        if (!withdraw) {
            return res.status(404).json({ success: false, message: 'Withdrawal not found' })
        }

        if (withdraw.status !== 'waiting') {
            return res.status(400).json({
                success: false,
                message: 'Only waiting withdrawals can be approved',
            })
        }

        withdraw.status = 'confirmed'
        await withdraw.save()

        const notification = new Notification({
            userId: withdraw.userId,
            category: "Withdrawal",
            title: "Your Withdrawal Approved",
            body: 'Your Withdrawal Approved',
        })
        await notification.save()

        return res.status(200).json({
            success: true,
            message: 'Withdrawal approved successfully',
            data: withdraw,
        })
    } catch (e) {
        console.error('approveWithdraw error:', e)
        return res.status(500).json({
            success: false,
            message: 'Server error while approving withdrawal',
        })
    }
}

// POST /withdrawals/reject
export const rejectWithdraw = async (req, res) => {
    try {
        const { id, reason } = req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid withdraw id' })
        }

        if (!reason || !reason.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Reject reason is required',
            })
        }

        const withdraw = await Withdraw.findById(id)

        if (!withdraw) {
            return res.status(404).json({ success: false, message: 'Withdrawal not found' })
        }

        if (withdraw.status !== 'waiting') {
            return res.status(400).json({
                success: false,
                message: 'Only waiting withdrawals can be rejected',
            })
        }

        withdraw.status = 'rejected'
        withdraw.rejectReason = reason.trim()
        await withdraw.save()
        const notification = new Notification({
            userId: withdraw.userId,
            category: "Withdrawal",
            title: "Your Withdrawal rejected",
            body: reason,
        })
        await notification.save()
        return res.status(200).json({
            success: true,
            message: 'Withdrawal rejected successfully',
            data: withdraw,
        })
    } catch (e) {
        console.error('rejectWithdraw error:', e)
        return res.status(500).json({
            success: false,
            message: 'Server error while rejecting withdrawal',
        })
    }
}