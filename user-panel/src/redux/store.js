import { configureStore, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import userReducer from './slices/userSlice'
import loginHistoryReducer from './slices/loginHistory'
import newsReducer from './slices/newsSlice'
import ticketReducer from './slices/ticketSlice'
import depositReducer from './slices/depositSlice'
import withdrawReducer from './slices/withdrawSlice'
import verificationReducer from './slices/verificationSlice'
import tradingReducer from './slices/tradingSlice'
import notificationReducer from './slices/notificationSlice'
import chartReducer from './slices/tradingRoomSlices/chartSlice'
import tickerReducer from './slices/tradingRoomSlices/tickerSlice'
import tradeReducer from './slices/tradingRoomSlices/tradeSlice'
import tradingRoomReducer from './slices/tradingRoomSlices/tradingRoomSlice'
import {
     persistReducer,
     persistStore,
     FLUSH,
     REHYDRATE,
     PAUSE,
     PERSIST,
     PURGE,
     REGISTER
} from 'redux-persist'
const chartReducerPersistConfig = {
     key: 'chartReducer',
     storage,
}
const tickerReducerPersistConfig = {
     key: 'tickerReducer',
     storage,
}

const persistedChartReducer = persistReducer(
     chartReducerPersistConfig,
     chartReducer
)
const persistedTickerReducer = persistReducer(
     tickerReducerPersistConfig,
     tickerReducer
)


const rootReducer = combineReducers({
     user: userReducer,
     loginHistory: loginHistoryReducer,
     news: newsReducer,
     ticket: ticketReducer,
     deposit: depositReducer,
     withdraw: withdrawReducer,
     chart: persistedChartReducer,
     ticker: persistedTickerReducer,
     trade: tradeReducer,
     verification: verificationReducer,
     trading: tradingReducer,
     notification: notificationReducer,
     tradingRoom: tradingRoomReducer,
})
const store = configureStore({
     reducer: rootReducer,
     middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({
               // keep your current tuning
               immutableCheck: {
                    ignoredPaths: [
                         'chart.candles',
                         'ticker.liveTicks',
                         'socket.lastMessage',
                    ],
                    warnAfter: 128,
               },
               serializableCheck: {
                    // keep your current ignores...
                    ignoredPaths: ['socket.lastMessage', 'chart.candles', '_persist'], // add _persist
                    ignoredActions: [
                         'priceFeed/liveTick',
                         'chart/appendCandles',
                         // ...and add redux-persist actions that carry functions
                         FLUSH,
                         REHYDRATE,
                         PAUSE,
                         PERSIST,
                         PURGE,
                         REGISTER,
                    ],
                    // these are the function fields on persist/PERSIST
                    ignoredActionPaths: ['register', 'rehydrate'],
               },
          }),
     devTools: process.env.NODE_ENV !== 'production',
})
export const persistor = persistStore(store)
export default store
