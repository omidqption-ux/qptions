import React from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import SlideUpSection from '@/components/SlideUp/SlideUp'
const Registeration = dynamic(() => import('@/components/RegisterationModal/Registeration'), { ssr: false })
import Head from 'next/head'
import { Button } from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import { motion } from 'framer-motion'
import { FaChartLine } from 'react-icons/fa'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../../next-i18next.config.cjs'

export default function Blockchain() {
     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     // i18n
     const { t: tBC, i18n } = useTranslation('blockchainFA')
     const bc = (k, opts) => tBC(k, opts)
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     // SEO
     const title = bc('seo.title')
     const description = bc('seo.description')
     const url = bc('seo.url')
     const keywords = bc('seo.keywords')

     const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: bc('seo.ld.headline'),
          description,
          mainEntityOfPage: url,
          publisher: { '@type': 'Organization', name: 'Qption' },
          articleSection: [
               bc('sections._list.0'),
               bc('sections._list.1'),
               bc('sections._list.2'),
               bc('sections._list.3'),
               bc('sections._list.4'),
               bc('sections._list.5'),
               bc('sections._list.6'),
               bc('sections._list.7'),
               bc('sections._list.8'),
               bc('sections._list.9'),
               bc('sections._list.10'),
               bc('sections._list.11'),
               bc('sections._list.12'),
               bc('sections._list.13'),
               bc('sections._list.14')
          ],
          about: [
               { '@type': 'Thing', name: bc('seo.ld.about.blockchain') },
               { '@type': 'Thing', name: bc('seo.ld.about.crypto') },
               { '@type': 'Thing', name: bc('seo.ld.about.pow') },
               { '@type': 'Thing', name: bc('seo.ld.about.pos') },
               { '@type': 'Thing', name: bc('seo.ld.about.tokenomics') },
               { '@type': 'Thing', name: bc('seo.ld.about.onchain') }
          ],
          additionalProperty: [
               { '@type': 'PropertyValue', name: bc('seo.ld.props.onchain.name'), value: bc('seo.ld.props.onchain.value') },
               { '@type': 'PropertyValue', name: bc('seo.ld.props.utility.name'), value: bc('seo.ld.props.utility.value') },
               { '@type': 'PropertyValue', name: bc('seo.ld.props.execution.name'), value: bc('seo.ld.props.execution.value') }
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
                         <div className='lg:my-12 my-4 leading-8 flex flex-col items-start w-full max-w-7xl mx-auto'>
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='my-6'>
                                   <Link
                                        href='/fundamentalanalysis'
                                        className='text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2'
                                   >
                                        <FaChartLine className='text-lg' />
                                        <span className='text-lg'>{bc('breadcrumb.fundamentalAnalysis')}</span>
                                   </Link>
                              </motion.div>

                              <div className='py-4 w-full'>
                                   <div className='text-center my-6'>
                                        <span className='text-2xl font-bold'>
                                             {bc('page.title')}
                                        </span>
                                   </div>

                                   {/* CTA */}
                                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='mb-8 w-full'>
                                        <div className='bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'>
                                             <div className='w-full px-2'>
                                                  <div className='text-lg items-center rounded flex justify-between'>
                                                       {bc('cta.ready')}
                                                       <Registeration handleClose={handleClose} open={openLogin} isRegister={true} />
                                                       <Button
                                                            onClick={handleOpen}
                                                            className='normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300'
                                                            variant='contained'
                                                            size='medium'
                                                       >
                                                            <HowToRegIcon className='mr-2' />
                                                            {bc('cta.start')}
                                                       </Button>
                                                  </div>
                                             </div>
                                        </div>
                                   </motion.div>

                                   {/* Content */}
                                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='mb-8 w-full text-lg leading-8'>
                                        <div className='bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'>
                                             <div className='mt-6 space-y-8'>

                                                  {/* Overview */}
                                                  <div className='py-4 rounded'>
                                                       <span className='text-2xl font-semibold text-green-700'>{bc('sections.overview.title')}</span>
                                                       <ul className='mt-2 list-inside marker:text-xl space-y-2'>
                                                            {(bc('sections.overview.items', { returnObjects: true }) || []).map((it, i) => (
                                                                 <li key={i}><span>{it}</span></li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  {/* Core Components */}
                                                  <div className='py-4 rounded'>
                                                       <span className='text-2xl font-semibold text-green-700'>{bc('sections.core.title')}</span>
                                                       <ul className='mt-2 list-decimal list-inside marker:text-xl space-y-2'>
                                                            {(bc('sections.core.items', { returnObjects: true }) || []).map((it, i) => (
                                                                 <li key={i}>
                                                                      <span className='text-green-200'>{it.label}</span>
                                                                      <span className='text-green-100 mx-2'>{it.text}</span>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  {/* Key Metrics */}
                                                  <div className='py-4 rounded'>
                                                       <span className='text-2xl font-semibold text-green-700'>{bc('sections.metrics.title')}</span>

                                                       <div className='mt-4'>
                                                            <span className='text-xl  text-green-200'>{bc('sections.metrics.onchain.title')}</span>
                                                            <ul className='mt-2 list-inside marker:text-xl space-y-2'>
                                                                 {(bc('sections.metrics.onchain.items', { returnObjects: true }) || []).map((it, i) => (
                                                                      <li key={i}><span>{it}</span></li>
                                                                 ))}
                                                            </ul>
                                                       </div>

                                                       <div className='mt-4'>
                                                            <span className='text-xl  text-green-200'>{bc('sections.metrics.tokenomics.title')}</span>
                                                            <ul className='mt-2 list-inside marker:text-xl space-y-2'>
                                                                 {(bc('sections.metrics.tokenomics.items', { returnObjects: true }) || []).map((it, i) => (
                                                                      <li key={i}><span>{it}</span></li>
                                                                 ))}
                                                            </ul>
                                                       </div>

                                                       <div className='mt-4'>
                                                            <span className='text-xl  text-green-200'>{bc('sections.metrics.team.title')}</span>
                                                            <ul className='mt-2 list-inside marker:text-xl space-y-2'>
                                                                 {(bc('sections.metrics.team.items', { returnObjects: true }) || []).map((it, i) => (
                                                                      <li key={i}><span>{it}</span></li>
                                                                 ))}
                                                            </ul>
                                                       </div>
                                                  </div>

                                                  {/* Impact on FA */}
                                                  <div className='py-4 rounded'>
                                                       <span className='text-2xl font-semibold text-green-700'>{bc('sections.impact.title')}</span>

                                                       <div className='mt-4'>
                                                            <span className='text-xl  text-green-200'>{bc('sections.impact.security.title')}</span>
                                                            <ul className='mt-2 list-inside marker:text-xl space-y-2'>
                                                                 {(bc('sections.impact.security.items', { returnObjects: true }) || []).map((it, i) => (
                                                                      <li key={i}><span>{it}</span></li>
                                                                 ))}
                                                            </ul>
                                                       </div>

                                                       <div className='mt-4'>
                                                            <span className='text-xl  text-green-200'>{bc('sections.impact.adoption.title')}</span>
                                                            <ul className='mt-2 list-inside marker:text-xl space-y-2'>
                                                                 {(bc('sections.impact.adoption.items', { returnObjects: true }) || []).map((it, i) => (
                                                                      <li key={i}><span>{it}</span></li>
                                                                 ))}
                                                            </ul>
                                                       </div>
                                                  </div>

                                                  {/* Benefits */}
                                                  <div className='py-4 rounded'>
                                                       <span className='text-2xl font-semibold text-green-700'>{bc('sections.benefits.title')}</span>
                                                       <ul className='mt-2 list-inside marker:text-xl space-y-2'>
                                                            {(bc('sections.benefits.items', { returnObjects: true }) || []).map((it, i) => (
                                                                 <li key={i}><span>{it}</span></li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  {/* Limitations */}
                                                  <div className='py-4 rounded'>
                                                       <span className='text-2xl font-semibold text-green-700'>{bc('sections.limits.title')}</span>
                                                       <ul className='mt-2 list-inside marker:text-xl space-y-2'>
                                                            {(bc('sections.limits.items', { returnObjects: true }) || []).map((it, i) => (
                                                                 <li key={i}><span>{it}</span></li>
                                                            ))}
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
               ...(await serverSideTranslations(locale, ['common', 'nav', 'footer', 'auth', 'blockchainFA'], i18nConfig))
          }
     }
}
