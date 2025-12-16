import { useEffect, useState } from 'react'
import { formatSeconds } from '../../../../utils/timeAgo'
import { useDispatch } from 'react-redux'
import { resetDeposit } from '../../../../redux/slices/depositSlice'
const DepositCounter = ({ setActiveStep, closeDepositPanel }) => {
     const dispatch = useDispatch()
     const [counter, setCounter] = useState(15 * 60)
     useEffect(() => {
          const interval = setInterval(() => {
               setCounter(counter - 1)
          }, 1000)
          if (!counter) {
               dispatch(resetDeposit())
               clearInterval(interval)
               setActiveStep(0)
               closeDepositPanel()
          }
          return () => clearInterval(interval)
     }, [counter])
     return (
          <span
               className={`${
                    counter < 60 ? 'text-googleRed' : 'text-menutxt'
               } w-[45px]`}
          >
               {formatSeconds(counter)}
          </span>
     )
}
export default DepositCounter
