'use client'

import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import SlideUpSection from '@/components/SlideUp/SlideUp'
import { Button } from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import { motion } from 'framer-motion'
import { FaChartLine, FaInfoCircle, FaLightbulb, FaExclamationTriangle } from 'react-icons/fa'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../../next-i18next.config.cjs'
import SEOAlternates from '@/components/SEOAlternates'

const Registeration = dynamic(
     () => import('@/components/RegisterationModal/Registeration'),
     { ssr: false }
)

export default function MovingAveragesPage() {
     const { t: tMA, i18n } = useTranslation('moving-Averages')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     return (
          <>
               <Head>
                    {/* Localized SEO */}
                    <title>{tMA('seo.title')}</title>
                    <meta name="description" content={tMA('seo.description')} />
                    <meta name="keywords" content={tMA('seo.keywords')} />

                    {/* Canonical */}
                    <link rel="canonical" href="https://qption.com/technical-analysis/moving-averages" />

                    {/* Open Graph */}
                    <meta property="og:type" content="article" />
                    <meta property="og:site_name" content="Qption" />
                    <meta property="og:title" content={tMA('seo.title')} />
                    <meta property="og:description" content={tMA('seo.description')} />
                    <meta property="og:url" content="https://qption.com/technical-analysis/moving-averages" />
                    <meta property="og:image" content="https://qption.com/videos/moving-average/moving-average.png" />
                    <meta property="og:image:alt" content={tMA('seo.ogAlt')} />
                    <meta property="og:image:width" content="1200" />
                    <meta property="og:image:height" content="630" />

                    {/* Twitter */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={tMA('seo.title')} />
                    <meta name="twitter:description" content={tMA('seo.description')} />
                    <meta name="twitter:image" content="https://qption.com/videos/moving-average/moving-average.png" />

                    {/* JSON-LD */}
                    <script
                         type="application/ld+json"
                         dangerouslySetInnerHTML={{
                              __html: JSON.stringify({
                                   '@context': 'https://schema.org',
                                   '@type': 'TechArticle',
                                   headline: tMA('seo.ld.headline'),
                                   description: tMA('seo.description'),
                                   inLanguage: i18n.language,
                                   mainEntityOfPage: 'https://qption.com/technical-analysis/moving-averages',
                                   image: 'https://qption.com/videos/moving-average/moving-average.png',
                                   publisher: { '@type': 'Organization', name: 'Qption' },
                                   about: [
                                        { '@type': 'Thing', name: 'Moving Average' },
                                        { '@type': 'Thing', name: 'Simple Moving Average (SMA)' },
                                        { '@type': 'Thing', name: 'Exponential Moving Average (EMA)' },
                                        { '@type': 'Thing', name: 'Golden Cross' },
                                        { '@type': 'Thing', name: 'Death Cross' },
                                        { '@type': 'Thing', name: 'Moving Average Ribbon' }
                                   ],
                                   articleSection: [
                                        'Overview',
                                        'How Moving Averages Work',
                                        'Key Strategies',
                                        'Limitations'
                                   ]
                              })
                         }}
                    />
               </Head>

               <SEOAlternates />

               <SlideUpSection>
                    <main
                         dir={isRTL ? 'rtl' : 'ltr'}
                         className="font-normal text-green-100 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 text-lg leading-8"
                    >
                         <div className="w-full max-w-7xl px-4 text-lg leading-8">
                              {/* Breadcrumb */}
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                                   <Link
                                        href="/trading-strategy"
                                        className="text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2"
                                   >
                                        <FaChartLine className="text-lg" />
                                        <span className="text-lg">{tMA('breadcrumb.tradingStrategy')}</span>
                                   </Link>
                              </motion.div>

                              {/* Hero */}
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.3 }}
                                   className="text-center mb-12"
                              >
                                   <h1 className="text-3xl md:text-4xl font-bold text-green-500 mb-4">
                                        {tMA('hero.title')}
                                   </h1>
                                   <p className={`text-green-100 text-lg max-w-3xl mx-auto ${isRTL ? 'text-right' : 'text-left'}`}>
                                        {tMA('hero.subtitle')}
                                   </p>
                              </motion.div>

                              {/* Video */}
                              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full my-5 bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-1 md:p-4 border border-green-500/20 flex flex-col">
                                   <video
                                        src="/videos/moving-average/moving-average.mp4"
                                        poster="/videos/moving-average/moving-average.png"
                                        controls
                                        playsInline
                                        preload="metadata"
                                        style={{ width: '100%', height: 'auto', borderRadius: 12 }}
                                        aria-description={tMA('video.aria')}
                                   />
                              </motion.div>

                              {/* CTA */}
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
                                   <div className="bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                             <div className="text-green-100 text-lg">{tMA('cta.ready')}</div>
                                             <Button
                                                  onClick={handleOpen}
                                                  className="normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
                                                  variant="contained"
                                                  size="medium"
                                             >
                                                  <HowToRegIcon className="mr-2" />
                                                  {tMA('cta.startTrading')}
                                             </Button>
                                        </div>
                                   </div>
                              </motion.div>

                              <div className="space-y-8">
                                   {/* Overview */}
                                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                        <div className="flex items-center gap-3 mb-4">
                                             <FaInfoCircle className="text-green-500 text-2xl" />
                                             <h2 className="text-2xl font-bold text-green-700">{tMA('overview.title')}</h2>
                                        </div>
                                        <ul className="space-y-4">
                                             {[1, 2, 3].map(i => (
                                                  <li key={i} className="flex items-start gap-3">
                                                       <span className="text-green-500 mt-1">•</span>
                                                       <span className="text-green-100">{tMA(`overview.items.${i}`)}</span>
                                                  </li>
                                             ))}
                                        </ul>
                                   </motion.div>

                                   {/* How it works */}
                                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                        <div className="flex items-center gap-3 mb-4">
                                             <FaLightbulb className="text-green-500 text-2xl" />
                                             <h2 className="text-2xl font-bold text-green-700">{tMA('how.title')}</h2>
                                        </div>
                                        <div className="space-y-4">
                                             {[1, 2, 3].map(i => (
                                                  <div key={i} className="flex items-start gap-3">
                                                       <span className="text-green-200 mt-1">{i}.</span>
                                                       <div>
                                                            <h3 className="text-green-200  mb-1">{tMA(`how.blocks.${i}.title`)}</h3>
                                                            <p className="text-green-100">{tMA(`how.blocks.${i}.desc`)}</p>
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                   </motion.div>

                                   {/* Key Strategies */}
                                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                        <div className="flex items-center gap-3 mb-4">
                                             <FaChartLine className="text-green-500 text-2xl" />
                                             <h2 className="text-2xl font-bold text-green-700">{tMA('strategies.title')}</h2>
                                        </div>

                                        {/* 1. Crossover */}
                                        <div>
                                             <h3 className="text-xl  text-green-200 mb-3">{tMA('strategies.crossover.title')}</h3>
                                             <ul className="space-y-3 marker:text-green-200">
                                                  {[1, 2].map(i => (
                                                       <li key={i} className="flex items-start gap-3">
                                                            <span className="text-green-500 mt-1">•</span>
                                                            <span className="text-green-100">{tMA(`strategies.crossover.items.${i}`)}</span>
                                                       </li>
                                                  ))}
                                             </ul>
                                        </div>

                                        {/* 2. Dynamic SR */}
                                        <div className="mt-6">
                                             <h3 className="text-xl  text-green-200 mb-3">{tMA('strategies.dynamicSR.title')}</h3>
                                             <ul className="space-y-3 marker:text-green-200">
                                                  {[1, 2].map(i => (
                                                       <li key={i} className="flex items-start gap-3">
                                                            <span className="text-green-500 mt-1">•</span>
                                                            <span className="text-green-100">{tMA(`strategies.dynamicSR.items.${i}`)}</span>
                                                       </li>
                                                  ))}
                                             </ul>
                                        </div>

                                        {/* 3. Ribbon */}
                                        <div className="mt-6">
                                             <h3 className="text-xl  text-green-200 mb-3">{tMA('strategies.ribbon.title')}</h3>
                                             <ul className="space-y-3 marker:text-green-200">
                                                  {[1, 2].map(i => (
                                                       <li key={i} className="flex items-start gap-3">
                                                            <span className="text-green-500 mt-1">•</span>
                                                            <span className="text-green-100">{tMA(`strategies.ribbon.items.${i}`)}</span>
                                                       </li>
                                                  ))}
                                             </ul>
                                        </div>
                                   </motion.div>

                                   {/* Limitations */}
                                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                        <div className="flex items-center gap-3 mb-4">
                                             <FaExclamationTriangle className="text-green-500 text-2xl" />
                                             <h2 className="text-2xl font-bold text-green-700">{tMA('limits.title')}</h2>
                                        </div>
                                        <ul className="space-y-4">
                                             {[1, 2].map(i => (
                                                  <li key={i} className="flex items-start gap-3">
                                                       <span className="text-green-500 mt-1">•</span>
                                                       <span className="text-green-100">{tMA(`limits.items.${i}`)}</span>
                                                  </li>
                                             ))}
                                        </ul>
                                   </motion.div>
                              </div>
                         </div>

                         {/* modal */}
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
                    ['common', 'nav', 'footer', 'auth', 'moving-Averages'],
                    i18nConfig
               ))
          }
     }
}
