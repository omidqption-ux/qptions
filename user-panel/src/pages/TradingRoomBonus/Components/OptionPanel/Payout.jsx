import { useEffect } from 'react'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import CurrencyDisplay from '../../../../components/NumberFormat/NumberFormat'
import { useSelector, useDispatch } from 'react-redux'
import {
     setPayoutPercentage,
} from '../../../../redux/slices/tradingRoomSlices/tradeSlice'
const Payout = () => {
     const dispatch = useDispatch()
     const { amount } = useSelector((store) => store.trade)
     const { activeTickerBonus } = useSelector((store) => store.ticker)
     const { payOutPercentage, timer } = useSelector((store) => store.trade)
     useEffect(() => {
          const next = Number(activeTickerBonus?.payoutPercentage ?? 0);
          // don't dispatch if unchanged
          if (next !== payOutPercentage) {
               dispatch(setPayoutPercentage({ payOutPercentage: next }));
          }
          if (timer > 599) {
               dispatch(setPayoutPercentage({
                    payOutPercentage:
                         activeTickerBonus.payoutPercentage - 6
               }))
          }
     }, [activeTickerBonus, timer]);
     return (
          <div className='w-full px-1' >
               <div className='items-center gap-1 lg:flex hidden'>
                    <span className={`text-xs font-semibold text-blue-200`}>
                         PayOut
                    </span>
                    <HelpOutlineRoundedIcon className='w-[16px]' />
               </div>
               <div
                    className={` w-full flex-col font-semibold text-xs  justify-between items-start `}
               >
                    <div
                         className={`flex justify-between mx-1 text-blue-300 text-xs font-semibold relative`}
                    >
                         <CurrencyDisplay
                              amount={
                                   Number(amount) +
                                   Number(
                                        (
                                             Number(amount * (payOutPercentage)) /
                                             100
                                        ).toFixed(2)
                                   )
                              }
                              currency={'USD'}
                              loading={false}
                         />
                    </div>
               </div >
          </div>
     )
}
export default Payout
