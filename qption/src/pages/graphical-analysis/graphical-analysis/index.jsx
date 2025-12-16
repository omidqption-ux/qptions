'use client'
import React from 'react'
import Link from 'next/link'
import SlideUpSection from '@/components/SlideUp/SlideUp'
import dynamic from 'next/dynamic'
import Head from 'next/head'
const Registeration = dynamic(() => import('@/components/RegisterationModal/Registeration'), { ssr: false })
import { Button } from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import { motion } from 'framer-motion'
import { FaChartLine } from 'react-icons/fa'

// i18n
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../../next-i18next.config.cjs'
import SEOAlternates from '@/components/SEOAlternates'

export default function GraphicalAnalysisPage() {
     const { t: ga, i18n } = useTranslation('graphical-Analysis')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     const jsonLd = ga('seo.ld', { returnObjects: true })

     return (
          <>
               <Head>
                    {/* SEO */}
                    <title>{ga('seo.title')}</title>
                    <meta name="description" content={ga('seo.description')} />
                    <meta name="keywords" content={ga('seo.keywords')} />
                    <link rel="canonical" href={ga('seo.url')} />
                    <meta name="robots" content="index,follow" />

                    {/* Open Graph / Twitter */}
                    <meta property="og:type" content="article" />
                    <meta property="og:title" content={ga('seo.title')} />
                    <meta property="og:description" content={ga('seo.description')} />
                    <meta property="og:url" content={ga('seo.url')} />
                    <meta property="og:image" content={ga('seo.image', '')} />
                    <meta property="og:image:alt" content={ga('seo.ogAlt', '')} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={ga('seo.title')} />
                    <meta name="twitter:description" content={ga('seo.description')} />
                    <meta name="twitter:image" content={ga('seo.image', '')} />

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
                         <Registeration handleClose={handleClose} open={openLogin} isRegister={true} />

                         <div className="lg:my-12 my-4 text-lg leading-8 flex flex-col items-start w-full max-w-7xl mx-auto">
                              {/* Back link */}
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="my-6">
                                   <Link
                                        href="/graphical-analysis"
                                        className="text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2"
                                   >
                                        <FaChartLine className="text-lg" />
                                        <span className="text-lg">{ga('ui.backToGraphical')}</span>
                                   </Link>
                              </motion.div>

                              {/* Title */}
                              <div className="text-center my-6 w-full">
                                   <span className="text-2xl font-bold text-green-500">
                                        {ga('page.title')}
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
                                             <div className="rounded flex justify-between text-lg items-center">
                                                  {ga('cta.ready')}
                                                  <Button
                                                       onClick={handleOpen}
                                                       className="normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
                                                       variant="contained"
                                                       size="medium"
                                                  >
                                                       <HowToRegIcon className="mr-2" />
                                                       {ga('cta.start')}
                                                  </Button>
                                             </div>
                                        </div>
                                   </div>
                              </motion.div>

                              {/* Overview */}
                              <section className="py-4 w-full">
                                   <span className="text-2xl font-semibold my-6 text-green-700">
                                        {ga('sections.overview.h')}
                                   </span>

                                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="my-6 w-full">
                                        <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <ul className="mt-2 my-6 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                  <li><span>{ga('sections.overview.items.0')}</span></li>
                                                  <li><span>{ga('sections.overview.items.1')}</span></li>
                                                  <li><span>{ga('sections.overview.items.2')}</span></li>
                                             </ul>
                                        </div>
                                   </motion.div>
                              </section>

                              {/* Key Concepts */}
                              <section className="py-4 w-full">
                                   <span className="text-2xl font-semibold my-6 text-green-700">
                                        {ga('sections.key.h')}
                                   </span>

                                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8 w-full my-6">
                                        <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <ul className="mt-2 list-decimal list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                  <li><span>{ga('sections.key.items.trends')}</span></li>
                                                  <li><span>{ga('sections.key.items.sr')}</span></li>
                                                  <li><span>{ga('sections.key.items.patterns')}</span></li>
                                                  <li><span>{ga('sections.key.items.volume')}</span></li>
                                             </ul>
                                        </div>
                                   </motion.div>
                              </section>

                              {/* Techniques: Trend Lines */}
                              <section className="py-4 w-full">
                                   <span className="text-2xl font-semibold my-6 text-green-700">
                                        {ga('sections.tech.h')}
                                   </span>

                                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8 w-full my-6">
                                        <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <div className="mt-4">
                                                  <span className="text-lg font-semibold">{ga('sections.tech.trend.h')}</span>
                                                  <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                       <li><span>{ga('sections.tech.trend.items.0')}</span></li>
                                                       <li><span>{ga('sections.tech.trend.items.1')}</span></li>
                                                  </ul>
                                             </div>
                                        </div>
                                   </motion.div>

                                   {/* Techniques: S/R */}
                                   <div className="mt-4">
                                        <span className="text-lg font-semibold my-6 text-green-700">{ga('sections.tech.sr.h')}</span>
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8 w-full my-6">
                                             <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                                  <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                       <li><span>{ga('sections.tech.sr.items.0')}</span></li>
                                                       <li><span>{ga('sections.tech.sr.items.1')}</span></li>
                                                  </ul>
                                             </div>
                                        </motion.div>
                                   </div>

                                   {/* Techniques: Chart Patterns */}
                                   <div className="mt-4">
                                        <span className="text-lg font-semibold my-6 text-green-700">{ga('sections.tech.patterns.h')}</span>
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8 w-full my-6">
                                             <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                                  <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                       <li><span>{ga('sections.tech.patterns.items.0')}</span></li>
                                                       <li><span>{ga('sections.tech.patterns.items.1')}</span></li>
                                                  </ul>
                                             </div>
                                        </motion.div>
                                   </div>

                                   {/* Techniques: Candlesticks */}
                                   <div className="mt-4">
                                        <span className="text-lg font-semibold my-6 text-green-700">{ga('sections.tech.candles.h')}</span>
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8 w-full my-6">
                                             <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                                  <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                       <li><span>{ga('sections.tech.candles.items.0')}</span></li>
                                                       <li><span>{ga('sections.tech.candles.items.1')}</span></li>
                                                  </ul>
                                             </div>
                                        </motion.div>
                                   </div>
                              </section>

                              {/* Tools */}
                              <section className="py-4 w-full">
                                   <span className="text-2xl font-semibold my-6 text-green-700">
                                        {ga('sections.tools.h')}
                                   </span>
                                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8 w-full my-6">
                                        <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <ul className="mt-2 list-decimal list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                  <li><span>{ga('sections.tools.items.ma')}</span></li>
                                                  <li><span>{ga('sections.tools.items.bb')}</span></li>
                                                  <li><span>{ga('sections.tools.items.rsi')}</span></li>
                                                  <li><span>{ga('sections.tools.items.fib')}</span></li>
                                             </ul>
                                        </div>
                                   </motion.div>
                              </section>

                              {/* Benefits */}
                              <section className="py-4 w-full">
                                   <span className="text-2xl font-semibold my-6 text-green-700">
                                        {ga('sections.benefits.h')}
                                   </span>
                                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8 w-full my-6">
                                        <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                  <li><span>{ga('sections.benefits.items.0')}</span></li>
                                                  <li><span>{ga('sections.benefits.items.1')}</span></li>
                                                  <li><span>{ga('sections.benefits.items.2')}</span></li>
                                             </ul>
                                        </div>
                                   </motion.div>
                              </section>

                              {/* Limitations */}
                              <section className="py-4 w-full">
                                   <span className="text-2xl font-semibold my-6 text-green-700">
                                        {ga('sections.limitations.h')}
                                   </span>
                                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8 w-full my-6">
                                        <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                  <li><span>{ga('sections.limitations.items.0')}</span></li>
                                                  <li><span>{ga('sections.limitations.items.1')}</span></li>
                                                  <li><span>{ga('sections.limitations.items.2')}</span></li>
                                             </ul>
                                        </div>
                                   </motion.div>
                              </section>
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
                    ['common', 'nav', 'footer', 'auth', 'graphical-Analysis'],
                    i18nConfig
               )),
          },
     }
}
