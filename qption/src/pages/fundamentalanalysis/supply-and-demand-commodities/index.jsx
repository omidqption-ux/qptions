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

export default function Commodities() {
     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     // i18n
     const { t: tSD, i18n } = useTranslation('supplyDemand')
     const sd = (k, opts) => tSD(k, opts)
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     const title = sd('seo.title')
     const description = sd('seo.description')
     const url = sd('seo.url')
     const keywords = sd('seo.keywords')

     const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: sd('seo.ld.headline'),
          description,
          mainEntityOfPage: url,
          publisher: { '@type': 'Organization', name: 'Qption' },
          about: [
               { '@type': 'Thing', name: sd('seo.ld.about.supplyDemand') },
               { '@type': 'Thing', name: sd('seo.ld.about.commodities') },
               { '@type': 'Thing', name: sd('seo.ld.about.crypto') },
               { '@type': 'Thing', name: sd('seo.ld.about.halving') },
               { '@type': 'Thing', name: sd('seo.ld.about.mining') },
               { '@type': 'Thing', name: sd('seo.ld.about.staking') },
               { '@type': 'Thing', name: sd('seo.ld.about.geopolitics') },
               { '@type': 'Thing', name: sd('seo.ld.about.weather') },
               { '@type': 'Thing', name: sd('seo.ld.about.sentiment') }
          ],
          articleSection: [
               sd('sections._list.0'),
               sd('sections._list.1'),
               sd('sections._list.2'),
               sd('sections._list.3'),
               sd('sections._list.4'),
               sd('sections._list.5'),
               sd('sections._list.6'),
               sd('sections._list.7'),
               sd('sections._list.8'),
               sd('sections._list.9'),
               sd('sections._list.10'),
               sd('sections._list.11'),
               sd('sections._list.12'),
               sd('sections._list.13'),
               sd('sections._list.14'),
               sd('sections._list.15')
          ],
          additionalProperty: [
               { '@type': 'PropertyValue', name: sd('seo.ld.props.scarcity.name'), value: sd('seo.ld.props.scarcity.value') },
               { '@type': 'PropertyValue', name: sd('seo.ld.props.shock.name'), value: sd('seo.ld.props.shock.value') },
               { '@type': 'PropertyValue', name: sd('seo.ld.props.flowstock.name'), value: sd('seo.ld.props.flowstock.value') }
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
                    <main dir={isRTL ? 'rtl' : 'ltr'} className='font-normal px-4 text-green-100 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 text-lg leading-8'>
                         <div className='lg:my-12 my-4 flex flex-col leading-8 items-start w-full max-w-7xl mx-auto'>
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='my-6'>
                                   <Link
                                        href='/fundamentalanalysis'
                                        className='text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2'
                                   >
                                        <FaChartLine className='text-lg' />
                                        <span className='text-lg'>{sd('breadcrumb.fundamentalAnalysis')}</span>
                                   </Link>
                              </motion.div>

                              <div className='py-4 w-full'>
                                   <div className='text-center my-6'>
                                        <span className='text-2xl font-bold text-green-500'>
                                             {sd('page.title')}
                                        </span>
                                   </div>

                                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='mb-8 w-full'>
                                        <div className='bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'>
                                             <div className='w-full px-2'>
                                                  <div className='rounded flex justify-between text-lg items-center'>
                                                       {sd('cta.ready')}
                                                       <Registeration handleClose={handleClose} open={openLogin} isRegister={true} />
                                                       <Button
                                                            onClick={handleOpen}
                                                            className='normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300'
                                                            variant='contained'
                                                            size='medium'
                                                       >
                                                            <HowToRegIcon className='mr-2' />
                                                            {sd('cta.start')}
                                                       </Button>
                                                  </div>
                                             </div>
                                        </div>
                                   </motion.div>

                                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='mb-8 w-full'>
                                        <div className='bg-linear-to-br w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'>
                                             <div className='mt-6 space-y-8'>
                                                  {/* Overview */}
                                                  <div className='py-4 rounded'>
                                                       <span className='text-2xl font-semibold text-green-500'>{sd('sections.overview.title')}</span>
                                                       <ul className='mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8'>
                                                            {(sd('sections.overview.items', { returnObjects: true }) || []).map((it, i) => (
                                                                 <li key={i}><span>{it}</span></li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  {/* Commodity Factors */}
                                                  <div className='py-4 rounded mt-8'>
                                                       <span className='text-2xl font-semibold text-green-500'>{sd('sections.commodityFactors.title')}</span>
                                                       <ul className='mt-2 list-decimal list-inside marker:text-xl space-y-2 text-lg leading-8'>
                                                            {(sd('sections.commodityFactors.items', { returnObjects: true }) || []).map((it, i) => (
                                                                 <li key={i} className='text-green-200'>
                                                                      {it.label}
                                                                      <span className='text-green-100 mx-2'>{it.text}</span>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  {/* Crypto Factors */}
                                                  <div className='py-4 rounded'>
                                                       <span className='text-2xl my-6 font-semibold text-green-700'>{sd('sections.cryptoFactors.title')}</span>

                                                       <div className='mt-4'>
                                                            <span className='text-xl my-4 font-semibold text-green-200'>{sd('sections.cryptoFactors.fixed.title')}</span>
                                                            <ul className='mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8'>
                                                                 {(sd('sections.cryptoFactors.fixed.items', { returnObjects: true }) || []).map((it, i) => (
                                                                      <li key={i}><span>{it}</span></li>
                                                                 ))}
                                                            </ul>
                                                       </div>

                                                       <div className='mt-4 my-4'>
                                                            <span className='text-xl  text-green-200'>{sd('sections.cryptoFactors.sentiment.title')}</span>
                                                            <ul className='mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8'>
                                                                 {(sd('sections.cryptoFactors.sentiment.items', { returnObjects: true }) || []).map((it, i) => (
                                                                      <li key={i}><span>{it}</span></li>
                                                                 ))}
                                                            </ul>
                                                       </div>

                                                       <div className='mt-4'>
                                                            <span className='text-xl my-6  text-green-200'>{sd('sections.cryptoFactors.rewards.title')}</span>
                                                            <ul className='mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8'>
                                                                 {(sd('sections.cryptoFactors.rewards.items', { returnObjects: true }) || []).map((it, i) => (
                                                                      <li key={i}><span>{it}</span></li>
                                                                 ))}
                                                            </ul>
                                                       </div>
                                                  </div>

                                                  {/* Reactions */}
                                                  <div className='py-4 rounded'>
                                                       <span className='text-2xl my-6 font-semibold text-green-700'>{sd('sections.reactions.title')}</span>

                                                       <div className='mt-4'>
                                                            <span className='text-xl  my-4 text-green-200'>{sd('sections.reactions.commodity.title')}</span>
                                                            <ul className='mt-2 text-lg leading-8 list-inside marker:text-xl space-y-2'>
                                                                 {(sd('sections.reactions.commodity.items', { returnObjects: true }) || []).map((it, i) => (
                                                                      <li key={i}><span>{it}</span></li>
                                                                 ))}
                                                            </ul>
                                                       </div>

                                                       <div className='mt-4'>
                                                            <span className='text-lg  my-4 text-green-200'>{sd('sections.reactions.crypto.title')}</span>
                                                            <ul className='mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8'>
                                                                 {(sd('sections.reactions.crypto.items', { returnObjects: true }) || []).map((it, i) => (
                                                                      <li key={i}><span>{it}</span></li>
                                                                 ))}
                                                            </ul>
                                                       </div>
                                                  </div>

                                                  {/* Benefits */}
                                                  <div className='py-4 rounded'>
                                                       <span className='text-2xl font-semibold my-4 text-green-700'>{sd('sections.benefits.title')}</span>
                                                       <ul className='mt-2 list-inside marker:text-xl space-y-2 text-lg leading-8'>
                                                            {(sd('sections.benefits.items', { returnObjects: true }) || []).map((it, i) => (
                                                                 <li key={i}><span>{it}</span></li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  {/* Limitations */}
                                                  <div className='py-4 rounded'>
                                                       <span className='text-2xl font-semibold my-4 text-green-700'>{sd('sections.limits.title')}</span>
                                                       <ul className='mt-2 list-inside text-lg leading-8 marker:text-xl space-y-2'>
                                                            {(sd('sections.limits.items', { returnObjects: true }) || []).map((it, i) => (
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
               ...(await serverSideTranslations(
                    locale,
                    ['common', 'nav', 'footer', 'auth', 'supplyDemand'],
                    i18nConfig
               ))
          }
     }
}
