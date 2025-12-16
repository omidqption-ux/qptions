'use client'

import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import SlideUpSection from '@/components/SlideUp/SlideUp'
import { Button } from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import { motion } from 'framer-motion'
import { FaChartLine } from 'react-icons/fa'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../../next-i18next.config.cjs'
import SEOAlternates from '@/components/SEOAlternates'

const Registeration = dynamic(
     () => import('@/components/RegisterationModal/Registeration'),
     { ssr: false }
)

export default function ThreeMethodsPage() {
     const { t: tTM, i18n } = useTranslation('threeMethods')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     return (
          <>
               <Head>
                    {/* Localized SEO */}
                    <title>{tTM('seo.title')}</title>
                    <meta name="description" content={tTM('seo.description')} />
                    <meta name="keywords" content={tTM('seo.keywords')} />

                    {/* Canonical */}
                    <link rel="canonical" href="https://qption.com/trading-strategy/threeMethods" />

                    {/* Open Graph / Twitter */}
                    <meta property="og:type" content="article" />
                    <meta property="og:site_name" content="Qption" />
                    <meta property="og:title" content={tTM('seo.title')} />
                    <meta property="og:description" content={tTM('seo.description')} />
                    <meta property="og:url" content="https://qption.com/trading-strategy/threeMethods" />
                    <meta property="og:image" content="https://qption.com/images/og/three-methods.jpg" />
                    <meta property="og:image:alt" content={tTM('seo.ogAlt')} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={tTM('seo.title')} />
                    <meta name="twitter:description" content={tTM('seo.description')} />
                    <meta name="twitter:image" content="https://qption.com/images/og/three-methods.jpg" />

                    {/* JSON-LD */}
                    <script
                         type="application/ld+json"
                         dangerouslySetInnerHTML={{
                              __html: JSON.stringify({
                                   '@context': 'https://schema.org',
                                   '@type': 'TechArticle',
                                   headline: tTM('seo.ld.headline'),
                                   description: tTM('seo.description'),
                                   inLanguage: i18n.language,
                                   mainEntityOfPage: 'https://qption.com/trading-strategy/threeMethods',
                                   publisher: { '@type': 'Organization', name: 'Qption' },
                                   about: [
                                        { '@type': 'Thing', name: 'Trend-Following Strategy' },
                                        { '@type': 'Thing', name: 'Range-Bound Strategy' },
                                        { '@type': 'Thing', name: 'Reversal Strategy' },
                                        { '@type': 'Thing', name: 'Moving Averages' },
                                        { '@type': 'Thing', name: 'ADX' },
                                        { '@type': 'Thing', name: 'MACD' },
                                        { '@type': 'Thing', name: 'RSI' },
                                        { '@type': 'Thing', name: 'Bollinger Bands' },
                                        { '@type': 'Thing', name: 'Fibonacci Levels' },
                                        { '@type': 'Thing', name: 'Candlestick Patterns' },
                                        { '@type': 'Thing', name: 'Divergence' },
                                        { '@type': 'Thing', name: 'Risk Management' }
                                   ],
                                   articleSection: [
                                        'Three Methods Strategy',
                                        'Trend-Following Strategy',
                                        'Range-Bound (Mean Reversion) Strategy',
                                        'Reversal Strategy',
                                        'Combining the Three Methods',
                                        'Pros and Cons'
                                   ],
                                   additionalProperty: [
                                        {
                                             '@type': 'PropertyValue',
                                             name: 'Trend-Following Tools',
                                             value: 'Moving Averages, MACD, ADX'
                                        },
                                        {
                                             '@type': 'PropertyValue',
                                             name: 'Range-Bound Tools',
                                             value: 'Bollinger Bands, RSI, Support and Resistance'
                                        },
                                        {
                                             '@type': 'PropertyValue',
                                             name: 'Reversal Tools',
                                             value: 'Candlestick Patterns, Divergence, Fibonacci Levels'
                                        }
                                   ]
                              })
                         }}
                    />
               </Head>

               <SEOAlternates />

               <SlideUpSection>
                    <main
                         dir={isRTL ? 'rtl' : 'ltr'}
                         className="font-normal px-4 text-green-100 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 text-lg leading-8"
                    >
                         <div className="my-12 flex flex-col text-lg leading-8 items-start w-full max-w-7xl mx-auto">
                              {/* Breadcrumb */}
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="my-6">
                                   <Link
                                        href="/trading-strategy"
                                        className="text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2"
                                   >
                                        <FaChartLine className="text-lg" />
                                        <span className="text-lg">{tTM('breadcrumb.tradingStrategy')}</span>
                                   </Link>
                              </motion.div>

                              {/* Hero */}
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.3 }}
                                   className="text-center mb-12 mx-auto"
                              >
                                   <h1 className="text-3xl md:text-4xl font-bold text-green-500 mb-4">
                                        {tTM('hero.title')}
                                   </h1>
                                   <p className={`text-green-100 text-lg max-w-7xl mx-auto text-center`}>
                                        {tTM('hero.subtitle')}
                                   </p>
                              </motion.div>

                              {/* CTA */}
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8 w-full">
                                   <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                        <div className="w-full flex md:flex-row flex-col items-center justify-between gap-4">
                                             <div className="text-green-100 text-lg">{tTM('cta.ready')}</div>
                                             <Registeration handleClose={handleClose} open={openLogin} isRegister />
                                             <Button
                                                  onClick={handleOpen}
                                                  className="normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
                                                  variant="contained"
                                                  size="medium"
                                             >
                                                  <HowToRegIcon className="mr-2" />
                                                  {tTM('cta.startTrading')}
                                             </Button>
                                        </div>
                                   </div>
                              </motion.div>

                              {/* Sections */}
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8 w-full">
                                   <div className="py-4 w-full">
                                        <div className="leading-8 text-lg bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <div className="mt-6 space-y-8 w-full">
                                                  {/* Trend-Following */}
                                                  <div className="p-4 rounded">
                                                       <span className="text-xl font-semibold text-green-700">
                                                            {tTM('trend.title')}
                                                       </span>
                                                       <ul className="mt-2 list-decimal list-inside marker:text-xl space-y-2">
                                                            {[1, 2, 3, 4, 5].map(i => (
                                                                 <li key={i}><span>{tTM(`trend.items.${i}`)}</span></li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  {/* Range-Bound */}
                                                  <div className="p-4 rounded">
                                                       <span className="text-xl font-semibold text-green-700">
                                                            {tTM('range.title')}
                                                       </span>
                                                       <ul className="mt-2 list-decimal list-inside marker:text-xl space-y-2">
                                                            {[1, 2, 3, 4, 5].map(i => (
                                                                 <li key={i}><span>{tTM(`range.items.${i}`)}</span></li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  {/* Reversal */}
                                                  <div className="p-4 rounded">
                                                       <span className="text-xl font-semibold text-green-700">
                                                            {tTM('reversal.title')}
                                                       </span>
                                                       <ul className="mt-2 list-decimal list-inside marker:text-xl space-y-2">
                                                            {[1, 2, 3, 4, 5].map(i => (
                                                                 <li key={i}><span>{tTM(`reversal.items.${i}`)}</span></li>
                                                            ))}
                                                       </ul>
                                                  </div>
                                             </div>

                                             {/* Combining */}
                                             <div className="mt-8 p-4 rounded">
                                                  <span className="text-xl font-semibold text-green-700">
                                                       {tTM('combine.title')}
                                                  </span>
                                                  <ul className="mt-2 list-inside marker:text-xl space-y-2">
                                                       {[1, 2, 3].map(i => (
                                                            <li key={i}><span>{tTM(`combine.items.${i}`)}</span></li>
                                                       ))}
                                                  </ul>
                                             </div>

                                             {/* Pros & Cons */}
                                             <div className="mt-8 space-y-4">
                                                  <div className="p-4 rounded">
                                                       <span className="text-xl font-semibold text-green-700">
                                                            {tTM('pros.title')}
                                                       </span>
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2">
                                                            {[1, 2, 3].map(i => (
                                                                 <li key={i}><span>{tTM(`pros.items.${i}`)}</span></li>
                                                            ))}
                                                       </ul>
                                                  </div>
                                                  <div className="p-4 rounded">
                                                       <span className="text-xl font-semibold text-green-700">
                                                            {tTM('cons.title')}
                                                       </span>
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2">
                                                            {[1, 2, 3].map(i => (
                                                                 <li key={i}><span>{tTM(`cons.items.${i}`)}</span></li>
                                                            ))}
                                                       </ul>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </motion.div>
                         </div>

                         {/* Register modal */}
                         <Registeration handleClose={handleClose} open={openLogin} isRegister />
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
                    ['common', 'nav', 'footer', 'auth', 'threeMethods'],
                    i18nConfig
               ))
          }
     }
}
