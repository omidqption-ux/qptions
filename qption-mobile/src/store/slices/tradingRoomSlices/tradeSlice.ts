import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type BuyOrSell = 'BUY' | 'SELL'

export interface TradeMessage {
     messageId: number
     message: string
     isBuy: boolean
     isOpen: boolean
}

export interface OpenTrade {
     tradeIndex: number
     status: 'opened' | 'closed'
     amount: number
     BuyOrSell: BuyOrSell
     closeTime: number
     openTime: number
     isWin: boolean | null
     counter: number
     price: number
     finalPrice: number
     winAmount: number
}

export interface TradeState {
     now: number
     amount: number
     payOutPercentage: number
     BuyOrSell: BuyOrSell
     _30secsCounter: number
     fetchLoading: boolean
     amountIsZero: boolean
     timeIsZero: boolean
     expirationTime: number
     timer: number
     hover: any | null
     openTrades: OpenTrade[]
     tickerCurrentValue: number
     tradeMessage: TradeMessage
     openedTradeIndex: number
     closedTradeIndex: number
     termminatedTradeIndex: number
     activeCounters: Record<string, number>
     counter: number
     aiMode: boolean
     aiActive: boolean
}

const initialState: TradeState = {
     now: 0,
     amount: 0,
     payOutPercentage: 0,
     BuyOrSell: 'BUY',
     _30secsCounter: 0,
     fetchLoading: true,
     amountIsZero: false,
     timeIsZero: false,
     expirationTime: 0,
     timer: 5,
     hover: null,
     openTrades: [],
     tickerCurrentValue: 0,
     tradeMessage: {
          messageId: 0,
          message: '',
          isBuy: true,
          isOpen: false,
     },
     openedTradeIndex: 0,
     closedTradeIndex: 0,
     termminatedTradeIndex: 0,
     activeCounters: {},
     counter: 0,
     aiMode: false,
     aiActive: false,
}

