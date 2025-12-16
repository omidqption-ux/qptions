import { configureStore } from '@reduxjs/toolkit'
// import your slices here as you add them
import adminReducer from './slices/admins'
import userReducer from './slices/users'
import depositReducer from './slices/deposits'
import tradeReducer from './slices/trades'
import withdrawReducer from './slices/withdraw'
import verificationReducer from './slices/verification'

export const store = configureStore({
    reducer: {
        admin: adminReducer,
        user: userReducer,
        deposit: depositReducer,
        withdraw: withdrawReducer,
        trade: tradeReducer,
        verification: verificationReducer,
    },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
