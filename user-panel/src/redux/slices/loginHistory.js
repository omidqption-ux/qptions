import { createSlice } from '@reduxjs/toolkit'

const initialState = {
     loginHistory: [
          {
               IP: '',
               deviceOs: '',
               browser: '',
               country: '',
               city: '',
               createdAt: '',
          },
     ],
     activeSessions: [
          {
               id: '',
               ipAddress: '',
               deviceOs: '',
               browser: '',
               country: '',
               city: '',
               createdAt: '',
               lastActive: '',
          },
     ],
     currentIp: '',
}

export const loginHistorySlice = createSlice({
     name: 'loginHistory',
     initialState,
     reducers: {
          setLoginHistory: (state, action) => {
               state.loginHistory = action.payload
          },
          setActiveSessions: (state, action) => {
               state.activeSessions = action.payload.activeSessions
               state.currentIp = action.payload.currentIp
          },
          setSessionIp: (state, action) => {
               state.currentIp = action.payload
          },
     },
})

export const { setLoginHistory, setActiveSessions, setSessionIp } =
     loginHistorySlice.actions

export default loginHistorySlice.reducer
