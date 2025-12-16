import crypto from 'crypto'
import express from 'express'
import User from '../models/User.js'
import Deposit from '../models/Deposit.js'
import { createNotification } from '../utils/notifications.js'

const router = express.Router()

// === CONFIG ===
const TOL_BPS = Number(process.env.DEPOSIT_TOLERANCE_BPS || 100) // 1% default
const CREDIT_OVERPAY_FULL = process.env.CREDIT_OVERPAY_FULL !== '0' // default true
const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET || '4hu1ckhz4adMqU5N7AWPA+vxqiPCucNr' // <-- SET THIS IN ENV

// Map NOWPayments statuses to your internal enum
const mapNpToInternal = (np) => {
    const s = String(np || '').toLowerCase()
    switch (s) {
        case 'created': return 'creating'
        case 'waiting': return 'waiting'
        case 'confirming': return 'processing'
        case 'processing': return 'processing'
        case 'confirmed': return 'processing'   // you may change to 'finished' if you want
        case 'sending': return 'sending'
        case 'partially_paid': return 'processing' // we handle underpay explicitly below
        case 'finished': return 'finished'
        case 'failed': return 'failed'
        case 'refunded': return 'rejected'
        case 'expired': return 'rejected'
        case 'rejected': return 'rejected'
        default: return 'processing'
    }
}

const ALLOWED = new Set([
    'creating', 'waiting', 'processing', 'sending', 'finished', 'failed', 'rejected'
])

function timingSafeHexEqual(aHex, bHex) {
    const a = Buffer.from(String(aHex).trim().toLowerCase(), 'utf8')
    const b = Buffer.from(String(bHex).trim().toLowerCase(), 'utf8')
    if (a.length !== b.length) return false
    return crypto.timingSafeEqual(a, b)
}

/**
 * NOWPayments IPN
 * Full URL (given your server.js):  POST /webhooks/nowpayments/ipn
 */
