import { createSlice, PayloadAction } from '@reduxjs/toolkit'



type WithdrawState = {
    approvedList: Withdraw[],
    pendingList: Withdraw[],
    rejectedList: Withdraw[],
    pendingCount: number
    approvedCount: number
    rejectedCount: number
}
export type Withdraw_status = 'waiting' | 'confirmed' | 'rejected'
export type Withdraw = {
    _id: string
    username: string
    userId: string
    amount: number
    method: {
        title: string,
        code: string,
    }
    status: Withdraw_status
    createdAt: string
}
const initialState: WithdrawState = {
    approvedList: [],
    pendingList: [],
    rejectedList: [],
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,

}

const withdrawSlice = createSlice({
    name: 'withdraw',
    initialState,
    reducers: {
        setApprovedWithList: (state: WithdrawState, action: PayloadAction<Withdraw[]>) => {
            state.approvedList = action.payload
        },
        setPendingWithList: (state: WithdrawState, action: PayloadAction<Withdraw[]>) => {
            state.pendingList = action.payload
        },
        setRejectedWithList: (state: WithdrawState, action: PayloadAction<Withdraw[]>) => {
            state.rejectedList = action.payload
        },
        setWithdrawCount: (
            state: WithdrawState,
            action: PayloadAction<{ rejectedCount: number, approvedCount: number, pendingCount: number }>
        ) => {
            state.rejectedCount = action.payload.rejectedCount
            state.approvedCount = action.payload.approvedCount
            state.pendingCount = action.payload.pendingCount
        },
    },
})

export const { setRejectedWithList, setWithdrawCount, setApprovedWithList, setPendingWithList } = withdrawSlice.actions
export default withdrawSlice.reducer