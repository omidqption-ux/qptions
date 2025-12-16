import { Router } from 'express'
import auth from './auth.routes.js'
import admins from './admin.routes.js'
import users from './users.routes.js'
import roles from './roles.routes.js'
import deposits from './deposits.routes.js'
import withdrawals from './withdrawals.routes.js'
import trades from './trades.routes.js'
import verification from './verification.routes.js'

const router = Router()
router.use('/auth', auth)
router.use('/admins', admins)
router.use('/users', users)
router.use('/roles', roles)
router.use('/deposits', deposits)
router.use('/withdrawals', withdrawals)
router.use('/trades', trades)
router.use('/verifications', verification)
export default router
