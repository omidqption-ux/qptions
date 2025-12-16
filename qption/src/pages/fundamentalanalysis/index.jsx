import React, { useState, useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
     FaChartLine,
     FaGlobe,
     FaBitcoin,
     FaDollarSign,
     FaBuilding,
     FaBalanceScale,
     FaChartBar,
     FaCoins,
     FaShieldAlt,
     FaExchangeAlt,
     FaMoneyBillWave,
     FaTrophy,
     FaTimes,
     FaCalendarAlt,
     FaUsers,
} from 'react-icons/fa'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../next-i18next.config.cjs'
import SEOAlternates from '@/components/SEOAlternates'

const containerVariants = {
     hidden: { opacity: 0 },
     visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
     },
}

const itemVariants = {
     hidden: { y: 20, opacity: 0 },
     visible: {
          y: 0,
          opacity: 1,
          transition: { duration: 0.5, ease: 'easeOut' },
     },
}

const modalVariants = {
     hidden: { x: '-100%', opacity: 0 },
     visible: {
          x: 0,
          opacity: 1,
          transition: { type: 'spring', stiffness: 100, damping: 15 },
     },
     exit: {
          x: '-100%',
          opacity: 0,
          transition: { duration: 0.3 },
     },
}

export default function FundamentalAnalysis() {
     const { t: fa, i18n } = useTranslation('fundamentalAnalysis')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)
     const [isModalOpen, setIsModalOpen] = useState(true)

     // Cards (titles/descriptions localized; routes remain the same)
     const analysisSections = useMemo(
          () => [
               {
                    title: fa('cards.economicIndicators.title'),
                    icon: <FaChartLine className='text-blue-500' />,
                    description: fa('cards.economicIndicators.description'),
                    link: '/fundamentalanalysis/economic-indicators-market-reactions',
                    color: 'from-blue-500/20 to-blue-500/10',
                    borderColor: 'border-blue-500/30',
               },
               {
                    title: fa('cards.centralBankPolicies.title'),
                    icon: <FaBuilding className='text-purple-500' />,
                    description: fa('cards.centralBankPolicies.description'),
                    link: '/fundamentalanalysis/central-bank-policies',
                    color: 'from-purple-500/20 to-purple-500/10',
                    borderColor: 'border-purple-500/30',
               },
               {
                    title: fa('cards.inflation.title'),
                    icon: <FaMoneyBillWave className='text-blue-500' />,
                    description: fa('cards.inflation.description'),
                    link: '/fundamentalanalysis/inflation-currency-crypto',
                    color: 'from-blue-500/20 to-blue-500/10',
                    borderColor: 'border-blue-500/30',
               },
               {
                    title: fa('cards.interestRates.title'),
                    icon: <FaChartBar className='text-purple-500' />,
                    description: fa('cards.interestRates.description'),
                    link: '/fundamentalanalysis/interest-rate-differentials-carry-trades',
                    color: 'from-purple-500/20 to-purple-500/10',
                    borderColor: 'border-purple-500/30',
               },
               {
                    title: fa('cards.geopolitics.title'),
                    icon: <FaGlobe className='text-green-500' />,
                    description: fa('cards.geopolitics.description'),
                    link: '/fundamentalanalysis/geopolitical-events-and-markets',
                    color: 'from-green-500/20 to-green-500/10',
                    borderColor: 'border-green-500/30',
               },
               {
                    title: fa('cards.fiscalPolicy.title'),
                    icon: <FaBalanceScale className='text-indigo-500' />,
                    description: fa('cards.fiscalPolicy.description'),
                    link: '/fundamentalanalysis/fiscal-policy-and-government-spending',
                    color: 'from-indigo-500/20 to-indigo-500/10',
                    borderColor: 'border-indigo-500/30',
               },
               {
                    title: fa('cards.debtAndFX.title'),
                    icon: <FaDollarSign className='text-teal-500' />,
                    description: fa('cards.debtAndFX.description'),
                    link: '/fundamentalanalysis/global-debt-levels-and-currency-valuation',
                    color: 'from-teal-500/20 to-teal-500/10',
                    borderColor: 'border-teal-500/30',
               },
               {
                    title: fa('cards.supplyDemandCommodities.title'),
                    icon: <FaCoins className='text-purple-500' />,
                    description: fa('cards.supplyDemandCommodities.description'),
                    link: '/fundamentalanalysis/supply-and-demand-commodities',
                    color: 'from-purple-500/20 to-purple-500/10',
                    borderColor: 'border-purple-500/30',
               },
               {
                    title: fa('cards.safeHavens.title'),
                    icon: <FaShieldAlt className='text-emerald-500' />,
                    description: fa('cards.safeHavens.description'),
                    link: '/fundamentalanalysis/safe-haven-assets-market-turbulence',
                    color: 'from-emerald-500/20 to-emerald-500/10',
                    borderColor: 'border-emerald-500/30',
               },
               {
                    title: fa('cards.forexCfds.title'),
                    icon: <FaExchangeAlt className='text-cyan-500' />,
                    description: fa('cards.forexCfds.description'),
                    link: '/fundamentalanalysis/forex-cfds',
                    color: 'from-cyan-500/20 to-cyan-500/10',
                    borderColor: 'border-cyan-500/30',
               },
               {
                    title: fa('cards.cryptoRegulation.title'),
                    icon: <FaBitcoin className='text-orange-500' />,
                    description: fa('cards.cryptoRegulation.description'),
                    link: '/fundamentalanalysis/crypto-adoption-regulation',
                    color: 'from-orange-500/20 to-orange-500/10',
                    borderColor: 'border-orange-500/30',
               },
               {
                    title: fa('cards.blockchainFA.title'),
                    icon: <FaChartLine className='text-violet-500' />,
                    description: fa('cards.blockchainFA.description'),
                    link: '/fundamentalanalysis/blockchain-fundamental-analysis',
                    color: 'from-violet-500/20 to-violet-500/10',
                    borderColor: 'border-violet-500/30',
               },
          ],
          [fa, i18n.language]
     )

     // Tournaments from i18n (fallback to default list if not provided)
     const tournaments = useMemo(() => {
          const tlist = fa('tournaments.list', { returnObjects: true })
          if (Array.isArray(tlist) && tlist.length) return tlist
          // Fallback to original sample but with localized labels
          return [
               {
                    id: 1,
                    title: fa('tournaments.defaults.weekly.title'),
                    prize: fa('tournaments.defaults.weekly.prize'),
                    participants: fa('tournaments.defaults.weekly.participants'),
                    startDate: fa('tournaments.defaults.weekly.startDate'),
                    endDate: fa('tournaments.defaults.weekly.endDate'),
                    status: fa('tournaments.defaults.weekly.status'),
               },
               {
                    id: 2,
                    title: fa('tournaments.defaults.monthly.title'),
                    prize: fa('tournaments.defaults.monthly.prize'),
                    participants: fa('tournaments.defaults.monthly.participants'),
                    startDate: fa('tournaments.defaults.monthly.startDate'),
                    endDate: fa('tournaments.defaults.monthly.endDate'),
                    status: fa('tournaments.defaults.monthly.status'),
               },
          ]
     }, [fa, i18n.language])

     return (
          <>
               <Head>
                    {/* ---------- Primary SEO (localized) ---------- */}
                    <title>{fa('seo.title')}</title>
                    <meta name="description" content={fa('seo.description')} />
                    <meta name="keywords" content={fa('seo.keywords')} />

                    {/* ---------- Open Graph ---------- */}
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={fa('seo.ogTitle')} />
                    <meta property="og:description" content={fa('seo.ogDescription')} />
                    <meta property="og:url" content={fa('seo.url')} />
                    <meta property="og:image" content={fa('seo.image')} />

                    {/* ---------- Twitter Card ---------- */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content={fa('seo.twitterSite')} />
                    <meta name="twitter:title" content={fa('seo.twitterTitle')} />
                    <meta name="twitter:description" content={fa('seo.twitterDescription')} />
                    <meta name="twitter:image" content={fa('seo.twitterImage')} />

                    {/* ---------- Canonical & Robots ---------- */}
                    <link rel="canonical" href={fa('seo.canonical')} />
                    <meta name="robots" content="index,follow" />
               </Head>

               <SEOAlternates />

               <main
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className="px-4 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12"
               >
                    <AnimatePresence>
                         {isModalOpen && (
                              <motion.div
                                   variants={modalVariants}
                                   initial="hidden"
                                   animate="visible"
                                   exit="exit"
                                   className="fixed left-4 top-1/2 -translate-y-1/2 w-80 bg-darkStart border-2 border-green-500 rounded-xl shadow-lg p-4 z-50"
                                   dir={isRTL ? 'rtl' : 'ltr'}
                              >
                                   <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                                             <FaTrophy className="text-yellow-500" />
                                             {fa('tournaments.title')}
                                        </h3>
                                        <button
                                             onClick={() => setIsModalOpen(false)}
                                             className="text-gray-400 hover:text-white transition-colors duration-200"
                                             aria-label={fa('tournaments.ui.close')}
                                             title={fa('tournaments.ui.close')}
                                        >
                                             <FaTimes />
                                        </button>
                                   </div>

                                   <div className="space-y-4">
                                        {tournaments.map((t) => (
                                             <motion.div
                                                  key={t.id}
                                                  initial={{ opacity: 0, y: 20 }}
                                                  animate={{ opacity: 1, y: 0 }}
                                                  transition={{ delay: 0.2 }}
                                                  className="p-4 rounded-lg bg-darkStart/50 border border-green-500/30 hover:border-green-500 transition-all duration-300"
                                             >
                                                  <div className="flex justify-between items-start mb-2">
                                                       <h4 className="font-medium text-white">{t.title}</h4>
                                                       <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                                                            {t.status}
                                                       </span>
                                                  </div>

                                                  <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                                                       <FaTrophy className="text-yellow-500" />
                                                       <span>
                                                            {fa('tournaments.labels.prize')}: {t.prize}
                                                       </span>
                                                  </div>

                                                  <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                                                       <FaUsers className="text-blue-500" />
                                                       <span>
                                                            {t.participants} {fa('tournaments.labels.participants')}
                                                       </span>
                                                  </div>

                                                  <div className="flex items-center gap-2 text-sm text-gray-300">
                                                       <FaCalendarAlt className="text-purple-500" />
                                                       <span>
                                                            {t.startDate} - {t.endDate}
                                                       </span>
                                                  </div>

                                                  <motion.button
                                                       whileHover={{ scale: 1.02 }}
                                                       whileTap={{ scale: 0.98 }}
                                                       className="w-full mt-3 py-2 rounded-lg bg-green-500 text-white font-medium text-sm hover:bg-green-600 transition-all duration-300"
                                                  >
                                                       {fa('tournaments.ui.join')}
                                                  </motion.button>
                                             </motion.div>
                                        ))}
                                   </div>
                              </motion.div>
                         )}
                    </AnimatePresence>

                    <div className="max-w-7xl m-auto">
                         <motion.div
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8 }}
                              className="text-center mb-12"
                         >
                              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-500 my-10">
                                   {fa('page.title')}
                              </h1>
                              <p className={`text-blue-100 text-lg max-w-3xl mx-auto ${isRTL ? 'text-right' : 'text-center'}`}>
                                   {fa('page.subtitle')}
                              </p>
                         </motion.div>

                         <motion.div
                              variants={containerVariants}
                              initial="hidden"
                              animate="visible"
                              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                         >
                              {analysisSections.map((section) => (
                                   <motion.div
                                        key={section.title}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02 }}
                                        className={`group relative overflow-hidden rounded-xl backdrop-blur-sm bg-linear-to-br ${section.color} border ${section.borderColor} p-6 transition-all duration-300 hover:border-opacity-40 hover:shadow-lg`}
                                   >
                                        <Link href={section.link} className="block">
                                             <div className="flex items-center gap-4 mb-4">
                                                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                                                       {section.icon}
                                                  </div>
                                                  <h2 className="text-xl text-green-300 font-semibold group-hover:text-green-300 transition-colors duration-300">
                                                       {section.title}
                                                  </h2>
                                             </div>
                                             <p className="text-blue-100 group-hover:text-gray-100 transition-colors duration-300">
                                                  {section.description}
                                             </p>
                                             <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-br from-transparent via-green-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                        </Link>
                                   </motion.div>
                              ))}
                         </motion.div>

                         {/* CTA to quiz */}
                         <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.7 }}
                              className="mt-6 group flex justify-center relative overflow-hidden rounded-lg bg-linear-to-br p-0.5 hover:scale-[1.02] transition-all duration-300"
                         >
                              <Link
                                   href="/fundamentalanalysis/quiz-fundamentalanalysis"
                                   className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-green-100 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20"
                              >
                                   <FaChartLine />
                                   {fa('cta.takeQuiz')}
                              </Link>
                         </motion.div>
                    </div>
               </main>
          </>
     )
}

export async function getServerSideProps({ locale }) {
     return {
          props: {
               ...(await serverSideTranslations(
                    locale,
                    ['common', 'nav', 'footer', 'auth', 'fundamentalAnalysis'],
                    i18nConfig
               )),
          },
     }
}
