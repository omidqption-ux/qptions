import mongoose from 'mongoose'
import { env } from '../config/env.js'

export default async function connectMongo() {
    if (!env.MONGO_URI) throw new Error('MONGO_URI missing')
    mongoose.set('strictQuery', true)
    await mongoose.connect(env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 20
    })
    console.log('Mongo connected')
}
