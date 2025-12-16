import { Router } from 'express'
import * as ctrl from '../controllers/auth.controller.js'
const r = Router()
r.post('/login', ctrl.loginAdmin)
r.post('/logoutAdmin', ctrl.logoutAdmin)
r.post('/isLoginAdmin', ctrl.isLoginAdmin)
r.post('/refreshTokenAdmin', ctrl.refreshTokenAdmin)
export default r
