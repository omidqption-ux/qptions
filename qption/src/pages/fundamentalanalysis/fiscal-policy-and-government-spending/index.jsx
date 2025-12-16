import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Button } from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import { FaChartLine } from 'react-icons/fa'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../../next-i18next.config.cjs'
import SEOAlternates from '@/components/SEOAlternates'

const Registeration = dynamic(
     () => import('@/components/RegisterationModal/Registeration'),
     { ssr: false }
)

export default function FiscalPolicyPage() {
     const { t: tFP, i18n } = useTranslation('fiscal-policy-and-government-spending')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     // ----- precompute translated arrays (pure JS safe) -----
     const overviewItems =
          (tFP('sections.overview.items', { returnObjects: true })) || []

     const typesItems =
          (tFP('sections.types.items', { returnObjects: true })) || []

     const componentsPublicGoods =
          (tFP('sections.components.public.items', { returnObjects: true })) || []

     const componentsSocial =
          (tFP('sections.components.social.items', { returnObjects: true })) || []

     const componentsDefense =
          (tFP('sections.components.defense.items', { returnObjects: true })) || []

     const impactGrowth =
          (tFP('sections.impact.growth.items', { returnObjects: true })) || []

     const impactInflation =
          (tFP('sections.impact.inflation.items', { returnObjects: true })) || []

     const impactDebt =
          (tFP('sections.impact.debt.items', { returnObjects: true })) || []

     const benefitsItems =
          (tFP('sections.benefits.items', { returnObjects: true })) || []

     const limitsItems =
          (tFP('sections.limits.items', { returnObjects: true })) || []

     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     return (
          <>
               <Head>
                    {/* SEO */}
                    <title>{tFP('seo.title')}</title>
                    <meta name="description" content={tFP('seo.description')} />
                    <meta name="keywords" content={tFP('seo.keywords')} />
                    <link rel="canonical" href={tFP('seo.url')} />
                    {/* Open Graph */}
                    <meta property="og:type" content="article" />
                    <meta property="og:title" content={tFP('seo.title')} />
                    <meta property="og:description" content={tFP('seo.description')} />
                    <meta property="og:url" content={tFP('seo.url')} />
                    {/* Twitter */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={tFP('seo.title')} />
                    <meta name="twitter:description" content={tFP('seo.description')} />
                    {/* JSON-LD */}
                    <script
                         type="application/ld+json"
                         // json-ld string from translations so we can localize pieces if needed
                         dangerouslySetInnerHTML={{ __html: JSON.stringify(tFP('seo.ld', { returnObjects: true })) }}
                    />
               </Head>

               <SEOAlternates />

               <main
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className="font-normal px-2 text-green-100 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 text-lg leading-8"
               >
                    <Registeration open={openLogin} handleClose={handleClose} isRegister />

                    <div className="lg:my-12 my-4 flex flex-col items-start w-full max-w-7xl mx-auto">
                         {/* Breadcrumb */}
                         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                              <Link
                                   href="/fundamentalanalysis"
                                   className="text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2"
                              >
                                   <FaChartLine className="text-lg" />
                                   <span className="text-lg">{tFP('breadcrumb.fundamentalAnalysis')}</span>
                              </Link>
                         </motion.div>

                         {/* Title + CTA */}
                         <div className="w-full">
                              <div className="text-center my-6">
                                   <span className="text-2xl font-bold text-green-500">{tFP('page.title')}</span>
                              </div>

                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.2 }}
                                   className="mb-8 w-full"
                              >
                                   <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                        <div className="w-full px-2">
                                             <div className="rounded flex items-center text-lg justify-between">
                                                  {tFP('cta.ready')}
                                                  <Button
                                                       onClick={handleOpen}
                                                       className="normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
                                                       variant="contained"
                                                       size="medium"
                                                  >
                                                       <HowToRegIcon className="mr-2" />
                                                       {tFP('cta.start')}
                                                  </Button>
                                             </div>
                                        </div>
                                   </div>
                              </motion.div>
                         </div>

                         {/* Content */}
                         <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="mb-8 w-full my-6"
                         >
                              <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                   <div className="mt-4 space-y-8">
                                        {/* Overview */}
                                        <section className="py-4">
                                             <h2 className="text-2xl font-semibold text-green-700">{tFP('sections.overview.title')}</h2>
                                             <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                  {overviewItems.map((it, i) => (
                                                       <li key={i}>
                                                            <span>{it}</span>
                                                       </li>
                                                  ))}
                                             </ul>
                                        </section>

                                        {/* Types */}
                                        <section className="py-4">
                                             <h2 className="text-2xl font-semibold text-green-700">{tFP('sections.types.title')}</h2>
                                             <ul className="mt-2 text-lg leading-8 list-decimal list-inside marker:text-xl space-y-2">
                                                  {typesItems.map((it, i) => (
                                                       <li key={i} className="text-green-200">
                                                            {it.label}
                                                            <span className="text-green-100 mx-2">{it.text}</span>
                                                       </li>
                                                  ))}
                                             </ul>
                                        </section>

                                        {/* Components */}
                                        <section className="py-4">
                                             <h2 className="text-2xl font-semibold text-green-700">{tFP('sections.components.title')}</h2>

                                             {/* Public goods & services */}
                                             <div className="mt-4">
                                                  <h3 className="text-xl  text-green-200">
                                                       {tFP('sections.components.public.title')}
                                                  </h3>
                                                  <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                       {componentsPublicGoods.map((it, i) => (
                                                            <li key={i}>
                                                                 <span>{it}</span>
                                                            </li>
                                                       ))}
                                                  </ul>
                                             </div>

                                             {/* Social programs */}
                                             <div className="mt-4">
                                                  <h3 className="text-xl  text-green-200">
                                                       {tFP('sections.components.social.title')}
                                                  </h3>
                                                  <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                       {componentsSocial.map((it, i) => (
                                                            <li key={i}>
                                                                 <span>{it}</span>
                                                            </li>
                                                       ))}
                                                  </ul>
                                             </div>

                                             {/* Defense */}
                                             <div className="mt-6">
                                                  <h3 className="text-xl  text-green-200">
                                                       {tFP('sections.components.defense.title')}
                                                  </h3>
                                                  <ul className="mt-2 text-lg leading-8 list-inside marker:text-xl space-y-2">
                                                       {componentsDefense.map((it, i) => (
                                                            <li key={i}>
                                                                 <span>{it}</span>
                                                            </li>
                                                       ))}
                                                  </ul>
                                             </div>
                                        </section>

                                        {/* Impact */}
                                        <section className="py-4">
                                             <h2 className="text-xl font-semibold text-green-700">
                                                  {tFP('sections.impact.title')}
                                             </h2>

                                             <div className="mt-6">
                                                  <h3 className="text-xl  text-green-200">
                                                       {tFP('sections.impact.growth.title')}
                                                  </h3>
                                                  <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                       {impactGrowth.map((it, i) => (
                                                            <li key={i}>
                                                                 <span>{it}</span>
                                                            </li>
                                                       ))}
                                                  </ul>
                                             </div>

                                             <div className="mt-6">
                                                  <h3 className="text-xl  text-green-200">
                                                       {tFP('sections.impact.inflation.title')}
                                                  </h3>
                                                  <ul className="mt-2 text-lg leading-8 list-inside marker:text-xl space-y-2">
                                                       {impactInflation.map((it, i) => (
                                                            <li key={i}>
                                                                 <span>{it}</span>
                                                            </li>
                                                       ))}
                                                  </ul>
                                             </div>

                                             <div className="mt-6">
                                                  <h3 className="text-xl text-green-200">
                                                       {tFP('sections.impact.debt.title')}
                                                  </h3>
                                                  <ul className="mt-2 text-lg leading-8 list-inside marker:text-xl space-y-2">
                                                       {impactDebt.map((it, i) => (
                                                            <li key={i}>
                                                                 <span>{it}</span>
                                                            </li>
                                                       ))}
                                                  </ul>
                                             </div>
                                        </section>

                                        {/* Benefits */}
                                        <section className="py-4 mt-4">
                                             <h2 className="text-2xl text-green-700 font-semibold">
                                                  {tFP('sections.benefits.title')}
                                             </h2>
                                             <ul className="text-lg leading-8 mt-2 list-inside marker:text-xl space-y-2">
                                                  {benefitsItems.map((it, i) => (
                                                       <li key={i}>
                                                            <span>{it}</span>
                                                       </li>
                                                  ))}
                                             </ul>
                                        </section>

                                        {/* Limits */}
                                        <section className="py-4 rounded mt-6">
                                             <h2 className="text-xl font-semibold text-green-700">
                                                  {tFP('sections.limits.title')}
                                             </h2>
                                             <ul className="mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8">
                                                  {limitsItems.map((it, i) => (
                                                       <li key={i}>
                                                            <span>{it}</span>
                                                       </li>
                                                  ))}
                                             </ul>
                                        </section>
                                   </div>
                              </div>
                         </motion.div>
                    </div>
               </main>
          </>
     )
}

// ---- Next.js i18n SSG/SSR hook (pure JS, same pattern) ----
export async function getServerSideProps({ locale }) {
     return {
          props: {
               ...(await serverSideTranslations(
                    locale,
                    ['common', 'nav', 'footer', 'auth', 'fiscal-policy-and-government-spending'],
                    i18nConfig
               )),
          },
     }
}
