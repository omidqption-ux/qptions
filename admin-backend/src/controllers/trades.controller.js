import TradingRoom from "../models/TradingRoom.js"
export const list = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            sortBy = 'openTime',
            sortOrder = 'desc',
            userId,
            isWin,
            status,
            buyOrSell,
            mode,
            amountMin,
            amountMax,
        } = req.query

        const SORT_FIELDS = new Set(['openTime', 'closeTime'])
        const sortField = SORT_FIELDS.has(String(sortBy)) ? String(sortBy) : 'openTime'
        const sortDir = String(sortOrder).toLowerCase() === 'asc' ? 1 : -1

        const pageNum = Math.max(parseInt(page, 10) || 1, 1)
        const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 200)
        const skip = (pageNum - 1) * limitNum

        // ---- Build filters ----
        // Room-level prefilter (helps performance before unwind)
        const roomMatch = {}
        if (userId) {
            if (!mongoose.isValidObjectId(userId)) {
                return res.status(400).json({ message: 'Invalid userId' })
            }
            roomMatch.userId = new mongoose.Types.ObjectId(userId)
        }
        // OPTIONAL: if you’d like to prefilter by room mode too (parent),
        // uncomment the next line, otherwise we’ll filter on trade.mode below:
        // if (mode) roomMatch.mode = String(mode)

        // Trade-level filter (after unwind)
        const tradeMatch = {}
        if (typeof isWin !== 'undefined') {
            if (isWin === 'true' || isWin === true) tradeMatch['trades.isWin'] = true
            else if (isWin === 'false' || isWin === false) tradeMatch['trades.isWin'] = false
        }
        if (status) tradeMatch['trades.status'] = String(status)
        if (buyOrSell) tradeMatch['trades.buyOrSell'] = String(buyOrSell).toLowerCase()
        if (mode) tradeMatch['trades.mode'] = String(mode)

        // amount range
        if (amountMin || amountMax) {
            tradeMatch['trades.amount'] = {}
            if (amountMin) tradeMatch['trades.amount'].$gte = Number(amountMin)
            if (amountMax) tradeMatch['trades.amount'].$lte = Number(amountMax)
        }

        // ---- Aggregation pipeline ----
        const pipeline = [
            // 1) Prefilter rooms (by userId etc.) to shrink the set
            Object.keys(roomMatch).length ? { $match: roomMatch } : null,

            // 2) Join username
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [{ $project: { _id: 1, username: 1 } }],
                },
            },
            { $unwind: '$user' },

            // 3) Unwind trades
            { $unwind: '$trades' },

            // 4) Filter on trade-level fields
            Object.keys(tradeMatch).length ? { $match: tradeMatch } : null,

            // 5) Project a flat trade row with userId + username
            {
                $project: {
                    _id: 0,
                    // top-level convenience fields
                    userId: '$userId',
                    username: '$user.username',

                    // room info if you want to keep it (optional)
                    roomMode: '$mode',
                    roomCreatedAt: '$createdAt',

                    // flattened trade fields
                    tradeId: '$trades._id',
                    openTime: '$trades.openTime',
                    closeTime: '$trades.closeTime',
                    amount: '$trades.amount',
                    buyOrSell: '$trades.buyOrSell',
                    isWin: '$trades.isWin',
                    initialPrice: '$trades.initialPrice',
                    finalPrice: '$trades.finalPrice',
                    percentage: '$trades.percentage',
                    pair: '$trades.pair',
                    netProfit: '$trades.netProfit',
                    status: '$trades.status',
                    mode: '$trades.mode',
                    createdAt: '$trades.createdAt',
                    updatedAt: '$trades.updatedAt',
                },
            },

            // 6) Sort
            { $sort: { [sortField]: sortDir, tradeId: 1 } },

            // 7) Paginate with facet
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: limitNum }],
                    totalCount: [{ $count: 'count' }],
                },
            },
            {
                $project: {
                    data: 1,
                    total: { $ifNull: [{ $arrayElemAt: ['$totalCount.count', 0] }, 0] },
                },
            },
        ].filter(Boolean)

        const agg = await TradingRoom.aggregate(pipeline).exec()
        const { data, total } = agg[0] || { data: [], total: 0 }

        return res.json({
            data,
            meta: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum) || 1,
                sortBy: sortField,
                sortOrder: sortDir === 1 ? 'asc' : 'desc',
                filters: {
                    userId,
                    isWin,
                    status,
                    buyOrSell,
                    mode,
                    amountMin,
                    amountMax,
                },
            },
        })
    } catch (err) {
        console.error('GET /api/trades error:', err)
        return res.status(500).json({ message: 'Server error' })
    }
}