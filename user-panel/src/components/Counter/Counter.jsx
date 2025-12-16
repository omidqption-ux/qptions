import { useEffect, useState } from 'react'

const Counter = ({ expirOtp, type }) => {
     const [counter, setCounter] = useState(120)
     useEffect(() => {
          let interval
          if (counter > 0) {
               interval = setInterval(() => {
                    setCounter((prev) => prev - 1)
               }, 1000)
          } else {
               expirOtp(type)
               clearInterval(interval)
          }
          return () => clearInterval(interval)
     }, [counter])

     return (
          <span className='text-sx text-[#00d2ff] mx-1'>
               {formatSecondsToMinutes(counter)}
          </span>
     )
}
export default Counter

function formatSecondsToMinutes(seconds) {
     const minutes = Math.floor(seconds / 60) // Get the number of minutes
     const remainingSeconds = seconds % 60 // Get the remaining seconds

     // Format minutes and seconds to always show 2 digits
     const formattedMinutes = String(minutes).padStart(2, '0')
     const formattedSeconds = String(remainingSeconds).padStart(2, '0')

     return `${formattedMinutes}:${formattedSeconds}`
}
