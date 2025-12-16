import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
     FaChartLine,
     FaChartBar,
     FaChartPie,
     FaChartArea,
} from 'react-icons/fa'
import { GiChart } from 'react-icons/gi'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../next-i18next.config.cjs'
import SEOAlternates from '@/components/SEOAlternates'

export default function TechnicalAnalysisPage() {
     const { t, i18n } = useTranslation('technical-analysis')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     // Safe helpers for i18n object/array shapes
     const toArray = (v) =>
          Array.isArray(v) ? v : v && typeof v === 'object' ? Object.values(v) : []

     // i18n payloads
     const seo = t('seo', { returnObjects: true })
     const hero = t('hero', { returnObjects: true })
     const labels = t('labels', { returnObjects: true })
     const strategies = toArray(t('strategies', { returnObjects: true }))
     const bullets = toArray(t('bullets', { returnObjects: true }))

     // Icon mapping by index (matches default EN order)
     const iconFor = (idx) => {
          switch (idx) {
               case 0: return <FaChartLine className="text-green-500 text-4xl" />
               case 1: return <FaChartArea className="text-green-500 text-4xl" />
               case 2: return <FaChartBar className="text-green-500 text-4xl" />
               case 3: return <GiChart className="text-green-500 text-4xl" />
               case 4: return <FaChartPie className="text-green-500 text-4xl" />
               default: return <GiChart className="text-green-500 text-4xl" />
          }
     }

     return (
          <>
               <Head>
                    <title>{seo?.title}</title>
                    <meta name="description" content={seo?.description} />
                    {seo?.keywords && <meta name="keywords" content={seo.keywords} />}
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={seo?.ogTitle || seo?.title} />
                    <meta property="og:description" content={seo?.ogDescription || seo?.description} />
                    {seo?.url && <meta property="og:url" content={seo.url} />}
                    {seo?.image && <meta property="og:image" content={seo.image} />}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={seo?.title} />
                    <meta name="twitter:description" content={seo?.description} />
                    {seo?.image && <meta name="twitter:image" content={seo.image} />}
                    {seo?.url && <link rel="canonical" href={seo.url} />}
                    <meta name="robots" content="index,follow" />
               </Head>

               <SEOAlternates />

               <main
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className="min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12"
               >
                    {/* Hero */}
                    <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="text-center mb-12"
                    >
                         <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-500">
                              {hero?.title}
                         </h1>
                         <p className={`text-green-100 text-lg max-w-3xl mx-auto ${isRTL ? 'text-right' : 'text-center'}`}>
                              {hero?.subtitle}
                         </p>
                    </motion.div>

                    {/* Strategy grid */}
                    <div className="w-full max-w-7xl px-4">
                         <div dir='rtl' className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                              {strategies.map((s, idx) => (
                                   <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="hover:scale-110 transition-all duration-150 bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20"
                                   >
                                        <Link className="group block h-full" href={s.link}>
                                             <div className="w-full flex flex-col items-center justify-between p-6 rounded-2xl transition-all duration-300 h-full">
                                                  <div className="bg-green-500/10 p-4 rounded-xl mb-4 group-hover:bg-green-500/20 transition-colors duration-300">
                                                       {iconFor(idx)}
                                                  </div>
                                                  <div className="text-center">
                                                       <h3 className="text-xl font-bold text-green-700 mb-2 transition-colors duration-300">
                                                            {s.title}
                                                       </h3>
                                                       <p className="text-sm text-green-100">{s.description}</p>
                                                  </div>
                                                  <div className="mt-4">
                                                       <span className="translate-x-0 inline-block mt-4 text-sm font-medium text-green-500 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-green-300">
                                                            {labels?.learnMore}
                                                       </span>
                                                  </div>
                                             </div>
                                        </Link>
                                   </motion.div>
                              ))}
                         </div>

                         {/* Video */}
                         <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="w-full my-5 bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-1 md:p-4 border border-green-500/20 flex flex-col"
                         >
                              <video
                                   src="/videos/technical-analysis/technical-analysis.mp4"
                                   poster="/videos/technical-analysis/technical-analysis.png"
                                   controls
                                   playsInline
                                   preload="metadata"
                                   style={{ width: '100%', height: 'auto', borderRadius: 12 }}
                                   aria-description={labels?.videoAria}
                              />
                         </motion.div>

                         {/* Quiz CTA */}
                         <motion.div
                              initial={{ opacity: 0, x: 0 }}
                              animate={{ opacity: 1, x: 20 }}
                              transition={{ delay: 0.7 }}
                              className="mt-6 group flex justify-center relative overflow-hidden rounded-lg bg-linear-to-br p-0.5 hover:scale-[1.02] transition-all duration-300"
                         >
                              <span className="translate-x-0 inline-block mt-4 text-sm font-medium text-green-400 transition-transform duration-500 group-hover:translate-x-3">
                                   <Link
                                        href="/technical-analysis/quiz-technical-analysis"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500 group-hover:text-green-100 hover:bg-green-600 text-green-300 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20"
                                   >
                                        <FaChartLine />
                                        {labels?.quizCta}
                                   </Link>
                              </span>
                         </motion.div>
                    </div>

                    {/* Bullets */}
                    <ul className="space-y-4 my-12 mx-4 text-sm lg:text-lg">
                         {bullets.map((b, i) => (
                              <li key={i} className="flex items-start gap-3">
                                   <span className="text-green-500 mt-1">•</span>
                                   <span className="text-blue-100">{b}</span>
                              </li>
                         ))}
                    </ul>
               </main>
          </>
     )
}

export async function getServerSideProps({ locale }) {
     return {
          props: {
               ...(await serverSideTranslations(
                    locale,
                    ['common', 'technical-analysis', 'nav', 'footer', 'auth'],
                    i18nConfig
               )),
          },
     }
}
