import React, { useEffect } from 'react'
import { Box, Tooltip, IconButton } from '@mui/material'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Divider from '@mui/material/Divider'
import { useDispatch, useSelector } from 'react-redux'
import {
     setCollapsedMenu,
     setUserId,
} from '../../../../redux/slices/tradingRoomSlices/tradingRoomSlice'
import LiveTrades from './LiveTrades'
import PaginatedTradeHistoryList from './PaginatedTradeHistoryList'
import axiosInstance from '../../../../network/axios'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

export default function BottomTradesDrawer({ socket }) {
     const dispatch = useDispatch()
     const open = useSelector(
          (s) => s.tradingRoom.collapsedMenu === 'openPositions'
     )
     const { mode, userId } = useSelector((store) => store.tradingRoom)

     const [tab, setTab] = React.useState(0)

     const handleTab = (e, v) => {
          setTab(v)
          e.stopPropagation()
     }

     const getUserId = async () => {
          try {
               const response = await axiosInstance.get('/users/getUserId')
               dispatch(setUserId(response.userId))
          } catch (e) { }
     }
     useEffect(() => {
          getUserId()
     }, [open, mode])
     const onClose = () => {
          dispatch(setCollapsedMenu(""))
     }
     return (
          <Box className='w-full'>
               <Tooltip title="Close">
                    <IconButton
                         aria-label="Close"
                         onClick={onClose}              // <-- provide your handler
                         size="small"
                         sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              color: '#94a3b8',
                              '&:hover': { color: '#ef4444', bgcolor: 'transparent' },
                              zIndex: 1,
                         }}
                    >
                         <ArrowBackIosNewIcon className='rotate-180' fontSize="small" />
                    </IconButton>
               </Tooltip>
               <Tabs
                    sx={{
                         '& .MuiTabs-indicator': {
                              backgroundColor: '#3b82f6', // blue-500
                              height: 3,
                              borderRadius: 2,
                         },
                         '& .MuiTab-root': {
                              color: '#94a3b8', // slate-400 (inactive text)
                         },
                         '& .MuiTab-root.Mui-selected': {
                              color: '#3b82f6', // same bluish tone when active
                         },
                    }}
                    value={tab}>
                    <Tab
                         onClick={(e) => handleTab(e, 0)}
                         label='Live Trades'
                         className='text-xs text-gray-300'
                    />
                    <Tab
                         onClick={(e) => handleTab(e, 1)}
                         label='Trade History'
                         className='text-xs text-gray-300'
                    />
               </Tabs>
               <Divider />
               <Box sx={{ p: 2 }}>
                    {tab === 0 ? (
                         <LiveTrades
                              socket={socket}
                              userId={userId}
                              mode={mode}
                         />
                    ) : (
                         <PaginatedTradeHistoryList
                              socket={socket}
                              userId={userId}
                              mode={mode}
                         />
                    )}
               </Box>
          </Box>
     )
}
