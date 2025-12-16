// middlewares/sessionMiddleware.js
import Session from '../models/Sessions.js'

export const sessionMiddleware = async (req, res, next) => {
     try {
          if (req.method === 'OPTIONS') return res.sendStatus(204)
          if (!req.session) return next()

          // Only act if we have an authenticated user/session id
          const userId = req.user?._id || req.session?.userId
          if (!userId) return next()

          req.session.userId = String(userId)

          const userAgent = req.headers['user-agent'] || ''
          const ipAddress = req.clientIp || req.ip

          const existing = await Session.findOne({ userId, ipAddress, userAgent })
          if (existing) {
               existing.lastActive = new Date()
               await existing.save()
               return next()
          }

          // Create record instead of killing the request
          await Session.create({
               userId,
               ipAddress,
               userAgent,
               lastActive: new Date(),
               createdAt: new Date(),
          })
          return next()
     } catch (err) {
          return next(err)
     }
}
