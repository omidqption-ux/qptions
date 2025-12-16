import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import RealTimeChart from './Components/RealTimeChart/AmChart'
import RightDrawer from './Components/RightDrawer'
import HistoryPanel from './Components/HistoryPanel/HistoryPanel'
import { Box } from '@mui/material'
import useDeviceOrientation from '../../hooks/useDeviceOrientation'
import RotationMessage from './Components/RotationMessage'

const TradingRoom = ({ socket }) => {
     const { mode, userId } = useSelector((store) => store.tradingRoom)
     const [isHistoryOpen, setIsHistoryOpen] = useState(false)
     const { isLandscape, isMobile, isPortrait } = useDeviceOrientation()
     const { fetchLoading } = useSelector((store) => store.trade)

     // Add screen size check
     const isSmallMobile = window.innerWidth < 400

     useEffect(() => {
          const handleResize = () => {
               // Force chart redraw with valid dimensions
               if (window.innerWidth < 900) {
                    // Small delay to ensure dimensions are updated
                    setTimeout(() => {
                         window.dispatchEvent(new Event('resize'))
                    }, 100)
               }
          }
          window.addEventListener('resize', handleResize)
          window.addEventListener('orientationchange', handleResize)
          return () => {
               window.removeEventListener('resize', handleResize)
               window.removeEventListener('orientationchange', handleResize)
          }
     }, [])

     return (
          <Box
               sx={{
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    '@media (maxWidth: 900px)': {
                         height: '100%',
                         minHeight: '100vh',
                    },
               }}
          >
               {/* Show rotation message on mobile portrait mode */}
               {isMobile && isPortrait && <RotationMessage />}

               <div
                    className='w-full h-[calc(100vh-70px)] transition-all duration-300 bg-gradient-to-br from-darkStart via-darkMid to-darkEnd relative'
                    style={{
                         '@media (maxWidth: 900px)': {
                              height: isLandscape ? '100vh' : '100%',
                              minHeight: isLandscape ? '100vh' : '100%',
                         },
                    }}
               >
                    <div
                         className='flex h-full'
                         style={{
                              '@media (maxWidth: 900px)': {
                                   flexDirection: isLandscape
                                        ? 'row'
                                        : 'column',
                              },
                         }}
                    >
                         <div
                              className={`flex-1 transition-all duration-300 ${isHistoryOpen ? 'lg:mr-[300px]' : ''
                                   }`}
                              style={{
                                   '@media (maxWidth: 900px)': {
                                        marginRight: isHistoryOpen
                                             ? '200px'
                                             : '0',
                                        width: isLandscape
                                             ? isSmallMobile
                                                  ? '100%'
                                                  : '50%'
                                             : '100%',
                                        minWidth: isLandscape
                                             ? isSmallMobile
                                                  ? '100%'
                                                  : '50%'
                                             : '100%',
                                   },
                              }}
                         >
                              <div
                                   className='flex justify-between items-start h-full w-full relative overflow-hidden  bg-darkStart'
                                   style={{
                                        minHeight: '100%',
                                        minWidth: '100%',
                                   }}
                              >
                                   {socket && (
                                        <>
                                             <RealTimeChart socket={socket} />
                                             {!fetchLoading && (
                                                  <RightDrawer socket={socket} />
                                             )}
                                        </>
                                   )}
                              </div>
                         </div>
                         <HistoryPanel
                              socket={socket}
                              userId={userId}
                              mode={mode}
                              onToggle={(isOpen) => setIsHistoryOpen(isOpen)}
                              sx={{
                                   '@media (maxWidth: 900px)': {
                                        width: isHistoryOpen ? '200px' : '0',
                                        position: isLandscape
                                             ? 'relative'
                                             : 'absolute',
                                        right: isLandscape ? '0' : '0',
                                        display:
                                             isSmallMobile && isLandscape
                                                  ? 'none'
                                                  : 'block',
                                   },
                              }}
                         />
                    </div>
               </div>
          </Box>
     )
}
export default TradingRoom
