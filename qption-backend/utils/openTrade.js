import User from '../models/User.js'
import TradingRoom from '../models/TradingRoom.js'
import { changeBalanceEmitForTrade } from './changeBalance.js'
import { runInTxn } from './db.js'
import { scheduleFinalize } from './priceScheduler.js'

/**
 * @param {import('socket.io').Namespace | import('socket.io').Server} ioNs - Socket.IO namespace (or io)
 * @param {object} tradeData
 * @param {string} roomName - prebuilt room name (e.g., openTrade-<uid>-<pair>)
 * @param {string} userId
 */

export function calculateProfit({
     amount,
     percentage,
     buyOrSell,
     initialPrice,
     finalPrice,
}) {
     let net = 0
     let winAmount = Number(amount)
     let won
     if (finalPrice !== initialPrice) {
          const isBuy = buyOrSell.toLowerCase() === 'buy'

          if (finalPrice === initialPrice) won = 'tie'
          else {
               if (isBuy) {
                    if (finalPrice > initialPrice) won = 'win'
                    else won = 'lose'
               } else {
                    if (finalPrice > initialPrice) won = 'lose'
                    else won = 'win'
               }
          }
          if (won === 'win') {
               net = Math.round(amount * (percentage / 100) * 100) / 100
               winAmount += net
          } else if (won === 'lose') {
               net = -amount
          }
     }
     return { net, winAmount, won }
}

function balancePathForMode(mode) {
     if (mode === 'demo') return 'balance.demo'
     if (mode === 'bonus') return 'balance.bonus'
     return 'balance.amount' // real
}

export const finalizeTrade = async ({
     io,              // <-- must be a Socket.IO *namespace* (or io instance)
     userId,
     mode,            // 'real' | 'demo' | 'bonus'
     tradeIndex,
     initialPrice,
     finalPrice,
     amount,
     percentage,
     buyOrSell,       // already normalized to 'buy' | 'sell'
     openTime,
     closeTime,
     pair,
     roomName
}) => {
     try {
          // 1) DB transaction: fetch user & room, compute P&L, update both
          const { user, result } = await runInTxn(async (session) => {
               const [user, room] = await Promise.all([
                    User.findById(userId).session(session),
                    TradingRoom.findOne({ userId, mode }).session(session),
               ])

               if (!user) throw new Error('User not found')
               if (!room) throw new Error('Room not found')

               const { net, winAmount, won } = calculateProfit({
                    amount,
                    percentage,
                    buyOrSell,
                    initialPrice,
                    finalPrice,
               })

               if (won !== 'lose') {
                    const path = balancePathForMode(mode)
                    const curr = user.get(path) || 0
                    user.set(path, curr + winAmount)
                    user.set('balance.updatedAt', new Date())
                    await user.save({ session })
               }

               const t = room.trades[tradeIndex - 1]
               if (!t) throw new Error('Trade not found at index')

               t.status = 'closed'
               t.isWin = won !== 'lose'
               t.netProfit = net
               t.finalPrice = finalPrice
               room.markModified('trades')
               await room.save({ session })

               return {
                    user,
                    result: {
                         closeTime,
                         openTime,
                         finalPrice,
                         isWin: won !== 'lose',
                         winAmount,
                         tradeIndex,
                         pair,
                         mode,
                    }
               }
          })

          // 2) Emit after commit
          io.to(roomName).emit('tradeResult', result)
          changeBalanceEmitForTrade(io, { userId: user._id, balance: user.balance, mode })

     } catch (err) {
          // Guard against undefined io
          if (io?.to) {
               io.to(roomName).emit('tradeError', { message: err.message || 'FAILED' })
          }
          // Also log
          console.warn('[finalizeTrade] error:', err)
     }
}

const MAX_SEC = 4 * 60 * 60
const MIN_SEC = 5
let finalizeKey
// openTrade.js
export const openTrade = async (ioNs, tradeData, roomName, userId) => {
     const {
          buyOrSell,
          closeTime,
          amount,
          pair,
          initialPrice,
          openTime,
          percentage,
          // mode can be: 'real' | 'demo' | 'bonus'
          // (caller already sets this using the namespace label)
          mode,
     } = tradeData;

     try {
          if (!pair) throw new Error('PAIR_REQUIRED')
          if (!Number.isFinite(amount) || amount <= 0) throw new Error('INVALID_AMOUNT')
          if (!Number.isFinite(openTime) || !Number.isFinite(closeTime)) throw new Error('INVALID_TIMES')
          //// check trade time frame
          const deltaSec = Math.floor((closeTime - openTime))
          if (deltaSec < MIN_SEC) throw new Error('Trade must be at least 5 seconds ahead of time')
          if (deltaSec > MAX_SEC) throw new Error('Trade duration cannot exceed 4 hours')


          // ---- resolve mode & balance path
          const resolvedMode = mode
          const balancePath =
               resolvedMode === 'demo' ? 'balance.demo' :
                    resolvedMode === 'bonus' ? 'balance.bonus' :
                         'balance.amount'; // real

          // ---- DB txn: deduct balance, create trade, persist to a room keyed by mode
          const { user, tradeIndex } = await runInTxn(async (session) => {
               // require enough funds in the correct bucket
               const userFilter = { _id: userId, [balancePath]: { $gte: amount } };

               const user = await User.findOneAndUpdate(
                    userFilter,
                    {
                         $inc: { [balancePath]: -amount },
                         $set: { 'balance.updatedAt': new Date() }
                    },
                    { new: true, session }
               );
               if (!user) throw new Error('Insufficient funds or user not found');

               const newTrade = {
                    percentage,
                    initialPrice,
                    openTime,
                    closeTime,
                    amount,
                    pair,
                    buyOrSell,
                    status: 'opened',
                    mode: resolvedMode,          // keep the mode on the trade for clarity
               };

               const roomQuery = { userId, mode: resolvedMode };

               const roomDoc = await TradingRoom.findOneAndUpdate(
                    roomQuery,
                    { $push: { trades: newTrade } },
                    { new: true, session, upsert: true }
               );
               if (!roomDoc) throw new Error('Trading room not found');

               const tradeIndex = roomDoc.trades.length;
               return { user, tradeIndex };
          })
          // ---- schedule finalize; pass mode so crediting happens in the correct bucket
          if (Number.isInteger(tradeIndex) && tradeIndex >= 0) {
               finalizeKey = scheduleFinalize({
                    roomName,
                    io: ioNs, // IMPORTANT
                    userId,
                    mode,            // 'real' | 'demo' | 'bonus'
                    tradeIndex,
                    initialPrice,
                    amount,
                    percentage,
                    buyOrSell,       // normalized to 'buy' | 'sell'
                    openTime,
                    closeTime,
                    pair,
                    finalizeTrade,   // the function above
               })

               /// now that trade was opened and scheduled to finalize you can tell the client new balance and announce trade opened
               // ---- notify room that the trade opened
               ioNs.to(roomName).emit('tradeOpened', {
                    amount,
                    buyOrSell,
                    openTime,
                    closeTime,
                    price: initialPrice,
                    tradeIndex,
                    pair,
                    mode: resolvedMode,
               })

               // ---- push fresh balances to all user balance rooms in THIS namespace
               changeBalanceEmitForTrade(ioNs, {
                    userId: user._id,
                    balance: user.balance, // { amount, bonus, demo, updatedAt }
                    mode: resolvedMode,
               })
          }

     } catch (err) {
          if (finalizeKey)
               cancelFinalize(finalizeKey)
          ioNs.to(roomName).emit('tradeError', { message: err.message || 'FAILED' });
     }
}

