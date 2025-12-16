// models/ChainCursor.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const ChainCursorSchema = new Schema({
    chain: { type: String, enum: ['ETH', 'TRON'], unique: true },
    lastBlock: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.ChainCursor || mongoose.model('ChainCursor', ChainCursorSchema);
