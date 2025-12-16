'use client'

import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import SlideUpSection from '@/components/SlideUp/SlideUp'
import { Button } from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import { FaChartLine } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../../next-i18next.config.cjs'

const Registeration = dynamic(
     () => import('@/components/RegisterationModal/Registeration'),
     { ssr: false }
)

export default function Engulfing() {
     const { t: tEng, i18n } = useTranslation('engulfing')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     return (
          <>
               <Head>
                    {/* Localized SEO */}
                    <title>{tEng('seo.title')}</title>
                    <meta name="description" content={tEng('seo.description')} />
                    <meta name="keywords" content={tEng('seo.keywords')} />

                    {/* Canonical */}
                    <link rel="canonical" href="https://qption.com/trading-strategy/engulfing-candlestick" />

                    {/* Open Graph */}
                    <meta property="og:type" content="article" />
                    <meta property="og:title" content={tEng('seo.title')} />
                    <meta property="og:description" content={tEng('seo.description')} />
                    <meta property="og:url" content="https://qption.com/trading-strategy/engulfing-candlestick" />
                    <meta property="og:image" content="https://qption.com/videos/engulfing-candlestick-strategy/engulfing-candlestick-strategy.jpg" />
                    <meta property="og:image:alt" content={tEng('seo.ogAlt')} />
                    <meta property="og:image:width" content="1200" />
                    <meta property="og:image:height" content="630" />

                    {/* Twitter */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={tEng('seo.title')} />
                    <meta name="twitter:description" content={tEng('seo.description')} />
                    <meta name="twitter:image" content="https://qption.com/videos/engulfing-candlestick-strategy/engulfing-candlestick-strategy.jpg" />

                    {/* JSON-LD */}
                    <script
                         type="application/ld+json"
                         dangerouslySetInnerHTML={{
                              __html: JSON.stringify({
                                   '@context': 'https://schema.org',
                                   '@type': 'TechArticle',
                                   headline: tEng('seo.ld.headline'),
                                   description: tEng('seo.description'),
                                   inLanguage: i18n.language,
                                   mainEntityOfPage: 'https://qption.com/trading-strategy/engulfing-candlestick',
                                   image: 'https://qption.com/videos/engulfing-candlestick-strategy/engulfing-candlestick-strategy.jpg',
                                   publisher: { '@type': 'Organization', name: 'Qption' },
                                   about: [
                                        { '@type': 'Thing', name: 'Engulfing Candlestick' },
                                        { '@type': 'Thing', name: 'Bullish Engulfing' },
                                        { '@type': 'Thing', name: 'Bearish Engulfing' },
                                        { '@type': 'Thing', name: 'Reversal Pattern' },
                                        { '@type': 'Thing', name: 'Price Action Trading' },
                                        { '@type': 'Thing', name: 'Support and Resistance' },
                                        { '@type': 'Thing', name: 'Volume Analysis' },
                                        { '@type': 'Thing', name: 'Risk Management' }
                                   ],
                                   articleSection: [
                                        'Engulfing Candlestick Strategy',
                                        'Overview',
                                        'Bullish Engulfing Pattern',
                                        'Bearish Engulfing Pattern',
                                        'Using the Engulfing Candlestick Strategy',
                                        'Pros and Cons'
                                   ]
                              })
                         }}
                    />
               </Head>

               <SlideUpSection>
                    <main
                         dir={isRTL ? 'rtl' : 'ltr'}
                         className="font-normal px-4 text-green-100 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 text-lg leading-8"
                    >
                         <div className="lg:my-12 my-4 text-lg leading-8 flex flex-col items-start w-full max-w-7xl mx-auto">
                              {/* Breadcrumb */}
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="my-6">
                                   <Link
                                        href="/trading-strategy"
                                        className="text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2"
                                   >
                                        <FaChartLine className="text-lg" />
                                        <span className="text-lg">{tEng('breadcrumb.tradingStrategy')}</span>
                                   </Link>
                              </motion.div>

                              {/* Title */}
                              <div className="py-4 w-full">
                                   <div className="text-center my-6">
                                        <span className="text-2xl font-bold text-green-500">
                                             {tEng('hero.title')}
                                        </span>
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
                                                  <div className="text-white text-lg">
                                                       {tEng('cta.ready')}
                                                  </div>
                                                  <Registeration handleClose={handleClose} open={openLogin} isRegister />
                                                  <Button
                                                       onClick={handleOpen}
                                                       className="normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
                                                       variant="contained"
                                                       size="medium"
                                                  >
                                                       <HowToRegIcon className="mr-2" />
                                                       {tEng('cta.startTrading')}
                                                  </Button>
                                             </div>
                                        </div>
                                   </motion.div>

                                   {/* Video */}
                                   <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="w-full my-5 bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-5 md:p-4 border border-green-500/20 flex flex-col"
                                   >
                                        <video
                                             src="/videos/engulfing-candlestick/engulfing-candlestick.mp4"
                                             poster="/videos/engulfing-candlestick/engulfing-candlestick.png"
                                             controls
                                             playsInline
                                             preload="metadata"
                                             style={{ width: '100%', height: 'auto', borderRadius: 12 }}
                                             aria-description={tEng('video.aria')}
                                        />
                                   </motion.div>

                                   {/* Content Blocks */}
                                   <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="mb-8 w-full"
                                   >
                                        <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <div className="mt-6 space-y-8">
                                                  {/* Overview */}
                                                  <div className="p-4 rounded">
                                                       <span className="text-2xl font-semibold text-green-700">
                                                            {tEng('overview.title')}
                                                       </span>
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            {[1, 2, 3].map(i => (
                                                                 <li key={i}>
                                                                      <span>{tEng(`overview.items.${i}`)}</span>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  {/* Bullish Engulfing */}
                                                  <div className="p-4 rounded">
                                                       <span className="text-xl font-semibold text-green-700">
                                                            {tEng('bullish.title')}
                                                       </span>
                                                       <ul className="mt-2 list-disc list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            {[1, 2, 3, 4].map(i => (
                                                                 <li key={i}>
                                                                      <span>{tEng(`bullish.items.${i}`)}</span>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  {/* Bearish Engulfing */}
                                                  <div className="p-4 rounded">
                                                       <span className="text-xl font-semibold text-green-700">
                                                            {tEng('bearish.title')}
                                                       </span>
                                                       <ul className="mt-2 list-disc list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            {[1, 2, 3, 4].map(i => (
                                                                 <li key={i}>
                                                                      <span>{tEng(`bearish.items.${i}`)}</span>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>
                                             </div>
                                        </div>
                                   </motion.div>

                                   {/* Using the Strategy */}
                                   <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="mb-8 w-full"
                                   >
                                        <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <div className="mt-8 p-4 rounded">
                                                  <span className="text-xl font-semibold text-green-700">
                                                       {tEng('using.title')}
                                                  </span>
                                                  <ul className="mt-2 list-inside marker:text-xl space-y-2">
                                                       {[1, 2, 3].map(i => (
                                                            <li key={i}>
                                                                 <span>{tEng(`using.items.${i}`)}</span>
                                                            </li>
                                                       ))}
                                                  </ul>
                                             </div>
                                        </div>
                                   </motion.div>

                                   {/* Pros / Cons */}
                                   <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="mb-8 w-full"
                                   >
                                        <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <div className="mt-8 space-y-4">
                                                  <div className="p-4 rounded">
                                                       <span className="text-xl font-semibold text-green-700">
                                                            {tEng('pros.title')}
                                                       </span>
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2">
                                                            {[1, 2, 3].map(i => (
                                                                 <li key={i}>
                                                                      <span>{tEng(`pros.items.${i}`)}</span>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  <div className="p-4 rounded">
                                                       <span className="text-xl font-semibold text-green-700">
                                                            {tEng('cons.title')}
                                                       </span>
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2">
                                                            {[1, 2, 3].map(i => (
                                                                 <li key={i}>
                                                                      <span>{tEng(`cons.items.${i}`)}</span>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>
                                             </div>
                                        </div>
                                   </motion.div>
                              </div>
                         </div>

                         {/* Modal */}
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
                    ['common', 'nav', 'footer', 'auth', 'engulfing'],
                    i18nConfig
               ))
          }
     }
}
