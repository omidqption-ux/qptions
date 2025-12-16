'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from 'next-i18next';

const Benefits = () => {
     const { t: thome, i18n } = useTranslation('home');
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.resolvedLanguage || i18n.language);
     const cards = thome('benefits.cards', { returnObjects: true });

     return (
          <div className="relative w-full overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
               <div className="relative w-full ">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                         <h2
                              className="text-4xl sm:text-5xl font-bold text-blue-100"
                              dangerouslySetInnerHTML={{
                                   __html: thome('benefits.heading')
                                        .replace(/<accent>/g, '<span class="text-[#3197F0]">')
                                        .replace(/<\/accent>/g, '</span>')
                              }}
                         />
                         <p className="text-xl text-blue-100 max-w-2xl mx-auto my-4">{thome('benefits.sub')}</p>

                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                              {cards.map((c, index) => (
                                   <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.2 }} className="relative">
                                        <div className="group relative transform transition-all duration-300 hover:scale-105">
                                             <div className={`relative flex flex-col items-center rounded-2xl bg-linear-to-b from-[#132a46] to-[#132a46]/95 p-8 shadow-lg border border-white/10`}>
                                                  <motion.div className="mb-6 p-4 group-hover:scale-110 transition-transform duration-300 relative" whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                                                       <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/5 to-transparent opacity-30" />
                                                       <div className="absolute -inset-1 rounded-2xl bg-linear-to-br from-white/10 to-transparent blur-sm" />
                                                       <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-linear-to-r from-transparent via-white/20 to-transparent blur-md" />
                                                       <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="relative z-10">
                                                            <Image src={index === 0 ? '/demo.png' : index === 1 ? '/bonus.png' : '/247support.png'} alt={c.alt} width={60} height={60} className="w-16 h-16" />
                                                       </motion.div>
                                                  </motion.div>

                                                  <h3 className="text-xl sm:text-2xl font-bold text-blue-100 text-center mb-3">{c.title}</h3>
                                                  <p className="text-sm text-blue-100 text-center mb-6">{c.desc}</p>

                                                  <div className="w-full space-y-3">
                                                       {c.features.map((f, fi) => (
                                                            <motion.div key={fi} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: fi * 0.1 }} className="flex items-center space-x-3">
                                                                 <FaCheckCircle className="text-[#21b474] shrink-0" />
                                                                 <span className="text-sm text-blue-200">{f}</span>
                                                            </motion.div>
                                                       ))}
                                                  </div>
                                             </div>
                                        </div>
                                   </motion.div>
                              ))}
                         </div>
                    </div>
               </div>
          </div>
     );
};
export default Benefits;
