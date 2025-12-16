import mongoose from 'mongoose'

const newsSchema = new mongoose.Schema(
     {
          TITLE: {
               type: String,
               required: true,
          },
          BODY: {
               type: String,
               required: false,
          },
          URL: {
               type: String,
               required: false,
          },
          KEYWORDS: {
               type: String,
               required: false,
          },
          SENTIMENT: {
               type: String,
               enum: ['positive', 'negative', 'neutral'],
               default: 'neutral',
          },
          SOURCE: {
               type: String,
               required: true,
          },
          SOURCEIMAGE: {
               type: String,
               required: false,
          },
     },
     {
          timestamps: true, // Automatically add createdAt and updatedAt fields
     }
)

newsSchema.methods.toJSON = function () {
     const obj = this.toObject()
     delete obj.__v
     return obj
}

const News = mongoose.model('News', newsSchema)
export default News