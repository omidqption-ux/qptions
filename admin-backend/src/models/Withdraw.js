import mongoose from 'mongoose'

const withdrawSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        method: {
            title: {
                type: String,
                required: true,
            },
            code: {
                type: String,
                required: true,
            },
        },
        walletAddress: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: 'waiting',
            enum: ['waiting', 'confirmed', 'rejected'],
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
)

withdrawSchema.methods.toJSON = function () {
    const obj = this.toObject()
    delete obj.__v // Remove Mongoose version key
    return obj
}

export default mongoose.model('Withdraw', withdrawSchema)