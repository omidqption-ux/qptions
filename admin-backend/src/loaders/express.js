import cors from 'cors'
import helmet from 'helmet'
import express from 'express'
import compression from 'compression'
import { env } from '../config/env.js'
import routes from '../routes/index.js'                 // your API router
import cookieParser from 'cookie-parser'
import error from '../middlewares/error.js'             // central error handler
import { httpLogger } from '../utils/logger.js'         // pino http logger
import sanitize from '../middlewares/sanitize.js'
import rateLimit, { ipKeyGenerator } from 'express-rate-limit'

const PROD_ORIGINS = [
    'https://adminpanel.qption.com'
]

const DEV_ORIGINS = [
    'http://localhost:3002',
    'http://127.0.0.1:3002'
]

const allowedOrigins = env.NODE_ENV === 'production' ? PROD_ORIGINS : DEV_ORIGINS

const corsOptionsDelegate = (req, cb) => {
    const origin = req.header('Origin')
    if (!origin || allowedOrigins.includes(origin)) {
        cb(null, {
            origin: origin || true,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            optionsSuccessStatus: 204,
        })
    } else {
        cb(null, { origin: false })
    }
}

export default function loadExpress() {
    const app = express()

    // Security & hardening
    app.use(helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }))

    // CORS (must be BEFORE routes)
    app.use(cors(corsOptionsDelegate))

    // Express 5-safe global preflight (avoid '*' or '(.*)' route patterns)
    app.use((req, res, next) => {
        if (req.method === 'OPTIONS') return res.sendStatus(204)
        next()
    })

    // Help caches vary by Origin (cors also sets this, but explicit is fine)
    app.use((req, res, next) => { res.setHeader('Vary', 'Origin'); next() })

    app.use(compression())

    // Parsers
    app.use(express.json({ limit: '1mb' }))
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser(env.COOKIE_SECRET))

    // Input hygiene & logging
    app.use(sanitize())
    app.use(httpLogger)

    // If behind Nginx in prod, trust one proxy hop
    app.set('trust proxy', env.NODE_ENV === 'production' ? 1 : false)

    // DDoS / brute-force guard
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 300,
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req) => {
            if (req.user?.id) return `u:${req.user.id}`
            return ipKeyGenerator(req.ip) // IPv6-safe
        },
    })
    app.use(limiter)

    // Health & readiness
    app.get('/health', (_req, res) => res.json({ ok: true }))
    app.get('/ready', (_req, res) => res.json({ ok: true }))

    // Mount API
    app.use('/api', routes)

    // 404 after routes
    app.use((req, res, _next) => res.status(404).json({ message: 'Not Found' }))

    // Centralized error handler
    app.use(error)

    return app
}
