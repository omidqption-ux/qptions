import { createSlice } from '@reduxjs/toolkit'

const initialState = {
     userId: '',
     tradingRoomId: '',
     collapsedMenu: '',
     collapsedMenuSaved: 'LivePositions',
     amountIsMoreThanBalance: false,
     openTrades: [],
     openTradesMeta: { total: 0, page: 1, totalPages: 1 },
     tradeHistory: [],
     meta: { page: 1, total: 0, totalPages: 1 },
     mode: 'real'
}

const tradingRoomSlice = createSlice({
     name: 'tradingRoom',
     initialState,
     reducers: {
          setTradingRoom: (state, action) => {
               state.tradingRoomId = action.payload.tradingRoomId
          },
          setMode: (state, action) => {
               state.mode = action.payload
          },
          resetTradingRoom: (state) => {
               state = initialState
          },
          setCollapsedMenu: (state, action) => {
               state.collapsedMenu = action.payload
          },
          setCollapsedMenuSaved: (state, action) => {
               state.collapsedMenuSaved = action.payload
          },
          setAmountIsMoreThanBalance: (state) => {
               state.amountIsMoreThanBalance = !state.amountIsMoreThanBalance
          },
          setUserId: (state, action) => {
               state.userId = action.payload
          },
          setOpenTrades: (state, action) => {
               const { trades, total, page, totalPages } = action.payload
               state.openTrades = trades
               state.openTradesMeta = { total, page, totalPages }
          },
          appendOpenTrades(state, action) {
               const { trades, total, page, totalPages } = action.payload
               if (trades) {
                    state.openTrades.push(...trades)
                    state.openTradesMeta = { total, page, totalPages }
               }
          },
          clearOpenTrades(state) {
               state.openTrades = []
               state.openTradesMeta = { total: 0, page: 1, totalPages: 1 }
          },
          setTradeHistory(state, action) {
               const { trades, total, page, totalPages } = action.payload
               state.tradeHistory = trades
               state.meta = { total, page, totalPages }
          },
          appendTradeHistory(
               state,
               { payload: { trades, total, page, totalPages } }
          ) {
               state.tradeHistory.push(...trades)
               state.meta = { total, page, totalPages }
          },
          clearTradeHistory(state) {
               state.tradeHistory = []
               state.meta = initialState.meta
          },
     },
})

export const {
     setMode,
     setTradingRoom,
     setCollapsedMenu,
     setAmountIsMoreThanBalance,
     setUserId,
     setOpenTrades,
     appendOpenTrades,
     clearOpenTrades,
     setTradeHistory,
     clearTradeHistory,
     appendTradeHistory,
     setCollapsedMenuSaved,
     setIsBonus
} = tradingRoomSlice.actions
export default tradingRoomSlice.reducer
