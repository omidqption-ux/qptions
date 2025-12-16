import React from 'react'
import Link from 'next/link'
import SlideUpSection from '@/components/SlideUp/SlideUp'
import dynamic from 'next/dynamic'
const Registeration = dynamic(
     () => import('@/components/RegisterationModal/Registeration'),
     { ssr: false }
)
import { Button } from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import { motion } from 'framer-motion'
import { FaChartLine } from 'react-icons/fa'
import Head from 'next/head'

import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../../next-i18next.config.cjs'

export default function CentralBankPoliciesPage() {
     const { t: cb, i18n } = useTranslation('central-bank-policies')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     // json-ld from i18n
     const ld = cb('seo.ld', { returnObjects: true })

     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     return (
          <>
               <Head>
                    {/* ---------- Primary SEO (localized) ---------- */}
                    <title>{cb('seo.title')}</title>
                    <meta name="description" content={cb('seo.description')} />
                    <meta name="keywords" content={cb('seo.keywords')} />

                    {/* ---------- Open Graph ---------- */}
                    <meta property="og:type" content="article" />
                    <meta property="og:title" content={cb('seo.ogTitle')} />
                    <meta property="og:description" content={cb('seo.ogDescription')} />
                    <meta property="og:url" content={cb('seo.url')} />
                    <meta property="og:image" content={cb('seo.image')} />

                    {/* ---------- Twitter Card ---------- */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content={cb('seo.twitterSite')} />
                    <meta name="twitter:title" content={cb('seo.twitterTitle')} />
                    <meta name="twitter:description" content={cb('seo.twitterDescription')} />
                    <meta name="twitter:image" content={cb('seo.twitterImage')} />

                    {/* ---------- Canonical & Robots ---------- */}
                    <link rel="canonical" href={cb('seo.canonical')} />
                    <meta name="robots" content="index,follow" />

                    {/* ---------- JSON-LD ---------- */}
                    {ld && (
                         <script
                              type="application/ld+json"
                              // json must be string
                              dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
                         />
                    )}
               </Head>

               <SlideUpSection>
                    <main
                         dir={isRTL ? 'rtl' : 'ltr'}
                         className="font-normal px-4 text-green-100 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 text-lg leading-8"
                    >
                         <div className="my-12 text-lg leading-8 flex flex-col items-start w-full max-w-7xl mx-auto">
                              {/* Breadcrumb */}
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   className="my-6"
                              >
                                   <Link
                                        href="/fundamentalanalysis"
                                        className="text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2"
                                   >
                                        <FaChartLine className="text-lg" />
                                        <span className="text-lg">{cb('breadcrumb.fundamentalAnalysis')}</span>
                                   </Link>
                              </motion.div>

                              {/* Title & CTA card */}
                              <div className="py-4 w-full">
                                   <div className="text-center my-6">
                                        <span className="text-2xl font-bold text-green-500">
                                             {cb('page.title')}
                                        </span>
                                   </div>

                                   <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="w-full my-6"
                                   >
                                        <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <div className="w-full px-2">
                                                  <div className="rounded flex justify-between text-lg items-center">
                                                       {cb('cta.ready')}
                                                       <Registeration
                                                            handleClose={handleClose}
                                                            open={openLogin}
                                                            isRegister={true}
                                                       />
                                                       <Button
                                                            onClick={handleOpen}
                                                            className="normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
                                                            variant="contained"
                                                            size="medium"
                                                       >
                                                            <HowToRegIcon className="mr-2" />
                                                            {cb('cta.startTrading')}
                                                       </Button>
                                                  </div>
                                             </div>
                                        </div>
                                   </motion.div>

                                   {/* Sections */}
                                   <div className="mt-6 space-y-8">
                                        {/* Overview */}
                                        <div className="py-4 rounded">
                                             <span className="text-2xl font-semibold text-green-500">
                                                  {cb('sections.overview.title')}
                                             </span>
                                             <motion.div
                                                  initial={{ opacity: 0, y: 20 }}
                                                  animate={{ opacity: 1, y: 0 }}
                                                  transition={{ delay: 0.2 }}
                                                  className="mb-8 w-full my-6"
                                             >
                                                  <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            {(cb('sections.overview.bullets', { returnObjects: true }) || []).map(
                                                                 (line, i) => (
                                                                      <li key={i}>
                                                                           <span>{line}</span>
                                                                      </li>
                                                                 )
                                                            )}
                                                       </ul>
                                                  </div>
                                             </motion.div>
                                        </div>

                                        {/* Key Concepts */}
                                        <div className="py-4 rounded">
                                             <span className="text-xl font-semibold text-green-500">
                                                  {cb('sections.keyConcepts.title')}
                                             </span>
                                             <motion.div
                                                  initial={{ opacity: 0, y: 20 }}
                                                  animate={{ opacity: 1, y: 0 }}
                                                  transition={{ delay: 0.2 }}
                                                  className="mb-8 w-full my-6"
                                             >
                                                  <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                                       <ul className="mt-2 list-decimal pl-6 marker:text-emerald-400 space-y-2 text-lg leading-8">
                                                            {[
                                                                 cb('sections.keyConcepts.items.monetaryPolicy'),
                                                                 cb('sections.keyConcepts.items.interestRates'),
                                                                 cb('sections.keyConcepts.items.qe'),
                                                                 cb('sections.keyConcepts.items.guidance')
                                                            ].map((txt, i) => (
                                                                 <li key={i}>
                                                                      <span>{txt}</span>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>
                                             </motion.div>
                                        </div>

                                        {/* Impact on Markets */}
                                        <motion.div
                                             initial={{ opacity: 0, y: 20 }}
                                             animate={{ opacity: 1, y: 0 }}
                                             transition={{ delay: 0.2 }}
                                             className="mb-8 w-full"
                                        >
                                             <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                                  <div className="py-4 rounded">
                                                       <span className="text-2xl font-semibold my-6 text-green-700">
                                                            {cb('sections.impact.title')}
                                                       </span>

                                                       {/* Stocks */}
                                                       <div className="mt-4">
                                                            <span className="text-xl  text-green-200">
                                                                 {cb('sections.impact.stocks.title')}
                                                            </span>
                                                            <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                                 {(cb('sections.impact.stocks.bullets', {
                                                                      returnObjects: true
                                                                 }) || []).map((b, i) => (
                                                                      <li key={i}>
                                                                           <span>{b}</span>
                                                                      </li>
                                                                 ))}
                                                            </ul>
                                                       </div>

                                                       {/* FX */}
                                                       <div className="mt-4">
                                                            <span className="text-xl  text-green-200">
                                                                 {cb('sections.impact.fx.title')}
                                                            </span>
                                                            <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                                 {(cb('sections.impact.fx.bullets', {
                                                                      returnObjects: true
                                                                 }) || []).map((b, i) => (
                                                                      <li key={i}>
                                                                           <span>{b}</span>
                                                                      </li>
                                                                 ))}
                                                            </ul>
                                                       </div>

                                                       {/* Bonds */}
                                                       <div className="mt-8">
                                                            <span className="text-xl  text-green-200">
                                                                 {cb('sections.impact.bonds.title')}
                                                            </span>
                                                            <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                                 {(cb('sections.impact.bonds.bullets', {
                                                                      returnObjects: true
                                                                 }) || []).map((b, i) => (
                                                                      <li key={i}>
                                                                           <span>{b}</span>
                                                                      </li>
                                                                 ))}
                                                            </ul>
                                                       </div>

                                                       {/* Commodities */}
                                                       <div className="mt-8">
                                                            <span className="text-xl  text-green-200">
                                                                 {cb('sections.impact.commodities.title')}
                                                            </span>
                                                            <ul className="mt-2 text-lg leading-8 list-inside marker:text-xl space-y-2">
                                                                 {(cb('sections.impact.commodities.bullets', {
                                                                      returnObjects: true
                                                                 }) || []).map((b, i) => (
                                                                      <li key={i}>
                                                                           <span>{b}</span>
                                                                      </li>
                                                                 ))}
                                                            </ul>
                                                       </div>
                                                  </div>

                                                  {/* Indicators */}
                                                  <div className="py-4 rounded mt-8">
                                                       <span className="text-xl font-semibold text-green-700">
                                                            {cb('sections.indicators.title')}
                                                       </span>
                                                       <ul className="mt-2 text-lg leading-8 list-decimal pl-6 marker:text-emerald-400 space-y-2">
                                                            {(cb('sections.indicators.items', {
                                                                 returnObjects: true
                                                            }) || []).map((it, i) => (
                                                                 <li key={i} className="text-green-200">
                                                                      {it.label}
                                                                      <span className="text-green-100 mx-2">{it.text}</span>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  {/* Benefits */}
                                                  <div className="py-4 rounded mt-4">
                                                       <span className="text-xl font-semibold text-green-700">
                                                            {cb('sections.benefits.title')}
                                                       </span>
                                                       <ul className="mt-2 text-lg leading-8 list-inside marker:text-xl space-y-2">
                                                            {(cb('sections.benefits.bullets', {
                                                                 returnObjects: true
                                                            }) || []).map((b, i) => (
                                                                 <li key={i}>
                                                                      <span>{b}</span>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  {/* Limitations */}
                                                  <div className="py-4 rounded mt-4">
                                                       <span className="text-2xl font-semibold text-green-700">
                                                            {cb('sections.limitations.title')}
                                                       </span>
                                                       <ul className="mt-2 text-lg leading-8 list-inside marker:text-xl space-y-2">
                                                            {(cb('sections.limitations.bullets', {
                                                                 returnObjects: true
                                                            }) || []).map((b, i) => (
                                                                 <li key={i} className="text-green-200">
                                                                      {b.split(':')[0]}:
                                                                      <span className="text-green-100 mx-2">
                                                                           {b.split(':').slice(1).join(':').trim()}
                                                                      </span>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>
                                             </div>
                                        </motion.div>
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
                    ['common', 'nav', 'footer', 'auth', 'central-bank-policies'],
                    i18nConfig
               ))
          }
     }
}
