// notificationWatcher.js
import Deposit from './models/Deposit.js';
import Withdraw from './models/Withdraw.js';
import Verification from './models/Verification.js';
import { emitAdminNotification } from './socket.js';

function watchCollection(model, type) {
    const pipeline = [{ $match: { operationType: 'insert' } }];

    const changeStream = model.watch(pipeline, { fullDocument: 'updateLookup' });

    changeStream.on('change', (change) => {
        const doc = change.fullDocument;

        if (type === 'deposit') {
            emitAdminNotification('deposit', {
                id: doc._id,
                userId: doc.userId,
                amount: doc.amount,                   // Number
                currency: doc.amountCurrency,         // e.g. 'USD', 'EUR', 'USDT'
                status: doc.payment_status,           // 'creating' | 'waiting' | ...
                meta: {
                    paidCurrency: doc.paidCurrency,     // e.g. 'trx'
                    paidCurrencyTitle: doc.paidCurrencyTitle,
                    type: doc.type,                     // your custom type if any
                },
                link: `/deposits/${doc._id}`,
                createdAt: doc.createdAt,
            });
        }

        if (type === 'withdrawal') {
            emitAdminNotification('withdrawal', {
                id: doc._id,
                userId: doc.userId,
                amount: doc.amount,
                currency: doc.method?.code,           // e.g. 'USDT-TRC20'
                status: doc.status,                   // 'waiting' | 'confirmed' | 'rejected'
                meta: {
                    methodTitle: doc.method?.title,     // e.g. 'USDT TRC20'
                    walletAddress: doc.walletAddress,
                },
                link: `/withdrawals/${doc._id}`,
                createdAt: doc.createdAt,
            });
        }

        if (type === 'verification') {
            emitAdminNotification('verification', {
                id: doc._id,
                userId: doc.userId,
                status: doc.status,                   // 'sending' | 'pending' | ...
                meta: {
                    issuingCountry: doc.issuingCountry,
                    documentType: doc.documentType,     // e.g. 'passport'
                },
                link: `/verifications/${doc._id}`,
                createdAt: doc.createdAt,
            });
        }
    });

    changeStream.on('error', (err) => {
        console.error(`ChangeStream error for ${type}:`, err);
        // optionally: reconnect logic
    });
}

export function startNotificationWatcher() {
    watchCollection(Deposit, 'deposit');
    watchCollection(Withdraw, 'withdrawal');
    watchCollection(Verification, 'verification');
}
