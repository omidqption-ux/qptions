import CircularProgress from '@mui/material/CircularProgress'
import { useSelector } from 'react-redux'

const TickerCard = ({ ticker }) => {
     const { fetchLoading } = useSelector((store) => store.trade)

     return (
          <div
               className={`bg-darkGrey/40 flex items-center justify-center cursor-pointer text-lightGrey w-[80px] shadow-md relative lg:py-[6px] py-[2px] px-2`}
          >
               {fetchLoading ? (
                    <div className='flex justify-center items-center'>
                         <CircularProgress
                              color='inherit'
                              className='text-menuTxt w-[20px] h-[20px]'
                         />
                    </div>
               ) : (
                    <>
                         <div className='ml-2 flex flex-col justify-center'>
                              <span className='text-xs lg:text-sm font-semibold text-[#3B82F6]'>
                                   {ticker.slice(2, ticker.length)}
                              </span>
                         </div>
                    </>
               )}
          </div>
     )
}
export default TickerCard
