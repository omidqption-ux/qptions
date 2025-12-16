// services/depositsUSD.js
import User from '../models/User.js';
import Transaction from '../models/wallet/Transaction.js';
import LedgerEntry from '../models/wallet/LedgerEntry.js';
import Balance from '../models/wallet/Balance.js';
import { runInTxn } from '../db/runInTxn.js';
import { USDT_DECIMALS } from '../utils/units.js'; // typically 6
import { getUsdRate } from './price/polygonRates.js';
import { getMinDepositMicros } from './deposits/minDeposit.js';

// ---- Helpers ----
function microsToUsd(amountMicros, rate) {
    const usdt = Number(amountMicros) / 10 ** (USDT_DECIMALS || 6);
    return usdt * rate;
}

/**
 * Apply a confirmed deposit to user's USD balance (atomic & idempotent).
 *
 * Contract:
 * - Assumes a "pending" Transaction already exists for { chain, txHash }
 *   created by your scanners.
 * - This function atomically:
 *    (a) validates and marks the Transaction as 'credited' (or 'rejected_below_min')
 *    (b) creates a LedgerEntry once (idempotent)
 *    (c) increments User.balance.amount + updates User.balance.updatedAt
 *
 * @param {object} p
 * @param {string|ObjectId} p.userId
 * @param {'ETH'|'TRON'} p.chain
 * @param {'USDT-ERC20'|'USDT-TRC20'} p.asset
 * @param {number} p.amountMicros     // token units (USDT: 6 decimals)
 * @param {string} p.txHash
 * @param {number} [confirmations=0]
 */
export async function applyConfirmedDepositUSD(p) {
    const {
        userId,
        chain,
        asset,
        amountMicros,
        txHash,
        confirmations = 0,
    } = p;

    if (!userId || !chain || !asset || !txHash || !Number.isFinite(Number(amountMicros))) {
        throw new Error('Missing or invalid params for applyConfirmedDepositUSD');
    }

    const minMicros = getMinDepositMicros(chain);
    const belowMin = Number(amountMicros) < Number(minMicros);

    // USDT≈USD, but keep the rate call for future assets or if you price in USD
    const rate = await getUsdRate({ asset }); // likely 1 for USDT
    const usdAmount = microsToUsd(amountMicros, rate);

    // round to cents to avoid float drift in a float schema
    const usdCents = Math.round(usdAmount * 100);
    const usdFinal = usdCents / 100;

    return runInTxn(async (session) => {
        // 1) Load the pending tx (must exist and be pending to proceed)
        const tx = await Transaction.findOne(
            { chain, txHash },
            null,
            { session }
        );

        if (!tx) {
            // If your scanner didn’t insert it, you can choose to insert here,
            // but safer to fail so scanners stay the source of truth.
            throw new Error(`Transaction not found for ${chain}:${txHash}`);
        }

        if (tx.status === 'credited') {
            // Already credited: idempotent no-op
            return {
                txId: tx._id,
                credited: false,
                idempotent: true,
                rejected: false,
                creditedUsd: 0,
                userBalance: null,
                reason: 'already_credited',
            };
        }

        if (tx.status !== 'pending' && tx.status !== 'confirmed') {
            // Any other terminal state → do nothing
            return {
                txId: tx._id,
                credited: false,
                idempotent: true,
                rejected: tx.status?.startsWith('rejected') || false,
                creditedUsd: 0,
                userBalance: null,
                reason: `status_${tx.status}`,
            };
        }

        // 2) If below minimum, reject cleanly and stop
        if (belowMin) {
            const upd = await Transaction.findOneAndUpdate(
                { _id: tx._id, status: { $in: ['pending', 'confirmed'] } },
                {
                    $set: {
                        status: 'rejected_below_min',
                        confirmations,
                        rejectedAt: new Date(),
                        minRequiredMicros: Number(minMicros),
                    },
                },
                { new: true, session }
            );

            return {
                txId: upd?._id || tx._id,
                credited: false,
                idempotent: true,
                rejected: true,
                reason: 'below_min_deposit',
                minRequiredUSDT: (minMicros / 1e6).toFixed(2),
                creditedUsd: 0,
                userBalance: null,
            };
        }

        // 3) Create idempotent ledger record (first-writer-wins)
        const unique = `${chain}:${txHash}:USDT:${amountMicros}`;
        const existingLedger = await LedgerEntry.findOne(
            { 'meta.unique': unique },
            null,
            { session }
        );

        let createdLedger = false;
        if (!existingLedger) {
            await LedgerEntry.create([{
                userId,
                asset: 'USDT',
                chain,
                type: 'deposit',
                amountMicros: Number(amountMicros),
                status: 'available',
                txHash,
                meta: { unique, confirmationsRequired: confirmations },
                createdAt: new Date(),
            }], { session });
            createdLedger = true;

            // Optional internal token balance cache
            await Balance.updateOne(
                { userId, asset: 'USDT', chain },
                {
                    $inc: { availableMicros: Number(amountMicros) },
                    $setOnInsert: { pendingMicros: 0, createdAt: new Date() },
                    $set: { updatedAt: new Date() },
                },
                { upsert: true, session }
            );
        }

        // 4) If this is the first time we see this tx (i.e., ledger created),
        //    increment the *app USD* balance and mark tx as credited — atomically.
        let newUserBalanceAmount = null;

        if (createdLedger) {
            // Increment user's USD wallet balance
            const userAfter = await User.findOneAndUpdate(
                { _id: userId },
                {
                    $inc: { 'balance.amount': usdFinal },
                    $set: { 'balance.updatedAt': new Date() },
                },
                { new: true, session, projection: { 'balance.amount': 1 } }
            );

            if (!userAfter) throw new Error(`User not found: ${userId}`);
            newUserBalanceAmount = Number(userAfter.balance?.amount ?? 0);

            // Mark the transaction as credited
            await Transaction.updateOne(
                { _id: tx._id, status: { $in: ['pending', 'confirmed'] } },
                {
                    $set: {
                        status: 'credited',
                        confirmations,
                        creditedAt: new Date(),
                        creditedAmountMicros: Number(amountMicros),
                        asset,
                        chain,
                        userId,
                    },
                },
                { session }
            );
        } else {
            // Ledger already exists → ensure tx is set to credited (idempotent)
            await Transaction.updateOne(
                { _id: tx._id, status: { $in: ['pending', 'confirmed'] } },
                {
                    $set: {
                        status: 'credited',
                        confirmations,
                        creditedAt: new Date(),
                        creditedAmountMicros: Number(amountMicros),
                        asset,
                        chain,
                        userId,
                    },
                },
                { session }
            );
        }

        return {
            txId: tx._id,
            credited: createdLedger,           // true only on first credit
            idempotent: !createdLedger,        // subsequent calls are idempotent
            rejected: false,
            creditedUsd: createdLedger ? usdFinal : 0,
            userBalance: newUserBalanceAmount, // null on idempotent re-run
        };
    });
}
