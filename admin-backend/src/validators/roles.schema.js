// src/validators/roles.schema.js
import { z } from 'zod'
import { zodHelpers } from '../middlewares/validate.js'

export const roleIdParams = z.object({
    id: z.string().regex(zodHelpers.objectIdRegex, 'Invalid role id')
})

export const roleCreateBody = z.object({
    name: z.string().min(2).max(50).trim(),
    permissions: z.array(z.string().min(1)).min(1).transform(a => Array.from(new Set(a))) // dedupe
}).strict()

export const roleUpdateBody = z.object({
    name: z.string().min(2).max(50).trim().optional(),
    permissions: z.array(z.string().min(1)).min(1).transform(a => Array.from(new Set(a))).optional()
}).strict()

export const roleListQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    q: z.string().trim().optional()
}).strict()
