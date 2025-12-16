// src/middlewares/error.js
import ApiError from '../utils/ApiError.js'

export default function error(err, _req, res, _next) {
    const env = process.env.NODE_ENV || 'development'
    const isApiError = err instanceof ApiError

    const status = isApiError ? err.statusCode : (err.status || 500)
    const message = isApiError ? err.message : (err.message || 'Internal Server Error')
    const details = isApiError ? err.details : undefined

    const payload = { message, statusCode: status }
    if (details) payload.details = details
    if (env !== 'production') payload.stack = err.stack

    res.status(status).json(payload)
}
