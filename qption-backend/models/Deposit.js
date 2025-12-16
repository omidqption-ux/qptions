import mongoose from 'mongoose'

const ActuallyPaidSchema = new mongoose.Schema(
     {
          crypto: { type: Number },       // amount sent on-chain in paidCurrency
          usd: { type: Number },          // crypto * expectedRatePerCrypto
          currency: { type: String },     // e.g. 'trx'
     },
     { _id: false }
)
const depositSchema = new mongoose.Schema(
     {
          userId: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'User',
               required: true,
               index: true,
          },
          amount: {
               type: Number,
               required: true,
          },
          amountCurrency: {
               type: String,
               required: true,
          },
          paidCurrency: {
               type: String,
               required: true,
          },
          paidCurrencyTitle: {
               type: String,
               required: false,
          },
          pay_address: {
               type: String,
               required: false,
          },
          payment_id: {
               type: String,
               required: false,
          },
          purchase_id: {
               type: String,
               required: false,
          },
          gatewayPaymentId: { type: String },
          gatewayPayload: {
               type: mongoose.Schema.Types.Mixed, select: false
          },
          payment_status: {
               type: String,
               required: true,
               default: 'waiting',
               enum: [
                    'creating',
                    'waiting',
                    'processing',
                    'sending',
                    'finished',
                    'failed',
                    'rejected',
                    'refunded',
                    'expired',
                    'confirmed', // keep if you ever persist NP's raw status
               ],
               index: true,
          },
          credited: { type: Boolean, default: false, index: true },
          creditedUsd: { type: Number, default: 0 },
          overpayUsd: { type: Number, default: 0 },
          shortfallUsd: { type: Number, default: 0 },
          actuallyPaid: { type: ActuallyPaidSchema },
          expiration_estimate_date: {
               type: String,
               required: false,
          },
          origin_ip: {
               type: String,
               required: false,
          },
          type: {
               type: String,
               required: false,
          },
          valid_until: {
               type: String,
               required: false,
          },
          expectedPayAmountCrypto: {
               type: Number,
               required: false,
          },
          expectedPayCurrency: {
               type: String,
               required: false,
          },
          expectedRatePerCrypto: {
               type: Number,
               required: false,
          },
          expectedRatePriceCurrency: {
               type: String,
               required: false,
          }
     },
     {
          timestamps: true, // Automatically add createdAt and updatedAt fields
     }
)

// Optional method to mask sensitive fields before sending the user object
depositSchema.methods.toJSON = function () {
     const obj = this.toObject()
     delete obj.__v // Remove Mongoose version key
     return obj
}

const Deposit = mongoose.model('Deposit', depositSchema)
export default Deposit