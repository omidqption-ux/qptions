import { createSlice, PayloadAction } from '@reduxjs/toolkit'



type UserState = {
    usersList: User[]
}
export type User = {
    email: string
    balance: {
        amount: number
        bonus: number
        demo: number
    }
    isEmailVerified: boolean
    isIDVerified: boolean
    isPhoneVerified: boolean
    username: string
    _id: string
    profileImage: string | undefined
}
const initialState: UserState = {
    usersList: [],
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsersList: (state: UserState, action: PayloadAction<User[]>) => {
            state.usersList = action.payload
        },
    },
})

export const { setUsersList } = userSlice.actions
export default userSlice.reducer