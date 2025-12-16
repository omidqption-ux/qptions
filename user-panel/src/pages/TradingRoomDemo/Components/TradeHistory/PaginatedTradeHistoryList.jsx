import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Typography } from '@mui/material'
import {
     setTradeHistory,
     appendTradeHistory,
     clearTradeHistory,
} from '../../../../redux/slices/tradingRoomSlices/tradingRoomSlice'
import { toast } from 'react-toastify'
import TradeHistoryList from './TradeHistoryList' // or create a HistoryList component

export default function PaginatedTradeHistoryList({ userId, mode, socket }) {
     const dispatch = useDispatch()
     const { tradeHistory: history, meta } = useSelector((s) => s.tradingRoom)
     const { page, totalPages } = meta

     const [loading, setLoading] = useState(false)
     const scrollRef = useRef(null)

     const fetchPage = (p) => {
          if (loading) return
          setLoading(true)
          socket.emit(
               'getTradeHistory',
               { mode, page: p, limit: 10 },
               (err, payload) => {
                    setLoading(false)
                    if (err) {
                         toast.error(err)
                         return
                    }
                    const {
                         trades,
                         total,
                         page: currentPage,
                         totalPages,
                    } = payload
                    if (currentPage === 1) {
                         dispatch(
                              setTradeHistory({
                                   trades,
                                   total,
                                   page: currentPage,
                                   totalPages,
                              })
                         )
                    } else {
                         dispatch(
                              appendTradeHistory({
                                   trades,
                                   total,
                                   page: currentPage,
                                   totalPages,
                              })
                         )
                    }
               }
          )
     }
     useEffect(() => {
          dispatch(clearTradeHistory())
          fetchPage(1)
     }, [userId, mode])
     useEffect(() => {
          const el = scrollRef.current
          if (!el) return

          const onScroll = () => {
               if (loading) return
               if (
                    page < totalPages &&
                    el.scrollTop + el.clientHeight >= el.scrollHeight - 20
               ) {
                    fetchPage(page + 1)
               }
          }

          el.addEventListener('scroll', onScroll)
          return () => el.removeEventListener('scroll', onScroll)
     }, [page, totalPages, loading])

     return (
          <Box
               ref={scrollRef}
               sx={{
                    height: 300,
                    overflowY: 'auto',
                    position: 'relative',
               }}
          >
               {history && history.length > 0 && (
                    <TradeHistoryList trades={history} />
               )}
               {loading && (
                    <Box sx={{ py: 1, textAlign: 'center' }}>
                         <Typography variant='body2'>Loading…</Typography>
                    </Box>
               )}
               {!loading && page >= totalPages && history.length > 0 && (
                    <Box sx={{ py: 1, textAlign: 'center' }}>
                         <Typography variant='body2'>
                              — End of history —
                         </Typography>
                    </Box>
               )}
               {!loading && history.length === 0 && (
                    <Box sx={{ py: 1, textAlign: 'center' }}>
                         <Typography variant='body2'>
                              No trade history.
                         </Typography>
                    </Box>
               )}
          </Box>
     )
}
