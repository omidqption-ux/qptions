import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type TradingMode = 'real' | 'demo' | 'bonus'

export interface PaginationMeta {
     total: number
     page: number
     totalPages: number
}

export interface TradingRoomState {
     userId: string
     tradingRoomId: string
     collapsedMenu: string
     collapsedMenuSaved: string
     amountIsMoreThanBalance: boolean
     openTrades: any[]               // replace `any` with your trade type if you have it
     openTradesMeta: PaginationMeta
     tradeHistory: any[]             // replace `any` with your trade history type if you have it
     meta: PaginationMeta
     mode: TradingMode
}

const initialState: TradingRoomState = {
     userId: '',
     tradingRoomId: '',
     collapsedMenu: '',
     collapsedMenuSaved: 'LivePositions',
     amountIsMoreThanBalance: false,
     openTrades: [],
     openTradesMeta: { total: 0, page: 1, totalPages: 1 },
     tradeHistory: [],
     meta: { page: 1, total: 0, totalPages: 1 },
     mode: 'real',
}

const tradingRoomSlice = createSlice({
     name: 'tradingRoom',
     initialState,
     reducers: {
          setTradingRoom: (
               state,
               action: PayloadAction<{ tradingRoomId: string }>
          ) => {
               state.tradingRoomId = action.payload.tradingRoomId
          },
          setMode: (state, action: PayloadAction<TradingMode>) => {
               state.mode = action.payload
          },
          resetTradingRoom: () => initialState,
          setCollapsedMenu: (state, action: PayloadAction<string>) => {
               state.collapsedMenu = action.payload
          },
          setCollapsedMenuSaved: (state, action: PayloadAction<string>) => {
               state.collapsedMenuSaved = action.payload
          },
          setAmountIsMoreThanBalance: (state) => {
               state.amountIsMoreThanBalance = !state.amountIsMoreThanBalance
          },
          setUserId: (state, action: PayloadAction<string>) => {
               state.userId = action.payload
          },
          setOpenTrades: (
               state,
               action: PayloadAction<{
                    trades: any[]
                    total: number
                    page: number
                    totalPages: number
               }>
          ) => {
               const { trades, total, page, totalPages } = action.payload
               state.openTrades = trades
               state.openTradesMeta = { total, page, totalPages }
          },
          appendOpenTrades: (
               state,
               action: PayloadAction<{
                    trades?: any[]
                    total: number
                    page: number
                    totalPages: number
               }>
          ) => {
               const { trades, total, page, totalPages } = action.payload
               if (trades && trades.length) {
                    state.openTrades.push(...trades)
               }
               state.openTradesMeta = { total, page, totalPages }
          },
          clearOpenTrades: (state) => {
               state.openTrades = []
               state.openTradesMeta = { total: 0, page: 1, totalPages: 1 }
          },
          setTradeHistory: (
               state,
               action: PayloadAction<{
                    trades: any[]
                    total: number
                    page: number
                    totalPages: number
               }>
          ) => {
               const { trades, total, page, totalPages } = action.payload
               state.tradeHistory = trades
               state.meta = { total, page, totalPages }
          },
          appendTradeHistory: (
               state,
               action: PayloadAction<{
                    trades: any[]
                    total: number
                    page: number
                    totalPages: number
               }>
          ) => {
               const { trades, total, page, totalPages } = action.payload
               if (trades && trades.length) {
                    state.tradeHistory.push(...trades)
               }
               state.meta = { total, page, totalPages }
          },
          clearTradeHistory: (state) => {
               state.tradeHistory = []
               state.meta = initialState.meta
          },
          // Added based on your export – simple example:
          setIsBonus: (state, action: PayloadAction<boolean>) => {
               state.mode = action.payload ? 'bonus' : 'real'
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
     setIsBonus,
} = tradingRoomSlice.actions

export default tradingRoomSlice.reducer
