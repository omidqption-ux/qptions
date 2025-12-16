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

const Registeration = dynamic(() => import('@/components/RegisterationModal/Registeration'), { ssr: false })

export default function GeopoliticalPage() {
     const { t: gp, i18n } = useTranslation('geopolitical-events-and-markets')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     // JSON-LD (localized)
     const jsonLd = gp('seo.ld', { returnObjects: true })

     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)


     const typeItems = Array.isArray(gp('sections.types.items', { returnObjects: true }))
          ? gp('sections.types.items', { returnObjects: true })
          : [];

     return (
          <>
               <Head>
                    {/* ---------- Primary SEO (localized) ---------- */}
                    <title>{gp('seo.title')}</title>
                    <meta name="description" content={gp('seo.description')} />
                    <meta name="keywords" content={gp('seo.keywords')} />
                    <link rel="canonical" href={gp('seo.canonical')} />

                    {/* ---------- Open Graph ---------- */}
                    <meta property="og:type" content="article" />
                    <meta property="og:title" content={gp('seo.ogTitle')} />
                    <meta property="og:description" content={gp('seo.ogDescription')} />
                    <meta property="og:url" content={gp('seo.url')} />
                    <meta property="og:image" content={gp('seo.image')} />

                    {/* ---------- Twitter Card ---------- */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content={gp('seo.twitterSite')} />
                    <meta name="twitter:title" content={gp('seo.twitterTitle')} />
                    <meta name="twitter:description" content={gp('seo.twitterDescription')} />
                    <meta name="twitter:image" content={gp('seo.twitterImage')} />

                    {/* ---------- JSON-LD ---------- */}
                    <script
                         type="application/ld+json"
                         // eslint-disable-next-line react/no-danger
                         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                    />
               </Head>

               <SEOAlternates />

               <SlideUpSection>
                    <main
                         dir={isRTL ? 'rtl' : 'ltr'}
                         className="font-normal px-4 text-green-100 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 text-lg leading-8"
                    >
                         <Registeration handleClose={handleClose} open={openLogin} isRegister={true} />

                         <div className="lg:my-12 my-4 flex flex-col items-start w-full max-w-7xl mx-auto leading-8">
                              {/* Breadcrumb back link */}
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="my-6">
                                   <Link
                                        href="/fundamentalanalysis"
                                        className="text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2"
                                   >
                                        <FaChartLine className="text-lg" />
                                        <span className="text-lg">{gp('breadcrumb.fundamentalAnalysis')}</span>
                                   </Link>
                              </motion.div>

                              {/* Title */}
                              <div className="py-4">
                                   <div className="text-center">
                                        <span className="text-2xl font-bold text-green-500">
                                             {gp('page.title')}
                                        </span>
                                   </div>

                                   {/* CTA card */}
                                   <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="mb-8 w-full my-6"
                                   >
                                        <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <div className="w-full px-2">
                                                  <div className="text-lg items-center rounded flex justify-between">
                                                       {gp('cta.ready')}
                                                       <Button
                                                            onClick={handleOpen}
                                                            className="normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
                                                            variant="contained"
                                                            size="medium"
                                                       >
                                                            <HowToRegIcon className="mr-2" />
                                                            {gp('cta.startTrading')}
                                                       </Button>
                                                  </div>
                                             </div>
                                        </div>
                                   </motion.div>

                                   {/* Content wrapper */}
                                   <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="mb-8 w-full my-6"
                                   >
                                        <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <div className="mt-6 space-y-8">

                                                  {/* Overview */}
                                                  <div className="py-4 rounded">
                                                       <span className="text-2xl font-semibold text-green-700">
                                                            {gp('sections.overview.title')}
                                                       </span>
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            {(gp('sections.overview.bullets', { returnObjects: true })).map((b, i) => (
                                                                 <li key={i}><span>{b}</span></li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  {/* Types of events */}
                                                  <div className="py-4 rounded">
                                                       <span className="text-2xl font-semibold my-6 text-green-700">
                                                            {gp('sections.types.title')}
                                                       </span>
                                                       <ul className="mt-2 list-decimal list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            {typeItems.length > 0 &&
                                                                 typeItems.map((it, i) => (
                                                                      <li key={i} className="text-green-200">
                                                                           <span className="font-semibold">{it.label}</span>
                                                                           <span className="text-green-100 mx-2">{it.text}</span>
                                                                      </li>
                                                                 ))
                                                            }
                                                       </ul>
                                                  </div>

                                                  {/* Market Reactions */}
                                                  <div className="py-4 rounded my-6">
                                                       <span className="text-2xl font-semibold text-green-700">
                                                            {gp('sections.reactions.title')}
                                                       </span>

                                                       {/* Stocks */}
                                                       <div className="mt-4">
                                                            <span className="text-xl  text-green-200">
                                                                 {gp('sections.reactions.stocks.title')}
                                                            </span>
                                                            <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                                 {(gp('sections.reactions.stocks.bullets', { returnObjects: true })).map((b, i) => (
                                                                      <li key={i}><span>{b}</span></li>
                                                                 ))}
                                                            </ul>
                                                       </div>

                                                       {/* FX */}
                                                       <div className="mt-6">
                                                            <span className="text-xl  text-green-200">
                                                                 {gp('sections.reactions.fx.title')}
                                                            </span>
                                                            <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                                 {(gp('sections.reactions.fx.bullets', { returnObjects: true })).map((b, i) => (
                                                                      <li key={i}><span>{b}</span></li>
                                                                 ))}
                                                            </ul>
                                                       </div>

                                                       {/* Commodities */}
                                                       <div className="mt-6">
                                                            <span className="text-xl  text-green-200">
                                                                 {gp('sections.reactions.commodities.title')}
                                                            </span>
                                                            <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                                 {(gp('sections.reactions.commodities.bullets', { returnObjects: true })).map((b, i) => (
                                                                      <li key={i}><span>{b}</span></li>
                                                                 ))}
                                                            </ul>
                                                       </div>

                                                       {/* Bonds */}
                                                       <div className="mt-6">
                                                            <span className="text-xl  text-green-200">
                                                                 {gp('sections.reactions.bonds.title')}
                                                            </span>
                                                            <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                                 {(gp('sections.reactions.bonds.bullets', { returnObjects: true })).map((b, i) => (
                                                                      <li key={i}><span>{b}</span></li>
                                                                 ))}
                                                            </ul>
                                                       </div>
                                                  </div>

                                                  {/* Benefits */}
                                                  <div className="py-4 mt-6 rounded">
                                                       <span className="text-2xl font-semibold text-green-700">
                                                            {gp('sections.benefits.title')}
                                                       </span>
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            {(gp('sections.benefits.bullets', { returnObjects: true })).map((b, i) => (
                                                                 <li key={i}><span>{b}</span></li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  {/* Limitations */}
                                                  <div className="py-4 mt-6 rounded">
                                                       <span className="text-2xl font-semibold text-green-700">
                                                            {gp('sections.limitations.title')}
                                                       </span>
                                                       <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                            {(gp('sections.limitations.items', { returnObjects: true })).map(
                                                                 (it, i) => (
                                                                      <li key={i} className="text-green-200">
                                                                           {it.label}
                                                                           <span className="text-green-100 mx-2">{it.text}</span>
                                                                      </li>
                                                                 )
                                                            )}
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
                    ['common', 'nav', 'footer', 'auth', 'geopolitical-events-and-markets'],
                    i18nConfig
               )),
          },
     }
}
