// src/validators/deposits.schema.js
import { z } from 'zod'
import { zodHelpers } from '../middlewares/validate.js'

const objectId = z.string().regex(zodHelpers.objectIdRegex, 'Invalid id')
const nonEmptyStr = z.string().trim().min(1)

export const depositsCountPeriodlicallyQuery = z.object({
    period: z.enum(['daily', 'monthly']),
    tz: z.string().trim().default('UTC'),

    // Optional filters
    payment_status: z.string().trim().optional(),
    paidCurrency: z.string().trim().optional(),
    amountCurrency: z.string().trim().optional(),
    type: z.string().trim().optional(),
    userId: objectId.optional()
}).strict()

export const usersDepositsInformationQuery = z.object({
    tz: z.string().trim().default('Europe/Sofia'),
    status: z.enum(['waiting', 'confirmed', 'rejected']).default('confirmed')
}).strict()

// For history list (assumptions: require userId, support paging and optional daterange/filters)
export const userDepositHistoryQuery = z.object({
    userId: objectId,
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),

    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),

    payment_status: z.string().trim().optional(),
    paidCurrency: z.string().trim().optional(),
    amountCurrency: z.string().trim().optional(),
    type: z.string().trim().optional()
}).strict()
