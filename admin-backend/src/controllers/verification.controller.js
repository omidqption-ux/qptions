import Verification from '../models/Verification.js'
import User from '../models/User.js'
import mongoose from 'mongoose'
import Notification from '../models/Notification.js'

const getId = (req) => req.params?.id || req.body?.id

export const rejectRequest = async (req, res) => {
    try {
        const id = getId(req)
        const { reason } = req.body || {}

        if (!id || !mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid verification id' })
        }

        const existing = await Verification.findById(id).select('status userId')
        if (!existing) return res.status(404).json({ message: 'Verification not found' })
        if (existing.status === 'rejected') {
            return res.status(400).json({ message: 'Already rejected' })
        }

        const [updated] = await Promise.all([
            Verification.findByIdAndUpdate(
                id,
                {
                    $set: {
                        status: 'rejected',
                        rejectionReason: reason || 'Rejected by admin',
                    },
                    $unset: { verificationDate: 1 },
                },
                { new: true }
            )
                .populate({ path: 'userId', select: 'username isIDVerified' })
                .lean(),
            User.findByIdAndUpdate(
                existing.userId,
                { $set: { isIDVerified: false } },
                { new: false }
            ),
        ])
        const notification = new Notification({
            userId: existing.userId,
            category: "verification",
            title: "ID Verification Rejected",
            body: reason || 'Rejected by admin',
        })
        await notification.save()
        return res.json({
            message: 'Verification rejected',
            data: updated,
        })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}
export const verifyRequest = async (req, res) => {
    try {
        const id = getId(req)
        if (!id || !mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid verification id' })
        }

        const existing = await Verification.findById(id).select('status userId')
        if (!existing) return res.status(404).json({ message: 'Verification not found' })
        if (existing.status === 'approved') {
            return res.status(400).json({ message: 'Already approved' })
        }

        const [updated] = await Promise.all([
            Verification.findByIdAndUpdate(
                id,
                {
                    $set: {
                        status: 'approved',
                        verificationDate: new Date(),
                    },
                    $unset: { rejectionReason: 1 },
                },
                { new: true }
            )
                .populate({ path: 'userId', select: 'username isIDVerified' })
                .lean(),
            User.findByIdAndUpdate(
                existing.userId,
                { $set: { isIDVerified: true } },
                { new: false }
            ),
        ])
        const notification = new Notification({
            userId: existing.userId,
            category: "verification",
            title: "Your ID Verification Approved",
            body: 'Your ID Verification Approved',
        })
        await notification.save()
        return res.json({
            message: 'Verification approved',
            data: updated,
        })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const SORT_FIELDS = new Set(['createdAt', 'updatedAt', 'verificationDate'])
function parsePaging(req) {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1)
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 500)
    const sortBy = SORT_FIELDS.has(String(req.query.sortBy)) ? String(req.query.sortBy) : 'createdAt'
    const sortDir = String(req.query.sortOrder).toLowerCase() === 'asc' ? 1 : -1
    return { page, limit, sortBy, sortDir }
}
async function listByStatus(req, res, status) {
    try {
        const { page, limit, sortBy, sortDir } = parsePaging(req)
        const { userId, from, to } = req.query

        const filter = { status }
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

        const [rows, total] = await Promise.all([
            Verification.find(filter)
                .sort({ [sortBy]: sortDir })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate({ path: 'userId', select: 'username' })
                .lean(),
            Verification.countDocuments(filter),
        ])

        const data = rows.map(v => ({ ...v, username: v.userId?.username ?? null }))
        const totalPages = Math.max(Math.ceil(total / limit), 1)

        return res.json({
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
                sortBy,
                sortOrder: sortDir === 1 ? 'asc' : 'desc',
                status,
            },
            data,
        })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}
export const pendingList = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            userId,
        } = req.query

        const PAGE = Math.max(parseInt(page, 10) || 1, 1)
        const LIMIT = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 500)
        const SORT_FIELDS = new Set(['createdAt', 'updatedAt', 'verificationDate'])
        const sortField = SORT_FIELDS.has(String(sortBy)) ? String(sortBy) : 'createdAt'
        const sortDir = String(sortOrder).toLowerCase() === 'asc' ? 1 : -1

        const filter = { status: 'pending' }
        if (userId) {
            if (!mongoose.isValidObjectId(userId)) {
                return res.status(400).json({ message: 'Invalid userId' })
            }
            filter.userId = new mongoose.Types.ObjectId(userId)
        }

        const [rows, total] = await Promise.all([
            Verification.find(filter)
                .sort({ [sortField]: sortDir })
                .skip((PAGE - 1) * LIMIT)
                .limit(LIMIT)
                .populate({ path: 'userId', select: 'username' }) // ← populate username
                .lean(),
            Verification.countDocuments(filter),
        ])

        // flatten username to top-level for convenience
        const data = rows.map(v => ({
            ...v,
            username: v.userId?.username ?? null,
        }))

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
            },
            data,
        })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}
export const verificationCounts = async (req, res) => {
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

        const agg = await Verification.aggregate([
            { $match: match },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ])

        const statuses = ['sending', 'pending', 'approved', 'rejected']
        const byStatus = Object.fromEntries(statuses.map(s => [s, 0]))
        for (const row of agg) {
            if (row?._id) byStatus[row._id] = row.count
        }
        const total = statuses.reduce((sum, s) => sum + byStatus[s], 0)

        res.json({ total, ...byStatus })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
export const listSending = (req, res) => listByStatus(req, res, 'sending')
export const listPending = (req, res) => listByStatus(req, res, 'pending')
export const listApproved = (req, res) => listByStatus(req, res, 'approved')
export const listRejected = (req, res) => listByStatus(req, res, 'rejected')