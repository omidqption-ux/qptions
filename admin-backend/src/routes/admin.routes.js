import { Router } from 'express'
import * as ctrl from '../controllers/admin.controller.js'
import { requireAuth, requireRole } from '../middlewares/auth.js'
import validate from '../middlewares/validate.js'
import {
    removeAdminBody,
} from '../validators/admin.schema.js'
const r = Router()
r.get('/getProfile', requireAuth, ctrl.getAdminProfile)
r.put('/changeName', requireAuth, ctrl.changeName) //// change Own name
r.put('/updateName', requireAuth, requireRole('superAdmin'), ctrl.updateName) //// change admins name by superadmin
r.put('/changePassword', requireAuth, requireRole('superAdmin'), ctrl.changePassword) //// change admins name by superadmin
r.get('/getAllAdmins', requireAuth, requireRole('superAdmin'), ctrl.getAllAdmins)
r.put('/deActivate', requireAuth, requireRole('superAdmin'), ctrl.deActivate)
r.put('/updateAdminRole', requireAuth, requireRole('superAdmin'), ctrl.updateAdminRole)
r.post('/newAdmin', requireAuth, requireRole('superAdmin'), ctrl.addNewAdmin)
r.post('/removeAdmin', requireAuth, requireRole('superAdmin'), validate({ body: removeAdminBody }), ctrl.removeAdmin)
r.get('/revenue', requireAuth, requireRole('superAdmin', 'admin'), ctrl.revenue)
r.get('/ordersCountPeriodlically', requireAuth, requireRole('superAdmin', 'admin'), ctrl.ordersCountPeriodlically)
r.get('/tradesInformation', requireAuth, requireRole('superAdmin', 'admin'), ctrl.tradesInformation)
export default r
