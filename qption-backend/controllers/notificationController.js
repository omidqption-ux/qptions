import Notification from '../models/Notification.js'

export const markAsRead = async (req, res) => {
     const { notificationId } = req.body
     try {
          const notification = await Notification.findById(notificationId)

          if (!notification) {
               return res
                    .status(404)
                    .json({ message: 'Notification not found' })
          }

          notification.isRead = true
          await notification.save()

          return res.status(200).json({ notificationId })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const getUnreadNotifications = async (req, res) => {
     const userId = req.user._id
     try {
          const notifications = await Notification.find({
               userId: userId,
               isRead: false,
          })
               .sort({ createdAt: -1 }) // most recent first
               .limit(10) // limit to 10 notifications
          return res.status(200).json({ notifications })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const getNotificationCount = async (req, res) => {
     const userId = req.user._id
     try {
          const count = await Notification.countDocuments({
               userId: userId,
               isRead: false,
          })
          return res.status(200).json({ count })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
