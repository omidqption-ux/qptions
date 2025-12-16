import express from 'express'
import { verifyToken } from '../middlewares/authMiddleware.js'
import {
     userTradingHistory,
     leaderBoardPnl,
     leaderBoardRoi,
     popularTraders,
     getPnlAndInvestemntOfUser,
     tickerInfo,
} from '../controllers/tradingController.js'

const router = express.Router()

router.get('/userTradingHistory', verifyToken, userTradingHistory)
router.get('/leaderBoardPnl', verifyToken, leaderBoardPnl)
router.get('/leaderBoardRoi', verifyToken, leaderBoardRoi)
router.get('/popularTraders', verifyToken, popularTraders)
router.get('/getPnlAndInvestemntOfUser', verifyToken, getPnlAndInvestemntOfUser)
router.get('/tickerInfo', tickerInfo)

export default router
