// src/validators/users.schema.js
import { z } from 'zod'
import { zodHelpers } from '../middlewares/validate.js'

const objectId = z.string().regex(zodHelpers.objectIdRegex, 'Invalid id')

export const listQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    q: z.string().trim().optional()
}).strict()

export const idParams = z.object({
    id: objectId
}).strict()

// Allow safe, partial updates only — expand as your model allows
export const userUpdateBody = z.object({
    name: z.string().trim().min(1).max(100).optional(),
    isActive: z.coerce.boolean().optional(),
    country: z.string().trim().max(60).optional(),
    isEmailVerified: z.coerce.boolean().optional(),
    isPhoneVerified: z.coerce.boolean().optional(),
    balances: z.object({
        usd: z.coerce.number().min(0).optional(),
        bonus: z.coerce.number().min(0).optional()
    }).partial().optional()
}).strict().refine(obj => Object.keys(obj).length > 0, { message: 'At least one field is required' })

export const usersCountInformationQuery = z.object({
    tz: z.string().trim().default('Europe/Sofia')
}).strict()

export const customersPerCountryQuery = z.object({
    active: z.enum(['true', 'false']).optional(),
    minCount: z.coerce.number().int().min(0).default(0)
}).strict()

export const mostProfitableQuery = z.object({
    period: z.enum(['This-24H', 'This-Month', 'This-Year', 'All-The-Time']),
    tz: z.string().trim().default('UTC'),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    mode: z.enum(['real', 'demo', 'bonus']).optional(),
    pair: z.string().trim().optional(),
    status: z.enum(['open', 'closed', 'all']).default('closed')
}).strict()

export const customersCountPeriodlicallyQuery = z.object({
    period: z.enum(['daily', 'monthly']),
    tz: z.string().trim().default('UTC')
}).strict()

export const verifyEmailBody = z.object({
    userId: objectId,
    isVerify: z.coerce.boolean()
}).strict()

export const verifyPhoneBody = z.object({
    userId: objectId,
    isVerify: z.coerce.boolean()
}).strict()
