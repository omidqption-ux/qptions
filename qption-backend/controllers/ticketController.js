import Ticket from '../models/Ticket.js'

export const getAllUserTicketsByUser = async (req, res) => {
     const { page, limit } = req.query
     const { id: userId } = req.user
     try {
          const count = await Ticket.countDocuments()
          const tickets = await Ticket.find({ userId })
               .skip((page - 1) * limit)
               .limit(limit)
               .sort({ createdAt: -1 })

          return res.status(200).json({ tickets, count })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const getAllTicketsByAdmin = async (req, res) => {
     const { page, limit } = req.query
     try {
          const count = await Ticket.countDocuments()
          const tickets = await Ticket.find()
               .skip((page - 1) * limit)
               .limit(limit)
               .sort({ updatedAt: -1 })

          return res.status(200).json({ tickets, count })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const getAllUserTickets = async (req, res) => {
     const { page, limit, userId } = req.query
     try {
          const count = await Ticket.countDocuments({ userId })
          const tickets = await Ticket.find({ userId })
               .skip((page - 1) * limit)
               .limit(limit)
               .sort({ updatedAt: -1 })

          return res.status(200).json({ tickets, count })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const getAllUserActiveTickets = async (req, res) => {
     try {
          return res.status(200).json({})
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const sendResponseTicket = async (req, res) => {
     try {
          const { ticket } = req.body
          const { response, id } = ticket
          await Ticket.findByIdAndUpdate(id, {
               $push: { response },
               isResponded: true,
          })
          return res.status(200).json({ message: 'Note was added' })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const createATicket = async (req, res) => {
     const { title, body, photo } = req.body
     const { id } = req.user
     try {
          await Ticket.create({ title, body, photo, userId: id })
          return res
               .status(200)
               .json({ message: 'Ticket was created successfully' })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const deActivateATicket = async (req, res) => {
     try {
          return res.status(200).json({})
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}