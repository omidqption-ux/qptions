'use client'
import React from 'react'
import Link from 'next/link'
import SlideUpSection from '@/components/SlideUp/SlideUp'
import dynamic from 'next/dynamic'
const Registeration = dynamic(() => import('@/components/RegisterationModal/Registeration'), { ssr: false })
import { Button } from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import { motion } from 'framer-motion'
import { FaChartLine } from 'react-icons/fa'
import Head from 'next/head'

import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../../next-i18next.config.cjs'
import SEOAlternates from '@/components/SEOAlternates'

export default function TrendContinuation() {
     const { t: gc, i18n } = useTranslation('graphicalContinuation')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     // Structured data (if present in locale)
     const jsonLd = gc('seo.ld', { returnObjects: true })

     // Pull translated arrays/objects
     const overviewItems = gc('sections.overview.items', { returnObjects: true }) || []
     const patterns = gc('sections.patterns.list', { returnObjects: true }) || [] // [{h, items:[]}, ...]
     const benefitsItems = gc('sections.benefits.items', { returnObjects: true }) || []
     const limitationsItems = gc('sections.limitations.items', { returnObjects: true }) || []

     return (
          <>
               <Head>
                    {/* SEO from i18n */}
                    <title>{gc('seo.title')}</title>
                    <meta name="description" content={gc('seo.description')} />
                    <meta name="keywords" content={gc('seo.keywords')} />
                    <link rel="canonical" href={gc('seo.url')} />

                    {/* Open Graph / Twitter */}
                    <meta property="og:type" content="article" />
                    <meta property="og:title" content={gc('seo.title')} />
                    <meta property="og:description" content={gc('seo.description')} />
                    <meta property="og:url" content={gc('seo.url')} />
                    <meta property="og:image" content={gc('seo.image')} />
                    <meta property="og:image:alt" content={gc('seo.ogAlt')} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={gc('seo.title')} />
                    <meta name="twitter:description" content={gc('seo.description')} />
                    <meta name="twitter:image" content={gc('seo.image')} />

                    {jsonLd && (
                         <script
                              type="application/ld+json"
                              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                         />
                    )}
               </Head>

               <SEOAlternates />

               <SlideUpSection>
                    <main
                         dir={isRTL ? 'rtl' : 'ltr'}
                         className="font-normal px-4 text-green-100 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 text-lg leading-8"
                    >
                         <div className="lg:my-12 my-4 text-lg leading-8 flex flex-col items-start w-full max-w-7xl mx-auto">
                              {/* Back link */}
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="my-6">
                                   <Link
                                        href="/graphical-analysis"
                                        className="text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2"
                                   >
                                        <FaChartLine className="text-lg" />
                                        <span className="text-lg">{gc('ui.backToGraphical')}</span>
                                   </Link>
                              </motion.div>

                              {/* Page title */}
                              <div className="text-center my-5 w-full">
                                   <span className="text-2xl font-bold text-green-500">
                                        {gc('page.title')}
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
                                        <div className="w-full px-2">
                                             <div className="rounded flex flex-col md:flex-row items-center justify-between gap-4 text-lg text-green-100">
                                                  <div>{gc('cta.ready')}</div>
                                                  <Button
                                                       onClick={handleOpen}
                                                       className="normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
                                                       variant="contained"
                                                       size="medium"
                                                  >
                                                       <HowToRegIcon className="mr-2" />
                                                       {gc('cta.start')}
                                                  </Button>
                                             </div>
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
                                        src="/videos/trend-continuation-patterns/trend-continuation-patterns.mp4"
                                        poster="/videos/trend-continuation-patterns/trend-continuation-patterns.png"
                                        controls
                                        playsInline
                                        preload="metadata"
                                        style={{ width: '100%', height: 'auto', borderRadius: 12 }}
                                        aria-description={gc('video.aria')}
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
                                        <span className="text-2xl font-semibold text-green-700">
                                             {gc('sections.overview.h')}
                                        </span>
                                        <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                             {Array.isArray(overviewItems) &&
                                                  overviewItems.map((line, idx) => (
                                                       <li key={`ov-${idx}`}><span>{line}</span></li>
                                                  ))}
                                        </ul>
                                   </div>
                              </motion.div>

                              {/* Common Patterns (each with its own sublist) */}
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.2 }}
                                   className="mb-8 w-full"
                              >
                                   <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                        <span className="text-2xl font-semibold text-green-700">
                                             {gc('sections.patterns.h')}
                                        </span>

                                        <div className="mt-4 space-y-6">
                                             {Array.isArray(patterns) &&
                                                  patterns.map((pat, pIdx) => (
                                                       <div key={`pt-${pIdx}`}>
                                                            <span className="text-lg font-semibold">{pat?.h}</span>
                                                            <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                                 {(pat?.items || []).map((line, iIdx) => (
                                                                      <li key={`pt-${pIdx}-i-${iIdx}`}>
                                                                           <span>{line}</span>
                                                                      </li>
                                                                 ))}
                                                            </ul>
                                                       </div>
                                                  ))}
                                        </div>
                                   </div>
                              </motion.div>

                              {/* Benefits */}
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.2 }}
                                   className="mb-8 w-full"
                              >
                                   <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                        <span className="text-2xl font-semibold text-green-700">
                                             {gc('sections.benefits.h')}
                                        </span>
                                        <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                             {Array.isArray(benefitsItems) &&
                                                  benefitsItems.map((line, idx) => (
                                                       <li key={`bn-${idx}`}><span>{line}</span></li>
                                                  ))}
                                        </ul>
                                   </div>
                              </motion.div>

                              {/* Limitations */}
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.2 }}
                                   className="mb-8 w-full"
                              >
                                   <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                        <span className="text-2xl font-semibold text-green-700">
                                             {gc('sections.limitations.h')}
                                        </span>
                                        <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                             {Array.isArray(limitationsItems) &&
                                                  limitationsItems.map((line, idx) => (
                                                       <li key={`lm-${idx}`}><span>{line}</span></li>
                                                  ))}
                                        </ul>
                                   </div>
                              </motion.div>
                         </div>
                    </main>

                    <Registeration handleClose={handleClose} open={openLogin} isRegister={true} />
               </SlideUpSection>
          </>
     )
}

export async function getServerSideProps({ locale }) {
     return {
          props: {
               ...(await serverSideTranslations(
                    locale,
                    ['common', 'nav', 'footer', 'auth', 'graphicalAnalysis', 'graphicalContinuation'],
                    i18nConfig
               )),
          },
     }
}
