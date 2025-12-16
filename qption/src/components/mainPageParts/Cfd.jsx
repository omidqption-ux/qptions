'use client'
import Card from '@/components/Card/Card'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Pagination, Autoplay, Navigation } from 'swiper/modules'

const Cfd = () => {
     const cfds = [
          {
               symbol: 'MSFT',
               currentPrice: 0,
               percentageChange: 0,
               dispalyName: 'Microsoft Corporation',
               image: 'microsoft',
          },
          {
               symbol: 'AMZN',
               currentPrice: 0,
               percentageChange: 0,
               dispalyName: 'AMAZON',
               image: 'amazon',
          },
          {
               symbol: 'GOOGL',
               currentPrice: 0,
               percentageChange: 0,
               dispalyName: 'GOOGLE',
               image: 'google',
          },
          // {symbol:'SPY',currentPrice:0,percentageChange:0,dispalyName:'SPDR S&P 500 ETF Trust',image:'SPY'},
          {
               symbol: 'META',
               currentPrice: 0,
               percentageChange: 0,
               dispalyName: 'META',
               image: 'META',
          },
          {
               symbol: 'MCD',
               currentPrice: 0,
               percentageChange: 0,
               dispalyName: `McDonald's Corporation`,
               image: 'MCD',
          },
          {
               symbol: 'AAPL',
               currentPrice: 0,
               percentageChange: 0,
               dispalyName: 'Apple Inc.',
               image: 'AAPL',
          },
          {
               symbol: 'IVV',
               currentPrice: 0,
               percentageChange: 0,
               dispalyName: 'iShares Core S&P 500 ETF',
               image: 'IVV',
          },
          {
               symbol: 'VOO',
               currentPrice: 0,
               percentageChange: 0,
               dispalyName: 'Vanguard S&P 500 ETF',
               image: 'VOO',
          },
          {
               symbol: 'AIG',
               currentPrice: 0,
               percentageChange: 0,
               dispalyName: 'American International Group',
               image: 'AIG',
          },
     ]

     return (
          <div className='flex w-full flex-col items-center justify-start px-4 text-center'>
               <div className='mb-8 space-y-4'>
                    <h2 className='text-3xl font-bold text-gray-300'>
                         Access over{' '}
                         <span className='text-[#21b474]'>300 CFD</span> assets
                    </h2>
                    <p className='text-gray-400 text-xl'>
                         Invest in the world's leading CFD assets. From
                         established industries to booming newcomers—explore
                         over a dozen smart investment paths.
                    </p>
               </div>

               <div className='w-full max-w-7xl'>
                    <Swiper
                         style={{ width: '100%' }}
                         spaceBetween={30}
                         pagination={{ clickable: true }}
                         draggable={true}
                         autoplay={{
                              delay: 3000,
                              disableOnInteraction: false,
                              pauseOnMouseEnter: true,
                         }}
                         breakpoints={{
                              400: { slidesPerView: 1, spaceBetween: 20 },
                              520: { slidesPerView: 2, spaceBetween: 25 },
                              690: { slidesPerView: 3, spaceBetween: 30 },
                              920: { slidesPerView: 4, spaceBetween: 30 },
                              1120: { slidesPerView: 5, spaceBetween: 30 },
                         }}
                         modules={[Pagination, Autoplay, Navigation]}
                         className='py-8'
                    >
                         {cfds.map((cfd, index) => (
                              <SwiperSlide key={index}>
                                   <div className='group relative transform transition-all duration-300 hover:scale-105'>
                                        <div className='absolute inset-0 rounded-xl bg-linear-to-br from-[#21b474]/20 to-[#132a46]/20 blur-xl group-hover:blur-2xl' />
                                        <Card
                                             className='relative w-60 rounded-xl bg-linear-to-b from-[#132a46] to-[#132a46]/90 p-4 shadow-lg'
                                             title={cfd.dispalyName}
                                             alt={cfd.symbol}
                                             image={`/cfds/${cfd.image}.webp`}
                                             percent={cfd.percentageChange}
                                             price={cfd.currentPrice}
                                        />
                                   </div>
                              </SwiperSlide>
                         ))}
                    </Swiper>
               </div>
          </div>
     )
}
export default Cfd
