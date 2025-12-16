import express from 'express'
import { verifyToken } from '../middlewares/authMiddleware.js'
import { getFxSymbols, getCryptoSymbols, checkMarketStatus } from '../controllers/tickerController.js';

const router = express.Router()

router.get('/forexSymbols', verifyToken, getFxSymbols)
router.get('/cryptoSymbols', verifyToken, getCryptoSymbols)
router.get('/checkMarketStatus', verifyToken, checkMarketStatus)

export default router