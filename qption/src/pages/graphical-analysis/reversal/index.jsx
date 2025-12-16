'use client'
import React from 'react'
import Link from 'next/link'
import SlideUpSection from '@/components/SlideUp/SlideUp'
import { Button } from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import { motion } from 'framer-motion'
import { FaChartLine } from 'react-icons/fa'
import dynamic from 'next/dynamic'
const Registeration = dynamic(() => import('@/components/RegisterationModal/Registeration'), { ssr: false })
import Head from 'next/head'

import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../../next-i18next.config.cjs'
import SEOAlternates from '@/components/SEOAlternates'

export default function Reversal() {
     const { t: gr, i18n } = useTranslation('graphicalReversal')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     const jsonLd = gr('seo.ld', { returnObjects: true })

     // ---- Pull translated arrays/strings from i18n ----
     const keyConceptsItems = gr('sections.keyConcepts.items', { returnObjects: true }) || []
     const applyItems = gr('sections.apply.items', { returnObjects: true }) || []
     const exampleText = gr('sections.example.text', { returnObjects: true }) || ''

     return (
          <>
               <Head>
                    <title>{gr('seo.title')}</title>
                    <meta name="description" content={gr('seo.description')} />
                    <meta name="keywords" content={gr('seo.keywords')} />
                    <link rel="canonical" href={gr('seo.url')} />
                    <meta property="og:type" content="article" />
                    <meta property="og:site_name" content="Qption" />
                    <meta property="og:title" content={gr('seo.title')} />
                    <meta property="og:description" content={gr('seo.description')} />
                    <meta property="og:url" content={gr('seo.url')} />
                    <meta property="og:image" content={gr('seo.image')} />
                    <meta property="og:image:alt" content={gr('seo.ogAlt')} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={gr('seo.title')} />
                    <meta name="twitter:description" content={gr('seo.description')} />
                    <meta name="twitter:image" content={gr('seo.image')} />
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
                         className="text-green-100 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 text-lg leading-8"
                    >
                         <div className="my-12 text-lg leading-8 flex flex-col items-start w-full max-w-7xl mx-auto">
                              {/* Back link */}
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                                   <Link
                                        href="/graphical-analysis"
                                        className="text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2"
                                   >
                                        <FaChartLine className="text-lg" />
                                        <span className="text-lg">{gr('ui.backToGraphical')}</span>
                                   </Link>
                              </motion.div>

                              {/* Title */}
                              <span className="text-4xl font-semibold mb-8 text-green-500 mx-auto">
                                   {gr('page.title')}
                              </span>

                              {/* CTA strip */}
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.2 }}
                                   className="mb-8 w-full"
                              >
                                   <div className="bg-linear-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                             <div className="text-green-100 text-lg">{gr('cta.ready')}</div>
                                             <Button
                                                  onClick={handleOpen}
                                                  className="normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
                                                  variant="contained"
                                                  size="medium"
                                             >
                                                  <HowToRegIcon className="mr-2" />
                                                  {gr('cta.start')}
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
                                        src="/videos/reversal-strategy/reversal-strategy.mp4"
                                        poster="/videos/reversal-strategy/reversal-strategy.png"
                                        controls
                                        playsInline
                                        preload="metadata"
                                        style={{ width: '100%', height: 'auto', borderRadius: 12 }}
                                        aria-description={gr('video.aria')}
                                   />
                              </motion.div>

                              {/* Key Concepts */}
                              <span className="text-2xl font-semibold my-4 text-green-700">
                                   {gr('sections.keyConcepts.h')}
                              </span>
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.2 }}
                                   className="mb-8 w-full"
                              >
                                   <div className="bg-linear-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                        <ul className="font-normal my-2 list-decimal list-inside marker:text-xl space-y-3">
                                             {Array.isArray(keyConceptsItems) &&
                                                  keyConceptsItems.map((line, idx) => (
                                                       <li key={`kc-${idx}`} className="text-green-100">
                                                            <span className="text-green-100">{line}</span>
                                                       </li>
                                                  ))}
                                        </ul>
                                   </div>
                              </motion.div>

                              {/* Applying */}
                              <span className="text-2xl font-semibold my-6 text-green-700">
                                   {gr('sections.apply.h')}
                              </span>
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.2 }}
                                   className="mb-8 w-full"
                              >
                                   <div className="bg-linear-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                        <ul className="font-normal text-lg leading-8 my-2 list-decimal list-inside marker:text-xl space-y-3">
                                             {Array.isArray(applyItems) &&
                                                  applyItems.map((line, idx) => (
                                                       <li key={`ap-${idx}`}>
                                                            <span className="text-green-100">{line}</span>
                                                       </li>
                                                  ))}
                                        </ul>
                                   </div>
                              </motion.div>

                              {/* Example */}
                              <span className="text-2xl font-semibold my-6 text-green-700">
                                   {gr('sections.example.h')}
                              </span>
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.2 }}
                                   className="mb-8 w-full"
                              >
                                   <div className="bg-linear-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                        <p className="my-2 text-lg leading-8 text-green-100">
                                             {exampleText}
                                        </p>
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
                    ['common', 'nav', 'footer', 'auth', 'graphicalAnalysis', 'graphicalReversal'],
                    i18nConfig
               )),
          },
     }
}
