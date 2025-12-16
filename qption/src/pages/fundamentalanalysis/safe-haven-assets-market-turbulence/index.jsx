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

export default function SafeHaven() {
     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     // i18n
     const { t: tSH, i18n } = useTranslation('safeHaven')
     const sh = (k, opts) => tSH(k, opts)
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     // SEO
     const title = sh('seo.title')
     const description = sh('seo.description')
     const url = sh('seo.url')
     const keywords = sh('seo.keywords')

     const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: sh('seo.ld.headline'),
          description,
          mainEntityOfPage: url,
          publisher: { '@type': 'Organization', name: 'Qption' },
          about: [
               { '@type': 'Thing', name: sh('seo.ld.about.safeHavens') },
               { '@type': 'Thing', name: sh('seo.ld.about.gold') },
               { '@type': 'Thing', name: sh('seo.ld.about.treasuries') },
               { '@type': 'Thing', name: sh('seo.ld.about.chf') },
               { '@type': 'Thing', name: sh('seo.ld.about.jpy') },
               { '@type': 'Thing', name: sh('seo.ld.about.defensive') },
               { '@type': 'Thing', name: sh('seo.ld.about.volatility') },
               { '@type': 'Thing', name: sh('seo.ld.about.f2q') },
               { '@type': 'Thing', name: sh('seo.ld.about.inflationHedge') }
          ],
          articleSection: [
               sh('sections._list.0'),
               sh('sections._list.1'),
               sh('sections._list.2'),
               sh('sections._list.3'),
               sh('sections._list.4'),
               sh('sections._list.5'),
               sh('sections._list.6'),
               sh('sections._list.7'),
               sh('sections._list.8'),
               sh('sections._list.9'),
               sh('sections._list.10'),
               sh('sections._list.11'),
               sh('sections._list.12'),
               sh('sections._list.13'),
               sh('sections._list.14'),
               sh('sections._list.15')
          ],
          additionalProperty: [
               { '@type': 'PropertyValue', name: sh('seo.ld.props.correlation.name'), value: sh('seo.ld.props.correlation.value') },
               { '@type': 'PropertyValue', name: sh('seo.ld.props.crisis.name'), value: sh('seo.ld.props.crisis.value') },
               { '@type': 'PropertyValue', name: sh('seo.ld.props.tradeoffs.name'), value: sh('seo.ld.props.tradeoffs.value') }
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
                         <div className='lg:my-12 my-4 text-lg leading-8 flex flex-col items-start w-full max-w-7xl mx-auto'>
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='my-6'>
                                   <Link
                                        href='/fundamentalanalysis'
                                        className='text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2'
                                   >
                                        <FaChartLine className='text-lg' />
                                        <span className='text-lg'>{sh('breadcrumb.fundamentalAnalysis')}</span>
                                   </Link>
                              </motion.div>

                              <div className='py-4 w-full'>
                                   <div className='text-center my-6'>
                                        <span className='text-2xl font-bold text-green-500'>
                                             {sh('page.title')}
                                        </span>
                                   </div>

                                   {/* CTA */}
                                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='mb-8 w-full'>
                                        <div className='bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'>
                                             <div className='w-full px-2'>
                                                  <div className='items-center text-lg rounded flex justify-between'>
                                                       {sh('cta.ready')}
                                                       <Registeration handleClose={handleClose} open={openLogin} isRegister={true} />
                                                       <Button
                                                            onClick={handleOpen}
                                                            className='normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300'
                                                            variant='contained'
                                                            size='medium'
                                                       >
                                                            <HowToRegIcon className='mr-2' />
                                                            {sh('cta.start')}
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
                                                       <span className='text-2xl font-semibold text-green-700'>{sh('sections.overview.title')}</span>
                                                       <ul className='mt-2 list-inside marker:text-xl space-y-2'>
                                                            {(sh('sections.overview.items', { returnObjects: true }) || []).map((it, i) => (
                                                                 <li key={i}><span>{it}</span></li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  {/* Common Safe-Haven Assets */}
                                                  <div className='py-4 rounded'>
                                                       <span className='text-2xl font-semibold text-green-700'>{sh('sections.common.title')}</span>
                                                       <ul className='mt-2 list-decimal list-inside marker:text-xl space-y-2'>
                                                            {(sh('sections.common.items', { returnObjects: true }) || []).map((it, i) => (
                                                                 <li key={i} className='text-green-200'>
                                                                      {it.label}
                                                                      <span className='text-green-100 mx-2'>{it.text}</span>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  {/* Why Investors Turn */}
                                                  <div className='py-4 rounded'>
                                                       <span className='text-2xl font-semibold text-green-700'>{sh('sections.why.title')}</span>

                                                       <div className='mt-4'>
                                                            <span className='text-lg font-semibold text-green-200'>{sh('sections.why.capital.title')}</span>
                                                            <ul className='mt-2 list-inside marker:text-xl space-y-2'>
                                                                 {(sh('sections.why.capital.items', { returnObjects: true }) || []).map((it, i) => (
                                                                      <li key={i}><span>{it}</span></li>
                                                                 ))}
                                                            </ul>
                                                       </div>

                                                       <div className='mt-4'>
                                                            <span className='text-xl font-semibold text-green-200'>{sh('sections.why.diversification.title')}</span>
                                                            <ul className='mt-2 list-inside marker:text-xl space-y-2'>
                                                                 {(sh('sections.why.diversification.items', { returnObjects: true }) || []).map((it, i) => (
                                                                      <li key={i}><span>{it}</span></li>
                                                                 ))}
                                                            </ul>
                                                       </div>

                                                       <div className='mt-4'>
                                                            <span className='text-xl font-semibold text-green-200'>{sh('sections.why.hedge.title')}</span>
                                                            <ul className='mt-2 list-inside marker:text-xl space-y-2'>
                                                                 {(sh('sections.why.hedge.items', { returnObjects: true }) || []).map((it, i) => (
                                                                      <li key={i}><span>{it}</span></li>
                                                                 ))}
                                                            </ul>
                                                       </div>
                                                  </div>

                                                  {/* Market Reactions */}
                                                  <div className='py-4 rounded'>
                                                       <span className='text-2xl font-semibold text-green-700'>{sh('sections.reactions.title')}</span>

                                                       <div className='mt-4'>
                                                            <span className='text-xl font-semibold text-green-200'>{sh('sections.reactions.demand.title')}</span>
                                                            <ul className='mt-2 list-inside marker:text-xl space-y-2'>
                                                                 {(sh('sections.reactions.demand.items', { returnObjects: true }) || []).map((it, i) => (
                                                                      <li key={i}><span>{it}</span></li>
                                                                 ))}
                                                            </ul>
                                                       </div>

                                                       <div className='mt-4'>
                                                            <span className='text-xl font-semibold text-green-200'>{sh('sections.reactions.bonds.title')}</span>
                                                            <ul className='mt-2 list-inside marker:text-xl space-y-2'>
                                                                 {(sh('sections.reactions.bonds.items', { returnObjects: true }) || []).map((it, i) => (
                                                                      <li key={i}><span>{it}</span></li>
                                                                 ))}
                                                            </ul>
                                                       </div>
                                                  </div>

                                                  {/* Benefits */}
                                                  <div className='py-4 rounded'>
                                                       <span className='text-2xl font-semibold text-green-700'>{sh('sections.benefits.title')}</span>
                                                       <ul className='mt-2 list-inside marker:text-xl space-y-2'>
                                                            {(sh('sections.benefits.items', { returnObjects: true }) || []).map((it, i) => (
                                                                 <li key={i}><span>{it}</span></li>
                                                            ))}
                                                       </ul>
                                                  </div>

                                                  {/* Limitations */}
                                                  <div className='py-4 rounded'>
                                                       <span className='text-2xl font-semibold text-green-700'>{sh('sections.limits.title')}</span>
                                                       <ul className='mt-2 list-inside marker:text-xl space-y-2'>
                                                            {(sh('sections.limits.items', { returnObjects: true }) || []).map((it, i) => (
                                                                 <li key={i} className={i === 0 || i === 1 || i === 2 ? 'text-green-200' : ''}>
                                                                      {typeof it === 'string' ? <span>{it}</span> : (<><span className='text-green-200'>{it.label}</span><span className='text-green-100 mx-2'>{it.text}</span></>)}
                                                                 </li>
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
                    ['common', 'nav', 'footer', 'auth', 'safeHaven'],
                    i18nConfig
               ))
          }
     }
}
