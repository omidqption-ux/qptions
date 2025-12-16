import { Server as SocketIOServer } from 'socket.io'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import cookieParser from 'cookie-parser'
import TradingRoom from './models/TradingRoom.js'
import { openTrade } from './utils/openTrade.js'
import { fetchRecentPolygon } from './polygon/polygonApis.js'
import { priceFeed } from './priceFeed.js'

let ioRef // for getIO()

/** ---- attach user if present; never reject during handshake ---- */
function attachUserIfPresent(socket) {
     try {
          const secret = process.env.JWT_SECRET
          const cookieName = process.env.COOKIE_ACCESS

          // 1) Signed cookie
          const raw = socket.handshake.headers?.cookie || ''
          if (raw) {
               const parsed = cookie.parse(raw)
               const signed = parsed[cookieName]
               if (signed) {
                    const token = cookieParser.signedCookie(signed, secret)
                    if (token && typeof token === 'string') {
                         const payload = jwt.verify(token, secret)
                         if (payload?.userId) socket.user = { id: String(payload.userId), ...payload }
                    }
               }
          }

          // 2) Authorization: Bearer
          if (!socket.user) {
               const h = socket.handshake.headers?.authorization || ''
               if (h.startsWith('Bearer ')) {
                    const payload = jwt.verify(h.slice(7).trim(), secret)
                    if (payload?.userId) socket.user = { id: String(payload.userId), ...payload }
               }
          }

          // 3) Engine.IO auth/query
          if (!socket.user) {
               const t = socket.handshake.auth?.token || socket.handshake.query?.token
               if (t) {
                    const payload = jwt.verify(String(t), secret)
                    if (payload?.userId) socket.user = { id: String(payload.userId), ...payload }
               }
          }
     } catch {
          // swallow errors; don't break polling
     }
}

function requireAuth(socket, ack) {
     const uid = socket.user?.id
     if (uid) return uid
     if (typeof ack === 'function') ack('AUTH_REQUIRED')
     else socket.emit('auth_required')
     return null
}

