// models/Transaction.js
import mongoose from "mongoose";
const { Schema } = mongoose;

/**
 * Raw chain transactions we saw (ERC20/TRC20 transfers into our deposit addresses)
 * amountMicros: integer (USDT has 6 decimals) e.g., 12.345678 USDT => 12345678
 */
const TxSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
        chain: { type: String, enum: ["ETH", "TRON"], required: true },
        asset: { type: String, enum: ["USDT-ERC20", "USDT-TRC20"], required: true },
        txHash: { type: String, required: true },
        from: { type: String },
        to: { type: String, index: true },
        amountMicros: { type: Number, required: true },
        blockNumber: { type: Number },
        confirmations: { type: Number, default: 0 },
        status: { type: String, enum: ['pending', 'confirmed', 'credited', 'failed', 'rejected'], default: 'pending', index: true },
        statusReason: { type: String }, // e.g., 'below_min_deposit'
        uniqueKey: { type: String, unique: true }, // e.g. `${chain}:${txHash}:${to}:${amountMicros}`
        seenAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

TxSchema.index({ chain: 1, txHash: 1 }, { unique: true });
export default mongoose.models.Transaction || mongoose.model('Transaction', TxSchema)