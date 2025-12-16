import mongoose from 'mongoose'

const connectDB = async () => {
     try {
          await mongoose.connect(
               process.env.NODE_ENV !== 'development'
                    ? 'mongodb://qptionUser:22125854ZzAQ@localhost:27017/qptionDB?authSource=admin&replicaSet=rs0'
                    : 'mongodb://localhost:27017/userPanel?replicaSet=rs0'
          )
     } catch (error) {
          console.error(`Error: ${error.message}`)
          process.exit(1)
     }
}

export default connectDB