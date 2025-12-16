import { useEffect } from 'react'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { useDispatch, useSelector } from 'react-redux'
import {
     setPayoutPercentage,
     setTimer,
} from '../../../../redux/slices/tradingRoomSlices/tradeSlice'

import AiOutlineMinus from '@mui/icons-material/Remove'
import AiOutlinePlus from '@mui/icons-material/Add'
import { formatTime } from '../../../../utils/timeAgo'
import { playClick, playBeep } from '../../../../utils/sounds'

const TimeDisplay = () => {
     const dispatch = useDispatch()
     const { timer } = useSelector((store) => store.trade)
     const { userSettings } = useSelector((store) => store.user)
     const { activeTicker } = useSelector((store) => store.ticker)

     const MIN_SEC = 5
     const MAX_SEC = 4 * 60 * 60

     /**
      * Adjusts seconds by a step (+/-1, +/-60, +/-3600), clamped to [5, 14400].
      * @param {number} current - current seconds value
      * @param {number} step - one of -3600, -60, -1, 1, 60, 3600
      * @returns {{seconds:number, hhmmss:string}}
      */
     function adjustSeconds(step) {
          const allowed = new Set([-3600, -60, -1, 1, 60, 3600])
          if (!Number.isFinite(timer)) {
               playBeep()
               return
          }
          if (!allowed.has(step)) {
               playBeep()
               return
          }
          userSettings.soundControl.notification && playClick()
          let next = timer + step
          if (next < MIN_SEC) {
               next = MIN_SEC
               playBeep()
          }
          if (next > MAX_SEC) {
               next = MAX_SEC
               playBeep()
          }
          dispatch(setTimer({ timer: next }))
     }


     useEffect(() => {
          dispatch(
               setTimer({
                    timer,
               })
          )
          dispatch(
               setPayoutPercentage({
                    payOutPercentage:
                         timer > 599
                              ? activeTicker.payoutPercentage - 6
                              : activeTicker.payoutPercentage,
               })
          )
     }, [timer])
     return (
          <div className='flex flex-col items-center justify-center'>
               <div className='bg-LightNavy p-2 w-full text-sm font-semibold text-center text-lightGrey'>
                    Expiration Time
                    <AccessTimeIcon className='mx-1 text-[16px]' />
               </div>
               <div className='flex flex-col justify-center text-sm pt-2 pb-4   '>
                    <div className='flex  justify-center items-center p-4 mt-2'>
                         <div className='flex flex-col justify-center items-center '>
                              <div className='flex items-center relative w-[120px]'>
                                   <button
                                        onClick={() => adjustSeconds(1)}
                                        className={`absolute right-3 -top-6 z-10 flex  items-center justify-center bg-Navy `}
                                   >
                                        <AiOutlinePlus className='h-[22px] w-[26px] text-xl text-menuTxt hover:text-greentxt' />
                                   </button>
                                   <button
                                        onClick={() => adjustSeconds(60)}
                                        className={`absolute right-[51px] -top-6 z-10 flex  items-center justify-center bg-Navy `}
                                   >
                                        <AiOutlinePlus className='h-[22px] w-[26px] text-xl text-menuTxt hover:text-greentxt' />
                                   </button>
                                   <button
                                        onClick={() => adjustSeconds(60 * 60)}
                                        className={`absolute right-[90px] -top-6 z-10 flex  items-center justify-center bg-Navy `}
                                   >
                                        <AiOutlinePlus className='h-[22px] w-[26px] text-xl text-menuTxt hover:text-greentxt' />
                                   </button>
                              </div>
                              <span className='text-lg font-semibold text-gray-300  flex justify-center'>
                                   {formatTime(timer)}
                              </span>
                              <div className='flex items-center relative w-[120px]'>
                                   <button
                                        onClick={() => adjustSeconds(-1)}
                                        className={`absolute right-3 -bottom-6 z-10 flex  items-center justify-center bg-Navy `}
                                   >
                                        <AiOutlineMinus className='h-[22px] w-[26px] text-xl text-menuTxt hover:text-googleRed' />
                                   </button>
                                   <button
                                        onClick={() => adjustSeconds(-60)}
                                        className={`absolute right-[51px] -bottom-6 z-10 flex  items-center justify-center bg-Navy `}
                                   >
                                        <AiOutlineMinus className='h-[22px] w-[26px] text-xl text-menuTxt hover:text-googleRed' />
                                   </button>
                                   <button
                                        onClick={() => adjustSeconds(-3600)}
                                        className={`absolute right-[90px] -bottom-6 z-10 flex  items-center justify-center bg-Navy`}
                                   >
                                        <AiOutlineMinus className='h-[22px] w-[26px] text-xl text-menuTxt hover:text-googleRed' />
                                   </button>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     )
}
export default TimeDisplay
