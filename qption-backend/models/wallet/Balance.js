// models/Balance.js
import mongoose from "mongoose";
const { Schema } = mongoose;

/**
 * Denormalized balance cache for quick reads.
 */
const BalanceSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", index: true, required: true },
        asset: { type: String, enum: ["USDT"], required: true },
        chain: { type: String, enum: ["ETH", "TRON"], required: true },
        availableMicros: { type: Number, default: 0 },
        pendingMicros: { type: Number, default: 0 },
        updatedAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

BalanceSchema.index({ userId: 1, asset: 1, chain: 1 }, { unique: true });
export default mongoose.models.Balance || mongoose.model('Balance', BalanceSchema)