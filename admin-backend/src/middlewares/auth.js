import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import Admin from '../models/Admin.js'

function allowPreflight(req, res) {
    if (req.method === 'OPTIONS') {
        res.status(204)
        return true;
    }
    return false;
}

export async function requireAuth(req, res, next) {

    if (allowPreflight(req, res)) return
    try {
        const cookieName = env.COOKIE_ADMIN_REFRESH
        const token = req.signedCookies?.[cookieName];
        if (!token) {
            return res.status(401).json({ error: 'No token' });
        }
        const payload = jwt.verify(token, env.COOKIE_SECRET)
        const admin = await Admin.findById(payload.userId)
        if (!admin) {
            return res.status(401).json({ error: 'Admin not found' });
        }
        req.admin = admin
        return next()
    } catch {
        return next({ status: 401, message: 'Unauthorized' })
    }
}

export function requireRole(...needed) {
    return (req, _res, next) => {
        const role = req.admin?.role || ''
        const ok = needed.includes(role)
        if (!ok) return next({ status: 403, message: 'Forbidden' })
        next()
    }
}
