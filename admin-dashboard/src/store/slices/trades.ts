import { createSlice, PayloadAction } from '@reduxjs/toolkit'



type TradesState = {
    tradeList: Trade[]
}
export type TradeStatus = 'opened' | 'inprocess' | 'closed'
export type TradeMode = 'real' | 'demo' | 'bonus'
export type TradeBuyOrSell = 'buy' | 'sell'
export type Trade = {
    tradeId: string
    username: string
    userId: string
    amount: number
    status: TradeStatus
    roomMode: TradeMode
    percentage: number
    pair: string
    openTime: number
    closeTime: number
    netProfit: number
    isWin: boolean
    initialPrice: number
    finalPrice: number
    buyOrSell: TradeBuyOrSell
}
const initialState: TradesState = {
    tradeList: [],
}

const tradeSlice = createSlice({
    name: 'trade',
    initialState,
    reducers: {
        setTradeList: (state: TradesState, action: PayloadAction<Trade[]>) => {
            state.tradeList = action.payload
        },
    },
})

export const { setTradeList } = tradeSlice.actions
export default tradeSlice.reducer