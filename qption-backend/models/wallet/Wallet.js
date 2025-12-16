// models/Wallet.js
import mongoose from "mongoose";
const { Schema } = mongoose;

/**
 * Stores per-user deposit addresses.
 * encPrivateKey: AES-256-GCM ciphertext base64 (if you self-custody keys).
 */
const WalletSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", index: true, required: true },
        chain: { type: String, enum: ["ETH", "TRON"], required: true },
        address: { type: String, required: true }, // 0x... for ETH, T... for TRON
        encPrivateKey: { type: String },           // optional (if you plan to sweep)
        path: { type: String },                    // optional derivation path
        assignedAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

WalletSchema.index({ chain: 1, address: 1 }, { unique: true })
WalletSchema.index({ userId: 1, chain: 1 }, { unique: true })

export default mongoose.models.Wallet || mongoose.model('Wallet', WalletSchema)