// models/LedgerEntry.js
import mongoose from "mongoose";
const { Schema } = mongoose;

/**
 * Double-entry style ledger (we only show 'deposit' here).
 * meta.unique is used for idempotency (unique index).
 */
const LedgerSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", index: true, required: true },
        asset: { type: String, enum: ["USDT"], required: true },
        chain: { type: String, enum: ["ETH", "TRON"], required: true },
        type: { type: String, enum: ["deposit"], required: true },
        amountMicros: { type: Number, required: true },
        status: { type: String, enum: ["pending", "available"], default: "pending", index: true },
        txHash: { type: String },
        meta: {
            unique: { type: String, unique: true }, // `${chain}:${txHash}:USDT`
            confirmationsRequired: { type: Number }
        }
    },
    { timestamps: true }
);

LedgerSchema.index({ userId: 1, chain: 1, asset: 1 });
export default mongoose.models.LedgerEntry || mongoose.model('LedgerEntry', LedgerSchema)