import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

notificationSchema.methods.toJSON = function () {
    const obj = this.toObject()
    delete obj.__v
    return obj
}

const Notification = mongoose.model('Notification', notificationSchema)
export default Notification
