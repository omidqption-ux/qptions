import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../next-i18next.config.cjs'

import SEOAlternates from '@/components/SEOAlternates'
import SlideUpSection from '@/components/SlideUp/SlideUp'

import {
     FaChartPie,
     FaChartArea,
     FaChartLine,
     FaGlobe,
     FaBitcoin,
     FaDollarSign,
     FaChartBar,
     FaCoins,
     FaExchangeAlt,
     FaTrophy,
     FaFileAlt,
} from 'react-icons/fa'

/** Keep icon keys STABLE in JSON (do not translate the key values) */
const ICONS = {
     chartBar: FaChartBar,
     chartLine: FaChartLine,
     chartPie: FaChartPie,
     chartArea: FaChartArea,
     globe: FaGlobe,
     bitcoin: FaBitcoin,
     dollar: FaDollarSign,
     coins: FaCoins,
     exchange: FaExchangeAlt,
     trophy: FaTrophy,
     file: FaFileAlt, // fallback
}

export default function TradingStrategy() {
     const { t: tStrat, i18n } = useTranslation('strategies')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     // Cards come from locale JSON
     const cards = tStrat('cards', { returnObjects: true }) || []

     // Helper to resolve icon by key with fallback
     const getIconComp = (key) => {
          const k = typeof key === 'string' ? key.trim() : ''
          return ICONS[k] || ICONS.file
     }

     return (
          <>
               <Head>
                    {/* ---------- Primary SEO ---------- */}
                    <title>{tStrat('seo.title')}</title>
                    <meta name="description" content={tStrat('seo.description')} />
                    <meta name="keywords" content={tStrat('seo.keywords')} />

                    {/* ---------- Open Graph ---------- */}
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={tStrat('seo.ogTitle')} />
                    <meta property="og:description" content={tStrat('seo.ogDescription')} />
                    <meta property="og:url" content={tStrat('seo.url')} />
                    <meta property="og:image" content={tStrat('seo.image')} />

                    {/* ---------- Twitter Card ---------- */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content={tStrat('seo.twitterSite')} />
                    <meta name="twitter:title" content={tStrat('seo.twitterTitle')} />
                    <meta name="twitter:description" content={tStrat('seo.twitterDescription')} />
                    <meta name="twitter:image" content={tStrat('seo.twitterImage')} />

                    {/* ---------- Canonical & Robots ---------- */}
                    <link rel="canonical" href={tStrat('seo.canonical')} />
                    <meta name="robots" content="index,follow" />
               </Head>

               <SEOAlternates />

               <SlideUpSection>
                    <main
                         dir={isRTL ? 'rtl' : 'ltr'}
                         className="min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex justify-center relative overflow-hidden p-4 lg:p-12 flex-col items-center"
                    >
                         <h1 className="text-4xl md:text-5xl font-bold my-6 text-green-500">
                              {tStrat('hero.title')}
                         </h1>

                         <p className={`text-blue-100 text-lg max-w-3xl mx-auto my-4 ${isRTL ? 'text-right' : 'text-center'}`}>
                              {tStrat('hero.subtitle')}
                         </p>

                         <div className="w-full max-w-7xl px-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                   {cards.map((card, index) => {
                                        const Icon = getIconComp(card.icon)
                                        return (
                                             <motion.div
                                                  key={card.key || index}
                                                  initial={{ opacity: 0, y: 20 }}
                                                  animate={{ opacity: 1, y: 0 }}
                                                  transition={{ delay: index * 0.08 }}
                                                  className="hover:scale-110 transition-all duration-150 bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20"
                                             >
                                                  <Link className="group block h-full" href={card.link}>
                                                       <div className="w-full flex flex-col items-center justify-between p-6 rounded-2xl transition-all duration-300 h-full">
                                                            <div className="bg-green-500/10 p-4 rounded-xl mb-4 group-hover:bg-green-500/20 transition-colors duration-300">
                                                                 <Icon className="text-green-500 text-4xl" />
                                                            </div>

                                                            <div className="text-center">
                                                                 <h3 className="text-xl font-bold text-green-100 mb-2 group-hover:text-green-300 transition-colors duration-300">
                                                                      {card.title}
                                                                 </h3>
                                                            </div>

                                                            <div className="mt-4">
                                                                 <span className="translate-x-0 inline-block group-hover:text-green-300 mt-4 text-sm font-medium text-green-500 transition-transform duration-500 group-hover:translate-x-1">
                                                                      {tStrat('cta.learnMore')} &rarr;
                                                                 </span>
                                                            </div>
                                                       </div>
                                                  </Link>
                                             </motion.div>
                                        )
                                   })}
                              </div>

                              <div className="w-full">
                                   <motion.div
                                        initial={{ opacity: 0, x: 0 }}
                                        animate={{ opacity: 1, x: 20 }}
                                        transition={{ delay: 0.7 }}
                                        className="mt-6 group flex justify-center relative overflow-hidden rounded-lg bg-linear-to-br p-0.5 hover:scale-[1.02] transition-all duration-300"
                                   >
                                        <span className="translate-x-0 inline-block mt-4 text-sm font-medium text-green-400 transition-transform duration-500 group-hover:translate-x-3">
                                             <Link
                                                  href={tStrat('quiz.link')}
                                                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500 group-hover:text-green-100 hover:bg-green-600 text-green-300 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20"
                                             >
                                                  <FaChartLine />
                                                  {tStrat('quiz.cta')}
                                             </Link>
                                        </span>
                                   </motion.div>
                              </div>
                         </div>
                    </main>
               </SlideUpSection>
          </>
     )
}

export async function getServerSideProps({ locale }) {
     return {
          props: {
               ...(await serverSideTranslations(
                    locale,
                    ['common', 'nav', 'footer', 'auth', 'strategies'],
                    i18nConfig
               )),
          },
     }
}
