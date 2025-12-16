import { Router } from 'express'
import * as ctrl from '../controllers/deposits.controller.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'

const r = Router()
r.get('/list', requireAuth, requireRole('superAdmin', 'admin', 'support'), ctrl.list)
r.get('/userDepositHistory', requireAuth, requireRole('superAdmin', 'admin'), ctrl.userDepositHistory)
r.get('/depositsCountPeriodlically', requireAuth, requireRole('superAdmin', 'admin'), ctrl.depositsCountPeriodlically)
r.get('/usersDepositsInformation', requireAuth, requireRole('superAdmin', 'admin'), ctrl.usersDepositsInformation)
r.get('/getById', requireAuth, requireRole('superAdmin', 'admin', 'support'), ctrl.getDepositById)

export default r
