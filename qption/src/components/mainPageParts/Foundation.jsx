'use client';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaShieldAlt, FaRocket } from 'react-icons/fa';
import { useTranslation } from 'next-i18next';

const Foundation = () => {
     const { t, i18n } = useTranslation('home');
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.resolvedLanguage || i18n.language);

     const [showVideo, setShowVideo] = useState(false);
     useEffect(() => {
          if (document.readyState === 'complete') setShowVideo(true);
          else {
               const onLoad = () => setShowVideo(true);
               window.addEventListener('load', onLoad);
               return () => window.removeEventListener('load', onLoad);
          }
     }, []);

     const plans = t('foundation.plans', { returnObjects: true });

     return (
          <div className="relative w-full overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
               <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                         animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0] }}
                         transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                         className="absolute -bottom-40 -left-40 w-[120%] h-96 bg-[#132a46]/5 rounded-full blur-3xl"
                    />
               </div>

               <div className="relative flex w-full text-center flex-col items-center justify-center space-y-8 px-4 py-20">
                    <h2
                         className="text-3xl md:text-5xl lg:text-6xl font-bold text-blue-100"
                         dangerouslySetInnerHTML={{
                              __html: t('foundation.title').replace(/<accent>/g, '<span class="text-[#3197F0] mx-1">').replace(/<\/accent>/g, '</span>')
                         }}
                    />
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">{t('foundation.sub')}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full max-w-7xl">
                         {plans.map((plan, index) => (
                              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.2 }} className="group relative transform transition-all duration-300 hover:scale-105">
                                   <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-[#21b474]/10 to-[#132a46]/10 blur-xl group-hover:blur-2xl transition-all duration-300" />

                                   <div className="relative flex flex-col items-center rounded-2xl bg-linear-to-b from-[#132a46] to-[#132a46]/95 p-8 shadow-lg border border-white/10">
                                        <motion.div className="mb-6 p-4 rounded-full bg-linear-to-br from-[#21b474] to-[#21b474]/80 shadow-lg group-hover:scale-110 transition-transform duration-300" whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                                             {index === 0 ? <FaShieldAlt className="text-4xl" /> : index === 1 ? <FaChartLine className="text-4xl" /> : <FaRocket className="text-4xl" />}
                                        </motion.div>

                                        <div className="text-center space-y-2 mb-6">
                                             <h3 className="text-2xl font-semibold text-blue-100">{plan.title}</h3>
                                             <p className="text-sm text-blue-200">{plan.subtitle}</p>
                                        </div>

                                        <div className="w-full space-y-3 mb-6">
                                             {plan.features.map((f, fi) => (
                                                  <motion.div key={fi} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: fi * 0.1 }} className="flex items-center space-x-3">
                                                       <div className="w-2 h-2 rounded-full bg-[#21b474]" />
                                                       <span className="text-sm text-blue-200">{f}</span>
                                                  </motion.div>
                                             ))}
                                        </div>

                                        <div className="w-full space-y-4 mb-6">
                                             <div className="flex justify-between items-center">
                                                  <span className="text-blue-100">{plan.minDepositLabel}</span>
                                                  <span className="text-[#21b474] font-semibold">{plan.minDeposit}</span>
                                             </div>
                                             <div className="flex justify-between items-center">
                                                  <span className="text-blue-100">{plan.returnsLabel}</span>
                                                  <span className="text-[#21b474] font-semibold">{plan.returns}</span>
                                             </div>
                                             <div className="flex flex-col">
                                                  <span className="text-blue-100 my-2">{plan.strategiesLabel}</span>
                                                  <span className="text-sm text-blue-200">{plan.strategies}</span>
                                             </div>
                                        </div>

                                        <Button className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#132a46] font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#FFD700]/30" variant="contained" component={Link} href="/AITrading" target="_blank">
                                             {plan.cta}
                                        </Button>
                                   </div>
                              </motion.div>
                         ))}
                    </div>
               </div>
          </div>
     );
};
export default Foundation;
