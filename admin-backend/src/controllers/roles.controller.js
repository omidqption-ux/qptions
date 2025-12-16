import Role from '../models/Role.js'

/**
 * GET /api/roles
 * Query: page=1&limit=20&q=searchText
 */
export const list = async (req, res, next) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1)
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20))
        const q = (req.query.q || '').trim()

        const filter = q
            ? { $or: [{ name: new RegExp(q, 'i') }, { permissions: new RegExp(q, 'i') }] }
            : {}

        const [data, total] = await Promise.all([
            Role.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
            Role.countDocuments(filter)
        ])

        res.json({ data, total, page, limit })
    } catch (err) { next(err) }
}

/**
 * GET /api/roles/:id
 */
export const getOne = async (req, res, next) => {
    try {
        const role = await Role.findById(req.params.id)
        if (!role) return res.status(404).json({ message: 'Role not found' })
        res.json(role)
    } catch (err) { next(err) }
}

/**
 * POST /api/roles
 * Body: { name: string, permissions: string[] }
 */
export const create = async (req, res, next) => {
    try {
        const { name, permissions } = sanitizeRoleBody(req.body)

        // uniqueness check
        const exists = await Role.findOne({ name })
        if (exists) return res.status(409).json({ message: 'Role name already exists' })

        const role = await Role.create({ name, permissions })
        res.status(201).json(role)
    } catch (err) { next(err) }
}

/**
 * PATCH /api/roles/:id
 * Body: { name?: string, permissions?: string[] }
 */
export const update = async (req, res, next) => {
    try {
        const { name, permissions, hasName, hasPermissions } = sanitizeRoleBody(req.body, { partial: true })

        // if changing name, ensure unique
        if (hasName && name) {
            const exists = await Role.findOne({ name, _id: { $ne: req.params.id } })
            if (exists) return res.status(409).json({ message: 'Role name already exists' })
        }

        const patch = {}
        if (hasName) patch.name = name
        if (hasPermissions) patch.permissions = permissions

        const role = await Role.findByIdAndUpdate(req.params.id, patch, { new: true })
        if (!role) return res.status(404).json({ message: 'Role not found' })

        res.json(role)
    } catch (err) { next(err) }
}

/**
 * DELETE /api/roles/:id
 */
export const remove = async (req, res, next) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id)
        if (!role) return res.status(404).json({ message: 'Role not found' })
        res.json({ ok: true })
    } catch (err) { next(err) }
}

/**
 * GET /api/roles/_meta/permissions
 * Central list of all permission strings your app recognizes.
 * Adjust this list to match your domain.
 */
export const permissionsMeta = async (_req, res, _next) => {
    const permissions = [
        // Users
        'user:read', 'user:write', 'user:delete',
        // Admins
        'admin:read', 'admin:write', 'admin:delete',
        // Roles
        'role:read', 'role:write', 'role:delete',
        // Deposits
        'deposit:read', 'deposit:approve', 'deposit:reject',
        // Withdrawals
        'withdraw:read', 'withdraw:approve', 'withdraw:reject',
        // Settings
        'settings:read', 'settings:write',
        // Reports
        'report:read', 'report:export'
    ]
    res.json({ permissions })
}

/* ------------------------ helpers ------------------------ */
function sanitizeRoleBody(body, opts = { partial: false }) {
    const out = {
        name: undefined,
        permissions: undefined,
        hasName: false,
        hasPermissions: false
    }

    if (!opts.partial || Object.prototype.hasOwnProperty.call(body, 'name')) {
        out.hasName = true
        if (typeof body.name !== 'string' || !body.name.trim()) {
            if (!opts.partial) throw makeBadRequest('`name` is required and must be a non-empty string')
        } else {
            out.name = body.name.trim()
        }
    }

    if (!opts.partial || Object.prototype.hasOwnProperty.call(body, 'permissions')) {
        out.hasPermissions = true
        if (!Array.isArray(body.permissions)) {
            if (!opts.partial) throw makeBadRequest('`permissions` must be an array of strings')
        } else {
            const perms = body.permissions.map(p => String(p).trim()).filter(Boolean)
            if (!opts.partial && perms.length === 0) {
                throw makeBadRequest('`permissions` cannot be empty')
            }
            out.permissions = Array.from(new Set(perms)) // dedupe
        }
    }

    return out
}

function makeBadRequest(message) {
    const err = new Error(message)
    err.status = 400
    return err
}
