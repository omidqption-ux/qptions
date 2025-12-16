// qption-backend/db/runInTxn.js
import mongoose from 'mongoose';

/**
 * Run a function inside a MongoDB transaction with retry on transient errors.
 * @param {(session: mongoose.ClientSession) => Promise<any>} work
 * @param {{ maxRetries?: number, transactionOptions?: object }} [opts]
 */
export async function runInTxn(work, opts = {}) {
    const maxRetries = Number(opts.maxRetries ?? 3);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const session = await mongoose.startSession();
        try {
            let result;
            await session.withTransaction(
                async () => { result = await work(session); },
                {
                    readConcern: { level: 'snapshot' },
                    writeConcern: { w: 'majority' },
                    readPreference: 'primary',
                    ...(opts.transactionOptions || {}),
                }
            );
            await session.endSession();
            return result;
        } catch (err) {
            await session.endSession();
            const msg = err?.message || '';
            const isTransient =
                err?.errorLabels?.includes('TransientTransactionError') ||
                /WriteConflict|NotPrimaryNoSecondaryOk|Transaction.*aborted/i.test(msg);
            if (isTransient && attempt < maxRetries) {
                await new Promise(r => setTimeout(r, 200 * attempt));
                continue;
            }
            throw err;
        }
    }
}