function wireHandlersForNamespace(ioNs, nsLabel) {
     // const activeTradingUsers = new Set()
     ioNs.on('connection', (socket) => {
          const getUid = () => socket.user?.userId ?? socket.user?.id;
          const balanceRoom = (userId, pair = '') =>
               `${nsLabel}:balance-${userId}${pair ? `-${String(pair).toUpperCase()}` : ''}`

          const tradeRoom = (userId, pair) => `${nsLabel}:trade-${userId}-${pair}`
          const liveRoom = (userId, pair) => `${nsLabel}:live-${userId}-${pair}`
          const liveSubs = new Map()
          const tradeSubs = new Map()
          const balanceSubs = new Map()

          function trackBalanceRoom(socket, room) {
               let set = balanceSubs.get(socket.id);
               if (!set) {
                    set = new Set();
                    balanceSubs.set(socket.id, set);
               }
               set.add(room);
          }
          function untrackBalanceRoom(socket, room) {
               const set = balanceSubs.get(socket.id);
               if (!set) return;
               set.delete(room);
               if (set.size === 0) balanceSubs.delete(socket.id);
          }

          function trackTradeRoom(socket, room) {
               let set = tradeSubs.get(socket.id);
               if (!set) {
                    set = new Set();
                    tradeSubs.set(socket.id, set);
               }
               set.add(room);
          }

          socket.on('joinBalanceCheckRoom', async () => {
               const userId = requireAuth(socket)
               if (!userId) return
               const room = balanceRoom(userId);
               if (!socket.rooms.has(room)) {
                    await socket.join(room);
                    trackBalanceRoom(socket, room);
               }
          })

          socket.on('leaveBalanceCheckRoom', async () => {
               const userId = getUid()
               if (!userId) return
               const room = balanceRoom(userId)
               if (socket.rooms.has(room)) {
                    try { await socket.leave(room); } catch { }
                    untrackBalanceRoom(socket, room);
               }
          })
          socket.on('joinTradeOpenAndCloseResult', async (tData, ack) => {
               const userId = requireAuth(socket, ack)
               if (!userId) return
               const room = tradeRoom(userId, tData.pair)
               if (!socket.rooms.has(room)) {
                    await socket.join(room)
                    trackTradeRoom(socket, room)
               }
          })
          socket.on('openTrade', async (tradeData, ack) => {
               const userId = requireAuth(socket, ack)
               if (!userId) return
               if (!tradeData?.pair) return typeof ack === 'function' && ack('PAIR_REQUIRED')
               const room = tradeRoom(userId, tradeData.pair)
               if (!socket.rooms.has(room)) {
                    await socket.join(room)
                    trackTradeRoom(socket, room)
               }
               const tradeCtx = {
                    ...tradeData,
                    mode: nsLabel
               }
               openTrade(ioNs, tradeCtx, room, userId)
          })

          socket.on('getOpenTrades', async ({ page = 1, limit = 10, mode } = {}, ack) => {
               const userId = requireAuth(socket, ack); if (!userId) return
               try {

                    const room = await TradingRoom.findOne({ userId, mode }).lean()
                    if (!room) return ack(null, { trades: [], total: 0, page: 1, totalPages: 0 })

                    const openTradesAll = room.trades.filter(t => t.status !== 'closed')
                    openTradesAll.sort((a, b) => b.openTime - a.openTime)
                    const total = openTradesAll.length
                    const totalPages = Math.max(1, Math.ceil(total / limit))
                    const currentPage = Math.min(Math.max(1, page), totalPages)
                    const start = (currentPage - 1) * limit
                    const trades = openTradesAll.slice(start, start + limit).map((t, idx) => ({
                         amount: t.amount, buyOrSell: t.buyOrSell, openTime: t.openTime, closeTime: t.closeTime,
                         price: t.open, tradeIndex: start + idx, pair: t.pair
                    }))
                    ack(null, { trades, total, page: currentPage, totalPages })
               } catch (e) {
                    ack(e.message || 'FAILED')
               }
          })

          socket.on('getTradeHistory', async ({ page = 1, limit = 10, mode } = {}, ack) => {
               const userId = requireAuth(socket, ack); if (!userId) return
               try {
                    const room = await TradingRoom.findOne({ userId, mode }).lean()
                    if (!room) return ack(null, { trades: [], total: 0, page: 1, totalPages: 0 })

                    const closed = room.trades.filter(t => t.status === 'closed')
                    closed.sort((a, b) => new Date(b.closeTime) - new Date(a.closeTime))
                    const total = closed.length
                    const totalPages = Math.max(1, Math.ceil(total / limit))
                    const start = (page - 1) * limit
                    const trades = closed.slice(start, start + limit).map((t, idx) => ({
                         netProfit: t.netProfit, amount: t.amount, buyOrSell: t.buyOrSell,
                         openTime: t.openTime, closeTime: t.closeTime, tradeIndex: start + idx, pair: t.pair
                    }))
                    ack(null, { trades, total, page, totalPages })
               } catch (e) {
                    ack(e.message || 'FAILED')
               }
          })

          socket.on('loadMore', async ({ pair, endTime, rows = 600 } = {}, ack) => {
               const userId = requireAuth(socket, ack); if (!userId) return
               try {
                    let result

                    result = await fetchRecentPolygon(pair, endTime, rows)

                    socket.emit('moreKlines', result)
                    ack && ack(null, { ok: true })
               } catch (e) {
                    ack && ack(e.message || 'Failed to load more klines')
               }
          })

          socket.on('subscribe', async ({ pair } = {}, ack) => {
               const userId = requireAuth(socket, ack); if (!userId) return
               try {
                    let snapshot
                    snapshot = await fetchRecentPolygon(pair)
                    ack && ack(null, snapshot)
               } catch (e) {
                    ack && ack(e.message || 'Failed to fetch snapshot')
               }
          })

          socket.on('disconnect', async () => {
               // 1) cleanup live subs 
               const keys = [];
               for (const [k, v] of liveSubs.entries()) {
                    if (k.startsWith(`${socket.id}:`)) keys.push(k);
               }
               for (const k of keys) {
                    const sub = liveSubs.get(k);
                    try { sub.unsubscribe && sub.unsubscribe(); } catch { }
                    liveSubs.delete(k);
                    try { await socket.leave(sub.room); } catch { }
               }
               // 2) leave trade rooms we tracked
               const set = tradeSubs.get(socket.id);
               if (set) {
                    for (const room of set) {
                         try { await socket.leave(room) } catch { }
                    }
                    tradeSubs.delete(socket.id)
               }
               ////3) leave balance checkroom
               const balSet = balanceSubs.get(socket.id)
               if (balSet) {
                    for (const room of balSet) {
                         try { await socket.leave(room) } catch { }
                    }
                    balanceSubs.delete(socket.id);
               }

          })

          socket.on('startLive', async ({ pair } = {}, ack) => {
               const userId = requireAuth(socket, ack);
               if (!userId || !pair) return;

               const room = liveRoom(userId, pair); // e.g. `${nsLabel}:live-${userId}-${pair}`
               const key = `${socket.id}:${pair}`;

               // If already subscribed, just ensure room + ack as before
               if (liveSubs.has(key)) {
                    if (!socket.rooms.has(room)) {
                         await socket.join(room);
                    }
                    return ack && ack(null, { liveStarted: true, already: true });
               }

               await socket.join(room);

               let firstData = false;
               let ackSent = false;
               let unsubscribe;

               // OPTIONAL: timeout – if you want to ack with an error instead of hanging forever
               const TIMEOUT_MS = 10_000;
               const timeoutId = setTimeout(() => {
                    if (ackSent) return;
                    ackSent = true;

                    // No data received in TIMEOUT_MS → cleanup + error ack
                    try {
                         unsubscribe && unsubscribe();
                    } catch (e) { }
                    liveSubs.delete(key);

                    ack && ack(
                         { code: 'NO_LIVE_DATA', message: 'No live data received for this pair.trying again' },
                         null
                    );
               }, TIMEOUT_MS);
               unsubscribe = priceFeed.subscribe(pair, (data) => {
                    if (!firstData) {
                         firstData = true
                         if (!ackSent && ack) {
                              ackSent = true
                              clearTimeout(timeoutId);
                              ack(null, { liveStarted: true })
                         }
                    }

                    ioNs.to(room).emit('liveData', data)
               })

               // Only keep subscription if it’s actually active
               liveSubs.set(key, { unsubscribe, room, pair });

               // NOTE: we are NOT doing `ack(null, { liveStarted: true })` here.
               // It happens only inside the subscribe callback on first data.
          });

          socket.on('unsubscribe', async ({ pair } = {}, ack) => {
               const key = `${socket.id}:${pair}`
               const sub = liveSubs.get(key)
               if (!sub) {
                    return
               }
               try { sub.unsubscribe && sub.unsubscribe(); } catch { }
               liveSubs.delete(key);
               try { await socket.leave(sub.room); } catch { }
          })
     })
}

