import { createSlice } from '@reduxjs/toolkit'

const initialState = {
     method: {
          title: '',
          minDeposit: '',
          logoSrc: null,
          chain: ""
     },
     amount: 0,
     paymentIOToken: '',
     paymentMethods: [],
     amountInPaymentMethod: 0,
     paymentInfo: {},
     depositHistory: [],

}

export const depositSlice = createSlice({
     name: 'deposit',
     initialState,
     reducers: {
          setDepositMethod: (state, action) => {
               state.method = action.payload
          },
          setDepositAmount: (state, action) => {
               state.amount = action.payload
          },
          resetDeposit: (state) => {
               state = initialState
          },
          setPaymentIOToken: (state, action) => {
               state.paymentIOToken = action.payload.token
          },
          setPaymentMethods: (state, action) => {
               state.paymentMethods = action.payload.paymentMethods
          },
          setAmountInPaymentMethod: (state, action) => {
               state.amountInPaymentMethod =
                    action.payload.amountInPaymentMethod
          },
          setPaymentInfo: (state, action) => {
               state.paymentInfo = action.payload.paymentInfo
          },
          setDepositHistory: (state, action) => {
               state.depositHistory = action.payload.depositHistory
          },
     },
})

export const {
     setDepositMethod,
     setDepositAmount,
     resetDeposit,
     setPaymentIOToken,
     setPaymentMethods,
     setAmountInPaymentMethod,
     setPaymentInfo,
     setDepositHistory,
} = depositSlice.actions

export default depositSlice.reducer
