import React from 'react'
import Link from 'next/link'
import SlideUpSection from '@/components/SlideUp/SlideUp'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { motion } from 'framer-motion'
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

export default function InterestRatePage() {
     const { t: ir, i18n } = useTranslation('interestRate')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     // Optional JSON-LD pulled from translations (keeps SEO localized)
     const ld = ir('seo.ld', { returnObjects: true })

     return (
          <>
               <Head>
                    {/* ---------- Primary SEO (localized) ---------- */}
                    <title>{ir('seo.title')}</title>
                    <meta name='description' content={ir('seo.description')} />
                    <meta name='keywords' content={ir('seo.keywords')} />
                    <link rel='canonical' href={ir('seo.canonical')} />
                    <meta name='robots' content='index,follow' />

                    {/* ---------- Open Graph ---------- */}
                    <meta property='og:type' content='article' />
                    <meta property='og:title' content={ir('seo.ogTitle')} />
                    <meta property='og:description' content={ir('seo.ogDescription')} />
                    <meta property='og:url' content={ir('seo.url')} />
                    <meta property='og:image' content={ir('seo.image')} />

                    {/* ---------- Twitter Card ---------- */}
                    <meta name='twitter:card' content='summary_large_image' />
                    <meta name='twitter:site' content={ir('seo.twitterSite')} />
                    <meta name='twitter:title' content={ir('seo.twitterTitle')} />
                    <meta name='twitter:description' content={ir('seo.twitterDescription')} />
                    <meta name='twitter:image' content={ir('seo.twitterImage')} />

                    {/* ---------- JSON-LD (optional) ---------- */}
                    {ld && (
                         <script
                              type='application/ld+json'
                              // eslint-disable-next-line react/no-danger
                              dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
                         />
                    )}
               </Head>

               <SEOAlternates />

               <SlideUpSection>
                    <main
                         dir={isRTL ? 'rtl' : 'ltr'}
                         className='font-normal px-4 text-green-100 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 text-lg leading-8'
                    >
                         <Registeration handleClose={handleClose} open={openLogin} isRegister />

                         <div className='lg:my-12 my-4 flex flex-col items-start w-full max-w-7xl mx-auto'>
                              {/* Breadcrumb */}
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   className='my-6'
                              >
                                   <Link
                                        href='/fundamentalanalysis'
                                        className='text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2'
                                   >
                                        <FaChartLine className='text-lg' />
                                        <span className='text-lg'>{ir('breadcrumb.fundamentalAnalysis')}</span>
                                   </Link>
                              </motion.div>

                              {/* Title */}
                              <div className='py-4 w-full'>
                                   <div className='text-center'>
                                        <h1 className='text-2xl font-bold my-6 text-green-500'>
                                             {ir('page.title')}
                                        </h1>
                                   </div>

                                   {/* CTA Card */}
                                   <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className='w-full my-6'
                                   >
                                        <div className='bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'>
                                             <div className='w-full px-2'>
                                                  <div className='rounded flex justify-between items-center text-lg text-green-100'>
                                                       {ir('cta.ready')}
                                                       <Button
                                                            onClick={handleOpen}
                                                            aria-label={ir('cta.startTrading')}
                                                            className='normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300'
                                                            variant='contained'
                                                            size='medium'
                                                       >
                                                            <HowToRegIcon className='mr-2' />
                                                            {ir('cta.startTrading')}
                                                       </Button>
                                                  </div>
                                             </div>
                                        </div>
                                   </motion.div>

                                   {/* Content */}
                                   <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className='mb-8 w-full my-6'
                                   >
                                        <div className='bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'>
                                             <div className='mt-2 space-y-8'>
                                                  {/* Overview */}
                                                  <section className='py-4'>
                                                       <h2 className='text-2xl font-semibold leading-8 text-green-700'>
                                                            {ir('sections.overview.title')}
                                                       </h2>
                                                       <ul className={`mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8 ${isRTL ? 'text-right' : ''}`}>
                                                            {(ir('sections.overview.bullets', { returnObjects: true })).map(
                                                                 (b, i) => (
                                                                      <li key={i}>
                                                                           <span>{b}</span>
                                                                      </li>
                                                                 )
                                                            )}
                                                       </ul>
                                                  </section>

                                                  {/* Understanding Differentials */}
                                                  <section className='py-4'>
                                                       <h2 className='text-2xl font-semibold my-2 text-green-700'>
                                                            {ir('sections.understanding.title')}
                                                       </h2>
                                                       <ol className='mt-2 list-decimal list-inside marker:text-xl space-y-2 text-lg leading-8'>
                                                            {(
                                                                 ir('sections.understanding.items', {
                                                                      returnObjects: true,
                                                                 })
                                                            ).map((item, idx) => (
                                                                 <li key={idx} className='text-green-200'>
                                                                      {item.label}:
                                                                      <span className='text-green-100 mx-2'>{item.text}</span>
                                                                 </li>
                                                            ))}
                                                       </ol>
                                                  </section>

                                                  {/* Mechanics */}
                                                  <section className='py-4'>
                                                       <h2 className='text-2xl font-semibold my-2 text-green-700'>
                                                            {ir('sections.mechanics.title')}
                                                       </h2>

                                                       {/* Choosing currencies */}
                                                       <div className='mt-6'>
                                                            <h3 className='text-2xl  text-green-200'>
                                                                 {ir('sections.mechanics.choose.title')}
                                                            </h3>
                                                            <ul className='mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8'>
                                                                 {(ir('sections.mechanics.choose.bullets', {
                                                                      returnObjects: true,
                                                                 })).map((b, i) => (
                                                                      <li key={i}>
                                                                           <span>{b}</span>
                                                                      </li>
                                                                 ))}
                                                            </ul>
                                                       </div>

                                                       {/* Earning differentials */}
                                                       <div className='mt-8'>
                                                            <h3 className='text-xl  text-green-200'>
                                                                 {ir('sections.mechanics.earn.title')}
                                                            </h3>
                                                            <ul className='mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8'>
                                                                 {(ir('sections.mechanics.earn.bullets', {
                                                                      returnObjects: true,
                                                                 })).map((b, i) => (
                                                                      <li key={i}>
                                                                           <span>{b}</span>
                                                                      </li>
                                                                 ))}
                                                            </ul>
                                                       </div>
                                                  </section>

                                                  {/* Favorable Conditions */}
                                                  <section className='py-4'>
                                                       <h2 className='text-2xl font-semibold text-green-700'>
                                                            {ir('sections.conditions.title')}
                                                       </h2>

                                                       <div className='mt-8'>
                                                            <h3 className='text-xl text-green-200'>
                                                                 {ir('sections.conditions.lowVol.title')}
                                                            </h3>
                                                            <ul className='mt-2 text-lg leading-8 list-inside marker:text-xl space-y-2'>
                                                                 {(ir('sections.conditions.lowVol.bullets', {
                                                                      returnObjects: true,
                                                                 })).map((b, i) => (
                                                                      <li key={i}>
                                                                           <span>{b}</span>
                                                                      </li>
                                                                 ))}
                                                            </ul>
                                                       </div>

                                                       <div className='mt-4'>
                                                            <h3 className='text-xl  text-green-200'>
                                                                 {ir('sections.conditions.riskOn.title')}
                                                            </h3>
                                                            <ul className='mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8'>
                                                                 {(ir('sections.conditions.riskOn.bullets', {
                                                                      returnObjects: true,
                                                                 })).map((b, i) => (
                                                                      <li key={i}>
                                                                           <span>{b}</span>
                                                                      </li>
                                                                 ))}
                                                            </ul>
                                                       </div>
                                                  </section>

                                                  {/* Benefits */}
                                                  <section className='py-4'>
                                                       <h2 className='text-2xl font-semibold text-green-700'>
                                                            {ir('sections.benefits.title')}
                                                       </h2>
                                                       <ul className='mt-2 text-lg leading-8 list-inside marker:text-xl space-y-2'>
                                                            {(ir('sections.benefits.bullets', { returnObjects: true })).map(
                                                                 (b, i) => (
                                                                      <li key={i}>
                                                                           <span>{b}</span>
                                                                      </li>
                                                                 )
                                                            )}
                                                       </ul>
                                                  </section>

                                                  {/* Risks */}
                                                  <section className='py-4'>
                                                       <h2 className='text-xl font-semibold text-green-700'>
                                                            {ir('sections.risks.title')}
                                                       </h2>
                                                       <ul className='mt-2 text-lg leading-8 list-inside marker:text-xl space-y-2'>
                                                            {(
                                                                 ir('sections.risks.items', {
                                                                      returnObjects: true,
                                                                 })
                                                            ).map((item, idx) => (
                                                                 <li key={idx} className='text-green-200'>
                                                                      {item.label}:
                                                                      <span className='text-green-100 mx-2'>{item.text}</span>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </section>
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
                    ['common', 'nav', 'footer', 'auth', 'interestRate'],
                    i18nConfig
               )),
          },
     }
}
