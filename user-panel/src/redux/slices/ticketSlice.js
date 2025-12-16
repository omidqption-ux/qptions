import { createSlice } from '@reduxjs/toolkit'

const initialState = {
     tickets: [
          {
               _id: '',
               title: '',
               body: '',
               Photo: '',
          },
     ],
     ticketsCount: 0,
}

export const ticketSlice = createSlice({
     name: 'ticket',
     initialState,
     reducers: {
          setTickets: (state, action) => {
               state.tickets = action.payload.tickets
               state.ticketsCount = action.payload.count
          },
     },
})

export const { setTickets } = ticketSlice.actions

export default ticketSlice.reducer
