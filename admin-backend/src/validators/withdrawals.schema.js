// src/validators/withdrawals.schema.js
import { z } from 'zod'
import { zodHelpers } from '../middlewares/validate.js'

const objectId = z.string().regex(zodHelpers.objectIdRegex, 'Invalid id')

// Accept either an array of {column, value} or a JSON string of that array
const searchColumnItem = z.object({
    column: z.string().trim().min(1),
    value: z.union([z.string(), z.number(), z.boolean(), z.null()]).optional()
})

const searchColumnsUnion = z.union([
    z.string().trim(),
    z.array(searchColumnItem)
]).transform((v) => {
    if (typeof v === 'string') {
        try {
            const parsed = JSON.parse(v)
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    }
    return v
})

export const userWithdrawHistoryQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),

    // Optional sort
    sortColumn: z
        .string()
        .regex(/^[A-Za-z0-9_.]+$/, 'Invalid sort column')
        .max(40)
        .optional(),
    sortDirection: z.enum(['asc', 'desc']).default('desc'),

    // Optional dynamic filters
    searchColumns: searchColumnsUnion.optional()
}).strict()

export const withdrawalsCountPeriodlicallyQuery = z.object({
    period: z.enum(['daily', 'monthly']),
    tz: z.string().trim().default('UTC'),

    // Optional filters
    status: z.enum(['waiting', 'confirmed', 'rejected']).optional(),
    methodCode: z.string().trim().optional(),
    methodTitle: z.string().trim().optional(),
    walletAddress: z.string().trim().optional(),
    userId: objectId.optional()
}).strict()

export const usersWithdrawalsInformationQuery = z.object({
    tz: z.string().trim().default('Europe/Sofia'),
    status: z.enum(['waiting', 'confirmed', 'rejected']).default('confirmed')
}).strict()
