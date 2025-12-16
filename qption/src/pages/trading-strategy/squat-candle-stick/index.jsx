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

export default function SquatCandlestickPage() {
     const { t: tSQ, i18n } = useTranslation('squat')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     return (
          <>
               <Head>
                    {/* Primary SEO (localized) */}
                    <title>{tSQ('seo.title')}</title>
                    <meta name="description" content={tSQ('seo.description')} />
                    <meta name="keywords" content={tSQ('seo.keywords')} />

                    {/* Canonical */}
                    <link rel="canonical" href="https://qption.com/trading-strategy/squat-candlestick" />

                    {/* Open Graph / Twitter */}
                    <meta property="og:type" content="article" />
                    <meta property="og:title" content={tSQ('seo.title')} />
                    <meta property="og:description" content={tSQ('seo.description')} />
                    <meta property="og:url" content="https://qption.com/trading-strategy/squat-candlestick" />
                    <meta property="og:image" content="https://qption.com/videos/squat-candlestick-strategy/squat-candlestick-strategy.png" />
                    <meta property="og:image:alt" content={tSQ('seo.ogAlt')} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={tSQ('seo.title')} />
                    <meta name="twitter:description" content={tSQ('seo.description')} />
                    <meta name="twitter:image" content="https://qption.com/videos/squat-candlestick-strategy/squat-candlestick-strategy.png" />

                    {/* JSON-LD (localized) */}
                    <script
                         type="application/ld+json"
                         dangerouslySetInnerHTML={{
                              __html: JSON.stringify({
                                   '@context': 'https://schema.org',
                                   '@type': 'TechArticle',
                                   headline: tSQ('seo.ld.headline'),
                                   description: tSQ('seo.description'),
                                   inLanguage: i18n.language,
                                   mainEntityOfPage: 'https://qption.com/trading-strategy/squat-candlestick',
                                   image: 'https://qption.com/videos/squat-candlestick-strategy/squat-candlestick-strategy.png',
                                   publisher: { '@type': 'Organization', name: 'Qption' },
                                   about: [
                                        { '@type': 'Thing', name: 'Squat Candlestick' },
                                        { '@type': 'Thing', name: 'Market Exhaustion' },
                                        { '@type': 'Thing', name: 'Volume Analysis' },
                                        { '@type': 'Thing', name: 'Support and Resistance' },
                                        { '@type': 'Thing', name: 'Reversal Trading' },
                                        { '@type': 'Thing', name: 'Risk Management' }
                                   ],
                                   articleSection: [
                                        'Squat Candle Strategy',
                                        'Overview',
                                        'Identifying a Squat Candle',
                                        'Squat Candle in an Uptrend',
                                        'Squat Candle in a Downtrend',
                                        'Using the Squat Candle Strategy',
                                        'Pros and Cons'
                                   ],
                                   additionalProperty: [
                                        {
                                             '@type': 'PropertyValue',
                                             name: 'Pattern Characteristics',
                                             value: 'Small real body, relatively long upper/lower wicks, unusually high volume'
                                        },
                                        {
                                             '@type': 'PropertyValue',
                                             name: 'Context',
                                             value: 'Often forms near resistance in uptrends or support in downtrends, signaling exhaustion'
                                        },
                                        {
                                             '@type': 'PropertyValue',
                                             name: 'Confirmation',
                                             value: "Follow-up candle closing beyond the squat candle's high/low; volume alignment preferred"
                                        },
                                        {
                                             '@type': 'PropertyValue',
                                             name: 'Risk Control',
                                             value: "Stops just beyond the squat candle's high (shorts) or low (longs)"
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
                         className="px-4 text-green-100 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 text-lg leading-8"
                    >
                         <div className="my-12 text-lg leading-8 flex flex-col items-start w-full max-w-7xl mx-auto">
                              {/* Breadcrumb */}
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 w-full">
                                   <Link
                                        href="/trading-strategy"
                                        className="text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2"
                                   >
                                        <FaChartLine className="text-lg" />
                                        <span className="text-lg">{tSQ('breadcrumb.tradingStrategy')}</span>
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
                                        {tSQ('hero.title')}
                                   </h1>
                                   <p className={`text-blue-100 text-lg max-w-7xl mx-auto text-center font-normal`}>
                                        {tSQ('hero.subtitle')}
                                   </p>
                              </motion.div>

                              {/* CTA strip */}
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.2 }}
                                   className="mb-8 w-full"
                              >
                                   <div className="font-normal bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                        <div className="w-full flex md:flex-row items-center justify-between gap-4">
                                             <div className="text-lg text-green-100">{tSQ('cta.ready')}</div>
                                             <Registeration handleClose={handleClose} open={openLogin} isRegister />
                                             <Button
                                                  onClick={handleOpen}
                                                  className="normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
                                                  variant="contained"
                                                  size="medium"
                                             >
                                                  <HowToRegIcon className="mr-2" />
                                                  {tSQ('cta.startTrading')}
                                             </Button>
                                        </div>
                                   </div>
                              </motion.div>

                              {/* Video */}
                              <motion.div
                                   initial={{ opacity: 0, x: 20 }}
                                   animate={{ opacity: 1, x: 0 }}
                                   className="w-full my-5 bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-1 md:p-4 border border-green-500/20 flex flex-col"
                              >
                                   <video
                                        src="/videos/squat-candlestick-strategy/squat-candlestick-strategy.mp4"
                                        poster="/videos/squat-candlestick-strategy/squat-candlestick-strategy.png"
                                        controls
                                        playsInline
                                        preload="metadata"
                                        style={{ width: '100%', height: 'auto', borderRadius: 12 }}
                                        aria-description={tSQ('video.aria')}
                                   />
                              </motion.div>

                              {/* Content */}
                              <div className="py-4 w-full">
                                   {/* Overview */}
                                   <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="mb-8 w-full"
                                   >
                                        <div className="font-normal bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <div className="mt-6 space-y-8">
                                                  <div className="p-4 rounded">
                                                       <span className="text-2xl font-semibold text-green-700">{tSQ('overview.title')}</span>
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            {[1, 2, 3].map((i) => (
                                                                 <li key={i}>
                                                                      <span>{tSQ(`overview.items.${i}`)}</span>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  {/* Identifying */}
                                                  <div className="p-4 rounded">
                                                       <span className="text-xl font-semibold text-green-700">{tSQ('identify.title')}</span>
                                                       <ul className="mt-2 list-disc list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            {[1, 2, 3, 4].map((i) => (
                                                                 <li key={i}>
                                                                      <span>{tSQ(`identify.items.${i}`)}</span>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  {/* Uptrend */}
                                                  <div className="p-4 rounded">
                                                       <span className="text-xl font-semibold text-green-700">{tSQ('uptrend.title')}</span>
                                                       <ul className="mt-2 list-disc list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            {[1, 2, 3, 4].map((i) => (
                                                                 <li key={i}>
                                                                      <span>{tSQ(`uptrend.items.${i}`)}</span>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  {/* Downtrend */}
                                                  <div className="p-4 rounded">
                                                       <span className="text-xl font-semibold text-green-700">{tSQ('downtrend.title')}</span>
                                                       <ul className="mt-2 list-disc list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            {[1, 2, 3, 4].map((i) => (
                                                                 <li key={i}>
                                                                      <span>{tSQ(`downtrend.items.${i}`)}</span>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>
                                             </div>
                                        </div>
                                   </motion.div>

                                   {/* Using the strategy */}
                                   <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="mb-8 w-full"
                                   >
                                        <div className="font-normal bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <div className="mt-8 p-4 rounded">
                                                  <span className="text-xl font-semibold text-green-700">{tSQ('use.title')}</span>
                                                  <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                       {[1, 2, 3].map((i) => (
                                                            <li key={i}>
                                                                 <span>{tSQ(`use.items.${i}`)}</span>
                                                            </li>
                                                       ))}
                                                  </ul>
                                             </div>
                                        </div>
                                   </motion.div>

                                   {/* Pros & Cons */}
                                   <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="mb-8 w-full"
                                   >
                                        <div className="font-normal bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <div className="mt-8 space-y-4">
                                                  {/* Pros */}
                                                  <div className="p-4 rounded">
                                                       <span className="text-xl font-semibold text-green-700">{tSQ('pros.title')}</span>
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            {[1, 2, 3].map((i) => (
                                                                 <li key={i}>
                                                                      <span>{tSQ(`pros.items.${i}`)}</span>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>
                                                  {/* Cons */}
                                                  <div className="p-4 rounded">
                                                       <span className="text-xl font-semibold text-green-700">{tSQ('cons.title')}</span>
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            {[1, 2, 3].map((i) => (
                                                                 <li key={i}>
                                                                      <span>{tSQ(`cons.items.${i}`)}</span>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>
                                             </div>
                                        </div>
                                   </motion.div>
                              </div>
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
                    ['common', 'nav', 'footer', 'auth', 'squat'],
                    i18nConfig
               ))
          }
     }
}
