import React, { useState, useEffect } from 'react'
import axiosInstance from '../../network/axios'
import { motion, useAnimation } from 'framer-motion'
import { ArrowUpward, ArrowDownward } from '@mui/icons-material'
import { formatDecimals } from "../../utils/formatDecimals"
const MarketBar = () => {
     const [marketData, setMarketData] = useState([])

     const controls = useAnimation()
     const getMarketData = async () => {
          try {

               const res = await axiosInstance.get('/api/marketData', {
                    timeout: 15000, // 15 seconds for just this call
               })
               setMarketData(res)
          } catch (e) {
          } finally {
          }
     }
     useEffect(() => {
          getMarketData()
          controls.start({
               x: ['0%', '-50%'],
               transition: {
                    duration: 30,
                    repeat: Infinity,
                    ease: 'linear',
               },
          })
          const interval = setInterval(() => {
               getMarketData()
          }, 500000) // 500 seconds

          return () => {
               clearInterval(interval)
               setMarketData([])
          }
     }, [])

     const pauseAnimation = () => {
          controls.stop()
     }

     const resumeAnimation = () => {
          controls.start({
               x: ['0%', '-50%'],
               transition: {
                    duration: 30,
                    repeat: Infinity,
                    ease: 'linear',
               },
          })
     }
     return (
          <div
               dir='ltr'
               className={`transition-all duration-300 ease-in-out  min-h-20 opacity-100  w-full z-50 bg-[#132a46]/30 backdrop-blur-sm py-2 overflow-hidden `}
          >
               <motion.div
                    animate={controls}
                    initial={{ x: '-100%' }}
                    onMouseEnter={pauseAnimation}
                    onMouseLeave={resumeAnimation}
                    onTouchStart={pauseAnimation}
                    onTouchEnd={resumeAnimation}
                    className='flex items-center gap-8 whitespace-nowrap w-max'

               >
                    {[...Array(2)].map((_, loopIndex) => (
                         <div
                              key={loopIndex}
                              className='flex items-center gap-8 px-4'
                         >
                              {marketData && marketData.map((item, index) => (
                                   <div
                                        key={`${loopIndex}-${index}`}
                                        className='text-white/90 text-sm flex flex-col justify-center items-center mx-3 p-2 shadow'
                                   >
                                        <span className='text-gray-300'>
                                             {item.ticker.slice(2)}
                                        </span>
                                        <span className='text-[#3197F0]'>
                                             {item.lastTrade.p}
                                        </span>
                                        <span className={`flex items-center justify-center text-xs ${item.todaysChangePerc > 0 ? " text-green-500" : "text-red-500"}`} >
                                             {formatDecimals(item.todaysChange)}
                                             {item.todaysChangePerc > 0 ? (
                                                  <ArrowUpward className='text-green-500 text-sm' />
                                             ) : (
                                                  <ArrowDownward className='text-red-500 text-sm' />
                                             )}
                                        </span>
                                   </div>
                              ))}
                         </div>
                    ))}
               </motion.div>
          </div>
     )
}
export default MarketBar
