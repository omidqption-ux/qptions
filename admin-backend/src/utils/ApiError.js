// src/utils/ApiError.js
/**
 * Standardized operational error for API responses
 * - statusCode: HTTP status (e.g., 400, 401, 403, 404, 422, 500)
 * - message: safe message for clients
 * - isOperational: marks errors we intentionally throw (vs programming bugs)
 * - stack: included in non-production for debugging
 */
export default class ApiError extends Error {
    constructor(statusCode, message, options = {}) {
        super(message)

        // Maintains proper stack trace (V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }

        this.name = this.constructor.name
        this.statusCode = statusCode
        this.isOperational = options.isOperational ?? true
        this.details = options.details // optional object/array with extra info
    }

    toJSON(env = process.env.NODE_ENV) {
        const payload = {
            message: this.message,
            statusCode: this.statusCode,
            ...(this.details ? { details: this.details } : {})
        }
        if (env !== 'production') {
            payload.stack = this.stack
        }
        return payload
    }
}

/* Convenience factories */
export const BadRequest = (msg = 'Bad Request', details) =>
    new ApiError(400, msg, { details })

export const Unauthorized = (msg = 'Unauthorized', details) =>
    new ApiError(401, msg, { details })

export const Forbidden = (msg = 'Forbidden', details) =>
    new ApiError(403, msg, { details })

export const NotFound = (msg = 'Not Found', details) =>
    new ApiError(404, msg, { details })

export const Conflict = (msg = 'Conflict', details) =>
    new ApiError(409, msg, { details })

export const Unprocessable = (msg = 'Unprocessable Entity', details) =>
    new ApiError(422, msg, { details })

export const Internal = (msg = 'Internal Server Error', details) =>
    new ApiError(500, msg, { details, isOperational: false })
