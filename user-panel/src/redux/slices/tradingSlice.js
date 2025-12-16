import { createSlice } from '@reduxjs/toolkit'

const initialState = {
     tradingHistory: [],
     leaderBoard: [],
     followers: [],
     followings: [],
     leaders: [],
}

export const tradingSlice = createSlice({
     name: 'trading',
     initialState,
     reducers: {
          setTradingHistory: (state, action) => {
               state.tradingHistory = action.payload
          },
          setLeaderBoard: (state, action) => {
               state.leaderBoard = action.payload
          },
          setFollowers: (state, action) => {
               state.followers = action.payload
          },
          setFollowings: (state, action) => {
               state.followings = action.payload
          },
          setLeaders: (state, action) => {
               state.leaders = action.payload
          },
          addALeader: (state, action) => {
               state.leaders = [...state.leaders, action.payload]
          },
          updateLeaders: (state, action) => {
               const index = state.leaders.findIndex(
                    (trader) =>
                         trader.leadTraderId._id.toString() ===
                         action.payload.leadTraderId._id
               )
               if (index > -1) {
                    state.leaders.splice(index, 1, action.payload)
               }
          },
     },
})

export const {
     setTradingHistory,
     setLeaderBoard,
     setFollowers,
     setFollowings,
     setLeaders,
     addALeader,
     updateLeaders,
} = tradingSlice.actions

export default tradingSlice.reducer
