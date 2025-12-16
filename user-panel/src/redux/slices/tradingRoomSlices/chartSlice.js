import { createSlice } from '@reduxjs/toolkit'

const initialState = {
     candleTime: 10,
     seriesType: 'LineSeries',
     chartData: [],
}

const chartSlice = createSlice({
     name: 'Chart',
     initialState,
     reducers: {
          changeCandleTime: (state, action) => {
               state.candleTime = action.payload
          },
          changeSeriesType: (state, action) => {
               state.seriesType = action.payload
          },
          setChartData: (state, action) => {
               state.chartData = action.payload
          },
          addLiveData: (state, action) => {
               state.chartData = [...state.chartData, action.payload]
          },
          addBulletToLiveData: (state) => {
               state.chartData[state.chartData.length - 1].bullet = true
          },
          resetChart: () => initialState
     },
})

export const { changeCandleTime, changeSeriesType, setChartData, addLiveData, resetChart, addBulletToLiveData } = chartSlice.actions
export default chartSlice.reducer
