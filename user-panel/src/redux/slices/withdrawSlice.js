import { createSlice } from '@reduxjs/toolkit'

const initialState = {
     method: {
          title: '',
          logo: null,
          code: '',
     },
     amount: 0,
     paymentIOToken: '',
     paymentMethods: [],
     amountInPaymentMethod: 0,
     withdrawHistory: [],
     walletAddress: '',
     walletType: 'bitcoin',
}

export const withdrawSlice = createSlice({
     name: 'withdraw',
     initialState,
     reducers: {
          setWithdrawMethod: (state, action) => {
               state.method = action.payload
          },
          setWithdrawAmount: (state, action) => {
               state.amount = action.payload
          },
          resetWithdraw: (state) => {
               state = initialState
          },
          setPaymentIOToken: (state, action) => {
               state.paymentIOToken = action.payload
          },
          setPaymentMethods: (state, action) => {
               state.paymentMethods = action.payload
          },
          setAmountInPaymentMethod: (state, action) => {
               state.amountInPaymentMethod = action.payload
          },
          setWalletAddress: (state, action) => {
               state.walletAddress = action.payload
          },
          setWithdrawHistory: (state, action) => {
               state.withdrawHistory = action.payload
          },
          setWalletType: (state, action) => {
               state.walletType = action.payload
          },
     },
})

export const {
     setWithdrawMethod,
     setWithdrawAmount,
     resetWithdraw,
     setPaymentIOToken,
     setPaymentMethods,
     setAmountInPaymentMethod,
     setWalletAddress,
     setWithdrawHistory,
     setWalletType,
} = withdrawSlice.actions

export default withdrawSlice.reducer
