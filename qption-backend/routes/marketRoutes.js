import express from 'express'

import { getLatestMarketData } from '../controllers/marketDataController.js'

const router = express.Router()

router.get('/', getLatestMarketData)
export default router
