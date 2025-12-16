import { useEffect } from 'react'
import { IconButton } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import HistoryIcon from '@mui/icons-material/History'
import PeopleIcon from '@mui/icons-material/People'
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import DepositIcon from '@mui/icons-material/CreditScore'
import {
     setCollapsedMenuSaved,
     setCollapsedMenu,
} from '../../../../redux/slices/tradingRoomSlices/tradingRoomSlice'
import TradeHistory from '../TradeHistory/TradeHistory'
import SocailTrading from '../SocailTrading/SocailTrading'
import Tournament from '../Tournoments/Tournoments'
import Desposit from '../MiniDeposit/MiniDeposit'

const HistoryPanel = ({ onToggle, socket }) => {
     const dispatch = useDispatch()
     const { collapsedMenu, collapsedMenuSaved } = useSelector(
          (store) => store.tradingRoom
     )

     useEffect(() => {
          if (collapsedMenu) dispatch(setCollapsedMenuSaved(collapsedMenu))
     }, [collapsedMenu])
     useEffect(() => {
          onToggle(!!collapsedMenu)
     }, [onToggle])

     const getMenuItemIcon = (text) => {
          switch (text) {
               case 'Deposit':
                    return <DepositIcon fontSize='small' />
               case 'LivePositions':
                    return <HistoryIcon fontSize='small' />
               case 'SocialTrading':
                    return <PeopleIcon fontSize='small' />
               case 'Signal':
                    return <SignalCellularAltIcon fontSize='small' />
               case 'Tournament':
                    return <EmojiEventsIcon fontSize='small' />
               default:
                    return <HistoryIcon fontSize='small' />
          }
     }

     return (
          <div
               onClick={(e) => e.stopPropagation()}
               className={`fixed right-0 top-[70px] h-[calc(100vh-70px)] flex items-center transition-all duration-300 z-10 ${collapsedMenu ? 'translate-x-0' : 'translate-x-[300px]'
                    }`}
          >
               <div
                    onClick={(e) => {
                         if (collapsedMenu) dispatch(setCollapsedMenu(''))
                         else dispatch(setCollapsedMenu(collapsedMenuSaved))
                         e.stopPropagation()
                    }}
                    className='[@media(max-height:400px)]:hidden absolute bottom-0 left-[-40px] flex flex-col items-center gap-2'
               >
                    <div
                         className={`cursor-pointer relative transition-all duration-300  `}
                    >
                         <IconButton
                              className={` cursor-pointer   z-20 transition-all duration-300 `}
                              sx={{
                                   color: 'rgba(255, 255, 255, 0.7)',
                                   '&:hover': {
                                        color: 'rgba(255, 255, 255, 0.9)',
                                   },
                              }}
                         >
                              {collapsedMenu ? (
                                   <ChevronRightIcon />
                              ) : (
                                   <ChevronLeftIcon />
                              )}
                         </IconButton>
                         <div className='cursor-pointer absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-orange-500/20 flex items-center justify-center'>
                              <div className='w-2 h-2 rounded-full bg-orange-500 animate-ping' />
                         </div>
                    </div>
                    <div
                         className={`cursor-pointer absolute left-[-80px] top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-lightGrey/70 transition-all duration-300 whitespace-nowrap opacity-0 translate-x-[-10px] `}
                    >
                         {getMenuItemIcon(collapsedMenuSaved)}
                         <span>{collapsedMenuSaved}</span>
                    </div>
               </div>
               <div className='w-[300px] h-full flex flex-col bg-gradient-to-b from-darkStart/90 to-darkEnd/90 backdrop-blur-sm border-l border-darkGrey/20 shadow-lg'>
                    {collapsedMenuSaved === 'LivePositions' && <TradeHistory socket={socket} />}
                    {collapsedMenuSaved === 'SocialTrading' && (
                         <SocailTrading />
                    )}
                    {collapsedMenuSaved === 'Tournament' && <Tournament />}
                    {collapsedMenuSaved === 'Deposit' && <Desposit />}
               </div>
          </div>
     )
}

export default HistoryPanel