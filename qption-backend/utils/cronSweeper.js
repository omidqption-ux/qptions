import cron from 'node-cron'
import { runInTxn } from './db.js'
import TradingRoom from '../models/TradingRoom.js'
import User from '../models/User.js'
import { priceFeed } from '../priceFeed.js'
import { calculateProfit } from './openTrade.js'
import { changeBalanceEmitForTrade } from './changeBalance.js'
import { getIO } from '../socket.js'
import { fetchRecentPolygon } from '../polygon/polygonApis.js'

let cronTask = null
// once every minute
export function startCronSweeper() {
     if (cronTask) return // Already running

     cronTask = cron.schedule('0 * * * * *', async () => {
          const nowSec = Math.floor(Date.now() / 1000)
          const threshold = nowSec - 2
          try {
               const io = getIO()
               await runInTxn(async (session) => {
                    // find rooms with any trades that should now close
                    const rooms = await TradingRoom.find({
                         'trades.status': 'opened',
                         'trades.closeTime': { $lte: threshold },
                    }).session(session)
                    const toEmit = []
                    for (const room of rooms) {
                         const user = await User.findById(room.userId).session(
                              session
                         )

                         const expiredTrades = room.trades
                              .map((trade, idx) => ({ trade, idx }))
                              .filter(
                                   ({ trade }) =>
                                        trade.status === 'opened' &&
                                        trade.closeTime <= threshold
                              )
                         for (const { trade: t, idx } of expiredTrades) {
                              // 1) get price from cache or REST
                              const tsMs = t.closeTime * 1000
                              let finalPrice = priceFeed.getLatest(tsMs)
                              if (finalPrice === undefined) {
                                   try {
                                        const candles = await fetchRecentPolygon(
                                             t.pair.toUpperCase(),
                                             tsMs,
                                             1
                                        )
                                        if (candles.length) {
                                             finalPrice = candles[0].value
                                        }
                                   } catch (e) {
                                        console.error(
                                             'Error fetching price:',
                                             e.message
                                        )
                                        finalPrice = t.initialPrice
                                   }
                              }
                              // 2) calculate profit & P&L
                              const { net, winAmount } = calculateProfit({
                                   amount: t.amount,
                                   percentage: Number(t.percentage),
                                   buyOrSell: t.buyOrSell,
                                   initialPrice: Number(t.initialPrice),
                                   finalPrice,
                              })

                              // 3) update user balance
                              if (room.mode === 'demo') {
                                   if (net > 0)
                                        user.balance.demo += winAmount

                              } else if (room.mode === 'real') {
                                   if (net > 0)
                                        user.balance.amount += winAmount

                              } else if (room.mode === 'bonus') {
                                   if (net > 0)
                                        user.balance.bonus += winAmount

                              }
                              await user.save({ session })

                              // 4) mark this trade closed on the room document
                              const sub = room.trades[idx]
                              sub.status = 'closed'
                              sub.netProfit = net
                              sub.isWin = net >= 0
                              sub.finalPrice = finalPrice

                              // 5) queue broadcast payload
                              toEmit.push({
                                   userId: user._id,
                                   username: user.username,
                                   balance: user.balance,
                                   demoBalance: user.balance.demo,
                                   closeTime: t.closeTime,
                                   openTime: t.openTime,
                                   finalPrice,
                                   isWin: net >= 0,
                                   winAmount,
                                   tradeIndex: idx,
                                   pair: t.pair,
                                   mode: room.mode
                              })
                         }
                         // 6) persist changes in transaction
                         room.markModified('trades')
                         await room.save({ session })
                    }

                    for (const emit of toEmit) {
                         io.to(`trade-${emit.userId}-${emit.pair}`).emit(
                              'tradeResult',
                              emit
                         )
                         changeBalanceEmitForTrade(io, {
                              userId: emit.userId,
                              balance: emit.balance,
                              mode: emit.mode
                         })
                    }
               })
          } catch (err) {
               console.error('[CronSweep]', err)
          }
     })
}
export function stopCronSweeper() {
     if (cronTask) {
          cronTask.stop()
          cronTask = null
     }
}