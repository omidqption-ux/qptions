import axiosInstance from '../config/axios.js'
import TradingRoom from '../models/TradingRoom.js'
import User from '../models/User.js'

const POLY_KEY = process.env.POLYGON_API_KEY
const BASE_URL = 'https://api.polygon.io'

export const tickerInfo = async (req, res) => {
     try {
          const cfds = [
               'MSFT',
               'AMZN',
               'GOOGL',
               'META',
               'MCD',
               'AAPL',
               'IVV',
               'VOO',
               'AIG',
          ]
          const tickersParam = cfds.join(',')
          const { data } = await axiosInstance.get(
               `${BASE_URL}/v2/snapshot/locale/us/markets/stocks/tickers`,
               { params: { tickers: tickersParam, apiKey: POLY_KEY } }
          )

          // 3) Map Polygon’s response into your desired shape
          const result = data.tickers.map((t) => ({
               symbol: t.ticker,
               currentPrice: t.lastTrade?.p ?? t.lastQuote?.p ?? 0,
               percentageChange: t.todaysChangePerc ?? 0,
          }))

          res.status(200).json(result)
     } catch (err) {
          return res.status(500).json({ message: err.message })
     }
}
export const userTradingHistory = async (req, res) => {
     const { page, limit, sortColumn, sortDirection, searchColumns } = req.query
     const { id: userId, mode } = req.user
     try {
          const userTradingRoom = await TradingRoom.findOne({
               userId,
               mode: mode ? "real" : "demo",
          })
          if (!userTradingRoom) {
               return res
                    .status(200)
                    .json({ message: 'you did not open any trade yet! ' })
          }
          const tradingHistory = userTradingRoom.trades
               // First, filter the trades based on searchColumns.
               .filter((trade) => {
                    return (searchColumns || []).every((search) => {
                         // If there's no valid column or value, skip filtering for that condition.
                         if (!search.column || !search.value) return true

                         const tradeValue = trade[search.column]

                         // Special handling for the isWin column.
                         if (search.column === 'isWin') {
                              // Convert the search.value to a boolean.
                              // If search.value is already a boolean, use it directly.
                              // Otherwise, if it's a string, convert "win" or "true" (case insensitive) to true.
                              // Anything else (for instance "lose" or "false") will be false.
                              const queryBool =
                                   typeof search.value === 'boolean'
                                        ? search.value
                                        : search.value
                                             .toString()
                                             .toLowerCase() === 'win' ||
                                        search.value
                                             .toString()
                                             .toLowerCase() === 'true'
                              return tradeValue === queryBool
                         }

                         // For string filtering: do a case-insensitive partial match.
                         if (
                              typeof tradeValue === 'string' &&
                              typeof search.value === 'string'
                         ) {
                              return tradeValue
                                   .toLowerCase()
                                   .includes(search.value.toLowerCase())
                         }

                         // For other types, use strict equality.
                         return tradeValue === search.value
                    })
               })
               // Then sort the filtered trades.
               .sort((a, b) => {
                    const valueA = a[sortColumn]
                    const valueB = b[sortColumn]

                    // Numeric comparison
                    if (
                         typeof valueA === 'number' &&
                         typeof valueB === 'number'
                    ) {
                         return sortDirection === 'asc'
                              ? valueA - valueB
                              : valueB - valueA
                    }

                    // String comparison
                    if (
                         typeof valueA === 'string' &&
                         typeof valueB === 'string'
                    ) {
                         if (sortDirection === 'asc') {
                              return valueA > valueB
                                   ? 1
                                   : valueA < valueB
                                        ? -1
                                        : 0
                         } else {
                              return valueA < valueB
                                   ? 1
                                   : valueA > valueB
                                        ? -1
                                        : 0
                         }
                    }

                    // Fallback: return 0 so items remain in their original order.
                    return 0
               })
          const totalCount = tradingHistory.length

          // Finally, slice the array for pagination.

          return res.status(201).json({
               tradingHistory: tradingHistory.slice(
                    (page - 1) * limit,
                    page * limit
               ),
               count: totalCount,
          })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const leaderBoardPnl = async (req, res) => {
     const { period, mode } = req.query
     try {
          const now = Date.now() // Current time in ms
          let cutoff
          switch (period) {
               case 'weekly':
                    // 7 days ago
                    cutoff = Math.floor((now - 7 * 24 * 60 * 60 * 1000) / 1000)
                    break
               case 'monthly':
                    // 30 days ago (simplified)
                    cutoff = Math.floor((now - 30 * 24 * 60 * 60 * 1000) / 1000)
                    break
               case 'yearly':
                    // 365 days ago (simplified)
                    cutoff = Math.floor(
                         (now - 365 * 24 * 60 * 60 * 1000) / 1000
                    )
                    break
               default:
                    // Default: all-time
                    cutoff = 0
                    break
          }

          const tradingRooms = await TradingRoom.find({
               mode
          })

          const pnlUsers = tradingRooms.map((tradingRoom) => {
               const { userId, trades } = tradingRoom
               const filteredTrades = trades.filter(
                    (trade) => trade.closeTime >= cutoff
               )
               const totalNetProfit = filteredTrades.reduce((acc, trade) => {
                    return acc + (trade.netProfit || 0)
               }, 0)

               const totalInvestment = filteredTrades.reduce((acc, trade) => {
                    return acc + (trade.amount || 0)
               }, 0)
               const roi =
                    totalInvestment > 0
                         ? (totalNetProfit / totalInvestment) * 100
                         : 0

               return { userId, roi, totalNetProfit }
          })

          const sortedNetProfit = pnlUsers
               .sort((a, b) => b.totalNetProfit - a.totalNetProfit)
               .slice(0, 10)
          return res.status(201).json({
               sortedNetProfit,
          })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const leaderBoardRoi = async (req, res) => {
     const { period, mode } = req.query

     try {
          const now = Date.now()
          let cutoff

          switch (period) {
               case 'weekly':
                    // 7 days ago
                    cutoff = Math.floor((now - 7 * 24 * 60 * 60 * 1000) / 1000)
                    break
               case 'monthly':
                    // 30 days ago (simplified)
                    cutoff = Math.floor((now - 30 * 24 * 60 * 60 * 1000) / 1000)
                    break
               case 'yearly':
                    // 365 days ago (simplified)
                    cutoff = Math.floor(
                         (now - 365 * 24 * 60 * 60 * 1000) / 1000
                    )
                    break
               default:
                    // Default: all-time
                    cutoff = 0
                    break
          }
          const tradingRooms = await TradingRoom.find({
               mode
          })
          const roiUsers = tradingRooms.map((tradingRoom) => {
               const { userId, trades } = tradingRoom
               const filteredTrades = trades.filter(
                    (trade) => trade.closeTime >= cutoff
               )
               const totalNetProfit = filteredTrades.reduce((acc, trade) => {
                    return acc + (trade.netProfit || 0)
               }, 0)

               const totalInvestment = filteredTrades.reduce((acc, trade) => {
                    return acc + (trade.amount || 0)
               }, 0)
               const roi =
                    totalInvestment > 0
                         ? (totalNetProfit / totalInvestment) * 100
                         : 0

               return { userId, roi, totalNetProfit }
          })

          const sortedRoi = roiUsers.sort((a, b) => b.roi - a.roi).slice(0, 10)
          return res.status(200).json({
               sortedRoi,
          })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const popularTraders = async (req, res) => {
     try {
          const users = await User.find()
               .sort({ followersCount: -1 })
               .limit(10)
               .select({
                    username: 1,
                    profileImage: 1,
                    followersCount: 1,
                    _id: 1,
               })
          const popularUsers = []
          for (const user of users) {
               let roi = 0
               let pnl = 0
               const tradingRoom = await TradingRoom.findOne({
                    mode: 'real',
                    userId: user._id,
               })
               if (tradingRoom.trades) {
                    const trades = tradingRoom.trades
                    pnl = trades.reduce((acc, trade) => {
                         return acc + (trade.netProfit || 0)
                    }, 0)

                    const totalInvestment = trades.reduce((acc, trade) => {
                         return acc + (trade.amount || 0)
                    }, 0)
                    roi =
                         totalInvestment > 0 ? (pnl / totalInvestment) * 100 : 0
               }
               popularUsers.push({
                    userId: user._id,
                    userName: user.username || '',
                    profileImage: user.profileImage,
                    followersCount: user.followersCount,
                    roi,
                    totalNetProfit: pnl,
               })
          }
          return res.status(200).json(popularUsers)
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const getPnlAndInvestemntOfUser = async (req, res) => {
     const user = req.user
     const { period } = req.query
     try {
          const now = Date.now()
          let cutoff
          switch (period) {
               case 'weekly':
                    // 7 days ago
                    cutoff = Math.floor((now - 7 * 24 * 60 * 60 * 1000) / 1000)
                    break
               case 'monthly':
                    // 30 days ago (simplified)
                    cutoff = Math.floor((now - 30 * 24 * 60 * 60 * 1000) / 1000)
                    break
               case 'yearly':
                    // 365 days ago (simplified)
                    cutoff = Math.floor(
                         (now - 365 * 24 * 60 * 60 * 1000) / 1000
                    )
                    break
               default:
                    // Default: all-time
                    cutoff = 0
                    break
          }
          const tradingRoom = await TradingRoom.findOne({
               mode: 'real',
               userId: user._id,
          })
          if (!tradingRoom || !tradingRoom.trades)
               return res.status(200).json({
                    roi: 0,
                    totalInvestment: 0,
                    totalNetProfit: 0,
               })
          const { trades } = tradingRoom
          if (!trades)
               return res.status(200).json({
                    roi: 0,
                    totalInvestment: 0,
                    totalNetProfit: 0,
               })
          const filteredTrades = trades.filter(
               (trade) => trade.closeTime >= cutoff
          )
          const totalNetProfit = filteredTrades.reduce((acc, trade) => {
               return acc + (trade.netProfit || 0)
          }, 0)

          const totalInvestment = filteredTrades.reduce((acc, trade) => {
               return acc + (trade.amount || 0)
          }, 0)
          const roi =
               totalInvestment > 0
                    ? (totalNetProfit / totalInvestment) * 100
                    : 0
          return res.status(200).json({
               roi,
               totalInvestment,
               totalNetProfit,
          })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
