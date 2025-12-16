// src/validators/admin.schema.js
import { z } from 'zod'
import { zodHelpers } from '../middlewares/validate.js'

// Common bits
const objectId = z.string().regex(zodHelpers.objectIdRegex, 'Invalid id')
const rolesEnum = z.enum(['superAdmin', 'admin', 'support'])

export const paginationQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    q: z.string().trim().optional()
}).strict()

// GET /getProfile – no payload needed
export const getProfileNone = z.object({}).strict()

// GET /getAllAdmins?page=&limit=&q=
export const getAllAdminsQuery = paginationQuery

// PUT /deActivate  { adminId, isActive }
export const deactivateBody = z.object({
    adminId: objectId,
    isActive: z.coerce.boolean()
}).strict()

// PUT /updateAdminRole  { adminId, roles }
export const updateAdminRoleBody = z.object({
    adminId: objectId,
    roles: z.array(rolesEnum).nonempty().transform(a => Array.from(new Set(a)))
}).strict()

// POST /newAdmin  { email, password, roles? }
export const newAdminBody = z.object({
    email: z.string().email().toLowerCase(),
    password: z.string().min(8).max(128),
    roles: z.array(rolesEnum).nonempty().transform(a => Array.from(new Set(a))).optional()
}).strict()

// POST /removeAdmin  { adminId }
export const removeAdminBody = z.object({
    adminId: objectId
}).strict()

// POST /revenue, /ordersCountPeriodlically, /tradesInformation
// Accept either explicit dates OR a named range. You can adjust on server if both provided.
const isoDate = z.coerce.date({ required_error: 'startDate/endDate must be valid date' })
export const periodBody = z.object({
    // optional convenience: 'today'|'7d'|'30d'|'mtd'|'ytd'|'prevMonth' etc.
    preset: z.enum(['today', '7d', '30d', 'mtd', 'ytd', 'prevMonth']).optional(),
    // optional grouping: 'day'|'week'|'month'
    groupBy: z.enum(['day', 'week', 'month']).default('day')
}).strict()
