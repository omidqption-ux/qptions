import { Router } from 'express'
import * as ctrl from '../controllers/withdrawals.controller.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'
import validate from '../middlewares/validate.js'
import {
    userWithdrawHistoryQuery,
    withdrawalsCountPeriodlicallyQuery,
} from '../validators/withdrawals.schema.js'

const r = Router()
r.get('/list', requireAuth, requireRole('superAdmin', 'admin', 'suppot'), ctrl.listWithdrawals)
r.get('/getById', requireAuth, requireRole('superAdmin', 'admin', 'suppot'), ctrl.getWitdhdrawById)
r.get('/count', requireAuth, requireRole('superAdmin', 'admin', 'suppot'), ctrl.getWithdrawStatsCounts)
r.get('/userWithdrawHistory', requireAuth, requireRole('superAdmin', 'admin'), validate({ query: userWithdrawHistoryQuery }), ctrl.userWithdrawHistory)
r.get('/withdrawalsCountPeriodlically', requireAuth, requireRole('superAdmin', 'admin'), validate({ query: withdrawalsCountPeriodlicallyQuery }),
    ctrl.withdrawalsCountPeriodlically)
r.get('/usersWithdrawalsInformation', requireAuth, requireRole('superAdmin', 'admin'), ctrl.usersWithdrawalsInformation)
r.post('/approve', requireAuth, requireRole('superAdmin', 'admin'), ctrl.approveWithdraw)
r.post('/reject', requireAuth, requireRole('superAdmin', 'admin'), ctrl.rejectWithdraw)
export default r
