import { useDispatch } from 'react-redux'
import { setCollapsedMenu } from '../../../../redux/slices/tradingRoomSlices/tradingRoomSlice'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
const BottomTradesHistory = ({ drawerWidth, sideDraweropen }) => {
     const dispatch = useDispatch()
     const setCollapsedMenuF = (e, v) => {
          dispatch(setCollapsedMenu(v))
          e.stopPropagation()
     }
     return (
          <div
               className={`h-[24px] overflow-hidden absolute bottom-0 left-0 z-50 `}
          >
               <Box
                    style={{
                         marginLeft:
                              window.innerWidth >= 886
                                   ? sideDraweropen
                                        ? `${drawerWidth}px`
                                        : '75px'
                                   : sideDraweropen
                                   ? `${drawerWidth}px`
                                   : '0px',
                    }}
                    className='flex items-center w-[250px] h-full bg-darkStart
               rounded-tl-2xl rounded-tr-2xl cursor-pointer
               transition-transform duration-150
               hover:scale-105 active:scale-95'
               >
                    <Tab
                         onClick={(e) => setCollapsedMenuF(e, 'LivePositions')}
                         label='Live Trades'
                         className='text-xs text-offWhite'
                    />
               </Box>
          </div>
     )
}
export default BottomTradesHistory
