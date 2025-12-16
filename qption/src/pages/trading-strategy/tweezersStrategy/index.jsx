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

export default function TweezerStrategyPage() {
     const { t: tTZ, i18n } = useTranslation('tweezer')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     return (
          <>
               <Head>
                    {/* Localized SEO */}
                    <title>{tTZ('seo.title')}</title>
                    <meta name="description" content={tTZ('seo.description')} />
                    <meta name="keywords" content={tTZ('seo.keywords')} />

                    {/* Canonical */}
                    <link rel="canonical" href="https://qption.com/trading-strategy/tweezer" />

                    {/* Open Graph / Twitter */}
                    <meta property="og:type" content="article" />
                    <meta property="og:title" content={tTZ('seo.title')} />
                    <meta property="og:description" content={tTZ('seo.description')} />
                    <meta property="og:url" content="https://qption.com/trading-strategy/tweezer" />
                    <meta
                         property="og:image"
                         content="https://qption.com/videos/tweezer-strategy/tweezer-strategy.png"
                    />
                    <meta property="og:image:alt" content={tTZ('seo.ogAlt')} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={tTZ('seo.title')} />
                    <meta name="twitter:description" content={tTZ('seo.description')} />
                    <meta
                         name="twitter:image"
                         content="https://qption.com/videos/tweezer-strategy/tweezer-strategy.png"
                    />

                    {/* JSON-LD */}
                    <script
                         type="application/ld+json"
                         // Keep constants (about/sections) in EN for consistency; localized headline/description.
                         dangerouslySetInnerHTML={{
                              __html: JSON.stringify({
                                   '@context': 'https://schema.org',
                                   '@type': 'TechArticle',
                                   headline: tTZ('seo.ld.headline'),
                                   description: tTZ('seo.description'),
                                   inLanguage: i18n.language,
                                   mainEntityOfPage: 'https://qption.com/trading-strategy/tweezer',
                                   image:
                                        'https://qption.com/videos/tweezer-strategy/tweezer-strategy.png',
                                   publisher: { '@type': 'Organization', name: 'Qption' },
                                   about: [
                                        { '@type': 'Thing', name: 'Tweezer Top' },
                                        { '@type': 'Thing', name: 'Tweezer Bottom' },
                                        { '@type': 'Thing', name: 'Candlestick Reversal Patterns' },
                                        { '@type': 'Thing', name: 'Price Action Trading' },
                                        { '@type': 'Thing', name: 'Support and Resistance' },
                                        { '@type': 'Thing', name: 'RSI Confirmation' },
                                        { '@type': 'Thing', name: 'Bullish Reversal' },
                                        { '@type': 'Thing', name: 'Bearish Reversal' },
                                        { '@type': 'Thing', name: 'Risk Management' }
                                   ],
                                   articleSection: [
                                        'Tweezers Strategy',
                                        'Overview',
                                        'Tweezer Top Strategy',
                                        'Tweezer Bottom Strategy',
                                        'Using the Tweezers Strategy',
                                        'Pros and Cons'
                                   ],
                                   additionalProperty: [
                                        {
                                             '@type': 'PropertyValue',
                                             name: 'Pattern Structure',
                                             value:
                                                  'Two consecutive candlesticks with nearly identical highs (Tweezer Top) or lows (Tweezer Bottom)'
                                        },
                                        {
                                             '@type': 'PropertyValue',
                                             name: 'Confirmation Tools',
                                             value: 'RSI, Support and Resistance Levels, Trend Context'
                                        },
                                        {
                                             '@type': 'PropertyValue',
                                             name: 'Risk Control',
                                             value:
                                                  'Stop-loss above Tweezer Top or below Tweezer Bottom for protection against failed reversals'
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
                         className="text-green-100 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 text-lg leading-8 px-4"
                    >
                         <div className="font-normal lg:my-12 my-4 flex text-lg leading-8 flex-col items-start w-full max-w-7xl mx-auto">
                              {/* Breadcrumb */}
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   className="my-6"
                              >
                                   <Link
                                        href="/trading-strategy"
                                        className="text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2"
                                   >
                                        <FaChartLine className="text-lg" />
                                        <span className="text-lg">{tTZ('breadcrumb.tradingStrategy')}</span>
                                   </Link>
                              </motion.div>

                              {/* Title */}
                              <div className="text-center my-6 w-full">
                                   <span className="text-3xl md:text-4xl font-bold text-green-500">
                                        {tTZ('hero.title')}
                                   </span>
                                   {tTZ('hero.subtitle') && (
                                        <p
                                             className={`mt-4 max-w-7xl mx-auto text-center `}
                                        >
                                             {tTZ('hero.subtitle')}
                                        </p>
                                   )}
                              </div>

                              {/* CTA */}
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.2 }}
                                   className="mb-8 w-full"
                              >
                                   <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
                                             <div className="text-green-100 text-lg">{tTZ('cta.ready')}</div>
                                             <Registeration handleClose={handleClose} open={openLogin} isRegister />
                                             <Button
                                                  onClick={handleOpen}
                                                  className="normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
                                                  variant="contained"
                                                  size="medium"
                                             >
                                                  <HowToRegIcon className="mr-2" />
                                                  {tTZ('cta.startTrading')}
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
                                        src="/videos/tweezer-strategy/tweezer-strategy.mp4"
                                        poster="/videos/tweezer-strategy/tweezer-strategy.png"
                                        controls
                                        playsInline
                                        preload="metadata"
                                        style={{ width: '100%', height: 'auto', borderRadius: 12 }}
                                        aria-description={tTZ('video.aria')}
                                   />
                              </motion.div>

                              {/* Overview */}
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.2 }}
                                   className="mb-8 w-full"
                              >
                                   <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                        <div className="mt-6 space-y-8">
                                             <div className="p-4 rounded">
                                                  <span className="text-2xl font-semibold text-green-500">
                                                       {tTZ('overview.title')}
                                                  </span>
                                                  <ul className="text-lg leading-8 mt-2 list-inside marker:text-xl space-y-2">
                                                       {[1, 2, 3].map((i) => (
                                                            <li key={i}>
                                                                 <span>{tTZ(`overview.items.${i}`)}</span>
                                                            </li>
                                                       ))}
                                                  </ul>
                                             </div>

                                             {/* Tweezer Top */}
                                             <div className="p-4 rounded">
                                                  <span className="text-xl font-semibold text-green-700">
                                                       {tTZ('top.title')}
                                                  </span>
                                                  <ul className="mt-2 list-disc list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                       {[1, 2, 3, 4].map((i) => (
                                                            <li key={i}>
                                                                 <span className="text-green-200">
                                                                      {tTZ(`top.items.${i}.label`)}:
                                                                 </span>
                                                                 <span className="text-green-100 mx-2">
                                                                      {tTZ(`top.items.${i}.text`)}
                                                                 </span>
                                                            </li>
                                                       ))}
                                                  </ul>
                                             </div>

                                             {/* Tweezer Bottom */}
                                             <div className="p-4 rounded">
                                                  <span className="text-xl font-semibold text-green-700">
                                                       {tTZ('bottom.title')}
                                                  </span>
                                                  <ul className="mt-2 list-disc list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                       {[1, 2, 3, 4].map((i) => (
                                                            <li key={i}>
                                                                 <span className="text-green-200">
                                                                      {tTZ(`bottom.items.${i}.label`)}:
                                                                 </span>
                                                                 <span className="text-green-100 mx-2">
                                                                      {tTZ(`bottom.items.${i}.text`)}
                                                                 </span>
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
                                   <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                        <div className="mt-8 p-4 rounded">
                                             <span className="text-xl font-semibold text-green-700">
                                                  {tTZ('use.title')}
                                             </span>
                                             <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                  {[1, 2, 3].map((i) => (
                                                       <li key={i}>
                                                            <span>{tTZ(`use.items.${i}`)}</span>
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
                                   <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                        <div className="mt-8 space-y-4">
                                             {/* Pros */}
                                             <div className="p-4 rounded">
                                                  <span className="text-xl font-semibold text-green-700">
                                                       {tTZ('pros.title')}
                                                  </span>
                                                  <ul className="mt-2 text-lg leading-8 list-inside marker:text-xl space-y-2">
                                                       {[1, 2, 3].map((i) => (
                                                            <li key={i}>
                                                                 <span>{tTZ(`pros.items.${i}`)}</span>
                                                            </li>
                                                       ))}
                                                  </ul>
                                             </div>
                                             {/* Cons */}
                                             <div className="p-4 rounded">
                                                  <span className="text-xl font-semibold text-green-700">
                                                       {tTZ('cons.title')}
                                                  </span>
                                                  <ul className="mt-2 text-lg leading-8 list-inside marker:text-xl space-y-2">
                                                       {[1, 2, 3].map((i) => (
                                                            <li key={i}>
                                                                 <span>{tTZ(`cons.items.${i}`)}</span>
                                                            </li>
                                                       ))}
                                                  </ul>
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
                    ['common', 'nav', 'footer', 'auth', 'tweezer'],
                    i18nConfig
               ))
          }
     }
}
