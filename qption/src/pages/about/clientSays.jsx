'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import './swiper.module.css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Pagination, Autoplay, Navigation } from 'swiper/modules'
import SayingCard from '@/components/Card/SayingCard'
import { motion } from 'framer-motion'
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa'
import { useTranslation } from 'next-i18next'

const ClientSays = () => {
     const { t: ttestomonial, i18n } = useTranslation('testimonials')

     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     return (
          <div className='w-full py-20 px-4 relative'>
               {/* Decorative elements */}
               <div className='absolute inset-0 overflow-hidden'>
                    <motion.div
                         animate={{
                              scale: [1, 1.2, 1],
                              rotate: [0, 45, 0],
                         }}
                         transition={{
                              duration: 20,
                              repeat: Infinity,
                              ease: 'linear',
                         }}
                         className='absolute -top-40 -right-40 w-[120%] h-96 bg-[#21b474]/5 rounded-full '
                    />
                    <motion.div
                         animate={{
                              scale: [1, 1.3, 1],
                              rotate: [0, -45, 0],
                         }}
                         transition={{
                              duration: 25,
                              repeat: Infinity,
                              ease: 'linear',
                         }}
                         className='absolute -bottom-40 -left-40 w-[120%] h-96 bg-[#132a46]/5 rounded-fulltext-2xl bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'
                    />
               </div>

               <div className='relative z-10'>
                    <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.8 }}
                         className='text-center mb-16 '
                    >
                         <div className='flex items-center justify-center gap-3 mb-6'>
                              <FaQuoteLeft className='text-4xl text-[#21b474]' />
                              <h2 className='text-3xl sm:text-4xl font-bold text-green-400'>
                                   {ttestomonial("heading")}
                              </h2>
                              <FaQuoteRight className='text-4xl text-[#21b474]' />
                         </div>
                         <p className='text-xl text-green-100 max-w-2xl mx-auto'>
                              {ttestomonial("subtitle")}
                         </p>
                    </motion.div>

                    <div className='swiper-container max-w-7xl mx-auto'>
                         <Swiper
                              spaceBetween={30}
                              pagination={{
                                   clickable: true,
                                   dynamicBullets: true,
                                   renderBullet: (index, className) => {
                                        return `<span class="${className} custom-bullet"></span>`
                                   },
                              }}
                              draggable={true}
                              autoplay={{
                                   delay: 4000,
                                   disableOnInteraction: false,
                                   pauseOnMouseEnter: true,
                              }}
                              breakpoints={{
                                   400: {
                                        slidesPerView: 1,
                                        spaceBetween: 20,
                                   },
                                   640: {
                                        slidesPerView: 2,
                                        spaceBetween: 20,
                                   },
                                   1024: {
                                        slidesPerView: 3,
                                        spaceBetween: 30,
                                   },
                                   1280: {
                                        slidesPerView: 4,
                                        spaceBetween: 30,
                                   },
                              }}
                              modules={[Pagination, Autoplay, Navigation]}
                              className='pb-16'
                         >
                              {[
                                   {
                                        saying: 'The AI-powered trading signals have completely transformed my trading strategy. The accuracy is impressive!',
                                        fullName: 'Michael Thompson',
                                        country: 'USA',
                                   },
                                   {
                                        saying: 'What sets this platform apart is the educational resources. The webinars and tutorials helped me understand complex trading concepts easily.',
                                        fullName: 'Sarah Johnson',
                                        country: 'Canada',
                                   },
                                   {
                                        saying: 'The mobile app is a game-changer! I can monitor my trades and execute orders from anywhere with perfect execution speed.',
                                        fullName: 'David Wilson',
                                        country: 'Australia',
                                   },
                                   {
                                        saying: 'The risk management tools are exceptional. I feel much more confident in my trades with the advanced stop-loss and take-profit features.',
                                        fullName: 'Emma Brown',
                                        country: 'UK',
                                   },
                                   {
                                        saying: 'The social trading feature is brilliant! Learning from experienced traders and copying their strategies has improved my results significantly.',
                                        fullName: 'James Anderson',
                                        country: 'New Zealand',
                                   },
                                   {
                                        saying: 'このプラットフォームは本当に素晴らしいです！テクニカル分析のツールが充実していて、取引がとてもスムーズになりました。',
                                        fullName: 'Aiko Nakamura',
                                        country: 'Japan',
                                        translation:
                                             'This platform is amazing! The technical analysis tools are comprehensive and make trading very smooth.',
                                   },
                                   {
                                        saying: '¡Increíble experiencia! La interfaz es intuitiva y los gráficos en tiempo real son una maravilla. ¡Mi rendimiento ha mejorado significativamente!',
                                        fullName: 'Carlos Mendoza',
                                        country: 'Mexico',
                                        translation:
                                             'Amazing experience! The interface is intuitive and real-time charts are wonderful. My performance has improved significantly!',
                                   },
                                   {
                                        saying: 'Che piattaforma fantastica! Gli strumenti di analisi sono eccezionali e il supporto clienti è sempre disponibile. Consigliatissimo!',
                                        fullName: 'Luca Rossi',
                                        country: 'Italy',
                                        translation:
                                             'What a fantastic platform! The analysis tools are exceptional and customer support is always available. Highly recommended!',
                                   },
                                   {
                                        saying: 'من مسرور جداً به تجربتي مع هذه المنصة. الأدوات المالية متقدمة جداً والدعم الفني ممتاز.',
                                        fullName: 'Fatima Al-Mansouri',
                                        country: 'UAE',
                                        translation:
                                             'I am very pleased with my experience with this platform. The financial tools are very advanced and technical support is excellent.',
                                   },
                                   {
                                        saying: 'Dette er den beste handelsplattformen jeg har brukt! Brukervennlig, teknisk avansert og med utmerket kundeservice.',
                                        fullName: 'Lars Johansen',
                                        country: 'Norway',
                                        translation:
                                             'This is the best trading platform I have used! User-friendly, technically advanced and with excellent customer service.',
                                   },
                                   {
                                        saying: '这个平台太棒了！技术分析工具非常专业，实时数据更新快，让我能做出更好的交易决策。',
                                        fullName: 'Wei Chen',
                                        country: 'China',
                                        translation:
                                             'This platform is great! The technical analysis tools are very professional, real-time data updates quickly, allowing me to make better trading decisions.',
                                   },
                                   {
                                        saying: "C'est une plateforme exceptionnelle ! Les outils d'analyse sont puissants et l'interface est très intuitive. Je recommande vivement !",
                                        fullName: 'Sophie Dubois',
                                        country: 'France',
                                        translation:
                                             "It's an exceptional platform! The analysis tools are powerful and the interface is very intuitive. I highly recommend it!",
                                   },
                                   {
                                        saying: 'Diese Plattform ist einfach genial! Die technische Analyse ist erstklassig und die Benutzeroberfläche ist sehr benutzerfreundlich.',
                                        fullName: 'Hans Schmidt',
                                        country: 'Germany',
                                        translation:
                                             'This platform is simply brilliant! The technical analysis is first-class and the user interface is very user-friendly.',
                                   },
                              ].map((client, index) => (
                                   <SwiperSlide key={index}>
                                        <motion.div
                                             initial={{ opacity: 0, y: 20 }}
                                             whileInView={{ opacity: 1, y: 0 }}
                                             transition={{
                                                  duration: 0.5,
                                                  delay: index * 0.1,
                                             }}
                                             className='h-full '
                                        >
                                             <SayingCard
                                                  saying={client.saying}
                                                  fullName={client.fullName}
                                                  country={client.country}
                                                  translation={
                                                       client.translation
                                                  }
                                             />
                                        </motion.div>
                                   </SwiperSlide>
                              ))}
                         </Swiper>
                    </div>
               </div>
          </div>
     )
}
export default ClientSays
