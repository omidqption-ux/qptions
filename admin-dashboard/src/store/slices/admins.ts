import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Role = 'superAdmin' | 'admin' | 'support'

type AdminList = {
    adminList: AdminState[]
}
type AdminState = {
    role: Role,
    fullName: string,
    username: string,
    isActive: boolean,
}
export type NewAdminState = {
    role: Role,
    fullName: string,
    username: string,
    isActive: boolean,
    password: string,
}
export type AdminSliceState = AdminState & AdminList

const initialState: AdminSliceState = {
    role: 'support',
    fullName: '',
    username: '',
    isActive: true,
    adminList: []
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setAdmin: (state: AdminSliceState, action: PayloadAction<AdminState>) => {
            state.fullName = action.payload.fullName
            state.role = action.payload.role
            state.username = action.payload.username

        },
        setFullName: (state: AdminSliceState, action: PayloadAction<string>) => {
            state.fullName = action.payload
        },
        changeIsActive: (state: AdminSliceState, action: PayloadAction<{ username: string, isActive: boolean }>) => {
            const index = state.adminList.findIndex(sA => sA.username === action.payload.username)
            state.adminList[index].isActive = action.payload.isActive
        },
        changeRole: (state: AdminSliceState, action: PayloadAction<{ username: string, role: string }>) => {
            const index = state.adminList.findIndex(sA => sA.username === action.payload.username)
            state.adminList[index].role = action.payload.role as Role
        },
        changeAdminName: (state: AdminSliceState, action: PayloadAction<{ username: string, fullName: string }>) => {
            const index = state.adminList.findIndex(sA => sA.username === action.payload.username)
            state.adminList[index].fullName = action.payload.fullName
        },
        setAdminList: (state: AdminSliceState, action: PayloadAction<AdminList>) => {
            state.adminList = action.payload.adminList
        },
    },
})

export const { changeRole, setAdmin, setFullName, setAdminList, changeIsActive, changeAdminName } = adminSlice.actions
export default adminSlice.reducer