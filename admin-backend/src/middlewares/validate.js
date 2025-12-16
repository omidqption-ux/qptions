import { ZodError } from 'zod'
import ApiError, { BadRequest } from '../utils/ApiError.js'
import { logger } from '../utils/logger.js'


export default function validate(schemas = {}) {
    const { body, params, query } = schemas

    return async function (req, _res, next) {
        try {
            req.validated = req.validated || {}

            // body
            if (body) {
                const parsed = await body.parseAsync(req.body)
                req.validated.body = parsed
                req.body = parsed // safe to overwrite
            }

            // params (no reassignment)
            if (params) {
                const parsed = await params.parseAsync(req.params || {})
                req.validated.params = parsed
                Object.assign(req.params, parsed)
            }

            // query (no reassignment)
            if (query) {
                const parsed = await query.parseAsync(req.query || {})
                req.validated.query = parsed
                Object.assign(req.query, parsed)
            }

            return next()
        } catch (err) {
            if (err instanceof ZodError) {
                const details = err.errors.map(e => ({
                    path: e.path.join('.'),
                    message: e.message,
                    code: e.code
                }))
                return next(BadRequest('Validation failed', details))
            }

            try { logger.error({ err }, 'validate() unexpected error') } catch { }

            const isProd = process.env.NODE_ENV === 'production'
            const msg = isProd ? 'Invalid request' : `Invalid request: ${err?.message || 'unknown error'}`
            return next(new ApiError(400, msg, { details: !isProd && err?.stack ? [{ stack: err.stack }] : undefined }))
        }
    }
}

export const zodHelpers = {
    objectIdRegex: /^[0-9a-fA-F]{24}$/
}
