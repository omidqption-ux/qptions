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

export default function EconomicIndicators() {
     const { t: ei, i18n } = useTranslation('economicIndicators')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     const jsonLd = ei('seo.ld', { returnObjects: true })

     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     return (
          <>
               <Head>
                    {/* ---------- Primary SEO (localized) ---------- */}
                    <title>{ei('seo.title')}</title>
                    <meta name="description" content={ei('seo.description')} />
                    <meta name="keywords" content={ei('seo.keywords')} />

                    {/* ---------- Open Graph ---------- */}
                    <meta property="og:type" content="article" />
                    <meta property="og:title" content={ei('seo.ogTitle')} />
                    <meta property="og:description" content={ei('seo.ogDescription')} />
                    <meta property="og:url" content={ei('seo.url')} />
                    <meta property="og:image" content={ei('seo.image')} />

                    {/* ---------- Twitter Card ---------- */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content={ei('seo.twitterSite')} />
                    <meta name="twitter:title" content={ei('seo.twitterTitle')} />
                    <meta name="twitter:description" content={ei('seo.twitterDescription')} />
                    <meta name="twitter:image" content={ei('seo.twitterImage')} />

                    {/* ---------- Canonical & Robots ---------- */}
                    <link rel="canonical" href={ei('seo.canonical')} />
                    <meta name="robots" content="index,follow" />

                    {/* ---------- JSON-LD ---------- */}
                    <script
                         type="application/ld+json"
                         // jsonLd comes from translations to allow localized headline/sections
                         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                    />
               </Head>

               <SEOAlternates />

               <SlideUpSection>
                    <main
                         dir={isRTL ? 'rtl' : 'ltr'}
                         className="px-4 text-green-100 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 text-sm lg:text-lg leading-8"
                    >
                         <div className="my-6 flex flex-col items-start w-full max-w-7xl mx-auto ">
                              {/* Breadcrumb back link */}
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="my-6">
                                   <Link
                                        href="/fundamentalanalysis"
                                        className="text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2"
                                   >
                                        <FaChartLine className="text-lg" />
                                        <span className="text-lg">{ei('breadcrumb.fundamentalAnalysis')}</span>
                                   </Link>
                              </motion.div>

                              {/* Title */}
                              <div className="text-center w-full">
                                   <span className="text-2xl font-bold my-6 text-green-500">
                                        {ei('page.title')}
                                   </span>
                              </div>

                              {/* CTA card */}
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.2 }}
                                   className="w-full my-6"
                              >
                                   <div className="bg-linear-to-br w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20 ">
                                        <div className="w-full px-2">
                                             <div className="text-lg flex items-center rounded gap-1 justify-between">
                                                  {ei('cta.ready')}
                                                  <Registeration handleClose={handleClose} open={openLogin} isRegister={true} />
                                                  <Button
                                                       onClick={handleOpen}
                                                       className="normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
                                                       variant="contained"
                                                       size="medium"
                                                  >
                                                       <HowToRegIcon className="mr-2" />
                                                       {ei('cta.startTrading')}
                                                  </Button>
                                             </div>
                                        </div>
                                   </div>
                              </motion.div>

                              <div className="py-4 font-normal">
                                   <div className="mt-6 space-y-8">
                                        {/* Overview */}
                                        <div className="p-4 rounded">
                                             <span className="text-2xl font-semibold text-green-700">{ei('sections.overview.title')}</span>
                                             <motion.div
                                                  initial={{ opacity: 0, y: 20 }}
                                                  animate={{ opacity: 1, y: 0 }}
                                                  transition={{ delay: 0.2 }}
                                                  className="w-full my-6"
                                             >
                                                  <div className="bg-linear-to-br w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg">
                                                            <li><span>{ei('sections.overview.bullets.0')}</span></li>
                                                            <li><span>{ei('sections.overview.bullets.1')}</span></li>
                                                            <li><span>{ei('sections.overview.bullets.2')}</span></li>
                                                       </ul>
                                                  </div>
                                             </motion.div>
                                        </div>

                                        {/* Key Economic Indicators */}
                                        <div className="p-4 rounded">
                                             <span className="text-xl font-semibold text-green-700">{ei('sections.keyIndicators.title')}</span>
                                             <motion.div
                                                  initial={{ opacity: 0, y: 20 }}
                                                  animate={{ opacity: 1, y: 0 }}
                                                  transition={{ delay: 0.2 }}
                                                  className="mb-8 w-full my-6"
                                             >
                                                  <div className="bg-linear-to-br w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                                       <ul className="mt-2 list-decimal list-inside marker:text-xl space-y-2 leading-8 text-lg">
                                                            <li><span>{ei('sections.keyIndicators.items.gdp')}</span></li>
                                                            <li><span>{ei('sections.keyIndicators.items.cpi')}</span></li>
                                                            <li><span>{ei('sections.keyIndicators.items.employment')}</span></li>
                                                            <li><span>{ei('sections.keyIndicators.items.retailSales')}</span></li>
                                                            <li><span>{ei('sections.keyIndicators.items.ppi')}</span></li>
                                                            <li><span>{ei('sections.keyIndicators.items.tradeBalance')}</span></li>
                                                       </ul>
                                                  </div>
                                             </motion.div>
                                        </div>

                                        {/* Market Reactions */}
                                        <div className="p-4 rounded">
                                             <span className="text-xl font-semibold my-6 text-green-700">
                                                  {ei('sections.reactions.title')}
                                             </span>

                                             {/* Stocks */}
                                             <motion.div
                                                  initial={{ opacity: 0, y: 20 }}
                                                  animate={{ opacity: 1, y: 0 }}
                                                  transition={{ delay: 0.2 }}
                                                  className="mb-8 w-full my-6"
                                             >
                                                  <div className="bg-linear-to-br w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                                       <div className="mt-4">
                                                            <span className="text-2xl font-semibold">{ei('sections.reactions.stocks.title')}</span>
                                                            <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                                 <li><span>{ei('sections.reactions.stocks.bullets.0')}</span></li>
                                                                 <li><span>{ei('sections.reactions.stocks.bullets.1')}</span></li>
                                                            </ul>
                                                       </div>
                                                  </div>
                                             </motion.div>

                                             {/* Bonds */}
                                             <div className="mt-4">
                                                  <span className="text-2xl font-semibold my-6 text-green-700">
                                                       {ei('sections.reactions.bonds.title')}
                                                  </span>
                                                  <motion.div
                                                       initial={{ opacity: 0, y: 20 }}
                                                       animate={{ opacity: 1, y: 0 }}
                                                       transition={{ delay: 0.2 }}
                                                       className="mb-8 w-full my-6"
                                                  >
                                                       <div className="bg-linear-to-br w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                                            <ul className="mt-2 list-inside marker:text-xl space-y-2 leading-8 text-lg">
                                                                 <li><span>{ei('sections.reactions.bonds.bullets.0')}</span></li>
                                                                 <li><span>{ei('sections.reactions.bonds.bullets.1')}</span></li>
                                                            </ul>
                                                       </div>
                                                  </motion.div>
                                             </div>

                                             {/* Forex */}
                                             <div className="mt-4">
                                                  <span className="text-2xl font-semibold text-green-700">
                                                       {ei('sections.reactions.fx.title')}
                                                  </span>
                                                  <motion.div
                                                       initial={{ opacity: 0, y: 20 }}
                                                       animate={{ opacity: 1, y: 0 }}
                                                       transition={{ delay: 0.2 }}
                                                       className="mb-8 w-full my-6"
                                                  >
                                                       <div className="bg-linear-to-br w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                                            <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                                 <li><span>{ei('sections.reactions.fx.bullets.0')}</span></li>
                                                                 <li><span>{ei('sections.reactions.fx.bullets.1')}</span></li>
                                                            </ul>
                                                       </div>
                                                  </motion.div>
                                             </div>

                                             {/* Commodities */}
                                             <div className="mt-4">
                                                  <span className="text-2xl font-semibold my-6 text-green-700">
                                                       {ei('sections.reactions.cmd.title')}
                                                  </span>
                                                  <motion.div
                                                       initial={{ opacity: 0, y: 20 }}
                                                       animate={{ opacity: 1, y: 0 }}
                                                       transition={{ delay: 0.2 }}
                                                       className="mb-8 w-full my-6"
                                                  >
                                                       <div className="bg-linear-to-br w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                                            <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                                 <li><span>{ei('sections.reactions.cmd.bullets.0')}</span></li>
                                                                 <li><span>{ei('sections.reactions.cmd.bullets.1')}</span></li>
                                                            </ul>
                                                       </div>
                                                  </motion.div>
                                             </div>
                                        </div>

                                        {/* Benefits */}
                                        <div className="p-4 rounded">
                                             <span className="text-2xl font-semibold my-6 text-green-700">
                                                  {ei('sections.benefits.title')}
                                             </span>
                                             <motion.div
                                                  initial={{ opacity: 0, y: 20 }}
                                                  animate={{ opacity: 1, y: 0 }}
                                                  transition={{ delay: 0.2 }}
                                                  className="mb-8 w-full my-6"
                                             >
                                                  <div className="bg-linear-to-br w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            <li><span>{ei('sections.benefits.bullets.0')}</span></li>
                                                            <li><span>{ei('sections.benefits.bullets.1')}</span></li>
                                                            <li><span>{ei('sections.benefits.bullets.2')}</span></li>
                                                       </ul>
                                                  </div>
                                             </motion.div>
                                        </div>

                                        {/* Limitations */}
                                        <div className="p-4 rounded">
                                             <span className="text-2xl font-semibold my-6 text-green-700">
                                                  {ei('sections.limitations.title')}
                                             </span>
                                             <motion.div
                                                  initial={{ opacity: 0, y: 20 }}
                                                  animate={{ opacity: 1, y: 0 }}
                                                  transition={{ delay: 0.2 }}
                                                  className="mb-8 w-full my-6"
                                             >
                                                  <div className="bg-linear-to-br w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            <li><span>{ei('sections.limitations.bullets.0')}</span></li>
                                                            <li><span>{ei('sections.limitations.bullets.1')}</span></li>
                                                            <li><span>{ei('sections.limitations.bullets.2')}</span></li>
                                                       </ul>
                                                  </div>
                                             </motion.div>
                                        </div>
                                   </div>
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
                    ['common', 'nav', 'footer', 'auth', 'fundamentalAnalysis', 'economicIndicators'],
                    i18nConfig
               )),
          },
     }
}
