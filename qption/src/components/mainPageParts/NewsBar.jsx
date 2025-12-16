import React, { useState, useEffect } from 'react'
import axiosInstance from '../../network/axios'
import { motion, useAnimation } from 'framer-motion'
export default function NewsBar() {
     const [stories, setStories] = useState([])
     const controls = useAnimation()

     const getLatestNews = async () => {
          try {
               const res = await axiosInstance.get('/api/news', {
                    params: {
                         limit: 20,
                    },
               })
               setStories(res.results)
          } catch (e) { }
     }

     useEffect(() => {
          getLatestNews()
          controls.start({
               x: ['0%', '-50%'],
               transition: {
                    duration: 200,
                    repeat: Infinity,
                    ease: 'linear',
               },
          })
          const interval = setInterval(() => {
               getLatestNews()
          }, 900000) // 900 seconds

          return () => {
               clearInterval(interval)
               setStories([])
          }
     }, [])
     const pauseAnimation = () => {
          controls.stop()
     }
     const resumeAnimation = () => {
          controls.start({
               x: ['0%', '-50%'],
               transition: {
                    duration: 200,
                    repeat: Infinity,
                    ease: 'linear',
               },
          })
     }
     return (
          <div dir='ltr' className='w-full bg-[#132a46]/80 backdrop-blur-sm border-t border-[#21b474]/20 py-2 overflow-hidden'>
               <motion.div
                    animate={controls}
                    initial={{ x: '-100%' }}
                    onMouseEnter={pauseAnimation}
                    onMouseLeave={resumeAnimation}
                    onTouchStart={pauseAnimation}
                    onTouchEnd={resumeAnimation}
                    className='flex items-center gap-8 whitespace-nowrap w-max'
               >
                    <div className='flex items-center gap-8'>
                         <span className='text-[#21b474] text-sm font-medium'>
                              LATEST NEWS:
                         </span>
                         {stories.map((item, index) => (
                              <React.Fragment key={index}>
                                   <a
                                        href={item.article_url}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-white/90 text-sm hover:text-[#21b474] transition-colors'
                                   >
                                        {item.title} ({item.publisher.name})
                                   </a>
                                   {index < stories.length - 1 && (
                                        <span className='text-white/90 text-sm'>
                                             •
                                        </span>
                                   )}
                              </React.Fragment>
                         ))}
                    </div>
                    <div className='flex items-center gap-8'>
                         <span className='text-[#21b474] text-sm font-medium'>
                              LATEST NEWS:
                         </span>
                         {stories.map((item, index) => (
                              <React.Fragment key={`duplicate-${index}`}>
                                   <a
                                        href={item.article_url}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-white/90 text-sm hover:text-[#21b474] transition-colors'
                                   >
                                        {item.title} ({item.publisher.name})
                                   </a>
                                   {index < stories.length - 1 && (
                                        <span className='text-white/90 text-sm'>
                                             •
                                        </span>
                                   )}
                              </React.Fragment>
                         ))}
                    </div>
               </motion.div>
          </div>
     )
}
