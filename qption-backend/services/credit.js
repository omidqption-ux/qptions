// services/credit.js
import LedgerEntry from "../models/LedgerEntry.js";
import Balance from "../models/Balance.js";

/**
 * creditIfNotCredited:
 * - Creates a ledger entry if it does not exist (unique by meta.unique).
 * - Increments availableMicros.
 */
export async function creditIfNotCredited({ userId, chain, amountMicros, txHash, confirmationsRequired = 12 }) {
    const unique = `${chain}:${txHash}:USDT`;

    // If it exists, do nothing (idempotent)
    const existing = await LedgerEntry.findOne({ "meta.unique": unique }).lean();
    if (existing) return;

    await LedgerEntry.create({
        userId,
        asset: "USDT",
        chain,
        type: "deposit",
        amountMicros,
        status: "available",
        txHash,
        meta: { unique, confirmationsRequired }
    });

    await Balance.updateOne(
        { userId, asset: "USDT", chain },
        {
            $inc: { availableMicros: amountMicros },
            $setOnInsert: { pendingMicros: 0, updatedAt: new Date() }
        },
        { upsert: true }
    );
}
