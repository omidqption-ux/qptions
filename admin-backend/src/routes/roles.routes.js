import { Router } from 'express'
import * as ctrl from '../controllers/roles.controller.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'
import { roleIdParams, roleCreateBody, roleUpdateBody, roleListQuery } from '../validators/roles.schema.js'
import validate from '../middlewares/validate.js'

const r = Router()

// Read (admins/support can view)
r.get('/', requireAuth, requireRole('superAdmin', 'admin', 'support'), validate({ query: roleListQuery }), ctrl.list)
r.get('/:id', requireAuth, requireRole('superAdmin', 'admin', 'support'), validate({ params: roleIdParams }), ctrl.getOne)

// Write (superAdmin only)
r.post('/', requireAuth, requireRole('superAdmin'), validate({ body: roleCreateBody }), ctrl.create)
r.patch('/:id', requireAuth, requireRole('superAdmin'), validate({ params: roleIdParams, body: roleUpdateBody }), ctrl.update)
r.delete('/:id', requireAuth, requireRole('superAdmin'), validate({ params: roleIdParams }), ctrl.remove)

// (optional) list all known permissions your app recognizes
r.get('/_meta/permissions', requireAuth, requireRole('superAdmin', 'admin'), ctrl.permissionsMeta)

export default r
