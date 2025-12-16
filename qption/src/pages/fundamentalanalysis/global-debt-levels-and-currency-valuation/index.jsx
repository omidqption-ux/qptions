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

export default function Debt() {
     const { t: dv, i18n } = useTranslation('debtValuation')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     const typesItems = dv('sections.factors.items', { returnObjects: true }) || []
     const impactIR = dv('sections.impact.ir.items', { returnObjects: true }) || []
     const impactConf = dv('sections.impact.conf.items', { returnObjects: true }) || []
     const impactFiscal = dv('sections.impact.fiscal.items', { returnObjects: true }) || []
     const reactFx = dv('sections.reactions.fx.items', { returnObjects: true }) || []
     const reactBond = dv('sections.reactions.bond.items', { returnObjects: true }) || []
     const benefits = dv('sections.benefits.items', { returnObjects: true }) || []
     const limits = dv('sections.limits.items', { returnObjects: true }) || []
     const overview = dv('sections.overview.items', { returnObjects: true }) || []

     const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: dv('seo.ld.headline'),
          description: dv('seo.description'),
          mainEntityOfPage: dv('seo.url'),
          publisher: { '@type': 'Organization', name: 'Qption' }
     }

     return (
          <>
               <Head>
                    <title>{dv('seo.title')}</title>
                    <meta name="description" content={dv('seo.description')} />
                    <meta name="keywords" content={dv('seo.keywords')} />
                    <link rel="canonical" href={dv('seo.url')} />
                    <meta property="og:type" content="article" />
                    <meta property="og:title" content={dv('seo.title')} />
                    <meta property="og:description" content={dv('seo.description')} />
                    <meta property="og:url" content={dv('seo.url')} />
                    <meta name="twitter:title" content={dv('seo.title')} />
                    <meta name="twitter:description" content={dv('seo.description')} />
                    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
               </Head>

               <SlideUpSection>
                    <main
                         dir={isRTL ? 'rtl' : 'ltr'}
                         className="font-normal px-4 text-green-100 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 text-lg leading-8"
                    >
                         <div className="lg:my-12 my-4 flex flex-col items-start w-full max-w-7xl mx-auto">
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="my-6">
                                   <Link
                                        href="/fundamentalanalysis"
                                        className="text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2"
                                   >
                                        <FaChartLine className="text-lg" />
                                        <span className="text-lg">{dv('breadcrumb.fundamentalAnalysis')}</span>
                                   </Link>
                              </motion.div>

                              <div className="py-4 w-full">
                                   <div className="text-center my-6">
                                        <span className="text-2xl font-bold text-green-500">
                                             {dv('page.title')}
                                        </span>
                                   </div>

                                   <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="mb-8 w-full"
                                   >
                                        <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <div className="w-full px-2">
                                                  <div className="text-lg items-center rounded flex justify-between">
                                                       {dv('cta.ready')}
                                                       <Registeration handleClose={() => { }} open={false} isRegister />
                                                       <Button
                                                            onClick={() => { }}
                                                            className="normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
                                                            variant="contained"
                                                            size="medium"
                                                       >
                                                            <HowToRegIcon className="mr-2" />
                                                            {dv('cta.start')}
                                                       </Button>
                                                  </div>
                                             </div>
                                        </div>
                                   </motion.div>
                              </div>

                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.2 }}
                                   className="mb-8 w-full"
                              >
                                   <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                        <div className="mt-6 space-y-8">
                                             {/* Overview */}
                                             <div className="py-4 rounded">
                                                  <span className="text-2xl font-semibold text-green-700">{dv('sections.overview.title')}</span>
                                                  <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                       {overview.map((s, i) => (
                                                            <li key={i}><span>{s}</span></li>
                                                       ))}
                                                  </ul>
                                             </div>

                                             {/* Key Factors */}
                                             <div className="py-4 rounded">
                                                  <span className="text-2xl font-semibold text-green-700">{dv('sections.factors.title')}</span>
                                                  <ul className="mt-2 list-decimal list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                       {typesItems.map((it, i) => (
                                                            <li key={i} className="text-green-200">
                                                                 {it.label}
                                                                 <span className="text-green-100 mx-2">{it.text}</span>
                                                            </li>
                                                       ))}
                                                  </ul>
                                             </div>

                                             {/* Impact on Currency Valuation */}
                                             <div className="py-4 rounded">
                                                  <span className="text-2xl font-semibold text-green-700">{dv('sections.impact.title')}</span>

                                                  <div className="mt-4">
                                                       <span className="text-xl  text-green-200">{dv('sections.impact.ir.title')}</span>
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            {impactIR.map((s, i) => (
                                                                 <li key={i}><span>{s}</span></li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  <div className="mt-4">
                                                       <span className="text-xl  text-green-200">{dv('sections.impact.conf.title')}</span>
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            {impactConf.map((s, i) => (
                                                                 <li key={i}><span>{s}</span></li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  <div className="mt-4">
                                                       <span className="text-xl  text-green-200">{dv('sections.impact.fiscal.title')}</span>
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            {impactFiscal.map((s, i) => (
                                                                 <li key={i}><span>{s}</span></li>
                                                            ))}
                                                       </ul>
                                                  </div>
                                             </div>

                                             {/* Market Reactions */}
                                             <div className="py-4 rounded">
                                                  <span className="text-2xl font-semibold text-green-700">{dv('sections.reactions.title')}</span>

                                                  <div className="mt-4">
                                                       <span className="text-xl  text-green-200">{dv('sections.reactions.fx.title')}</span>
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            {reactFx.map((s, i) => (
                                                                 <li key={i}><span>{s}</span></li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  <div className="mt-4">
                                                       <span className="text-xl  text-green-200">{dv('sections.reactions.bond.title')}</span>
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            {reactBond.map((s, i) => (
                                                                 <li key={i}><span>{s}</span></li>
                                                            ))}
                                                       </ul>
                                                  </div>
                                             </div>

                                             {/* Benefits */}
                                             <div className="py-4 rounded">
                                                  <span className="text-2xl font-semibold text-green-700">{dv('sections.benefits.title')}</span>
                                                  <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                       {benefits.map((s, i) => (
                                                            <li key={i}><span>{s}</span></li>
                                                       ))}
                                                  </ul>
                                             </div>

                                             {/* Limitations */}
                                             <div className="py-4 rounded">
                                                  <span className="text-2xl font-semibold text-green-700">{dv('sections.limits.title')}</span>
                                                  <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                       {limits.map((s, i) => (
                                                            <li key={i}><span>{s}</span></li>
                                                       ))}
                                                  </ul>
                                             </div>
                                        </div>
                                   </div>
                              </motion.div>
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
                    ['common', 'nav', 'footer', 'auth', 'debtValuation'],
                    i18nConfig
               ))
          }
     }
}
