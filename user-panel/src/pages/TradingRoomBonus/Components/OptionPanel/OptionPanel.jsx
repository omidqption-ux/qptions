import { useEffect, useState, useCallback, useRef } from 'react'
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
import { resetActiveTickerBonus } from '../../../../redux/slices/tradingRoomSlices/tickerSlice'
import '../styles.css'
import { toast } from 'react-toastify'
import {
     playClick,
     playBeep,
     playLose,
     playWin,
} from '../../../../utils/sounds'

const OptionPanel = ({ socket }) => {
     const dispatch = useDispatch()
     const changeHover = (x) => {
          dispatch(setHover({ hover: x }))
     }
     const { amount, payOutPercentage, timer, now, fetchLoading } = useSelector((store) => store.trade)
     const { chartData } = useSelector((store) => store.chart)
     const { activeTickerBonus: activeTicker } = useSelector((store) => store.ticker)
     const { bonusBalance, userSettings } = useSelector((store) => store.user)
     const { mode } = useSelector((store) => store.tradingRoom)
     const [isActiveBuy, setActiveBuy] = useState(true)
     const [isActiveSell, setActiveSell] = useState(true)
     const [isMarketActive, setIsMarketActive] = useState(true)
     const [willMarketActive, setWillMarketActive] = useState(true)


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
               if (amount > bonusBalance) {
                    dispatch(setAmountIsMoreThanBalance())
                    userSettings.soundControl.notification && playBeep()
                    return
               }
               userSettings.soundControl.notification && playClick()
               if (BuyOrSell === 'BUY') setActiveBuy(false)
               else setActiveSell(false)
               socket.emit('openTrade', {
                    buyOrSell: BuyOrSell,
                    closeTime: Math.floor(now / 1000) + timer,
                    openTime: Math.floor(now / 1000),
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
               dispatch(resetActiveTickerBonus())
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
          socket.onerror = () => {
               socket.disconnect('tradeResult')
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
          amount,
     ])
     const handleEnterBuy = (e) => {
          if (e.pointerType === 'mouse') changeHover('BUY')
     }
     const handleEnterSell = (e) => {
          if (e.pointerType === 'mouse') changeHover('SELL')
     }

     const handleLeave = (e) => {
          if (e.pointerType === 'mouse') changeHover(null)
     }

     /** Always clear when the user taps and lifts a finger */
     const handleTouchEnd = () => changeHover(null)

     return (
          <div className='flex w-full px-1'>
               <div className='flex w-full flex-col items-center justify-center gap-3'>
                    <Button
                         onClick={() => isActiveSell && isActiveBuy && !fetchLoading && openTradeFunction('BUY')}
                         onPointerEnter={handleEnterBuy}
                         onPointerLeave={handleLeave}
                         onPointerDown={() => changeHover('BUY')} // visual feedback while pressing
                         onPointerUp={handleTouchEnd} // clear on lift
                         className={`${!isActiveBuy
                              ? 'scale-110 cursor-none'
                              : 'hover:scale-105'
                              } transition-all duration-300 transform group flex h-[36px] lg:h-[40px] w-full items-center justify-center space-x-2 bg-gradient-to-r from-Green/90 to-Green/70 shadow-lg hover:shadow-Green/20 font-semibold text-green-100 rounded-lg`}
                    >
                         <div className='flex flex-col gap-1 mt-2' >
                              <sub className='group-hover:scale-110 duration-500' >{payOutPercentage}%</sub>
                              <KeyboardDoubleArrowUpIcon
                                   fontSize='small'
                                   className={`transition-transform group-hover:rotate-45 duration-300 mr-2 w-4 ${!isActiveBuy && 'rotate-45'
                                        }`}
                              />
                         </div>
                         <span className='text-xs lg:text-sm font-light lg:font-medium'>Buy</span>
                    </Button>
                    <Button
                         onClick={() =>
                              isActiveSell && isActiveBuy && !fetchLoading && openTradeFunction('SELL')
                         }
                         onPointerEnter={handleEnterSell}
                         onPointerLeave={handleLeave}
                         onPointerDown={() => changeHover('SELL')} // visual feedback while pressing
                         onPointerUp={handleTouchEnd}
                         className={`${!isActiveSell
                              ? 'scale-110 cursor-none'
                              : 'hover:scale-105'
                              } transition-all duration-300 transform group flex h-[36px] lg:h-[40px] w-full items-center justify-center space-x-2 bg-googleRed hover:bg-[#ff3333] shadow-lg hover:shadow-[#ff4444]/30 font-semibold text-red-100 rounded-lg`}
                    >
                         <div className='flex flex-col-reverse mb-2' >
                              <sub className='group-hover:scale-110 duration-500' >{payOutPercentage}%</sub>
                              <KeyboardDoubleArrowDownIcon
                                   fontSize='small'
                                   className={`transition-transform group-hover:-rotate-45 duration-300 mr-2 w-4 ${!isActiveSell && '-rotate-45'
                                        }`}
                              />
                         </div>
                         <span className='text-xs lg:text-sm font-light lg:font-medium'>Sell</span>
                    </Button>
               </div>
          </div>
     )
}
export default OptionPanel
