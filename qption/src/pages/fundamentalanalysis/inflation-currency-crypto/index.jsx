import React from 'react'
import Link from 'next/link'
import SlideUpSection from '@/components/SlideUp/SlideUp'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Button } from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import { motion } from 'framer-motion'
import { FaChartLine } from 'react-icons/fa'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../../next-i18next.config.cjs'
import SEOAlternates from '@/components/SEOAlternates'

const Registeration = dynamic(
     () => import('@/components/RegisterationModal/Registeration'),
     { ssr: false }
)

export default function Inflation() {
     const { t: inf, i18n } = useTranslation('inflation-currency-crypto')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     const overviewBullets = inf('sections.overview.bullets', { returnObjects: true }) || []
     const indicators = inf('sections.indicators.items', { returnObjects: true }) || []

     const fxStrength = inf('sections.impactCurrency.currencyStrength.bullets', { returnObjects: true }) || []
     const fxRates = inf('sections.impactCurrency.ratePolicy.bullets', { returnObjects: true }) || []

     const cryptoHedge = inf('sections.impactCrypto.hedge.bullets', { returnObjects: true }) || []
     const cryptoVol = inf('sections.impactCrypto.volatility.bullets', { returnObjects: true }) || []

     const benefits = inf('sections.benefits.bullets', { returnObjects: true }) || []
     const limits = inf('sections.limitations.bullets', { returnObjects: true }) || []

     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     return (
          <>
               <Head>
                    {/* SEO (localized) */}
                    <title>{inf('seo.title')}</title>
                    <meta name="description" content={inf('seo.description')} />
                    <meta name="keywords" content={inf('seo.keywords')} />
                    <link rel="canonical" href={inf('seo.canonical')} />

                    {/* Open Graph */}
                    <meta property="og:type" content="article" />
                    <meta property="og:title" content={inf('seo.ogTitle')} />
                    <meta property="og:description" content={inf('seo.ogDescription')} />
                    <meta property="og:url" content={inf('seo.url')} />
                    <meta property="og:image" content={inf('seo.image')} />

                    {/* Twitter */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content={inf('seo.twitterSite')} />
                    <meta name="twitter:title" content={inf('seo.twitterTitle')} />
                    <meta name="twitter:description" content={inf('seo.twitterDescription')} />
                    <meta name="twitter:image" content={inf('seo.twitterImage')} />

                    {/* JSON-LD */}
                    <script
                         type="application/ld+json"
                         // Keep LD from translations to allow full localization
                         dangerouslySetInnerHTML={{ __html: JSON.stringify(inf('seo.ld', { returnObjects: true })) }}
                    />
               </Head>

               <SEOAlternates />

               <SlideUpSection>
                    <Registeration handleClose={handleClose} open={openLogin} isRegister={true} />
                    <main
                         dir={isRTL ? 'rtl' : 'ltr'}
                         className="font-normal px-4 text-green-100 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 text-lg leading-8"
                    >
                         <div className="lg:my-12 my-4 flex flex-col items-start w-full max-w-7xl mx-auto">
                              {/* Breadcrumb */}
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="my-6">
                                   <Link
                                        href="/fundamentalanalysis"
                                        className="text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2"
                                   >
                                        <FaChartLine className="text-lg" />
                                        <span className="text-lg">{inf('breadcrumb.fundamentalAnalysis')}</span>
                                   </Link>
                              </motion.div>

                              {/* Title + CTA card */}
                              <div className="py-4 w-full">
                                   <div className="text-center my-6">
                                        <span className="text-2xl font-bold text-green-500">{inf('page.title')}</span>
                                   </div>

                                   <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="mb-8 w-full"
                                   >
                                        <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <div className="w-full px-2">
                                                  <div className="text-green-100 rounded flex justify-between items-center text-lg">
                                                       {inf('cta.ready')}
                                                       <Button
                                                            onClick={handleOpen}
                                                            className="normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
                                                            variant="contained"
                                                            size="medium"
                                                       >
                                                            <HowToRegIcon className="mr-2" />
                                                            {inf('cta.startTrading')}
                                                       </Button>
                                                  </div>
                                             </div>
                                        </div>
                                   </motion.div>

                                   {/* Overview */}
                                   <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="mb-8 w-full"
                                   >
                                        <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <div className="p-4 rounded">
                                                  <span className="text-2xl font-semibold text-green-700">{inf('sections.overview.title')}</span>
                                                  <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                       {overviewBullets.map((b, i) => (
                                                            <li key={i}>
                                                                 <span>{b}</span>
                                                            </li>
                                                       ))}
                                                  </ul>
                                             </div>
                                        </div>
                                   </motion.div>

                                   {/* Key Concepts */}
                                   <div className="p-4 rounded">
                                        <span className="text-2xl font-semibold text-green-700">{inf('sections.keyConcepts.title')}</span>
                                        <ul className="mt-2 list-decimal list-inside marker:text-green-200 marker:text-xl space-y-2 text-lg leading-8">
                                             <li className="text-green-200">
                                                  {inf('sections.keyConcepts.items.cpi.label')}
                                                  <span className="text-green-100 mx-2">
                                                       {inf('sections.keyConcepts.items.cpi.text')}
                                                  </span>
                                             </li>
                                             <li className="text-green-200">
                                                  {inf('sections.keyConcepts.items.ppi.label')}
                                                  <span className="text-green-100 mx-2">
                                                       {inf('sections.keyConcepts.items.ppi.text')}
                                                  </span>
                                             </li>
                                             <li className="text-green-200">
                                                  {inf('sections.keyConcepts.items.demandPull.label')}
                                                  <span className="text-green-100 mx-2">
                                                       {inf('sections.keyConcepts.items.demandPull.text')}
                                                  </span>
                                             </li>
                                             <li className="text-green-200">
                                                  {inf('sections.keyConcepts.items.costPush.label')}
                                                  <span className="text-green-100 mx-2">
                                                       {inf('sections.keyConcepts.items.costPush.text')}
                                                  </span>
                                             </li>
                                        </ul>
                                   </div>

                                   {/* Impact on FX */}
                                   <div className="p-4 rounded">
                                        <span className="text-2xl font-semibold text-green-700">
                                             {inf('sections.impactCurrency.title')}
                                        </span>

                                        <div className="mt-4">
                                             <span className="text-xl font-semibold text-green-200">
                                                  {inf('sections.impactCurrency.currencyStrength.title')}
                                             </span>
                                             <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                  {fxStrength.map((b, i) => (
                                                       <li key={i}>
                                                            <span>{b}</span>
                                                       </li>
                                                  ))}
                                             </ul>
                                        </div>

                                        <div className="mt-4">
                                             <span className="text-xl font-semibold text-green-200">
                                                  {inf('sections.impactCurrency.ratePolicy.title')}
                                             </span>
                                             <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                  {fxRates.map((b, i) => (
                                                       <li key={i}>
                                                            <span>{b}</span>
                                                       </li>
                                                  ))}
                                             </ul>
                                        </div>
                                   </div>

                                   {/* Impact on Crypto */}
                                   <div className="p-4 rounded">
                                        <span className="text-2xl font-semibold text-green-700">
                                             {inf('sections.impactCrypto.title')}
                                        </span>

                                        <div className="mt-4">
                                             <span className="text-xl font-semibold text-green-200">
                                                  {inf('sections.impactCrypto.hedge.title')}
                                             </span>
                                             <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                  {cryptoHedge.map((b, i) => (
                                                       <li key={i}>
                                                            <span>{b}</span>
                                                       </li>
                                                  ))}
                                             </ul>
                                        </div>

                                        <div className="mt-4">
                                             <span className="text-xl font-semibold text-green-200">
                                                  {inf('sections.impactCrypto.volatility.title')}
                                             </span>
                                             <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                  {cryptoVol.map((b, i) => (
                                                       <li key={i}>
                                                            <span>{b}</span>
                                                       </li>
                                                  ))}
                                             </ul>
                                        </div>
                                   </div>

                                   {/* Indicators */}
                                   <div className="p-4 rounded">
                                        <span className="text-2xl font-semibold text-green-700">
                                             {inf('sections.indicators.title')}
                                        </span>
                                        <ul className="mt-2 list-decimal list-inside marker:text-green-200 marker:text-xl space-y-2 text-lg leading-8">
                                             {indicators.map((it, i) => (
                                                  <li key={i} className="text-green-200">
                                                       {it.label}
                                                       <span className="text-green-100 mx-2">{it.text}</span>
                                                  </li>
                                             ))}
                                        </ul>
                                   </div>

                                   {/* Benefits */}
                                   <div className="py-4 rounded">
                                        <span className="text-2xl font-semibold text-green-700">
                                             {inf('sections.benefits.title')}
                                        </span>
                                        <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                             {benefits.map((b, i) => (
                                                  <li key={i}>
                                                       <span>{b}</span>
                                                  </li>
                                             ))}
                                        </ul>
                                   </div>

                                   {/* Limitations */}
                                   <div className="py-4 rounded">
                                        <span className="text-2xl font-semibold text-green-700">
                                             {inf('sections.limitations.title')}
                                        </span>
                                        <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                             {limits.map((b, i) => (
                                                  <li key={i} className={b?.emphasis ? 'text-green-200' : ''}>
                                                       <span className={b?.emphasis ? 'text-green-100 mx-2' : ''}>
                                                            {typeof b === 'string' ? b : b.text}
                                                       </span>
                                                  </li>
                                             ))}
                                        </ul>
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
                    ['common', 'nav', 'footer', 'auth', 'inflation-currency-crypto'],
                    i18nConfig
               )),
          },
     }
}
