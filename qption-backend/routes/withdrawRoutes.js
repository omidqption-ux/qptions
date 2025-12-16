import express from 'express'
import { verifyToken } from '../middlewares/authMiddleware.js'

import {
     makeAWithdraw,
     userWithdrawHistory,
} from '../controllers/withdrawController.js'

const router = express.Router()

router.post('/makeAWithdraw', verifyToken, makeAWithdraw)
router.get('/userWithdrawHistory', verifyToken, userWithdrawHistory)

export default router