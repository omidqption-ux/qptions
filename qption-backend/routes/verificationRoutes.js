import express from 'express'
import { verifyToken } from '../middlewares/authMiddleware.js'
import multer from 'multer'

import {
     uploadIDDoc,
     uploadSelfie,
     getVerification,
     saveDocType,
     uploadIDDocBack,
     changeStatus,
     getUserVerificationStatus,
} from '../controllers/verificationController.js'

const router = express.Router()
router.post('/changeStatus', verifyToken, changeStatus)
router.get('/getVerification', verifyToken, getVerification)
router.post('/saveDocType', verifyToken, saveDocType)
router.post('/uploadIDDoc', verifyToken, uploadIDDoc)
router.post('/uploadIDDocBack', verifyToken, uploadIDDocBack)
router.post('/uploadSelfie', verifyToken, uploadSelfie)
router.get('/getUserVerificationStatus', verifyToken, getUserVerificationStatus)

export default router