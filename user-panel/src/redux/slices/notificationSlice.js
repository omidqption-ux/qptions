import { createSlice } from '@reduxjs/toolkit'

const initialState = {
     notifications: [],
     notificationsCount: 0,
}

export const notificationSlice = createSlice({
     name: 'notification',
     initialState,
     reducers: {
          setNotifications: (state, action) => {
               state.notifications = action.payload
          },
          setNotificationsCount: (state, action) => {
               state.notificationsCount = action.payload
          },
          addNotification: (state) => {
               state.notificationsCount += 1
          },
     },
})

export const { setNotifications, setNotificationsCount, addNotification } =
     notificationSlice.actions

export default notificationSlice.reducer
