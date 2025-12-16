import express from 'express'
import { verifyToken } from '../middlewares/authMiddleware.js'
import { setTradingRoom, setTradingRoomDemo, setTradingRoomBonus } from '../controllers/tradingRoomController.js'

const router = express.Router()

router.post('/setTradingRoom', verifyToken, setTradingRoom)
router.post('/setTradingRoomDemo', verifyToken, setTradingRoomDemo)
router.post('/setTradingRoomBonus', verifyToken, setTradingRoomBonus)

export default router