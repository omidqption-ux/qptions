// src/validators/common.schema.js
import { z } from 'zod'
import { zodHelpers } from '../middlewares/validate.js'

export const objectIdParam = z.object({
    id: z.string().regex(zodHelpers.objectIdRegex, 'Invalid id')
})

export const paginationQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    q: z.string().trim().optional()
}).strict()
