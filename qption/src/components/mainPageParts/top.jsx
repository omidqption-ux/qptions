'use client';
import React, { useEffect, useState } from 'react';
import OpenAccount from './OpenAccount';
import Slogans from './Slogans';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import NewsBar from './NewsBar';
import MarketBar from './MarketBar';
import { useTranslation } from 'next-i18next';

const TopPage = () => {
     const { t } = useTranslation('home');

     const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
     useEffect(() => {
          const set = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
          set();
          window.addEventListener('resize', set);
          return () => window.removeEventListener('resize', set);
     }, []);

     const slides = t('hero.slides', { returnObjects: true });
     const imgs = t('hero.images', { returnObjects: true });

     return (
          <div className="relative min-h-[calc(100vh-180px)] w-full overflow-hidden" >
               <div className="absolute inset-0  z-0">
                    <div className="absolute inset-0">
                         {windowSize.width > 0 &&
                              Array.from({ length: 8 }).map((_, i) => (
                                   <motion.div
                                        key={i}
                                        className="absolute w-1 h-1 bg-[#21b474] rounded-full"
                                        initial={{
                                             x: Math.random() * (windowSize.width / 2) + windowSize.width / 2,
                                             y: Math.random() * windowSize.height
                                        }}
                                        animate={{
                                             y: [null, Math.random() * windowSize.height],
                                             opacity: [0.1, 0.3, 0.1]
                                        }}
                                        transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: 'linear' }}
                                   />
                              ))}
                    </div>
               </div>

               <div className="relative z-10 min-h-[calc(100vh-80px)] flex flex-col">
                    <NewsBar />
                    <div className="flex-1 w-full flex items-center justify-center py-8 sm:py-0">
                         <div className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
                              {/* Left side */}
                              <motion.div
                                   className="flex flex-col justify-center space-y-6 sm:space-y-8 relative"
                                   initial={{ opacity: 0, x: -50 }}
                                   animate={{ opacity: 1, x: 0 }}
                                   transition={{ duration: 0.8 }}
                              >
                                   {/* Mobile image */}
                                   <div className="lg:hidden absolute right-0 top-24 w-40 h-40">
                                        <img src="/hero-image-png1.png" alt="Hero" className="w-full h-full object-cover rounded-lg" />
                                   </div>

                                   <Swiper
                                        className="w-full"
                                        spaceBetween={0}
                                        slidesPerView={1}
                                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                                        loop
                                        modules={[Autoplay]}
                                   >
                                        {slides.map((s, idx) => (
                                             <SwiperSlide key={idx}>
                                                  <motion.div
                                                       initial={{ opacity: 0, y: 20 }}
                                                       animate={{ opacity: 1, y: 0 }}
                                                       transition={{ duration: 0.5 }}
                                                       className="space-y-3 sm:space-y-4"
                                                  >
                                                       <h1
                                                            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center lg:text-left"
                                                            dangerouslySetInnerHTML={{
                                                                 __html: (s.title || '').replace(/<accent>/g, '<span class="text-[#21b474]">').replace(/<\/accent>/g, '</span>')
                                                            }}
                                                       />
                                                       <p className="text-lg sm:text-xl text-gray-300 text-center lg:text-left">{s.subtitle}</p>

                                                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                                            {s.bullets.map((b, i) => (
                                                                 <div key={i} className="flex items-center space-x-2 sm:space-x-3">
                                                                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#21b474]/20 flex items-center justify-center">
                                                                           <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#21b474]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                                           </svg>
                                                                      </div>
                                                                      <div>
                                                                           <h3 className="text-base sm:text-lg font-semibold text-white">{b.title}</h3>
                                                                           <p className="text-xs sm:text-sm text-gray-400">{b.desc}</p>
                                                                      </div>
                                                                 </div>
                                                            ))}
                                                       </div>
                                                  </motion.div>
                                             </SwiperSlide>
                                        ))}
                                   </Swiper>

                                   <div className="pt-0 sm:pt-6">
                                        <Slogans />
                                        <OpenAccount />
                                   </div>
                              </motion.div>

                              {/* Right image slider */}
                              <motion.div
                                   className="relative h-full items-center justify-center mt-8 lg:mt-0 hidden lg:flex"
                                   initial={{ opacity: 0, x: 50 }}
                                   animate={{ opacity: 1, x: 0 }}
                                   transition={{ duration: 0.8 }}
                              >
                                   <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[600px]">
                                        <Swiper
                                             className="w-full h-full"
                                             spaceBetween={0}
                                             slidesPerView={1}
                                             autoplay={{ delay: 5000, disableOnInteraction: false }}
                                             loop
                                             modules={[Autoplay]}
                                        >
                                             <SwiperSlide>
                                                  <img src="/hero-image.webp" alt={imgs.hero1Alt} className="w-full h-full object-contain " />
                                             </SwiperSlide>
                                             <SwiperSlide className="perspective-distant">
                                                  <img src="/hero-image1png.png" alt={imgs.hero2Alt || imgs.hero1Alt} className="w-full h-full object-contain rotate-y-35 rotate-z-3 transform-3d" />
                                             </SwiperSlide>
                                             <SwiperSlide>
                                                  <img src="/hero-image2.webp" alt={imgs.hero3Alt || imgs.hero1Alt} className="w-full h-full object-contain" />
                                             </SwiperSlide>
                                        </Swiper>
                                   </div>
                              </motion.div>
                         </div>
                    </div>

                    <MarketBar />
               </div>
          </div>
     );
};
export default TopPage;
