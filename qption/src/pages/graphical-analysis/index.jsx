import Link from 'next/link'
import { motion } from 'framer-motion'
import Head from 'next/head'
import {
     FaChartPie,
     FaExchangeAlt,
     FaMoneyBillWave,
     FaChartArea,
     FaChartLine,
} from 'react-icons/fa'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../next-i18next.config.cjs' // adjust path if needed
import SEOAlternates from '@/components/SEOAlternates'

export default function Graphical() {
     const { t: ga, i18n } = useTranslation('graphicalAnalysis')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     const strategies = [
          {
               title: ga('cards.movingAverage.title'),
               link: '/graphical-analysis/moving-average',
               icon: <FaMoneyBillWave className="text-green-500 text-4xl" />,
          },
          {
               title: ga('cards.fibonacciElliott.title'),
               link: '/graphical-analysis/fibonacci-elliott-waves',
               icon: <FaChartArea className="text-green-500 text-4xl" />,
          },
          {
               title: ga('cards.reversal.title'),
               link: '/graphical-analysis/reversal',
               icon: <FaExchangeAlt className="text-green-500 text-4xl" />,
          },
          {
               title: ga('cards.trendContinuation.title'),
               link: '/graphical-analysis/trend-continuation-patterns',
               icon: <FaChartLine className="text-green-500 text-4xl" />,
          },
          {
               title: ga('cards.graphicalAnalysis.title'),
               link: '/graphical-analysis/graphical-analysis',
               icon: <FaChartPie className="text-green-500 text-4xl" />,
          },
     ]

     const bullets = ga('bullets', { returnObjects: true }) || []

     return (
          <>
               <Head>
                    {/* ---------- Primary SEO (localized) ---------- */}
                    <title>{ga('seo.title')}</title>
                    <meta name="description" content={ga('seo.description')} />
                    <meta name="keywords" content={ga('seo.keywords')} />

                    {/* ---------- Open Graph ---------- */}
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={ga('seo.ogTitle')} />
                    <meta property="og:description" content={ga('seo.ogDescription')} />
                    <meta property="og:url" content={ga('seo.url')} />
                    <meta property="og:image" content={ga('seo.image')} />

                    {/* ---------- Twitter Card ---------- */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content={ga('seo.twitterSite')} />
                    <meta name="twitter:title" content={ga('seo.twitterTitle')} />
                    <meta name="twitter:description" content={ga('seo.twitterDescription')} />
                    <meta name="twitter:image" content={ga('seo.twitterImage')} />

                    {/* ---------- Canonical & Robots ---------- */}
                    <link rel="canonical" href={ga('seo.canonical')} />
                    <meta name="robots" content="index,follow" />
               </Head>

               <SEOAlternates />

               <main
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className="min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12"
               >
                    <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="text-center mb-12"
                    >
                         <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-500">
                              {ga('page.title')}
                         </h1>
                         <p className={`text-blue-100 text-lg max-w-3xl mx-auto ${isRTL ? 'text-right' : 'text-center'}`}>
                              {ga('page.subtitle')}
                         </p>
                    </motion.div>

                    <div className="w-full max-w-7xl px-4">
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                              {strategies.map((strategy, index) => (
                                   <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="hover:scale-110 transition-all duration-150 bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20"
                                   >
                                        <Link className="group block h-full" href={strategy.link}>
                                             <div className="w-full flex flex-col items-center justify-between p-6 rounded-2xl transition-all duration-300 h-full">
                                                  <div className="bg-green-500/10 p-4 rounded-xl mb-4 group-hover:bg-green-500/20 transition-colors duration-300">
                                                       {strategy.icon}
                                                  </div>
                                                  <div className="text-center">
                                                       <h3 className="text-xl font-bold text-green-100 group-hover:text-green-300 mb-2 transition-colors duration-300">
                                                            {strategy.title}
                                                       </h3>
                                                  </div>
                                                  <div className="mt-4">
                                                       <span
                                                            className="translate-x-0 inline-block mt-4 text-sm font-medium text-green-500 
                        transition-transform duration-500 group-hover:translate-x-1 group-hover:text-green-300"
                                                       >
                                                            {ga('ui.learnMore')} →
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
                                   aria-description={ga('video.aria')}
                              />
                         </motion.div>

                         {/* CTA to quiz */}
                         <div className="w-full">
                              <motion.div
                                   initial={{ opacity: 0, x: 0 }}
                                   animate={{ opacity: 1, x: 20 }}
                                   transition={{ delay: 0.7 }}
                                   className="mt-6 group flex justify-center relative overflow-hidden rounded-lg bg-linear-to-br p-0.5 hover:scale-[1.02] transition-all duration-300"
                              >
                                   <Link
                                        href="/graphical-analysis/quiz-graphical-analysis"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500 group-hover:text-green-100 hover:bg-green-600 text-green-300 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20"
                                   >
                                        <FaChartLine />
                                        {ga('cta.takeQuiz')}
                                   </Link>
                              </motion.div>
                         </div>
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
                    ['common', 'nav', 'footer', 'auth', 'graphicalAnalysis'],
                    i18nConfig
               )),
          },
     }
}
