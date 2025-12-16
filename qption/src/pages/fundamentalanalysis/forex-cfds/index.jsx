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

export default function ForexCFDs() {
     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     // i18n
     const { t: tFX, i18n } = useTranslation('forexCfds')
     const fx = (k, opts) => tFX(k, opts)
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     // Safe helpers
     const tStr = (k) => {
          const v = fx(k)
          return typeof v === 'string' ? v : ''
     }
     const tArr = (k) => {
          const v = fx(k, { returnObjects: true })
          return Array.isArray(v) ? v : []
     }

     // SEO from translations
     const title = tStr('seo.title')
     const description = tStr('seo.description')
     const url = tStr('seo.url')
     const keywords = tStr('seo.keywords')

     const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: tStr('seo.ld.headline'),
          description,
          mainEntityOfPage: url,
          publisher: { '@type': 'Organization', name: 'Qption' },
          about: [
               { '@type': 'Thing', name: tStr('seo.ld.about.equities') },
               { '@type': 'Thing', name: tStr('seo.ld.about.forex') },
               { '@type': 'Thing', name: tStr('seo.ld.about.cfds') },
               { '@type': 'Thing', name: tStr('seo.ld.about.riskSentiment') },
               { '@type': 'Thing', name: tStr('seo.ld.about.safeHavens') },
               { '@type': 'Thing', name: tStr('seo.ld.about.rates') },
               { '@type': 'Thing', name: tStr('seo.ld.about.flows') }
          ],
          articleSection: tArr('sections._list'),
          additionalProperty: [
               { '@type': 'PropertyValue', name: tStr('seo.ld.props.regimes.name'), value: tStr('seo.ld.props.regimes.value') },
               { '@type': 'PropertyValue', name: tStr('seo.ld.props.commodity.name'), value: tStr('seo.ld.props.commodity.value') },
               { '@type': 'PropertyValue', name: tStr('seo.ld.props.practice.name'), value: tStr('seo.ld.props.practice.value') }
          ]
     }

     return (
          <>
               <Head>
                    <title>{title}</title>
                    <meta name='description' content={description} />
                    <meta name='keywords' content={keywords} />
                    <link rel='canonical' href={url} />
                    <meta property='og:type' content='article' />
                    <meta property='og:title' content={title} />
                    <meta property='og:description' content={description} />
                    <meta property='og:url' content={url} />
                    <meta name='twitter:title' content={title} />
                    <meta name='twitter:description' content={description} />
                    <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
               </Head>

               <SlideUpSection>
                    <main
                         dir={isRTL ? 'rtl' : 'ltr'}
                         className='font-normal px-4 text-green-100 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 text-lg leading-8'
                    >
                         <Registeration handleClose={handleClose} open={openLogin} isRegister={true} />

                         <div className='lg:my-12 my-4 leading-8 text-lg flex flex-col items-start w-full max-w-7xl mx-auto'>
                              {/* Breadcrumb */}
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='my-6'>
                                   <Link
                                        href='/fundamentalanalysis'
                                        className='text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2'
                                   >
                                        <FaChartLine className='text-lg' />
                                        <span className='text-lg'>{tStr('breadcrumb.fundamentalAnalysis')}</span>
                                   </Link>
                              </motion.div>

                              {/* Title */}
                              <div className='my-6 w-full'>
                                   <div className='text-center'>
                                        <span className='text-2xl font-bold text-green-500 mb-8'>
                                             {tStr('page.title')}
                                        </span>
                                   </div>

                                   {/* CTA */}
                                   <div className='w-full'>
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='mb-8 w-full'>
                                             <div className='bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'>
                                                  <div className='w-full'>
                                                       <div className='text-lg items-center rounded flex justify-between'>
                                                            {tStr('cta.ready')}
                                                            <Button
                                                                 onClick={handleOpen}
                                                                 className='normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300'
                                                                 variant='contained'
                                                                 size='medium'
                                                            >
                                                                 <HowToRegIcon className='mr-2' />
                                                                 {tStr('cta.start')}
                                                            </Button>
                                                       </div>
                                                  </div>
                                             </div>
                                        </motion.div>
                                   </div>

                                   {/* Content */}
                                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='mb-8 w-full'>
                                        <div className='bg-linear-to-b text-lg leading-8 w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'>
                                             <div className='mt-6 space-y-8'>

                                                  {/* Overview */}
                                                  <div className='py-4 rounded'>
                                                       <span className='text-2xl my-4 font-semibold text-green-700'>{tStr('sections.overview.title')}</span>
                                                       <ul className='mt-2 list-inside marker:text-xl space-y-2'>
                                                            {tArr('sections.overview.items').map((it, i) => (
                                                                 <li key={i}><span>{it}</span></li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  {/* Key Drivers */}
                                                  <div className='py-4 rounded'>
                                                       <span className='text-2xl font-semibold text-green-700'>{tStr('sections.drivers.title')}</span>
                                                       <ul className='mt-2 list-decimal list-inside marker:text-xl space-y-2'>
                                                            {tArr('sections.drivers.items').map((it, i) => (
                                                                 <li key={i} className='text-green-200'>
                                                                      {it && it.label ? it.label : ''}
                                                                      <span className='text-green-100 mx-2'>{it && it.text ? it.text : ''}</span>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  {/* Common Correlations */}
                                                  <div className='py-4 rounded'>
                                                       <span className='text-2xl font-semibold text-green-700'>{tStr('sections.common.title')}</span>

                                                       <div className='mt-4'>
                                                            <span className='text-lg font-semibold text-green-3'>
                                                                 {tStr('sections.common.positive.title')}</span>
                                                            <ul className='mt-2 list-inside marker:text-xl space-y-2'>
                                                                 {tArr('sections.common.positive.items').map((it, i) => (
                                                                      <li key={i}><span>{it}</span></li>
                                                                 ))}
                                                            </ul>
                                                       </div>

                                                       <div className='mt-4'>
                                                            <span className='text-xl  text-green-200'>{tStr('sections.common.negative.title')}</span>
                                                            <ul className='mt-2 list-inside marker:text-xl space-y-2'>
                                                                 {tArr('sections.common.negative.items').map((it, i) => (
                                                                      <li key={i}><span>{it}</span></li>
                                                                 ))}
                                                            </ul>
                                                       </div>
                                                  </div>

                                                  {/* How Equities Impact FX/CFDs */}
                                                  <div className='py-4 rounded'>
                                                       <span className='text-2xl font-semibold text-green-700'>{tStr('sections.impact.title')}</span>

                                                       <div className='mt-4'>
                                                            <span className='text-lg  text-green-200'>{tStr('sections.impact.rallies.title')}</span>
                                                            <ul className='mt-2 list-inside marker:text-xl space-y-2'>
                                                                 {tArr('sections.impact.rallies.items').map((it, i) => (
                                                                      <li key={i}><span>{it}</span></li>
                                                                 ))}
                                                            </ul>
                                                       </div>

                                                       <div className='mt-4'>
                                                            <span className='text-xl  text-green-200'>{tStr('sections.impact.declines.title')}</span>
                                                            <ul className='mt-2 list-inside marker:text-xl space-y-2'>
                                                                 {tArr('sections.impact.declines.items').map((it, i) => (
                                                                      <li key={i}><span>{it}</span></li>
                                                                 ))}
                                                            </ul>
                                                       </div>
                                                  </div>

                                                  {/* Benefits */}
                                                  <div className='py-4 rounded'>
                                                       <span className='text-2xl font-semibold text-green-700'>{tStr('sections.benefits.title')}</span>
                                                       <ul className='mt-2 list-inside marker:text-xl space-y-2'>
                                                            {tArr('sections.benefits.items').map((it, i) => (
                                                                 <li key={i}><span>{it}</span></li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  {/* Limitations */}
                                                  <div className='py-4 rounded'>
                                                       <span className='text-2xl font-semibold text-green-700'>{tStr('sections.limits.title')}</span>
                                                       <ul className='mt-2 list-inside marker:text-xl space-y-2'>
                                                            {tArr('sections.limits.items').map((it, i) => {
                                                                 if (typeof it === 'string') return <li key={i}><span>{it}</span></li>
                                                                 return (
                                                                      <li key={i} className='text-green-200'>
                                                                           <span className='text-green-200'>{it && it.label ? it.label : ''}</span>
                                                                           <span className='text-green-100 mx-2'>{it && it.text ? it.text : ''}</span>
                                                                      </li>
                                                                 )
                                                            })}
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
                    ['common', 'nav', 'footer', 'auth', 'forexCfds'],
                    i18nConfig
               ))
          }
     }
}
