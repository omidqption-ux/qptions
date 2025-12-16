import { Router } from 'express'
import * as ctrl from '../controllers/trades.controller.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'

const r = Router()
r.get('/list', requireAuth, requireRole('superAdmin', 'admin', 'support'), ctrl.list)

export default r
