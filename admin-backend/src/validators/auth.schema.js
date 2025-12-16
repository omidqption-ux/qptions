// src/validators/auth.schema.js
import { z } from 'zod'

// Reusable bits
const email = z.string().email().toLowerCase()
const password = z.string().min(8).max(128)
const tokenStr = z.string().trim().min(20).max(2048)

export const loginAdminBody = z.object({
    email,
    password,
    // optional niceties
    remember: z.coerce.boolean().default(false), // e.g., issue long-lived refresh cookie
    deviceId: z.string().trim().max(200).optional(),
    userAgent: z.string().trim().max(500).optional()
}).strict()

export const refreshTokenAdminBody = z.object({
    refreshToken: tokenStr,
    fingerprint: z.string().trim().max(300).optional()
}).strict()

// If you store refreshToken in cookies, keep this optional;
// controller can read from cookie when body.refreshToken is absent.
export const logoutAdminBody = z.object({
    refreshToken: tokenStr.optional()
}).strict()