'use client'
const Percentage = ({ percent, isPositive }) => {
     return (
          <span className='flex'>
               {isPositive ? (
                    <span className='text-greentxt'>
                         +{percent.toFixed(2)}%
                    </span>
               ) : (
                    <span className='text-[#fa5252]'>
                         {percent.toFixed(2)}%
                    </span>
               )}
          </span>
     )
}
export default Percentage
