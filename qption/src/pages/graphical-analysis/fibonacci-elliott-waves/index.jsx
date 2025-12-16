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

export default function Fibonacci() {
     const { t: gf, i18n } = useTranslation('fibonacci')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     const openLoginState = React.useState(false)
     const [openLogin, setOpenLogin] = openLoginState
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     const jsonLd = gf('seo.ld', { returnObjects: true })

     return (
          <>
               <Head>
                    <title>{gf('seo.title')}</title>
                    <meta name="description" content={gf('seo.description')} />
                    <meta name="keywords" content={gf('seo.keywords')} />
                    <link rel="canonical" href={gf('seo.url')} />
                    <meta property="og:type" content="article" />
                    <meta property="og:title" content={gf('seo.title')} />
                    <meta property="og:description" content={gf('seo.description')} />
                    <meta property="og:url" content={gf('seo.url')} />
                    <meta property="og:image" content={gf('seo.image')} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={gf('seo.title')} />
                    <meta name="twitter:description" content={gf('seo.description')} />
                    <meta name="twitter:image" content={gf('seo.image')} />
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
                         className="font-normal text-green-100 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 text-lg leading-8"
                    >
                         <div className="my-12 flex flex-col items-start w-full max-w-7xl mx-auto ">
                              {/* Back to Graphical Analysis */}
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   className="my-6"
                              >
                                   <Link
                                        href="/graphical-analysis"
                                        className="text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2 px-2"
                                   >
                                        <FaChartLine className="text-lg" />
                                        <span className="text-lg">{gf('ui.backToGraphical')}</span>
                                   </Link>
                              </motion.div>

                              {/* Title */}
                              <div className="p-4">
                                   <div className="text-center my-6">
                                        <span className="text-2xl font-bold text-green-500">
                                             {gf('page.title')}
                                        </span>
                                   </div>

                                   {/* CTA strip */}
                                   <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="mb-8 w-full"
                                   >
                                        <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <div className="rounded flex items-center justify-between text-lg">
                                                  {gf('cta.ready')}
                                                  <Registeration handleClose={handleClose} open={openLogin} isRegister={true} />
                                                  <Button
                                                       onClick={handleOpen}
                                                       className="normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
                                                       variant="contained"
                                                       size="medium"
                                                  >
                                                       <HowToRegIcon className="mr-2" />
                                                       {gf('cta.start')}
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
                                             src="/videos/fibonacci-elliott-waves/fibonacci-elliott-waves.mp4"
                                             poster="/videos/fibonacci-elliott-waves/fibonacci-elliott-waves.png"
                                             controls
                                             playsInline
                                             preload="metadata"
                                             style={{ width: '100%', height: 'auto', borderRadius: 12 }}
                                             aria-description={gf('video.aria')}
                                        />
                                   </motion.div>

                                   {/* Content (you can progressively move these strings into i18n) */}
                                   {/* --- Fibonacci Retracements Overview --- */}
                                   <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="mb-8 w-full"
                                   >
                                        <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <div className="mt-6 space-y-8">
                                                  <div className="p-4 rounded text-lg leading-8 ">
                                                       <span className="text-xl font-semibold text-green-700">
                                                            {gf('sections.fibOverview.h')}
                                                       </span>
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2">
                                                            <li><span>{gf('sections.fibOverview.i1')}</span></li>
                                                            <li><span>{gf('sections.fibOverview.i2')}</span></li>
                                                            <li><span>{gf('sections.fibOverview.i3')}</span></li>
                                                       </ul>
                                                  </div>

                                                  <div className="p-4 rounded ">
                                                       <span className="text-xl font-semibold text-green-700">
                                                            {gf('sections.fibHow.h')}
                                                       </span>
                                                       <ul className="mt-2 list-decimal list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            <li className="text-green-200">
                                                                 {gf('sections.fibHow.s1.h')}
                                                                 <span className="text-green-100 mx-2">{gf('sections.fibHow.s1.t')}</span>
                                                            </li>
                                                            <li className="text-green-200">
                                                                 {gf('sections.fibHow.s2.h')}
                                                                 <span className="text-green-100 mx-2">{gf('sections.fibHow.s2.t')}</span>
                                                            </li>
                                                            <li className="text-green-200">
                                                                 {gf('sections.fibHow.s3.h')}
                                                                 <span className="text-green-100 mx-2">{gf('sections.fibHow.s3.t')}</span>
                                                            </li>
                                                            <li className="text-green-200">
                                                                 {gf('sections.fibHow.s4.h')}
                                                                 <span className="text-green-100 mx-2">{gf('sections.fibHow.s4.t')}</span>
                                                            </li>
                                                       </ul>
                                                  </div>

                                                  <div className="p-4 rounded ">
                                                       <span className="text-2xl font-semibold text-green-700">
                                                            {gf('sections.fibTech.h')}
                                                       </span>

                                                       <div className="mt-4">
                                                            <span className="text-xl font-semibold text-green-200">{gf('sections.fibTech.t1.h')}</span>
                                                            <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                                 <li><span>{gf('sections.fibTech.t1.i1')}</span></li>
                                                                 <li><span>{gf('sections.fibTech.t1.i2')}</span></li>
                                                            </ul>
                                                       </div>

                                                       <div className="mt-4">
                                                            <span className="text-2xl font-semibold text-green-200">{gf('sections.fibTech.t2.h')}</span>
                                                            <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                                 <li><span>{gf('sections.fibTech.t2.i1')}</span></li>
                                                                 <li><span>{gf('sections.fibTech.t2.i2')}</span></li>
                                                            </ul>
                                                       </div>
                                                  </div>

                                                  <div className="p-4 rounded ">
                                                       <span className="text-2xl font-semibold text-green-700">
                                                            {gf('sections.fibProsCons.h')}
                                                       </span>
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            <li className="text-green-200">
                                                                 {gf('sections.fibProsCons.p1.h')}
                                                                 <span className="text-green-100 mx-2">{gf('sections.fibProsCons.p1.t')}</span>
                                                            </li>
                                                            <li className="text-green-200">
                                                                 {gf('sections.fibProsCons.p2.h')}
                                                                 <span className="text-green-100 mx-2">{gf('sections.fibProsCons.p2.t')}</span>
                                                            </li>
                                                            <li className="text-green-200">
                                                                 {gf('sections.fibProsCons.c1.h')}
                                                                 <span className="text-green-100 mx-2">{gf('sections.fibProsCons.c1.t')}</span>
                                                            </li>
                                                       </ul>
                                                  </div>
                                             </div>
                                        </div>
                                   </motion.div>

                                   {/* --- Elliott Waves --- */}
                                   <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="mb-8 w-full"
                                   >
                                        <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <div className="mt-8 space-y-8">
                                                  <div className="p-4 rounded ">
                                                       <span className="text-xl font-semibold text-green-700">{gf('sections.ewOverview.h')}</span>
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            <li><span>{gf('sections.ewOverview.i1')}</span></li>
                                                            <li><span>{gf('sections.ewOverview.i2')}</span></li>
                                                            <li><span>{gf('sections.ewOverview.i3')}</span></li>
                                                       </ul>
                                                  </div>

                                                  <div className="p-4 rounded ">
                                                       <span className="text-xl font-semibold text-green-700">{gf('sections.ewHow.h')}</span>
                                                       <ul className="mt-2 list-decimal list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            <li className="text-green-200">{gf('sections.ewHow.s1.h')}<span className="text-green-100 mx-2">{gf('sections.ewHow.s1.t')}</span></li>
                                                            <li className="text-green-200">{gf('sections.ewHow.s2.h')}<span className="text-green-100 mx-2">{gf('sections.ewHow.s2.t')}</span></li>
                                                            <li className="text-green-200">{gf('sections.ewHow.s3.h')}<span className="text-green-100 mx-2">{gf('sections.ewHow.s3.t')}</span></li>
                                                            <li className="text-green-200">{gf('sections.ewHow.s4.h')}<span className="text-green-100 mx-2">{gf('sections.ewHow.s4.t')}</span></li>
                                                       </ul>
                                                  </div>

                                                  <div className="p-4 rounded ">
                                                       <span className="text-2xl font-semibold text-green-700">{gf('sections.ewTech.h')}</span>
                                                       <div className="mt-4">
                                                            <span className="text-2xl font-semibold text-green-200">{gf('sections.ewTech.t1.h')}</span>
                                                            <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                                 <li><span>{gf('sections.ewTech.t1.i1')}</span></li>
                                                                 <li><span>{gf('sections.ewTech.t1.i2')}</span></li>
                                                            </ul>
                                                       </div>
                                                       <div className="mt-4">
                                                            <span className="text-2xl font-semibold text-green-200">{gf('sections.ewTech.t2.h')}</span>
                                                            <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                                 <li><span>{gf('sections.ewTech.t2.i1')}</span></li>
                                                                 <li><span>{gf('sections.ewTech.t2.i2')}</span></li>
                                                            </ul>
                                                       </div>
                                                  </div>

                                                  <div className="p-4 rounded ">
                                                       <span className="text-2xl font-semibold text-green-700">{gf('sections.ewProsCons.h')}</span>
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            <li><span>{gf('sections.ewProsCons.p1')}</span></li>
                                                            <li><span>{gf('sections.ewProsCons.p2')}</span></li>
                                                            <li><span>{gf('sections.ewProsCons.c1')}</span></li>
                                                            <li><span>{gf('sections.ewProsCons.c2')}</span></li>
                                                       </ul>
                                                  </div>
                                             </div>
                                        </div>
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
                    ['common', 'nav', 'footer', 'auth', 'graphicalAnalysis', 'fibonacci'],
                    i18nConfig
               )),
          },
     }
}
