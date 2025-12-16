import express from 'express'
import { verifyToken, verifyTokenAdmin } from '../middlewares/authMiddleware.js'

import {
     getAllUserTickets,
     getAllUserActiveTickets,
     sendResponseTicket,
     createATicket,
     deActivateATicket,
     getAllUserTicketsByUser,
     getAllTicketsByAdmin,
} from '../controllers/ticketController.js'

const router = express.Router()

router.get('/getAllUserTicketsByAdmin', verifyTokenAdmin, getAllUserTickets)
router.get('/getAllUserTicketsByUser', verifyToken, getAllUserTicketsByUser)
router.get('/getAllTicketsByAdmin', verifyTokenAdmin, getAllTicketsByAdmin)
router.get(
     '/getAllUserActiveTicketsByAdmin',
     verifyTokenAdmin,
     getAllUserActiveTickets
)
router.get(
     '/getAllUserActiveTicketsByUser',
     verifyToken,
     getAllUserActiveTickets
)
router.post('/sendResponse', verifyTokenAdmin, sendResponseTicket)
router.post('/sendResponseByUser', verifyToken, sendResponseTicket)
router.post('/createATicket', verifyToken, createATicket)
router.post('/deActivateATicket', verifyTokenAdmin, deActivateATicket)
export default router