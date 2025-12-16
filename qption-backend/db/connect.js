// db/connect.js
import mongoose from 'mongoose';

export async function connectDB() {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/userPanel';
    const opts = {
        // Lower the wait so you fail fast if misconfigured:
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
        // good defaults
        retryWrites: true,
        w: 'majority',
    };

    // Optional niceties
    mongoose.set('strictQuery', true);

    if (mongoose.connection.readyState === 1) return; // already connected

    await mongoose.connect(uri, opts);
    console.log('[DB] connected:', uri);
}
