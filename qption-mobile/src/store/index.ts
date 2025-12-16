import { configureStore } from '@reduxjs/toolkit'
import auth from './slices/authSlice'
import user from './slices/userSlice'
import deposit from './slices/depositSlice'
import chart from './slices/tradingRoomSlices/chartSlice'
import ticker from './slices/tradingRoomSlices/tickerSlice'
import trade from './slices/tradingRoomSlices/tradeSlice'
import tradingRoom from './slices/tradingRoomSlices/tradingRoomSlice'

export const store = configureStore({
    reducer: { auth, user, chart, ticker, trade, tradingRoom, deposit },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        }),
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
