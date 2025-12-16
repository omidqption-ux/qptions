import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type SeriesType = 'LineSeries' | 'CandlestickSeries' | string

export interface ChartPoint {
     time: number
     value?: number
     open?: number
     high?: number
     low?: number
     close?: number
     bullet?: boolean
     // if you attach extra fields from backend, keep it flexible:
     [key: string]: any
}

export interface ChartState {
     candleTime: number
     seriesType: SeriesType
     lastchartData: ChartPoint
}

const initialState: ChartState = {
     candleTime: 10,
     seriesType: 'LineSeries',
     lastchartData: {} as ChartPoint
}

const chartSlice = createSlice({
     name: 'Chart',
     initialState,
     reducers: {
          changeCandleTime: (state, action: PayloadAction<number>) => {
               state.candleTime = action.payload
          },
          changeSeriesType: (state, action: PayloadAction<SeriesType>) => {
               state.seriesType = action.payload
          },
          addLiveData: (state, action: PayloadAction<ChartPoint>) => {
               state.lastchartData = action.payload
          },
          resetChart: () => initialState,
     },
})

export const {
     changeCandleTime,
     changeSeriesType,
     addLiveData,
     resetChart,
} = chartSlice.actions

export default chartSlice.reducer
