// qption-backend/models/ChainCursor.js
import mongoose from 'mongoose';

const ChainCursorSchema = new mongoose.Schema(
    {
        chain: { type: String, enum: ['ETH', 'TRON'], required: true },
        network: { type: String, default: '' },   // e.g. 'mainnet', 'sepolia', 'tron'
        contract: { type: String, default: '' },  // token address lowercased (optional)
        cursorType: { type: String, enum: ['block', 'event'], default: 'block' },
        lastProcessedBlock: { type: Number, default: 0 },
        lastProcessedTs: { type: Date, default: Date.now },
    },
    { timestamps: true, collection: 'chainCursors' }
);

// unique per chain+contract (contract optional => sparse)
ChainCursorSchema.index({ chain: 1, contract: 1 }, { unique: true, sparse: true });

export default mongoose.model('ChainCursor', ChainCursorSchema);
