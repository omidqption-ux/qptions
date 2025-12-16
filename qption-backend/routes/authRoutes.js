import express from 'express'
import {
     registerUser,
     loginUser,
     isLoginUser,
     sendValidationOtpSMS,
     sendValidationOtpEmail,
     otpUserLogin,
     refreshToken,
     logOutUser
} from '../controllers/authController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/isLogin', isLoginUser)
router.post('/sendOtpEmail', sendValidationOtpEmail)
router.post('/sendOtpSMS', sendValidationOtpSMS)
router.post('/otpLogin', otpUserLogin)
router.post('/refreshToken', refreshToken)
router.post('/logout', verifyToken, logOutUser)

export default router
