// src/utils/logger.js
import pino from 'pino'
import pinoHttp from 'pino-http'

const isProd = process.env.NODE_ENV === 'production'
const level = process.env.LOG_LEVEL || (isProd ? 'info' : 'debug')

/** Base app logger */
export const logger = pino({
    level,
    base: { env: process.env.NODE_ENV || 'development', service: 'admin-backend' },
    redact: {
        paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'password',
            '*.password',
            '*.token',
            'token',
            'accessToken',
            'refreshToken'
        ],
        censor: '[REDACTED]'
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: isProd
        ? undefined
        : {
            // human-friendly logs in dev
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
                singleLine: true
            }
        }
})

/** Create a namespaced child logger (per module/service) */
export const createLogger = (name) => logger.child({ name })

/** Express HTTP logger middleware */
export const httpLogger = pinoHttp({
    logger,
    autoLogging: false, // set to { ignore: req => ... } to skip healthchecks, etc.
    // Generate a short request id for correlation
    genReqId: (req, res) => {
        const existing = req.id || req.headers['x-request-id']
        if (existing) return existing
        // quick, reasonably unique id
        return Math.random().toString(36).slice(2, 10)
    },
    // Add useful props to req/res logs
    serializers: {
        // keep request body small in logs; remove for file uploads
        req(req) {
            return {
                id: req.id,
                method: req.method,
                url: req.url,
                query: req.query,
                // comment next line if bodies might be large/sensitive
                body: req.raw && req.raw.body ? req.raw.body : undefined
            }
        },
        res(res) {
            return {
                statusCode: res.statusCode
            }
        }
    },
    customSuccessMessage: function (req, res) {
        return `${req.method} ${req.url} -> ${res.statusCode}`
    },
    customErrorMessage: function (req, res, err) {
        return `ERROR ${req.method} ${req.url} -> ${res.statusCode} (${err.message})`
    },
    // Log response time
    customLogLevel: function (req, res, err) {
        if (err || res.statusCode >= 500) return 'error'
        if (res.statusCode >= 400) return 'warn'
        return 'info'
    }
})
