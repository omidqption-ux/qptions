import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Typography } from '@mui/material'
import {
     setOpenTrades,
     appendOpenTrades,
     clearOpenTrades,
} from '../../../../redux/slices/tradingRoomSlices/tradingRoomSlice'
import { toast } from 'react-toastify'
import LiveTradesList from './LiveTradesList'


export default function PaginatedLiveTradesList({ userId, mode, socket }) {
     const dispatch = useDispatch()
     const { openTrades, openTradesMeta } = useSelector((s) => s.tradingRoom)
     const { page, totalPages } = openTradesMeta

     const [loading, setLoading] = useState(false)
     const scrollRef = useRef(null)

     const fetchPage = (p) => {
          if (loading) return
          setLoading(true)
          socket.emit('getOpenTrades', { mode, page: p }, (err, payload) => {
               setLoading(false)
               if (err) {
                    toast.error(err)
                    return
               }
               const { trades, total, page: currentPage, totalPages } = payload
               if (currentPage === 1) {
                    dispatch(
                         setOpenTrades({
                              trades,
                              total,
                              page: currentPage,
                              totalPages,
                         })
                    )
               } else {
                    dispatch(
                         appendOpenTrades({
                              trades,
                              total,
                              page: currentPage,
                              totalPages,
                         })
                    )
               }
          })
     }

     useEffect(() => {
          dispatch(clearOpenTrades())
          fetchPage(1)
     }, [userId, mode])

     // infinite‐scroll handler stays the same…
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

     // ─── POLLING: refetch page 1 every 3s ───
     useEffect(() => {
          const INTERVAL_MS = 3_000 // pick whatever interval works for you
          const id = setInterval(() => {
               if (!loading) fetchPage(1)
          }, INTERVAL_MS)

          return () => clearInterval(id)
     }, [userId, loading])

     return (
          <Box
               ref={scrollRef}
               sx={{
                    height: 300,
                    overflowY: 'auto',
                    position: 'relative',
               }}
          >
               <LiveTradesList trades={openTrades} />
               {loading && (
                    <Box sx={{ py: 1, textAlign: 'center' }}>
                         <Typography variant='body2'>Loading…</Typography>
                    </Box>
               )}

               {!loading && page >= totalPages && openTrades.length > 0 && (
                    <Box sx={{ py: 1, textAlign: 'center' }}>
                         <Typography variant='body2'>
                              — No more trades —
                         </Typography>
                    </Box>
               )}
          </Box>
     )
}
