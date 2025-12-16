import { useEffect, useState } from 'react'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { useDispatch } from 'react-redux'
import {
     setCounter,
     setExpirationTime,
     setPayoutPercentage,
} from '../../../../redux/slices/tradingRoomSlices/tradeSlice'
import {
     cryptoSymbols,
     forexSymbols,
} from '../../../../redux/slices/tradingRoomSlices/symbols'
import { formatTimeFromSeconds } from '../../../../utils/timeAgo'
const TimeDisplay = ({ handleClose, pair }) => {
     const [timer, setTimer] = useState(0) /// /tp update times each 30 secs
     const [timesAndRemainings, setTimesAndRemainings] = useState([
          { time: 0, unix: 0 },
          { time: 0, unix: 0 },
          { time: 0, unix: 0 },
          { time: 0, unix: 0 },
          { time: 0, unix: 0 },
          { time: 0, unix: 0 },
          { time: 0, unix: 0 },
          { time: 0, unix: 0 },
          { time: 0, unix: 0 },
          { time: 0, unix: 0 },
     ]) /// /tp update times each 30 secs
     useEffect(() => {
          const interval = setInterval(() => {
               setTimer((prev) => prev + 1)
          }, 1000)

          if (timer % 30 === 0) {
               createTimesAndRemainings()
          }

          return () => {
               clearInterval(interval)
          }
     }, [timer])

     const createTimesAndRemainings = () => {
          setTimesAndRemainings([
               {
                    time: unixToTime(Date.now() + 60000),
                    unix: Date.now() + 60000,
               },
               {
                    time: unixToTime(Date.now() + 2 * 60000),
                    unix: Date.now() + 2 * 60000,
               },
               {
                    time: unixToTime(Date.now() + 3 * 60000),
                    unix: Date.now() + 3 * 60000,
               },
               {
                    time: unixToTime(Date.now() + 4 * 60000),
                    unix: Date.now() + 4 * 60000,
               },
               {
                    time: unixToTime(Date.now() + 5 * 60000),
                    unix: Date.now() + 5 * 60000,
               },
               {
                    time: unixToTime(Date.now() + 10 * 60000),
                    unix: Date.now() + 10 * 60000,
               },
               {
                    time: unixToTime(Date.now() + 15 * 60000),
                    unix: Date.now() + 15 * 60000,
               },
               {
                    time: unixToTime(Date.now() + 20 * 60000),
                    unix: Date.now() + 20 * 60000,
               },
               {
                    time: unixToTime(Date.now() + 25 * 60000),
                    unix: Date.now() + 25 * 60000,
               },
               {
                    time: unixToTime(Date.now() + 30 * 60000),
                    unix: Date.now() + 30 * 60000,
               },
          ])
     }
     const dispatch = useDispatch()
     const payOutPercentage = [...cryptoSymbols, ...forexSymbols].find(
          (s) => s.title === pair
     )?.payoutPercentage

     const setExpirationTimeAndPayout = (time, remaining) => {
          dispatch(setExpirationTime({ timer }))
          dispatch(setCounter({ counter: remaining - 30 }))
          dispatch(
               setPayoutPercentage({
                    payOutPercentage:
                         remaining < 301
                              ? payOutPercentage
                              : payOutPercentage - 2,
               })
          )
          handleClose()
     }
     const unixToTime = (x) => {
          const time = new Date(x)
          return (
               String(time.getHours()).padStart(2, '0') +
               ':' +
               String(time.getMinutes()).padStart(2, '0') +
               ':' +
               String(time.getSeconds()).padStart(2, '0')
          )
     }

     return (
          <div className='flex flex-col items-center justify-center p-0'>
               <div className='bg-LightNavy py-2 w-full text-sm font-semibold text-center text-lightGrey'>
                    Expiration Time
               </div>
               <div
                    style={{
                         display: 'flex',
                         justifyContent: 'center',
                         gap: '20px',
                         margin: '20px',
                    }}
               >
                    <div>
                         <div className='flex justify-center text-sm'>
                              <span className='text-menuTxt'>Profit</span>
                              <span className='text-menuTxt bg-Green px-2 rounded-md flex justify-center mx-2'>
                                   {payOutPercentage}%
                              </span>
                         </div>
                         <div className='grid grid-cols-2 gap-1 text-lightGrey text-xs mt-5'>
                              <span>Time</span>
                              <span>Remaining</span>
                         </div>
                         <div className='grid grid-cols-2 gap-4 mt-2 '>
                              <span
                                   onClick={() =>
                                        setExpirationTimeAndPayout(
                                             timesAndRemainings[0].unix,
                                             60 - (timer % 30)
                                        )
                                   }
                                   className='text-menuTxt text-sm hover:underline cursor-pointer'
                              >
                                   {timesAndRemainings[0].time}
                              </span>
                              <span className='text-darkGrey text-xs text-center flex items-center'>
                                   <AccessTimeIcon fontSize='small' />
                                   {formatTimeFromSeconds(60 - (timer % 30))}
                              </span>
                         </div>
                         <div className='grid grid-cols-2 gap-4 mt-2 '>
                              <span
                                   onClick={() =>
                                        setExpirationTimeAndPayout(
                                             timesAndRemainings[1].unix,
                                             120 - (timer % 30)
                                        )
                                   }
                                   className='text-menuTxt text-sm hover:underline cursor-pointer'
                              >
                                   {timesAndRemainings[1].time}
                              </span>
                              <span className='text-darkGrey text-xs text-center flex items-center'>
                                   <AccessTimeIcon fontSize='small' />
                                   {formatTimeFromSeconds(120 - (timer % 30))}
                              </span>
                         </div>
                         <div className='grid grid-cols-2 gap-4 mt-2 '>
                              <span
                                   onClick={() =>
                                        setExpirationTimeAndPayout(
                                             timesAndRemainings[2].unix,
                                             180 - (timer % 30)
                                        )
                                   }
                                   className='text-menuTxt text-sm hover:underline cursor-pointer'
                              >
                                   {timesAndRemainings[2].time}
                              </span>
                              <span className='text-darkGrey text-xs text-center flex items-center'>
                                   <AccessTimeIcon fontSize='small' />
                                   {formatTimeFromSeconds(180 - (timer % 30))}
                              </span>
                         </div>
                         <div className='grid grid-cols-2 gap-4 mt-2 '>
                              <span
                                   onClick={() =>
                                        setExpirationTimeAndPayout(
                                             timesAndRemainings[3].unix,
                                             240 - (timer % 30)
                                        )
                                   }
                                   className='text-menuTxt text-sm hover:underline cursor-pointer'
                              >
                                   {timesAndRemainings[3].time}
                              </span>
                              <span className='text-darkGrey text-xs text-center flex items-center'>
                                   <AccessTimeIcon fontSize='small' />
                                   {formatTimeFromSeconds(240 - (timer % 30))}
                              </span>
                         </div>
                         <div className='grid grid-cols-2 gap-4 mt-2 '>
                              <span
                                   onClick={() =>
                                        setExpirationTimeAndPayout(
                                             timesAndRemainings[4].unix,
                                             300 - (timer % 30)
                                        )
                                   }
                                   className='text-menuTxt text-sm hover:underline cursor-pointer'
                              >
                                   {timesAndRemainings[4].time}
                              </span>
                              <span className='text-darkGrey text-xs text-center flex items-center'>
                                   <AccessTimeIcon fontSize='small' />
                                   {formatTimeFromSeconds(300 - (timer % 30))}
                              </span>
                         </div>
                    </div>
                    <div>
                         <div className='flex justify-center text-sm'>
                              <span className='text-menuTxt'>Profit</span>
                              <span className='text-menuTxt bg-Green px-2 rounded-md flex justify-center mx-2'>
                                   {payOutPercentage - 2}%
                              </span>
                         </div>
                         <div className='grid grid-cols-2 gap-1 text-lightGrey text-xs mt-5'>
                              <span>Time</span>
                              <span>Remaining</span>
                         </div>
                         <div className='grid grid-cols-2 gap-4 mt-2 '>
                              <span
                                   onClick={() =>
                                        setExpirationTimeAndPayout(
                                             timesAndRemainings[5].unix,
                                             600 - (timer % 30)
                                        )
                                   }
                                   className='text-menuTxt text-sm hover:underline cursor-pointer'
                              >
                                   {timesAndRemainings[5].time}
                              </span>
                              <span className='text-darkGrey text-xs text-center flex items-center'>
                                   <AccessTimeIcon fontSize='small' />
                                   {formatTimeFromSeconds(600 - (timer % 30))}
                              </span>
                         </div>
                         <div className='grid grid-cols-2 gap-4 mt-2 '>
                              <span
                                   onClick={() =>
                                        setExpirationTimeAndPayout(
                                             timesAndRemainings[6].unix,
                                             900 - (timer % 30)
                                        )
                                   }
                                   className='text-menuTxt text-sm hover:underline cursor-pointer'
                              >
                                   {timesAndRemainings[6].time}
                              </span>
                              <span className='text-darkGrey text-xs text-center flex items-center'>
                                   <AccessTimeIcon fontSize='small' />
                                   {formatTimeFromSeconds(900 - (timer % 30))}
                              </span>
                         </div>
                         <div className='grid grid-cols-2 gap-4 mt-2 '>
                              <span
                                   onClick={() =>
                                        setExpirationTimeAndPayout(
                                             timesAndRemainings[7].unix,
                                             1200 - (timer % 30)
                                        )
                                   }
                                   className='text-menuTxt text-sm hover:underline cursor-pointer'
                              >
                                   {timesAndRemainings[7].time}
                              </span>
                              <span className='text-darkGrey text-xs text-center flex items-center'>
                                   <AccessTimeIcon fontSize='small' />
                                   {formatTimeFromSeconds(1200 - (timer % 30))}
                              </span>
                         </div>
                         <div className='grid grid-cols-2 gap-4 mt-2 '>
                              <span
                                   onClick={() =>
                                        setExpirationTimeAndPayout(
                                             timesAndRemainings[8].unix,
                                             1500 - (timer % 30)
                                        )
                                   }
                                   className='text-menuTxt text-sm hover:underline cursor-pointer'
                              >
                                   {timesAndRemainings[8].time}
                              </span>
                              <span className='text-darkGrey text-xs text-center flex items-center'>
                                   <AccessTimeIcon fontSize='small' />
                                   {formatTimeFromSeconds(1500 - (timer % 30))}
                              </span>
                         </div>
                         <div className='grid grid-cols-2 gap-4 mt-2 '>
                              <span
                                   onClick={() =>
                                        setExpirationTimeAndPayout(
                                             timesAndRemainings[9].unix,
                                             1800 - (timer % 30)
                                        )
                                   }
                                   className='text-menuTxt text-sm hover:underline cursor-pointer'
                              >
                                   {timesAndRemainings[9].time}
                              </span>
                              <span className='text-darkGrey text-xs text-center flex items-center'>
                                   <AccessTimeIcon fontSize='small' />
                                   {formatTimeFromSeconds(1800 - (timer % 30))}
                              </span>
                         </div>
                    </div>
               </div>
          </div>
     )
}

export default TimeDisplay
