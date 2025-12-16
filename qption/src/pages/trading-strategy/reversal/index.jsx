import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { Button } from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import { FaChartLine } from 'react-icons/fa'
import dynamic from 'next/dynamic'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../../next-i18next.config.cjs'

const Registeration = dynamic(() => import('@/components/RegisterationModal/Registeration'), { ssr: false })

export default function ReversalPage() {
     const { t, i18n } = useTranslation('reversal')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     // pull arrays for JSON-LD
     const jsonLdAbout = t('seo.jsonLd.about', { returnObjects: true })
     const jsonLdSections = t('seo.jsonLd.articleSection', { returnObjects: true })

     const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: t('seo.jsonLd.headline'),
          description: t('seo.description'),
          mainEntityOfPage: t('seo.url'),
          image: t('seo.image'),
          publisher: { '@type': 'Organization', name: 'Qption' },
          about: Array.isArray(jsonLdAbout) ? jsonLdAbout.map((name) => ({ '@type': 'Thing', name })) : [],
          articleSection: Array.isArray(jsonLdSections) ? jsonLdSections : []
     }

     const [openLogin, setOpenLogin] = React.useState(false)

     return (
          <>
               <Head>
                    {/* Primary SEO */}
                    <title>{t('seo.title')}</title>
                    <meta name="description" content={t('seo.description')} />
                    <meta name="keywords" content={t('seo.keywords')} />

                    {/* Open Graph */}
                    <meta property="og:type" content="article" />
                    <meta property="og:site_name" content="Qption" />
                    <meta property="og:title" content={t('seo.title')} />
                    <meta property="og:description" content={t('seo.description')} />
                    <meta property="og:url" content={t('seo.url')} />
                    <meta property="og:image" content={t('seo.image')} />
                    <meta property="og:image:alt" content={t('seo.imageAlt')} />
                    <meta property="og:image:width" content="1200" />
                    <meta property="og:image:height" content="630" />

                    {/* Twitter */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={t('seo.title')} />
                    <meta name="twitter:description" content={t('seo.description')} />
                    <meta name="twitter:image" content={t('seo.image')} />

                    {/* Canonical & Robots */}
                    <link rel="canonical" href={t('seo.url')} />
                    <meta name="robots" content="index,follow" />

                    {/* Structured Data */}
                    <script
                         type="application/ld+json"
                         // eslint-disable-next-line react/no-danger
                         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                    />
               </Head>

               <main
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className="px-4 text-green-100 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 text-lg leading-8"
               >
                    <div className="my-12 flex flex-col items-start w-full max-w-7xl mx-auto">
                         {/* Breadcrumb */}
                         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="my-6">
                              <Link
                                   href="/trading-strategy"
                                   className="text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2"
                              >
                                   <FaChartLine className="text-lg" />
                                   <span className="text-lg">{t('breadcrumb')}</span>
                              </Link>
                         </motion.div>

                         {/* Title */}
                         <h1 className="text-4xl font-semibold mb-8 text-green-500 w-full text-center">
                              {t('title')}
                         </h1>

                         {/* CTA Card */}
                         <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="mb-8 w-full"
                         >
                              <div className="bg-linear-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                   <div className="flex md:flex-row items-center justify-between gap-4">
                                        <div className="text-lg text-green-100">{t('cta.prompt')}</div>
                                        <Button
                                             onClick={() => setOpenLogin(true)}
                                             className="normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
                                             variant="contained"
                                             size="medium"
                                        >
                                             <HowToRegIcon className={isRTL ? 'ml-2' : 'mr-2'} />
                                             {t('cta.button')}
                                        </Button>
                                   </div>
                              </div>
                         </motion.div>

                         {/* Video */}
                         <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full my-5 bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-1 md:p-4 border border-green-500/20 flex flex-col">
                              <video
                                   src="/videos/reversal-strategy/reversal-strategy.mp4"
                                   poster="/videos/reversal-strategy/reversal-strategy.png"
                                   controls
                                   playsInline
                                   preload="metadata"
                                   style={{ width: '100%', height: 'auto', borderRadius: 12 }}
                                   aria-description={t('video.aria')}
                              />
                         </motion.div>

                         {/* Key Concepts */}
                         <span className="text-2xl font-semibold my-4 text-green-700">{t('sections.keyConcepts.title')}</span>
                         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8 w-full">
                              <div className="bg-linear-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                   <ul className="font-normal text-lg leading-8 my-2 list-decimal list-inside marker:text-xl space-y-3">
                                        {[
                                             'exhaustion',
                                             'sr',
                                             'indicators',
                                             'candles',
                                             'divergence'
                                        ].map((k) => (
                                             <li key={k}>
                                                  <span className="font-bold text-lg text-green-200">
                                                       {t(`sections.keyConcepts.items.${k}.title`)}
                                                  </span>
                                                  <br />
                                                  {t(`sections.keyConcepts.items.${k}.desc`)}
                                             </li>
                                        ))}
                                   </ul>
                              </div>
                         </motion.div>

                         {/* Applying */}
                         <span className="text-2xl font-semibold my-6 text-green-700">{t('sections.applying.title')}</span>
                         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8 w-full">
                              <div className="bg-linear-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                   <ul className="font-normal text-lg leading-8 my-2 list-decimal list-inside marker:text-xl space-y-3">
                                        {[
                                             'identifyTrend',
                                             'watchSignals',
                                             'confirm',
                                             'entriesExits',
                                             'risk'
                                        ].map((k) => (
                                             <li key={k}>
                                                  <span className="font-bold text-lg text-green-200">
                                                       {t(`sections.applying.items.${k}.title`)}
                                                  </span>
                                                  <br />
                                                  {t(`sections.applying.items.${k}.desc`)}
                                             </li>
                                        ))}
                                   </ul>
                              </div>
                         </motion.div>

                         {/* Example */}
                         <span className="text-2xl font-semibold my-6 text-green-700">{t('sections.example.title')}</span>
                         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8 w-full">
                              <div className="bg-linear-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                   <p className="my-2 text-lg leading-8">{t('sections.example.p1')}</p>
                                   <p className="my-2 text-lg leading-8">{t('sections.example.p2')}</p>
                              </div>
                         </motion.div>
                    </div>

                    <Registeration handleClose={() => setOpenLogin(false)} open={openLogin} isRegister />
               </main>
          </>
     )
}

export async function getServerSideProps({ locale }) {
     return {
          props: {
               ...(await serverSideTranslations(
                    locale,
                    ['common', 'nav', 'footer', 'auth', 'reversal'],
                    i18nConfig
               ))
          }
     }
}
