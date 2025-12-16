import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
     userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
     },
     ipAddress: { type: String, required: false },
     userAgent: { type: String, required: false },
     deviceOs: {
          type: String,
     },
     browser: {
          type: String,
     },
     createdAt: { type: Date, default: Date.now },
     lastActive: { type: Date, default: Date.now },
     country: { type: String },
     city: { type: String },
})

export default mongoose.model('Session', sessionSchema)
