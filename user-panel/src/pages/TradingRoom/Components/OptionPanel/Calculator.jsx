import { useDispatch } from 'react-redux'
import { setAmount } from '../../../../redux/slices/tradingRoomSlices/tradeSlice'
import { setCollapsedMenu } from '../../../../redux/slices/tradingRoomSlices/tradingRoomSlice'
import { useSelector } from 'react-redux'
import CurrencyDisplay from '../../../../components/NumberFormat/NumberFormat'
import { setAmountIsMoreThanBalance } from '../../../../redux/slices/tradingRoomSlices/tradingRoomSlice'
import { playClick, playBeep } from '../../../../utils/sounds'

const Calculator = ({ closeCalc }) => {
     const dispatch = useDispatch()
     const { balance, userSettings } = useSelector(
          (store) => store.user
     )
     const { mode } = useSelector((store) => store.tradingRoom)

     const chooseAmount = (e, x) => {
          e.stopPropagation()
          userSettings.soundControl.notification && playClick()
          if (mode === 'real' && x > balance) {
               dispatch(setAmountIsMoreThanBalance())
               closeCalc()
               userSettings.soundControl.notification && playBeep()
               return
          }
          dispatch(setAmount({ amount: x }))
          closeCalc()
     }

     return (
          <div
               style={{ width: '184px', margin: '0 auto', textAlign: 'center' }}
               className='select-none text-gray-200'
          >
               <div className='grid w-full grid-cols-3 gap-1  p-1 text-center text-xs'>
                    <span
                         onClick={(e) => chooseAmount(e, 10)}
                         className='cursor-pointer bg-Navy p-2'
                    >
                         10$
                    </span>
                    <span
                         onClick={(e) => chooseAmount(e, 50)}
                         className='cursor-pointer bg-Navy p-2'
                    >
                         50$
                    </span>
                    <span
                         onClick={(e) => chooseAmount(e, 100)}
                         className='cursor-pointer bg-Navy p-2'
                    >
                         100$
                    </span>
                    <span
                         onClick={(e) => chooseAmount(e, 200)}
                         className='cursor-pointer bg-Navy p-2'
                    >
                         200$
                    </span>
                    <span
                         onClick={(e) => chooseAmount(e, 500)}
                         className='cursor-pointer bg-Navy p-2'
                    >
                         500$
                    </span>
                    <span
                         onClick={(e) => chooseAmount(e, 1000)}
                         className='cursor-pointer bg-Navy p-2'
                    >
                         1,000$
                    </span>
                    <span
                         onClick={(e) => chooseAmount(e, 2000)}
                         className='cursor-pointer bg-Navy p-2'
                    >
                         2,000$
                    </span>
                    <span
                         onClick={(e) => chooseAmount(e, 4000)}
                         className='cursor-pointer bg-Navy p-2'
                    >
                         4,000$
                    </span>
                    <span
                         onClick={(e) => chooseAmount(e, 6000)}
                         className='cursor-pointer bg-Navy p-2'
                    >
                         6,000$
                    </span>
                    <span
                         onClick={(e) => chooseAmount(e, 8000)}
                         className='cursor-pointer bg-Navy p-2'
                    >
                         8,000$
                    </span>
                    <span
                         onClick={(e) => chooseAmount(e, 10000)}
                         className='cursor-pointer bg-Navy p-2'
                    >
                         10,000$
                    </span>
                    <span
                         onClick={(e) => chooseAmount(e, 12000)}
                         className='cursor-pointer bg-Navy p-2'
                    >
                         12,000$
                    </span>
                    <span
                         onClick={(e) =>
                              chooseAmount(e, balance)
                         }
                         className='col-span-3 cursor-pointer bg-Navy p-2'
                    >
                         <span className='text-gray-400 mb-2'>
                              Available Balance
                         </span>
                         <CurrencyDisplay
                              className="text-green-100"
                              amount={balance}
                              currency='USD'
                              loading={false}
                         />
                    </span>
               </div>
          </div >
     )
}

export default Calculator
