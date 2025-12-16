import express from 'express'
import {
     verifyToken,
     verifyTokenAdmin,
} from '../middlewares/authMiddleware.js'

import {
     getLatestNews,
     getCompanyNews,
     setCompanyNews,
     editCompanyNews,
     deleteCompanyNews,
} from '../controllers/newsController.js'

const router = express.Router()

router.get('/', getLatestNews)
router.get('/companyNewsUser', verifyToken, getCompanyNews)
router.get('/companyNews', verifyTokenAdmin, getCompanyNews)
router.post('/companyNews', verifyTokenAdmin, setCompanyNews)
router.put('/companyNews', verifyTokenAdmin, editCompanyNews)
router.delete('/companyNews', verifyTokenAdmin, deleteCompanyNews)
export default router
