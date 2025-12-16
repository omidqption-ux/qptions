import express from 'express'
import { verifyToken } from '../middlewares/authMiddleware.js'
import {
     getUnreadNotifications,
     markAsRead,
     getNotificationCount,
} from '../controllers/notificationController.js'

const router = express.Router()

router.get('/getUnreadNotifications', verifyToken, getUnreadNotifications)
router.get('/getNotificationCount', verifyToken, getNotificationCount)
router.post('/markAsRead', verifyToken, markAsRead)

export default router