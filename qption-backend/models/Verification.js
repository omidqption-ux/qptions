import mongoose from 'mongoose'

const verificationSchema = new mongoose.Schema(
     {
          userId: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'User',
               required: true,
          },
          issuingCountry: {
               type: String,
               required: false,
          },
          documentType: {
               type: String,
               required: false,
          },
          documentImage: {
               type: String,
               required: false,
          },
          documentBackImage: {
               type: String,
               required: false,
          },
          selfieImage: {
               type: String,
               required: false,
          },
          status: {
               type: String,
               enum: ['pending', 'approved', 'rejected'],
               default: 'pending',
          },
          rejectionReason: {
               type: String,
               required: false,
          },
          verificationDate: {
               type: Date,
               required: false,
          },
     },
     {
          timestamps: true, // Automatically add createdAt and updatedAt fields
     }
)

// Optional method to mask sensitive fields before sending the user object
verificationSchema.methods.toJSON = function () {
     const obj = this.toObject()
     delete obj.__v // Remove Mongoose version key
     delete obj._id // Remove Mongoose version key
     return obj
}

export default mongoose.model('Verification', verificationSchema)
