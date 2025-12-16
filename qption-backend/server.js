import './config/env.js'
import connectDB from './config/db.js'
import express from 'express'
import * as routes from './routes/index.js'
import cors from 'cors'
import requestIp from 'request-ip'
import http from 'http'
import { init as initSockets } from './socket.js'
import './utils/cronSweeper.js'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import passport from './config/passportConfig.js'
import { sessionMiddleware as syncSessionUser } from './middlewares/sessionMiddleware.js'
import webhookRoutes from './routes/webhooks.js'
import RedisStore from 'connect-redis'
import { createClient as createRedisClient } from 'redis'

const redisClient = createRedisClient({
     url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
})
redisClient.on('error', (e) => console.error('[redis] error', e))
await redisClient.connect()                 // <-- IMPORTANT
const store = new RedisStore({
     client: redisClient,
     ttl: 7 * 24 * 60 * 60,                    // seconds
})


connectDB()

const app = express()
const server = http.createServer(app)

const dev = process.env.NODE_ENV !== 'production'
const allowedOrigins = dev
     ? ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8081']
     : ['https://www.qption.com', 'https://panel.qption.com', 'https://qption.com', 'http://localhost:8081']

initSockets(server)

app.set('trust proxy', 1)

/** 1) CORS FIRST */
const corsOptions = {
     origin: (origin, cb) => {
          if (!origin) return cb(null, true)                // curl / server-to-server
          cb(null, allowedOrigins.includes(origin))
     },
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}

app.use((req, res, next) => { res.setHeader('Vary', 'Origin'); next() })
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

/** 2) Cookies BEFORE sessions/auth */
app.use(cookieParser(process.env.COOKIE_SIGN_SECRET))


app.use(session({
     store,                                    // undefined → MemoryStore fallback
     name: 'connect.sid',
     secret: process.env.SESSION_SECRET || 'devsecret',
     resave: false,
     saveUninitialized: false,
     cookie: {
          httpOnly: true,
          sameSite: dev ? 'lax' : 'none',
          secure: !dev,
          domain: dev ? undefined : '.qption.com',
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7,   // optional TTL
     }
}))


/** 4) Passport + keep session user in sync */
app.use(passport.initialize())
app.use(passport.session())
app.use(syncSessionUser)

/** 5) Misc */
app.use(requestIp.mw())
app.use(express.json({
     limit: '6mb',
     type: ['application/json', 'text/plain', 'application/*+json'],
     verify: (req, res, buf) => {
          req.rawBody = buf.toString('utf8'); // keep EXACT raw payload
     }
}))
app.use(express.urlencoded({ limit: '6mb', extended: true }))

app.use('/webhooks', webhookRoutes)

/** 6) Health */
app.get('/healthz', (_req, res) =>
     res.status(200).json({ ok: true, time: new Date().toISOString() })
)

/** 7) Routes */
app.get('/', (_req, res) => res.send('✅ API is working!'))
app.use('/auth', routes.googleAnFBRoutes)
app.use('/api/auth', routes.authRoutes)
app.use('/api/users', routes.userRoutes)
app.use('/api/news', routes.newsRoutes)
app.use('/api/tickets', routes.ticketRoutes)
app.use('/api/deposit', routes.depositRoutes)
app.use('/api/withdraw', routes.withdrawRoutes)
app.use('/api/verification', routes.verificationRoutes)
app.use('/api/trading', routes.tradingRoutes)
app.use('/api/notifications', routes.notificationRoutes)
app.use('/api/tradingRoom', routes.tradingRoomRoutes)
app.use('/api/marketData', routes.marketRoutes)
app.use('/api/tickers', routes.tickerRoutes)
app.use('/api/deposits', routes.depositRouter)

/** 8) 404 then error */
app.use((req, res) => res.status(404).send('Route not found: ' + req.url))
app.use((err, _req, res, _next) => {
     console.error('[ERR]', err)
     res.status(err.status || 500).json({ message: err.message || 'Internal Server error' })
})


const PORT = process.env.PORT || 5000
server.listen(PORT, '0.0.0.0', () => console.log('listening on port', PORT))
