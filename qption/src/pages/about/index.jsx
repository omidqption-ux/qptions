import React from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../next-i18next.config.cjs'
import SEOAlternates from '@/components/SEOAlternates'
import {
     FaGlobe, FaShieldAlt, FaChartLine, FaUsers,
     FaHandshake, FaRocket, FaHeart, FaBalanceScale,
     FaTrophy, FaBuilding
} from 'react-icons/fa';
import ClientSays from './clientSays';

export default function About() {
     const { t: tAbout, i18n } = useTranslation('about')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     return (
          <>
               <Head>
                    <title>{tAbout('seo.title')}</title>
                    <meta name="description" content={tAbout('seo.description')} />
                    {/* OG/Twitter can also be localized if you want */}
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={tAbout('seo.title')} />
                    <meta property="og:description" content={tAbout('seo.description')} />
                    <meta property="og:image" content="https://qption.com/images/og/about-qption.jpg" />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={tAbout('seo.title')} />
                    <meta name="twitter:description" content={tAbout('seo.description')} />
                    <meta name="twitter:image" content="https://qption.com/images/og/about-qption.jpg" />
               </Head>

               <SEOAlternates />

               <main dir={isRTL ? 'rtl' : 'ltr'} className="font-normal leading-8 text-lg bg-linear-to-b from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start p-4 lg:p-12">
                    {/* Hero */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex w-full text-center justify-center items-center py-20">
                         <div className="max-w-3xl">
                              <h1 className="text-xl lg:text-4xl md:text-5xl font-bold text-green-500 mb-6">
                                   {tAbout('hero.title')}
                              </h1>
                              <p className={`text-lg leading-8 text-green-100 ${isRTL ? 'text-right' : 'text-left'} `}>
                                   {tAbout('hero.subtitle')}
                              </p>
                         </div>
                    </motion.div>

                    {/* About Box */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full my-4 px-4">
                         <div className="max-w-2xl mx-auto bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 lg:p-5 border border-green-500/20">
                              <h2 className="text-2xl font-bold text-green-700 mb-8 text-center">
                                   {tAbout('box.heading')}
                              </h2>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                   <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                             <FaBuilding className="text-green-600 text-6xl" />
                                             <div>
                                                  <h3 className="text-xl font-semibold text-green-400 mb-2">
                                                       {tAbout('box.companyRegistration.title')}
                                                  </h3>
                                                  <p className="text-green-100">{tAbout('box.companyRegistration.body')}</p>
                                             </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                             <FaGlobe className="text-2xl text-green-600 mt-1" />
                                             <div>
                                                  <h3 className="text-xl font-semibold text-green-400 mb-2">
                                                       {tAbout('box.globalPresence.title')}
                                                  </h3>
                                                  <p className="text-green-100">{tAbout('box.globalPresence.body')}</p>
                                             </div>
                                        </div>
                                   </div>

                                   <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                             <FaShieldAlt className="text-4xl text-green-600 mt-1" />
                                             <div>
                                                  <h3 className="text-xl font-semibold text-green-400 mb-2">
                                                       {tAbout('box.securityFirst.title')}
                                                  </h3>
                                                  <p className="text-green-100">{tAbout('box.securityFirst.body')}</p>
                                             </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                             <FaChartLine className="text-2xl text-green-600 mt-1" />
                                             <div>
                                                  <h3 className="text-xl font-semibold text-green-400 mb-2">
                                                       {tAbout('box.tradingExcellence.title')}
                                                  </h3>
                                                  <p className="text-green-100">{tAbout('box.tradingExcellence.body')}</p>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full py-12 px-4">
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                              {[
                                   { number: '100K+', label: tAbout('stats.activeTraders'), icon: <FaUsers className="text-3xl text-[#21b474]" /> },
                                   { number: '$500M+', label: tAbout('stats.monthlyVolume'), icon: <FaChartLine className="text-3xl text-[#21b474]" /> },
                                   { number: '95+', label: tAbout('stats.countries'), icon: <FaGlobe className="text-3xl text-[#21b474]" /> },
                                   { number: '$850+', label: tAbout('stats.avgIncome'), icon: <FaTrophy className="text-3xl text-[#21b474]" /> }
                              ].map((stat, i) => (
                                   <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20 text-center justify-center flex flex-col items-center">
                                        <div className="mb-4">{stat.icon}</div>
                                        <div className="text-3xl font-bold text-green-300 mb-2">{stat.number}</div>
                                        <div className="text-green-100">{stat.label}</div>
                                   </motion.div>
                              ))}
                         </div>
                    </motion.div>

                    {/* Core values */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full py-16 px-4">
                         <div className="max-w-4xl mx-auto">
                              <h2 className="text-3xl font-bold text-green-600 mb-12 text-center">
                                   {tAbout('values.heading')}
                              </h2>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                   {[
                                        { icon: <FaRocket className="text-3xl text-[#21b474]" />, title: tAbout('values.innovationFirst.title'), desc: tAbout('values.innovationFirst.desc') },
                                        { icon: <FaHeart className="text-3xl text-[#21b474]" />, title: tAbout('values.customerCentric.title'), desc: tAbout('values.customerCentric.desc') },
                                        { icon: <FaUsers className="text-3xl text-[#21b474]" />, title: tAbout('values.communityDriven.title'), desc: tAbout('values.communityDriven.desc') },
                                        { icon: <FaShieldAlt className="text-3xl text-[#21b474]" />, title: tAbout('values.integrity.title'), desc: tAbout('values.integrity.desc') },
                                        { icon: <FaBalanceScale className="text-3xl text-[#21b474]" />, title: tAbout('values.sustainability.title'), desc: tAbout('values.sustainability.desc') },
                                        { icon: <FaHandshake className="text-3xl text-[#21b474]" />, title: tAbout('values.sharedSuccess.title'), desc: tAbout('values.sharedSuccess.desc') }
                                   ].map((v, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <div className="flex flex-col items-center text-center">
                                                  <div className="mb-4">{v.icon}</div>
                                                  <h3 className="text-xl font-semibold text-green-300 mb-3">{v.title}</h3>
                                                  <p className="text-green-100">{v.desc}</p>
                                             </div>
                                        </motion.div>
                                   ))}
                              </div>
                         </div>
                    </motion.div>

                    <ClientSays />
               </main >
          </>
     );
}

export async function getServerSideProps({ locale }) {
     return {
          props: {
               ...(await serverSideTranslations(locale, ['common', 'about', 'testimonials', 'nav', 'footer', 'auth'], i18nConfig)),
          }
     };
}
