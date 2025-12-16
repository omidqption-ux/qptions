'use client';
import * as React from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { useTranslation } from 'next-i18next';

const SimpleStart = () => {
     const { t, i18n } = useTranslation('home');
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.resolvedLanguage || i18n.language);
     const steps = t('simpleStart.steps', { returnObjects: true });

     return (
          <MotionConfig reducedMotion="never">
               <div className="relative w-full py-10 px-4 sm:px-6 lg:px-8 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
                    <div className="relative max-w-7xl mx-auto text-center space-y-6 mb-20">
                         <h2
                              className="text-3xl md:text-5xl lg:text-6xl font-bold text-blue-100"
                              dangerouslySetInnerHTML={{
                                   __html: t('simpleStart.title').replace(/<accent>/g, '<span class="text-[#21b474] mx-1">').replace(/<\/accent>/g, '</span>')
                              }}
                         />
                         <p className="text-sm md:text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto">{t('simpleStart.sub')}</p>

                         <div className="relative">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                   {steps.map((s, index) => (
                                        <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.2 }} className="relative">
                                             <div className="group relative transform transition-all duration-300 hover:scale-105">
                                                  <div className="absolute -top-4 -left-2 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-green-100 font-bold text-lg shadow-lg z-10">
                                                       {index + 1}
                                                  </div>

                                                  <div className="relative flex flex-col items-center rounded-2xl bg-linear-to-b from-[#132a46] to-[#132a46]/90 p-8 shadow-lg border border-white/5">
                                                       <div className="mb-6">
                                                            <img src={index === 0 ? '/signup.png' : index === 1 ? '/platform.png' : index === 2 ? '/trading.png' : '/withdraw.png'} alt={s.alt} className="w-16 h-16" />
                                                       </div>
                                                       <h3 className="text-xl sm:text-2xl font-bold text-[#21b474] text-center mb-3">{s.title}</h3>
                                                       <p className="text-sm text-blue-200 text-center max-w-[200px]">{s.desc}</p>
                                                  </div>
                                             </div>
                                        </motion.div>
                                   ))}
                              </div>
                         </div>

                         <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-[#132a46]/5 to-transparent" />
                    </div>
               </div>
          </MotionConfig>
     );
};
export default SimpleStart;
