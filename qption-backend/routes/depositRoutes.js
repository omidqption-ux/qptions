import express from 'express'
import { verifyToken } from '../middlewares/authMiddleware.js'

import {
     getCoins,
     getMinDeposit,
     getEstimatedPriceCrypto,
     createpayment,
     userDepositHistory,
     isFirstDeposit,
} from '../controllers/depositController.js'

const router = express.Router()

router.get('/userDepositHistory', verifyToken, userDepositHistory)
router.post('/createpayment', verifyToken, createpayment)
router.post('/getEstimatedPriceCrypto', verifyToken, getEstimatedPriceCrypto)
router.post('/getMinDeposit', verifyToken, getMinDeposit)
router.get('/getCoins', verifyToken, getCoins)
router.get('/isFirstDeposit', verifyToken, isFirstDeposit)

export default router