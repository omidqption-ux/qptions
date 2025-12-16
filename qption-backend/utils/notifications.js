import Notification from '../models/Notification.js'
import { emitUserNotification } from '../socket.js'

export const createNotification = async ({ userId, category, title, body }) => {
     try {
          const notification = new Notification({
               userId: userId,
               category: category,
               title: title,
               body: body,
          })
          await notification.save()
          emitUserNotification(userId, {
               type: category,
               title: title,
               message: body,
               createdAt: new Date().toISOString(),
          })
     } catch (error) {
          console.error('Error creating notification:', error)
     }
}
