import { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import { useDispatch, useSelector } from 'react-redux'
import {
     chnageAmountIzZero,
     openTrade,
     closeTrade,
     setHover,
} from '../../../../redux/slices/tradingRoomSlices/tradeSlice'
import {
     setAmountIsMoreThanBalance,
} from '../../../../redux/slices/tradingRoomSlices/tradingRoomSlice'
import { resetActiveTickerDemo } from '../../../../redux/slices/tradingRoomSlices/tickerSlice'
import '../styles.css'
import { toast } from 'react-toastify'
import {
     playClick,
     playBeep,
     playLose,
     playWin,
} from '../../../../utils/sounds'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import ZoomOutMapRoundedIcon from '@mui/icons-material/ZoomOutMapRounded'
import ZoomInMapRoundedIcon from '@mui/icons-material/ZoomInMapRounded'
import axiosInstance from '../../../../network/axios'
import { setUserSettings } from '../../../../redux/slices/userSlice'


const OptionPanel = ({ socket }) => {
     const dispatch = useDispatch()
     const changeHover = (x) => {
          dispatch(setHover({ hover: x }))
     }
     const { amount, payOutPercentage, timer, fetchLoading } = useSelector((store) => store.trade)
     const { activeTickerDemo: activeTicker } = useSelector((store) => store.ticker)
     const { chartData } = useSelector((store) => store.chart)
     const { demoBalance, userSettings } = useSelector((store) => store.user)
     const { mode } = useSelector((store) => store.tradingRoom)
     const [isActiveBuy, setActiveBuy] = useState(true)
     const [isActiveSell, setActiveSell] = useState(true)
     const [isMarketActive, setIsMarketActive] = useState(true)
     const [willMarketActive, setWillMarketActive] = useState(true)
     const [isFullScreen, setisFullScreen] = useState(false)
     const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
     const openTradeFunction = async (BuyOrSell) => {
          try {
               if (!isMarketActive || !willMarketActive) {
                    userSettings.soundControl.notification && playBeep()
                    toast("Forex market will be closed soon. No more trades", { type: 'error' })
                    return
               }
               if (amount === 0) {
                    dispatch(chnageAmountIzZero({ amountIsZero: true }))
                    userSettings.soundControl.notification && playBeep()
                    return
               }
               if (amount > demoBalance) {
                    dispatch(setAmountIsMoreThanBalance())
                    userSettings.soundControl.notification && playBeep()
                    return
               }
               userSettings.soundControl.notification && playClick()
               if (BuyOrSell === 'BUY') setActiveBuy(false)
               else setActiveSell(false)
               socket.emit('openTrade', {
                    buyOrSell: BuyOrSell,
                    closeTime: Math.floor(chartData[chartData.length - 1].time / 1000) + timer,
                    openTime: Math.floor(chartData[chartData.length - 1].time / 1000),
                    amount,
                    mode,
                    pair: activeTicker.symbol,
                    initialPrice: chartData[chartData.length - 1].value,
                    percentage: payOutPercentage,
               })
               setTimeout(() => {
                    setActiveSell(true)
                    setActiveBuy(true)
               }, 1000)
          } catch (err) {
               setActiveSell(true)
               setActiveBuy(true)
               toast.error(err.response.data.message)
          }
     }

     useEffect(() => {
          socket.on('market:closingSoon', ({ minutesLeft, closesAt, earlyClose }) => {
               toast("closing soon.", { type: 'error' })
               setIsMarketActive(false)
               setWillMarketActive(false)
          })
          socket.on('market:closed', () => {
               toast("Forex market is closed right now, so we've switched you to crypto.", { type: 'error' })
               dispatch(resetActiveTickerDemo())
               setIsMarketActive(false)
          })
          socket.emit('joinTradeOpenAndCloseResult', { pair: activeTicker.symbol })
     }, [socket, activeTicker.symbol])



     useEffect(() => {
          socket.on('tradeResult', (message) => {
               if (message.pair !== activeTicker.symbol) return
               dispatch(
                    closeTrade({
                         closeTime: message.closeTime,
                         openTime: message.openTime,
                         finalPrice: message.finalPrice,
                         isWin: message.isWin,
                         winAmount: message.winAmount,
                         tradeIndex: message.tradeIndex,
                    })
               )
               userSettings.soundControl.notification &&
                    message.isWin &&
                    playWin()
               userSettings.soundControl.notification &&
                    !message.isWin &&
                    playLose()
          })
          socket.on('tradeOpened', (data) => {
               if (data.pair !== activeTicker.symbol) return
               dispatch(
                    openTrade({
                         amount,
                         BuyOrSell: data.buyOrSell,
                         isWin: false,
                         status: 'open',
                         openTime: data.openTime,
                         closeTime: data.closeTime,
                         counter: data.closeTime - data.openTime,
                         price: Number(data.price),
                         tradeIndex: data.tradeIndex,
                    })
               )
          })
          socket.onerror = (e) => {
               console.warn('socket.onerror', e)
          }
          socket.on('tradeError', (error) => {
               toast.error(error.message)
          })

          return () => {
               socket.off('tradeResult')
               socket.off('tradeOpened')
               socket.off('tradeError')
               socket.off('redirectToRoot')
          }
     }, [
          activeTicker.symbol,
          amount
     ])

     const toggleSoundSettings = async () => {
          try {
               const response = await axiosInstance.put(
                    '/users/userSoundSettings',
                    {
                         ...userSettings.soundControl,
                         notification: !userSettings.soundControl.notification,
                    }
               )
               dispatch(
                    setUserSettings({
                         ...userSettings,
                         soundControl: response.soundControl,
                    })
               )
          } catch (e) { }
     }
     const toggleFullScreen = () => {
          userSettings?.soundControl?.notification && playClick()

          if (isMobile) {
               // optionally just ignore or show a toast instead of alert
               return
          }

          if (!document.fullscreenElement) {
               document.documentElement.requestFullscreen().catch((err) => {
                    console.error('Fullscreen error', err)
               })
               setisFullScreen(true)
          } else {
               document.exitFullscreen()
               setisFullScreen(false)
          }
     }
     const handleMouseEnterBuy = () => changeHover('BUY')
     const handleMouseLeaveBuy = () => changeHover(null)

     const handleMouseEnterSell = () => changeHover('SELL')
     const handleMouseLeaveSell = () => changeHover(null)

     const handleTouchStartBuy = () => changeHover('BUY')
     const handleTouchEndBuy = () => changeHover(null)

     const handleTouchStartSell = () => changeHover('SELL')
     const handleTouchEndSell = () => changeHover(null)
     return (
          <div className='flex w-full px-1'>
               <div className='flex w-full flex-col items-center justify-center gap-3'>
                    <Button
                         onClick={() => isActiveSell && isActiveBuy && !fetchLoading && openTradeFunction('BUY')}
                         onMouseEnter={handleMouseEnterBuy}
                         onMouseLeave={handleMouseLeaveBuy}
                         onTouchStart={handleTouchStartBuy}
                         onTouchEnd={handleTouchEndBuy}
                         className={`${!isActiveBuy
                              ? 'scale-110 cursor-none'
                              : 'hover:scale-105'
                              } transition-all duration-300 transform group flex h-[36px] lg:h-[40px] w-full items-center justify-center space-x-2 bg-gradient-to-l font-normal from-green-500 to-green-800  text-green-100 rounded-lg`}
                    >
                         <div className='flex flex-col gap-1 mt-2' >
                              <sub className='group-hover:scale-110 duration-500' >{payOutPercentage}%</sub>
                              <KeyboardDoubleArrowUpIcon
                                   fontSize='small'
                                   className={`transition-transform group-hover:rotate-45 duration-300 mr-2 w-4 `}
                              />
                         </div>
                         <span className='text-xs lg:text-sm font-light lg:font-medium'>Buy</span>
                    </Button>
                    <Button
                         onClick={() =>
                              isActiveSell && isActiveBuy && !fetchLoading && openTradeFunction('SELL')
                         }
                         onMouseEnter={handleMouseEnterSell}
                         onMouseLeave={handleMouseLeaveSell}
                         onTouchStart={handleTouchStartSell}
                         onTouchEnd={handleTouchEndSell}
                         className={`${!isActiveSell
                              ? 'scale-110 cursor-none'
                              : 'hover:scale-105'
                              } transition-all duration-300 transform group flex h-[36px] lg:h-[40px] w-full items-center justify-center space-x-2 bg-gradient-to-l font-normal from-red-500 to-red-800  text-red-100 rounded-lg`}
                    >
                         <div className='flex flex-col-reverse mb-2' >
                              <sub className='group-hover:scale-110 duration-500' >{payOutPercentage}%</sub>
                              <KeyboardDoubleArrowDownIcon
                                   fontSize='small'
                                   className={`transition-transform group-hover:-rotate-45 duration-300 mr-2 w-4 `}
                              />
                         </div>
                         <span className='text-xs lg:text-sm font-light lg:font-medium'>Sell</span>
                    </Button>
                    <div className='w-full bg-transparent flex mb-5 justify-around lg:hidden mt-2' >
                         <button
                              onClick={toggleSoundSettings}
                              className='flex flex-col items-center justify-center p-1 bg-slate-800 text-gray-400 text-xs group '>
                              {userSettings.soundControl.notification ? (
                                   <VolumeUpIcon className="transition-colors group-hover:text-LightGray text-xs" />
                              ) : (
                                   <VolumeOffIcon className="transition-colors group-hover:text-LightGray text-xs" />
                              )}
                         </button>
                         <button
                              onClick={toggleFullScreen}
                              className='flex flex-col items-center justify-center p-1 bg-slate-800   text-gray-400 text-xs group'
                         >
                              {isFullScreen ? (
                                   <ZoomInMapRoundedIcon className="transition-colors group-hover:text-LightGray text-xs" />
                              ) : (
                                   <ZoomOutMapRoundedIcon className="transition-colors group-hover:text-LightGray text-xs" />
                              )}
                         </button>
                    </div>
               </div>
          </div>
     )
}
export default OptionPanel
