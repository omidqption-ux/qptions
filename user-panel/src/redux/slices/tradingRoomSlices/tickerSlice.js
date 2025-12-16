import { createSlice } from '@reduxjs/toolkit'


const initialState = {
     tickerType: 'fx',
     fxSymbols: [],
     cryptoSymbols: [],
     ////watchlist
     WATCHLISTSymbols: [],
     ///active
     activeTicker: {
          symbol: 'X:BTCUSD',
          payoutPercentage: 96,
          market: 'crypto',
          currency_symbol: 'USD',
          base_currency_symbol: 'BTC',
     },
     activeTickerDemo: {
          symbol: 'X:BTCUSD',
          payoutPercentage: 96,
          market: 'crypto',
          currency_symbol: 'USD',
          base_currency_symbol: 'BTC',
     },
     activeTickerBonus: {
          symbol: 'X:BTCUSD',
          payoutPercentage: 96,
          market: 'crypto',
          currency_symbol: 'USD',
          base_currency_symbol: 'BTC',
     },
     lastDataItem: null
}

const tickerSlice = createSlice({
     name: 'ticker',
     initialState,
     reducers: {
          selectTickerType: (state, action) => {
               state.tickerType = action.payload.tickerType
          },
          setSymbols: (state, action) => {
               switch (action.payload.tickerType) {
                    case 'WATCHLIST':
                         state.WATCHLISTSymbols = [
                              ...action.payload.symbols,
                         ]
                         break
                    case 'crypto':
                         state.cryptoSymbols = [
                              ...action.payload.symbols,
                         ]
                         break
                    case 'fx':
                         state.fxSymbols = [
                              ...action.payload.symbols,
                         ]
                         break
               }
          },
          resetTicker: () => initialState,
          addToWatchList: (state, action) => {
               const index = state.WATCHLISTSymbols.findIndex(
                    (sWl) => sWl.symbol === action.payload.symbol
               )
               if (index < 0)
                    state.WATCHLISTSymbols.push(action.payload)
          },
          clearWatchList: (state) => {
               state.WATCHLISTSymbols = []
          },
          removeFormWatchList: (state, action) => {
               state.WATCHLISTSymbols = state.WATCHLISTSymbols.filter(wlItem => wlItem.symbol !== action.payload)
          },
          setActiveTicker: (state, action) => {
               state.activeTicker = action.payload
          },
          setActiveTickerDemo: (state, action) => {
               state.activeTickerDemo = action.payload
          },
          setActiveTickerBonus: (state, action) => {
               state.activeTickerBonus = action.payload
          },
          resetActiveTicker: (state) => {
               state.activeTicker = initialState.activeTicker
          },
          resetActiveTickerDemo: (state) => {
               state.activeTickerDemo = initialState.activeTickerDemo
          },
          resetActiveTickerBonus: (state) => {
               state.activeTickerBonus = initialState.activeTickerBonus
          },
          setLastDataItem: (state, action) => {
               state.lastDataItem = action.payload
          }
     },
})

export const {
     selectTickerType,
     setSymbols,
     resetTicker,
     clearWatchList,
     addToWatchList,
     removeFormWatchList,
     setActiveTicker,
     setActiveTickerDemo,
     setActiveTickerBonus,
     resetActiveTicker,
     resetActiveTickerDemo,
     resetActiveTickerBonus,
     setLastDataItem
} = tickerSlice.actions
export default tickerSlice.reducer
