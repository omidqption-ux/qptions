import { useEffect, useState } from 'react'
import { formatSecondsToMinutes } from '../../utils/formatSecsToMins'
const Counter = ({ expirOtp }) => {
     const [counter, setCounter] = useState(120)
     useEffect(() => {
          let interval
          if (counter > 0) {
               interval = setInterval(() => {
                    setCounter((prev) => prev - 1)
               }, 1000)
          } else {
               expirOtp()
               clearInterval(interval)
          }
          return () => clearInterval(interval)
     }, [counter])

     return (
          <span className='text-sx mx-1 text-white'>
               {formatSecondsToMinutes(counter)}
          </span>
     )
}
export default Counter
