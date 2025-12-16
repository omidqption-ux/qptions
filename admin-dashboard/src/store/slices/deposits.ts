import { createSlice, PayloadAction } from '@reduxjs/toolkit'



type DepositState = {
    depositList: Deposit[]
}
export type Payment_status = 'waiting' | 'confirmed' | 'sending' | 'finished' | 'refunded' | 'expired'
export type Deposit = {
    username: string
    _id: string
    userId: string
    amount: number
    amountCurrency: string
    paidCurrency: string
    createdAt: string
    payment_status: Payment_status
    expectedPayAmountCrypto: number
}
const initialState: DepositState = {
    depositList: [],
}

const depositSlice = createSlice({
    name: 'deposit',
    initialState,
    reducers: {
        setDepositList: (state: DepositState, action: PayloadAction<Deposit[]>) => {
            state.depositList = action.payload
        },
    },
})

export const { setDepositList } = depositSlice.actions
export default depositSlice.reducer