const tradeSlice = createSlice({
     name: 'trade',
     initialState,
     reducers: {
          setChart: (state) => {
               state.now = Date.now()
               state.amount = 0
               state.payOutPercentage = 0
               state.BuyOrSell = 'BUY'
               state._30secsCounter = 0
               state.fetchLoading = false
               state.amountIsZero = false
               state.timeIsZero = false
               state.expirationTime = 0
               state.timer = 5
               state.hover = null
               state.openTrades = []
               state.tickerCurrentValue = 0
               state.tradeMessage = {
                    messageId: 0,
                    message: '',
                    isBuy: true,
                    isOpen: false,
               }
               state.openedTradeIndex = 0
               state.closedTradeIndex = 0
               state.termminatedTradeIndex = 0
               state.activeCounters = {}
               state.counter = 0
          },
          start_30sec: (state) => {
               state._30secsCounter = 30
          },
          count_30secsCounter: (state) => {
               if (state._30secsCounter > 0) {
                    state._30secsCounter = state._30secsCounter - 1
               }
          },
          setFetchLoading: (
               state,
               action: PayloadAction<{ loading: boolean }>
          ) => {
               state.fetchLoading = action.payload.loading
          },
          chnageAmountIzZero: (
               state,
               action: PayloadAction<{ amountIsZero: boolean }>
          ) => {
               state.amountIsZero = action.payload.amountIsZero
          },
          chnageTimeIzZero: (
               state,
               action: PayloadAction<{ timeIsZero: boolean }>
          ) => {
               state.timeIsZero = action.payload.timeIsZero
          },
          setExpirationTime: (
               state,
               action: PayloadAction<{ timer: number }>
          ) => {
               state.expirationTime = Date.now() + action.payload.timer * 1000
               state.timer = action.payload.timer
          },
          setTimer: (state, action: PayloadAction<{ timer: number }>) => {
               state.timer = action.payload.timer
          },
          setAmount: (state, action: PayloadAction<{ amount: number }>) => {
               state.amount = action.payload.amount
          },
          setBuyOrSell: (
               state,
               action: PayloadAction<{ BuyOrSell: BuyOrSell }>
          ) => {
               state.BuyOrSell = action.payload.BuyOrSell
          },
          setCounter: (state, action: PayloadAction<{ counter: number }>) => {
               state.counter = action.payload.counter
          },
          setNow: (state, action: PayloadAction<{ now: number }>) => {
               state.now = action.payload.now
          },
          setHover: (state, action: PayloadAction<{ hover: any }>) => {
               state.hover = action.payload.hover
          },
          updateTrade: (
               state,
               action: PayloadAction<{
                    openTime: number
                    isWin: boolean
                    status: OpenTrade['status']
               }>
          ) => {
               const index = state.openTrades.findIndex(
                    (oTrade) => oTrade.openTime === action.payload.openTime
               )
               if (index > -1) {
                    state.openTrades[index].isWin = action.payload.isWin
                    state.openTrades[index].status = action.payload.status
               }
          },
          resetTrades: (state) => {
               state.openTrades = []
          },
          setPayoutPercentage: (
               state,
               action: PayloadAction<{ payOutPercentage: number }>
          ) => {
               state.payOutPercentage = action.payload.payOutPercentage
          },
          setTickerValue: (
               state,
               action: PayloadAction<{ tickerValue: number }>
          ) => {
               state.tickerCurrentValue = action.payload.tickerValue
          },
          setTradeMessage: (
               state,
               action: PayloadAction<{
                    message: string
                    isBuy: boolean
                    isOpen: boolean
               }>
          ) => {
               state.tradeMessage = {
                    messageId: state.tradeMessage.messageId, // keep old id if you use it elsewhere
                    message: action.payload.message,
                    isBuy: action.payload.isBuy,
                    isOpen: action.payload.isOpen,
               }
          },
          closeTradeMessage: (state) => {
               state.tradeMessage = {
                    messageId: state.tradeMessage.messageId,
                    message: '',
                    isBuy: true,
                    isOpen: false,
               }
          },
          openTrade: (
               state,
               action: PayloadAction<{
                    tradeIndex: number
                    amount: number
                    BuyOrSell: BuyOrSell
                    openTime: number
                    closeTime: number
                    counter: number
                    price: number
                    isWin: boolean
                    status: string
               }>
          ) => {
               const {
                    tradeIndex,
                    amount,
                    BuyOrSell,
                    openTime,
                    closeTime,
                    counter,
                    price,
               } = action.payload

               const exists = state.openTrades.some(
                    (t) => t.tradeIndex === tradeIndex
               )
               if (exists) return

               state.openTrades.push({
                    tradeIndex,
                    status: 'opened',
                    amount,
                    BuyOrSell,
                    closeTime,
                    openTime,
                    isWin: null,
                    counter,
                    price,
                    finalPrice: 0,
                    winAmount: 0,
               })
               state.openedTradeIndex = tradeIndex
          },
          closeTrade: (
               state,
               action: PayloadAction<{
                    tradeIndex: number
                    finalPrice: number
                    isWin: boolean
                    winAmount: number
                    closeTime: number
                    openTime: number
               }>
          ) => {
               const openTradeIndex = state.openTrades.findIndex(
                    (oTrade) => oTrade.tradeIndex === action.payload.tradeIndex
               )
               if (openTradeIndex > -1) {
                    state.openTrades[openTradeIndex].status = 'closed'
                    state.openTrades[openTradeIndex].finalPrice =
                         action.payload.finalPrice
                    state.openTrades[openTradeIndex].isWin = action.payload.isWin
                    state.openTrades[openTradeIndex].winAmount =
                         action.payload.winAmount
                    state.closedTradeIndex = action.payload.tradeIndex
               }
          },
          terminateTrade: (
               state,
               action: PayloadAction<{ tradeIndex: number }>
          ) => {
               const openTradeIndex = state.openTrades.findIndex(
                    (oTrade) => oTrade.tradeIndex === action.payload.tradeIndex
               )
               if (openTradeIndex > -1) {
                    state.openTrades.splice(openTradeIndex, 1)
               }
               state.termminatedTradeIndex = action.payload.tradeIndex
          },

          toggleAiMode: (state) => {
               state.aiMode = !state.aiMode
               if (!state.aiMode) state.aiActive = false
          },
          setAiActive: (state, action: PayloadAction<boolean>) => {
               state.aiActive = action.payload
               if (action.payload) state.aiMode = true
          }
     },
})

export const {
     setChart,
     start_30sec,
     count_30secsCounter,
     setFetchLoading,
     chnageAmountIzZero,
     chnageTimeIzZero,
     setExpirationTime,
     setAmount,
     setBuyOrSell,
     setCounter,
     setHover,
     updateTrade,
     openTrade,
     resetTrades,
     setPayoutPercentage,
     setTickerValue,
     setTradeMessage,
     closeTradeMessage,
     setTimer,
     setNow,
     closeTrade,
     terminateTrade,
     toggleAiMode,
     setAiActive,
} = tradeSlice.actions

export default tradeSlice.reducer
