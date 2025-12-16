import { Router } from 'express'
import * as ctrl from '../controllers/verification.controller.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'

const r = Router()

r.get('/verificationCounts', requireAuth, requireRole('superAdmin', 'admin', 'support'), ctrl.verificationCounts)
r.get('/pendingList', requireAuth, requireRole('superAdmin', 'admin', 'support'), ctrl.pendingList)
r.get('/sending', requireAuth, requireRole('superAdmin', 'admin', 'support'), ctrl.listSending)
r.get('/pending', requireAuth, requireRole('superAdmin', 'admin', 'support'), ctrl.listPending)
r.get('/approved', requireAuth, requireRole('superAdmin', 'admin', 'support'), ctrl.listApproved)
r.get('/rejected', requireAuth, requireRole('superAdmin', 'admin', 'support'), ctrl.listRejected)
r.put('/:id/verify', requireAuth, requireRole('superAdmin', 'admin'), ctrl.verifyRequest)
r.put('/:id/reject', requireAuth, requireRole('superAdmin', 'admin'), ctrl.rejectRequest)

export default r
