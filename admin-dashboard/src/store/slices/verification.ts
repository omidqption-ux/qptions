import { createSlice, PayloadAction } from '@reduxjs/toolkit'



type VerificationState = {
    verificationRejectedList: Verification[]
    verificationApprovedList: Verification[]
    verificationPendingList: Verification[]
    verificationSendingList: Verification[]
    rejectedCount: number
    approvedCount: number
    pendingCount: number
    sendingCount: number
}

export type Verification = {
    _id: string
    userId: {
        username: string
        _id: string
    }
    issuingCountry: string
    documentType: string
    documentImage: string
    documentBackImage: string | undefined
    selfieImage: string
    rejectionReason: string | undefined
    createdAt: string

}
const initialState: VerificationState = {
    verificationRejectedList: [],
    verificationApprovedList: [],
    verificationPendingList: [],
    verificationSendingList: [],
    rejectedCount: 0,
    approvedCount: 0,
    pendingCount: 0,
    sendingCount: 0
}

const verificationSlice = createSlice({
    name: 'verification',
    initialState,
    reducers: {
        setPendingVerificationList: (state: VerificationState, action: PayloadAction<Verification[]>) => {
            state.verificationPendingList = action.payload
        },
        setApprovedVerificationList: (state: VerificationState, action: PayloadAction<Verification[]>) => {
            state.verificationApprovedList = action.payload
        },
        setSendingVerificationList: (state: VerificationState, action: PayloadAction<Verification[]>) => {
            state.verificationSendingList = action.payload
        },
        setRejectedVerificationList: (state: VerificationState, action: PayloadAction<Verification[]>) => {
            state.verificationRejectedList = action.payload
        },
        setVerificationsCount: (
            state: VerificationState,
            action: PayloadAction<{ rejectedCount: number, approvedCount: number, pendingCount: number, sendingCount: number }>
        ) => {
            state.rejectedCount = action.payload.rejectedCount
            state.approvedCount = action.payload.approvedCount
            state.pendingCount = action.payload.pendingCount
            state.sendingCount = action.payload.sendingCount
        },
    },
})

export const {
    setPendingVerificationList,
    setApprovedVerificationList,
    setSendingVerificationList,
    setRejectedVerificationList,
    setVerificationsCount
} = verificationSlice.actions
export default verificationSlice.reducer