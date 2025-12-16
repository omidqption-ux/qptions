import axiosInstance from '../config/axios.js'
import { axiosPaymentIo } from '../config/axios-paymentIo.js'
import Deposit from '../models/Deposit.js'
import User from '../models/User.js'
import { createNotification } from '../utils/notifications.js'
import { changeBalanceEmit } from '../utils/changeBalance.js'
import { getIO } from '../socket.js'

export const getCoins = async (req, res) => {
     try {
          const responseWalletStatus = await axiosInstance.get(
               'https://api.nowpayments.io/v1/status'
          )
          if (responseWalletStatus.message !== 'OK') {
               return res
                    .status(404)
                    .json({ message: 'Deposit out of service try again later' })
          }
          const responseAuth = await axiosInstance.post(
               'https://api.nowpayments.io/v1/auth',
               {
                    email: 'omid.qption@gmail.com',
                    password: '2212zZzZ',
               }
          )
          if (!responseAuth.token) {
               return res
                    .status(404)
                    .json({ message: 'Deposit out of service try again later' })
          }
          const response = await axiosPaymentIo.get(
               'https://api.nowpayments.io/v1/full-currencies'
          )
          return res.status(200).json(response)
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const getMinDeposit = async (req, res) => {
     const { currency_from } = req.body
     try {
          const response = await axiosPaymentIo.get(
               `https://api.nowpayments.io/v1/min-amount?currency_from=${currency_from}&currency_to=USDTTRC20&fiat_equivalent=usd&is_fixed_rate=False&is_fee_paid_by_user=False`
          )
          return res.status(200).json({ data: response })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const getEstimatedPriceCrypto = async (req, res) => {
     const { amount, currency_from, currency_to } = req.body
     try {
          const response = await axiosPaymentIo.get(
               `https://api.nowpayments.io/v1/estimate?amount=${amount}&currency_from=${currency_from}&currency_to=${currency_to}`
          )
          return res.status(200).json({ data: response })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const createpayment = async (req, res) => {
     const user = req.user
     const { price_amount, price_currency, pay_currency, pay_currency_title } =
          req.body
     try {
          const resDeposit = await Deposit.create({
               userId: user._id,
               amount: price_amount,
               amountCurrency: price_currency,
               paidCurrency: pay_currency,
               paidCurrencyTitle: pay_currency_title,
               payment_status: 'waiting',
               credited: false,
          })
          /// Create payment at NOWPayments
          const response = await axiosPaymentIo.post(
               `https://api.nowpayments.io/v1/payment`,
               {
                    price_amount,
                    price_currency,
                    pay_currency,
                    ipn_callback_url:
                         process.env.NODE_ENV === 'development'
                              ? 'http://localhost:5000/webhooks/nowpayments/ipn'
                              : 'https://api.qption.com/webhooks/nowpayments/ipn',
                    order_id: String(resDeposit._id),
                    order_description: 'qption deposit',
               }
          )
          const payAmt = Number(response?.pay_amount ?? 0);
          const priceAmt = Number(response?.price_amount ?? price_amount);
          const lockedRate =
               payAmt > 0 ? priceAmt / payAmt : null; // price_currency per 1 crypto

          resDeposit.expiration_estimate_date =
               response.expiration_estimate_date
          resDeposit.origin_ip = response.origin_ip
          resDeposit.pay_address = response.pay_address
          resDeposit.payment_id = response.payment_id
          resDeposit.purchase_id = response.purchase_id
          resDeposit.type = response.type
          resDeposit.valid_until = response.valid_until
          resDeposit.payment_status = response.payment_status
          // --- LOCKED FIELDS (used later in IPN to handle under/over payments) ---
          resDeposit.expectedPayAmountCrypto = payAmt                         // e.g., 0.01839419 BTC
          resDeposit.expectedPayCurrency = response?.pay_currency || pay_currency;
          resDeposit.expectedRatePerCrypto = lockedRate;                     // e.g., 2000 / 0.01839419
          resDeposit.expectedRatePriceCurrency = response?.price_currency || price_currency; // e.g., 'usd'
          // ----------------------------------------------------------------------
          await resDeposit.save()

          return res.status(200).json({
               data: {
                    deposit_amount: response.price_amount,
                    deposit_currency: response.price_currency,
                    pay_amount: response.pay_amount,
                    pay_currency: response.pay_currency,
                    pay_address: response.pay_address,
                    pay_network: response.network,
                    order_id: resDeposit._id,
               },
          })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const nowPaymentCallBack = async (req, res) => {
     const { payment_status, order_id, price_amount } = req.body
     try {
          const depositRow = await Deposit.findOne({
               _id: new ObjectId(order_id),
          })
          const confirmedDeposit = await Deposit.findOne({
               userId: depositRow.userId,
               payment_status: 'confirmed',
          })

          depositRow.payment_status = payment_status
          await depositRow.save()
          let bonus = 0
          if (!confirmedDeposit) {
               if (depositRow.amount > 100 && depositRow.amount < 1000) {
                    bonus = price_amount
               } else if (depositRow.amount >= 1000) {
                    bonus = 2 * price_amount
               }
          }
          const updateObj = {
               $inc: { 'balance.amount': Math.round(price_amount * 100) / 100 },
               'balance.updatedAt': new Date(),
          }

          // If bonus is calculated (greater than 0), add it to the update operation
          if (bonus > 0) {
               updateObj.$inc['balance.bonus'] = bonus
          }
          const user = await User.findByIdAndUpdate(
               depositRow.userId,
               updateObj,
               { new: true }
          )
          createNotification({
               userId: depositRow.userId,
               category: 'deposit',
               title: 'Deposit Status',
               body: `Your deposit of ${price_amount} has been ${payment_status}`,
          })
          changeBalanceEmit(getIO(), {
               balance: user.balance,
               userId: user._id,
          })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const userDepositHistory = async (req, res) => {
     const user = req.user
     let { page, limit, sortColumn, sortDirection, searchColumns } = req.query

     // Parse page and limit as numbers
     page = parseInt(page) || 1
     limit = parseInt(limit) || 10

     // If searchColumns is provided as a JSON string, parse it.
     if (typeof searchColumns === 'string') {
          try {
               searchColumns = JSON.parse(searchColumns)
          } catch (error) {
               searchColumns = []
          }
     }

     // Build the base filter (always filter by the user)
     let filter = { userId: user._id }

     // Append additional filter conditions from searchColumns array
     if (Array.isArray(searchColumns)) {
          searchColumns.forEach((sc) => {
               if (sc.column && sc.value) {
                    // For string values, use a case-insensitive regex match,
                    // otherwise, use equality.
                    if (typeof sc.value === 'string') {
                         filter[sc.column] = { $regex: sc.value, $options: 'i' }
                    } else {
                         filter[sc.column] = sc.value
                    }
               }
          })
     }

     // Build the sort object
     let sortOption = {}
     if (sortColumn) {
          sortOption[sortColumn] = sortDirection === 'asc' ? 1 : -1
     } else {
          // Default sort by updatedAt (descending)
          sortOption.updatedAt = -1
     }

     try {
          // Calculate the count of documents matching the filters (before pagination)
          const count = await Deposit.countDocuments(filter)

          // Find, sort, and then apply pagination to the deposits
          const deposits = await Deposit.find(filter)
               .sort(sortOption)
               .skip((page - 1) * limit)
               .limit(limit)

          return res.status(200).json({ deposits, count })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const isFirstDeposit = async (req, res) => {
     const userId = req.user._id
     try {
          const confirmedDeposit = await Deposit.findOne({
               userId,
               payment_status: 'confirmed',
          })

          res.status(200).json({
               isFirstDeposit: !confirmedDeposit,
          })
     } catch (error) {
          res.status(500).json({ message: error.message })
     }
}