/** ---- init / getIO ---- */
export function init(server) {
     const dev = process.env.NODE_ENV !== 'production'
     const origins = dev
          ? ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002']
          : ['https://www.qption.com', 'https://panel.qption.com', 'https://qption.com']

     const io = new SocketIOServer(server, {
          cors: { origin: origins, credentials: true },
          transports: ['websocket', 'polling'],
          path: '/socket.io',
          allowEIO3: false,
          pingTimeout: 25000,
          pingInterval: 20000
     })

     // soft auth — never reject here
     io.use((socket, next) => { attachUserIfPresent(socket); next() })
     const nsReal = io.of('/real')
     const nsDemo = io.of('/demo')
     const nsBonus = io.of('/bonus')
     const nsNotifications = io.of('/notifications')

     nsReal.use((socket, next) => { attachUserIfPresent(socket); next() })
     nsDemo.use((socket, next) => { attachUserIfPresent(socket); next() })
     nsBonus.use((socket, next) => { attachUserIfPresent(socket); next() })
     nsNotifications.use((socket, next) => { attachUserIfPresent(socket); next() })

     wireHandlersForNamespace(nsReal, 'real', false)
     wireHandlersForNamespace(nsDemo, 'demo', true)
     wireHandlersForNamespace(nsBonus, 'bonus', true)


     nsNotifications.on('connection', (socket) => {
          const userId = requireAuth(socket) // enforce auth here
          if (!userId) {
               socket.disconnect(true)
               return
          }
          const room = `notifications:user:${userId}`
          socket.join(room)
          // Optional: client can confirm it’s joined
          socket.emit('joinedNotifications', { room })

          // Optional: let client leave manually if you add that on frontend
          socket.on('leaveNotifications', async () => {
               try { await socket.leave(room) } catch { }
          })
     })

     ioRef = io
     //startMarketClock(io) // <— start background market watcher for forex holidays
     return io
}

export function emitUserNotification(userId, payload) {
     if (!ioRef) throw new Error('Socket.io not initialized!')
     const room = `notifications:user:${userId}`
     ioRef.of('/notifications').to(room).emit('notification', payload)
}
export function getIO() {
     if (!ioRef) throw new Error('Socket.io not initialized!')
     return ioRef
}
