import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type TickerType = 'fx' | 'crypto' | 'WATCHLIST'

export interface TickerSymbol {
     symbol: string
     payoutPercentage?: number
     market?: 'crypto' | 'fx'
     currency_symbol?: string
     base_currency_symbol?: string
     // keep it flexible for any extra fields (spread from backend, etc.)
     [key: string]: any
}

export interface ActiveTicker extends TickerSymbol {
     payoutPercentage: number
     market: 'crypto' | 'fx'
     currency_symbol: string
     base_currency_symbol: string
}

export interface TickerState {
     tickerType: TickerType
     fxSymbols: TickerSymbol[]
     cryptoSymbols: TickerSymbol[]
     WATCHLISTSymbols: TickerSymbol[]
     activeTicker: ActiveTicker
     activeTickerDemo: ActiveTicker
     activeTickerBonus: ActiveTicker
     lastDataItem: any | null // you can tighten this to a specific type later
}

const initialActiveTicker: ActiveTicker = {
     symbol: 'X:BTCUSD',
     payoutPercentage: 96,
     market: 'crypto',
     currency_symbol: 'USD',
     base_currency_symbol: 'BTC',
}

const initialState: TickerState = {
     tickerType: 'fx',
     fxSymbols: [],
     cryptoSymbols: [],
     ////watchlist
     WATCHLISTSymbols: [],
     ///active
     activeTicker: initialActiveTicker,
     activeTickerDemo: initialActiveTicker,
     activeTickerBonus: initialActiveTicker,
     lastDataItem: null,
}

const tickerSlice = createSlice({
     name: 'ticker',
     initialState,
     reducers: {
          selectTickerType: (
               state,
               action: PayloadAction<{ tickerType: TickerType }>
          ) => {
               state.tickerType = action.payload.tickerType
          },
          setSymbols: (
               state,
               action: PayloadAction<{ tickerType: TickerType; symbols: TickerSymbol[] }>
          ) => {
               switch (action.payload.tickerType) {
                    case 'WATCHLIST':
                         state.WATCHLISTSymbols = [...action.payload.symbols]
                         break
                    case 'crypto':
                         state.cryptoSymbols = [...action.payload.symbols]
                         break
                    case 'fx':
                         state.fxSymbols = [...action.payload.symbols]
                         break
               }
          },
          resetTicker: () => initialState,
          addToWatchList: (state, action: PayloadAction<TickerSymbol>) => {
               const index = state.WATCHLISTSymbols.findIndex(
                    (sWl) => sWl.symbol === action.payload.symbol
               )
               if (index < 0) state.WATCHLISTSymbols.push(action.payload)
          },
          clearWatchList: (state) => {
               state.WATCHLISTSymbols = []
          },
          removeFormWatchList: (state, action: PayloadAction<string>) => {
               state.WATCHLISTSymbols = state.WATCHLISTSymbols.filter(
                    (wlItem) => wlItem.symbol !== action.payload
               )
          },
          setActiveTicker: (state, action: PayloadAction<ActiveTicker>) => {
               state.activeTicker = action.payload
          },
          setActiveTickerDemo: (state, action: PayloadAction<ActiveTicker>) => {
               state.activeTickerDemo = action.payload
          },
          setActiveTickerBonus: (state, action: PayloadAction<ActiveTicker>) => {
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
          setLastDataItem: (state, action: PayloadAction<any>) => {
               state.lastDataItem = action.payload
          },
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
     setLastDataItem,
} = tickerSlice.actions

export default tickerSlice.reducer
