import { createSlice, PayloadAction } from '@reduxjs/toolkit'
type AuthState = { isAuthenticated: boolean; userId: string | null }
const initial: AuthState = { isAuthenticated: false, userId: null }

const slice = createSlice({
    name: 'auth',
    initialState: initial,
    reducers: {
        setAuth(state, a: PayloadAction<{ userId?: string | null }>) {
            state.isAuthenticated = true
            state.userId = a.payload.userId ?? null
        },
        clearAuth(state) {
            state.isAuthenticated = false
            state.userId = null
        },
    },
})
export const { setAuth, clearAuth } = slice.actions
export default slice.reducer