router.post('/nowpayments/ipn', async (req, res) => {
    try {
        if (!IPN_SECRET) {
            console.error('[NOWPayments IPN] Missing NOWPAYMENTS_IPN_SECRET env')
            return res.status(500).send('IPN secret not configured')
        }

        // ---- 1) Verify HMAC signature exactly as in docs ----
        const sigHeader = req.header('x-nowpayments-sig') || ''
        // `req.rawBody` is set by express.json verify() in server.js
        const rawBody = req.rawBody || JSON.stringify(req.body || {})
        const hmac = crypto.createHmac('sha512', IPN_SECRET).update(rawBody).digest('hex')

        if (!timingSafeHexEqual(hmac, sigHeader)) {
            console.warn('[NOWPayments IPN] Invalid signature', { sigHeader, hmac })
            // 400 is ok – NOWPayments will retry a few times
            return res.status(400).send('Invalid signature')
        }

        // ---- 2) Parse payload (it should already be parsed by express.json) ----
        const payload = req.body || {}

        const {
            ipn_type,          // e.g. 'payment'
            payment_status: npStatus,
            order_id,          // you passed this when you created payment (use deposit _id)
            payment_id,        // NOWPayments payment id
            pay_currency,
            pay_amount,        // quoted crypto amount to be paid
            actually_paid,     // real on-chain amount in pay_currency
            price_amount,      // fiat amount requested (e.g. USD)
            price_currency,    // e.g. 'usd'
            purchase_id,
            pay_address,
        } = payload

        // Optional: only handle payment IPNs
        if (ipn_type && ipn_type !== 'payment') {
            console.log('[NOWPayments IPN] Ignoring non-payment ipn_type:', ipn_type)
            return res.status(200).send('Ignored ipn_type')
        }

        // ---- 3) Find your deposit ----
        let depositRow = null
        if (order_id) {
            try {
                depositRow = await Deposit.findOne({ _id: order_id })
            } catch (e) {
                console.error('[NOWPayments IPN] error finding by order_id:', e)
            }
        }
        if (!depositRow && payment_id != null) {
            depositRow = await Deposit.findOne({ payment_id: String(payment_id) })
        }
        if (!depositRow) {
            console.warn('[NOWPayments IPN] Deposit not found for', { order_id, payment_id })
            // 404 so you see it in logs – NOW may retry
            return res.status(404).send('Deposit not found')
        }

        // ---- 4) Map status & guard ----
        const internal = mapNpToInternal(npStatus)
        if (!ALLOWED.has(internal)) {
            console.log('[NOWPayments IPN] Ignored NP status:', npStatus)
            return res.status(200).send('Ignored status')
        }

        // Idempotency – if already terminal, do nothing
        if (['finished', 'failed', 'rejected'].includes(depositRow.payment_status)) {
            return res.status(200).send('Already processed')
        }

        // Persist latest gateway info
        depositRow.payment_status = internal
        depositRow.gatewayPaymentId = String(payment_id ?? '')
        depositRow.gatewayPayload = payload
        await depositRow.save()

        // ---- 5) Credit logic only on successful terminal status ----
        if (internal === 'finished') {
            // Prevent double-credit
            if (depositRow.credited) {
                return res.status(200).send('Already credited')
            }

            const expectedUsd = Number(depositRow.amount) || 0
            const expectedCry = Number(
                depositRow.expectedPayAmountCrypto ??
                pay_amount ??
                0
            )

            let usdPerCrypto = Number(depositRow.expectedRatePerCrypto ?? 0)

            // Derive rate if missing
            if (!usdPerCrypto && expectedUsd && expectedCry) {
                usdPerCrypto = expectedUsd / expectedCry
            }
            // Fallback from payload (less trusted, but in line with docs)
            if (!usdPerCrypto && price_amount && pay_amount) {
                usdPerCrypto = Number(price_amount) / Number(pay_amount)
            }

            const paidCrypto = Number(actually_paid ?? 0)
            const paidUsd = usdPerCrypto
                ? paidCrypto * usdPerCrypto
                : expectedUsd // very conservative fallback

            // Thresholds based on tolerance
            const underOkUsd = expectedUsd * (1 - TOL_BPS / 10_000)

            // Treat NOWPayments `partially_paid` OR math underpay as underpaid
            if (npStatus === 'partially_paid' || paidUsd < underOkUsd) {
                const shortfall = Math.max(0, expectedUsd - paidUsd)

                depositRow.payment_status = 'processing'
                depositRow.shortfallUsd = Math.round(shortfall * 100) / 100
                depositRow.actuallyPaid = {
                    crypto: paidCrypto,
                    usd: Math.round(paidUsd * 100) / 100,
                    currency: pay_currency,
                }
                await depositRow.save()

                await createNotification({
                    userId: depositRow.userId,
                    category: 'deposit',
                    title: 'Deposit Underpaid',
                    body: `We received ~${paidUsd.toFixed(2)} ${price_currency?.toUpperCase() || 'USD'} for a ${expectedUsd.toFixed(2)} ${price_currency?.toUpperCase() || 'USD'} request. Please send the remaining ${(expectedUsd - paidUsd).toFixed(2)} to complete.`,
                })

                return res.status(200).send('Underpaid recorded')
            }

            // Overpaid or within tolerance
            let creditUsd
            let note = ''
            if (CREDIT_OVERPAY_FULL) {
                creditUsd = Math.round(paidUsd * 100) / 100
                note = paidUsd > expectedUsd ? ' (overpaid)' : ''
            } else {
                creditUsd = Math.round(Math.min(paidUsd, expectedUsd) * 100) / 100
                note = paidUsd > expectedUsd ? ' (excess kept on hold/refund)' : ''
            }

            // Atomic guard – avoid race on retries
            const updated = await Deposit.updateOne(
                { _id: depositRow._id, credited: { $ne: true } },
                {
                    $set: {
                        credited: true,
                        creditedUsd: creditUsd,
                        payment_status: 'finished',
                        actuallyPaid: {
                            crypto: paidCrypto,
                            usd: Math.round(paidUsd * 100) / 100,
                            currency: pay_currency,
                        },
                        overpayUsd: Math.max(
                            0,
                            Math.round((paidUsd - expectedUsd) * 100) / 100
                        ),
                        updatedAt: new Date(),
                    },
                }
            )

            if (!updated.modifiedCount) {
                return res.status(200).send('Already credited')
            }

            // ---- 6) Credit user balance ----
            const creditedCount = await Deposit.countDocuments({
                userId: depositRow.userId,
                credited: true,                // or whatever flag means "successful"
            })
            const update = {
                $inc: {
                    'balance.amount': creditUsd,
                },
                $set: {
                    'balance.updatedAt': new Date(),
                },
            }
            if (creditedCount === 0) {
                update.$inc['balance.bonus'] = creditUsd * 2 // 200% of amount
            }
            await User.findByIdAndUpdate(
                depositRow.userId,
                update,
                { new: true }
            )

            await createNotification({
                userId: depositRow.userId,
                category: 'deposit',
                title: 'Deposit Confirmed',
                body: `We credited ${creditUsd.toFixed(2)} ${price_currency?.toUpperCase() || 'USD'}${note}.`,
            })
            return res.status(200).send('Credited')
        }

        // Non-terminal statuses – just acknowledge
        return res.status(200).send('OK')
    } catch (err) {
        console.error('[NOWPayments IPN] error:', err)
        // Return 200 so NOWPayments does not spam retries forever,
        // but you still see the error in logs.
        return res.status(200).send('OK')
    }
})

export default router
