import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema(
     {
          userId: {
               type: mongoose.Schema.Types.ObjectId,
               required: true,
               ref: 'User',
          },
          title: {
               type: String,
               required: true,
          },
          body: {
               type: String,
               required: true,
          },
          userId: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'User',
               required: true,
          },
          photo: {
               type: String,
               required: false,
          },
          response: [
               {
                    title: {
                         type: String,
                         required: false,
                    },
                    body: {
                         type: String,
                         required: false,
                    },
                    photo: {
                         type: String,
                         required: false,
                    },
                    adminName: {
                         type: String,
                         required: false,
                    },
               },
          ],
          isActive: {
               type: Boolean,
               default: true,
          },
          isResponded: {
               type: Boolean,
               default: false,
          },
     },
     {
          timestamps: true, // Automatically add createdAt and updatedAt fields
     }
)

ticketSchema.methods.toJSON = function () {
     const obj = this.toObject()
     delete obj.__v
     return obj
}

export default mongoose.model('Ticket', ticketSchema)