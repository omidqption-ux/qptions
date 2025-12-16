import { createSlice } from '@reduxjs/toolkit'
const initialState = {
     now: 0,
     amount: 10,
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
               state.tradeMessage = { messageId: 0, message: '', isBuy: true, isOpen: false }
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
               if (state._30secsCounter > 0)
                    state._30secsCounter =
                         state._30secsCounter - 1
          },
          setFetchLoading: (state, action) => {
               state.fetchLoading = action.payload.loading
          },
          chnageAmountIzZero: (state, action) => {
               state.amountIsZero = action.payload.amountIsZero
          },
          chnageTimeIzZero: (state, action) => {
               state.timeIsZero = action.payload.timeIsZero
          },
          setExpirationTime: (state, action) => {
               state.expirationTime =
                    Date.now() + action.payload.timer * 1000
               state.timer = action.payload.timer
          },
          setTimer: (state, action) => {
               state.timer = action.payload.timer
          },
          setAmount: (state, action) => {
               state.amount = action.payload.amount
          },
          setBuyOrSell: (state, action) => {
               state.BuyOrSell = action.payload.BuyOrSell
          },
          setCounter: (state, action) => {
               state.counter = action.payload.counter
          },
          setNow: (state, action) => {
               state.now = action.payload.now
          },
          setHover: (state, action) => {
               state.hover = action.payload.hover
          },
          updateTrade: (state, action) => {
               const index = state.openTrades.findIndex(
                    (oTrade) => oTrade.openTime === action.payload.openTime
               )
               if (index > -1) {
                    state.openTrades[index].isWin =
                         action.payload.isWin
                    state.openTrades[index].status =
                         action.payload.status
               }
          },
          resetTrades: (state) => {
               state.openTrades = []
          },
          setPayoutPercentage: (state, action) => {
               state.payOutPercentage =
                    action.payload.payOutPercentage
          },
          setTickerValue: (state, action) => {
               state.tickerCurrentValue =
                    action.payload.tickerValue
          },
          setTradeMessage: (state, action) => {
               state.tradeMessage = {
                    message: action.payload.message,
                    isBuy: action.payload.isBuy,
                    isOpen: action.payload.isOpen,
               }

          },
          closeTradeMessage: (state) => {
               state.tradeMessage = {
                    message: '',
                    isBuy: true,
                    isOpen: false,
               }

          },
          openTrade: (state, action) => {
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
          closeTrade: (state, action) => {
               const openTradeIndex = state.openTrades.findIndex(
                    (oTrade) =>
                         oTrade.tradeIndex === action.payload.tradeIndex
               )
               if (openTradeIndex > -1) {
                    state.openTrades[openTradeIndex].status =
                         'closed'
                    state.openTrades[
                         openTradeIndex
                    ].finalPrice = action.payload.finalPrice
                    state.openTrades[openTradeIndex].isWin =
                         action.payload.isWin
                    state.openTrades[
                         openTradeIndex
                    ].winAmount = action.payload.winAmount
                    state.closedTradeIndex =
                         action.payload.tradeIndex
               }
          },

          terminateTrade: (state, action) => {
               const openTradeIndex = state.openTrades.findIndex(
                    (oTrade) =>
                         oTrade.tradeIndex === action.payload.tradeIndex
               )
               if (openTradeIndex) {
                    state.openTrades.splice(
                         openTradeIndex,
                         1
                    )
               }
               state.termminatedTradeIndex =
                    action.payload.tradeIndex
          }
     },
},
)

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
} = tradeSlice.actions
export default tradeSlice.reducer
