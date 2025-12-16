import Withdraw from '../models/Withdraw.js'
import { createNotification } from '../utils/notifications.js'
import { changeBalanceEmit } from '../utils/changeBalance.js'
import { getIO } from '../socket.js'
export const makeAWithdraw = async (req, res) => {
     const { amount, methodTitle, methodCode, walletAddress } = req.body
     const user = req.user
     try {
          if (user.balance.amount < amount) {
               return res
                    .status(401)
                    .json({ message: 'Amount is more than your balance' })
          }
          await Withdraw.create({
               amount,
               method: { title: methodTitle, code: methodCode },
               userId: user._id,
               walletAddress,
          })
          user.balance.amount = Number(user.balance.amount) - Number(amount)
          user.balance.updatedAt = Date.now()
          user.save()
          createNotification(
               user._id,
               'withdraw',
               'Withdraw Status',
               `Your withdrawal of ${amount} has been successfully submitted.`
          )
          changeBalanceEmit(getIO(), {
               balance: user.balance,
               userId: user._id,
          })
          return res.status(201).json({
               message: `Your withdrawal request has been successfully submitted.`,
               userBalance: user.balance.amount,
          })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}
export const userWithdrawHistory = async (req, res) => {
     const user = req.user
     let { page, limit, sortColumn, sortDirection, searchColumns } = req.query

     // Parse pagination parameters
     page = parseInt(page) || 1
     limit = parseInt(limit) || 10

     // If searchColumns is passed as a JSON string, try parsing it.
     if (typeof searchColumns === 'string') {
          try {
               searchColumns = JSON.parse(searchColumns)
          } catch (error) {
               searchColumns = []
          }
     }

     // Build the base filter: only withdrawals for the current user
     let filter = { userId: user._id }

     // Append additional filter criteria from searchColumns array.
     if (Array.isArray(searchColumns)) {
          searchColumns.forEach((sc) => {
               if (sc.column && sc.value) {
                    // For strings, use a case-insensitive regex search.
                    if (typeof sc.value === 'string') {
                         filter[sc.column] = { $regex: sc.value, $options: 'i' }
                    } else {
                         // For non-string values, apply a direct equality
                         filter[sc.column] = sc.value
                    }
               }
          })
     }

     // Build the sort option
     let sortOption = {}
     if (sortColumn) {
          sortOption[sortColumn] = sortDirection === 'asc' ? 1 : -1
     } else {
          // Default: sort by updatedAt (descending)
          sortOption.updatedAt = -1
     }

     try {
          // Count the total number of documents matching the filter (before pagination)
          const count = await Withdraw.countDocuments(filter)

          // Apply the filter, sorting, and pagination on the Withdraw model
          const withdrawals = await Withdraw.find(filter)
               .sort(sortOption)
               .skip((page - 1) * limit)
               .limit(limit)

          return res.status(200).json({ withdrawals, count })
     } catch (error) {
          return res.status(500).json({ message: error.message })
     }
}