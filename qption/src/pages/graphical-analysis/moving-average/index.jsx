'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { Button } from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import {
     FaChartLine,
     FaInfoCircle,
     FaLightbulb,
     FaExclamationTriangle,
} from 'react-icons/fa'

import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../../next-i18next.config.cjs'
import SlideUpSection from '@/components/SlideUp/SlideUp'

const Registeration = dynamic(
     () => import('@/components/RegisterationModal/Registeration'),
     { ssr: false }
)

export default function MovingAveragesPage() {
     const { t, i18n } = useTranslation('movingAverages')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     // i18n bundles
     const seo = t('seo', { returnObjects: true })
     const labels = t('labels', { returnObjects: true })
     const promo = t('promo', { returnObjects: true })
     const hero = t('hero', { returnObjects: true })
     const overview = t('overview', { returnObjects: true })
     const how = t('how', { returnObjects: true })
     const strategies = t('strategies', { returnObjects: true })
     const limitations = t('limitations', { returnObjects: true })

     // JSON-LD (localized)
     const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: seo?.title?.replace(' | Qption', ''),
          description: seo?.description,
          mainEntityOfPage: seo?.url,
          image: seo?.image,
          publisher: { '@type': 'Organization', name: 'Qption' },
          about: [
               { '@type': 'Thing', name: 'Moving Average' },
               { '@type': 'Thing', name: 'Simple Moving Average (SMA)' },
               { '@type': 'Thing', name: 'Exponential Moving Average (EMA)' },
               { '@type': 'Thing', name: 'Golden Cross' },
               { '@type': 'Thing', name: 'Death Cross' },
               { '@type': 'Thing', name: 'Moving Average Ribbon' },
          ],
          articleSection: [
               overview?.title,
               how?.title,
               strategies?.title,
               limitations?.title,
          ],
     }

     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     return (
          <>
               <Head>
                    <title>{seo?.title}</title>
                    <meta name='description' content={seo?.description} />
                    {seo?.keywords && <meta name='keywords' content={seo.keywords} />}

                    {/* Open Graph */}
                    <meta property='og:type' content='article' />
                    <meta property='og:site_name' content='Qption' />
                    <meta property='og:title' content={seo?.ogTitle || seo?.title} />
                    <meta property='og:description' content={seo?.ogDescription || seo?.description} />
                    {seo?.url && <meta property='og:url' content={seo.url} />}
                    {seo?.image && (
                         <>
                              <meta property='og:image' content={seo.image} />
                              <meta property='og:image:alt' content={t('seo.imageAlt')} />
                              <meta property='og:image:width' content='1200' />
                              <meta property='og:image:height' content='630' />
                         </>
                    )}

                    {/* Twitter */}
                    <meta name='twitter:card' content='summary_large_image' />
                    <meta name='twitter:title' content={seo?.title} />
                    <meta name='twitter:description' content={seo?.description} />
                    {seo?.image && <meta name='twitter:image' content={seo.image} />}

                    {/* Canonical */}
                    {seo?.url && <link rel='canonical' href={seo.url} />}

                    {/* Indexing */}
                    <meta name='robots' content='index,follow' />

                    {/* Structured data */}
                    <script
                         type='application/ld+json'
                         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                    />
               </Head>

               <SlideUpSection>
                    <main
                         dir={isRTL ? 'rtl' : 'ltr'}
                         className='font-normal min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 text-lg leading-8'
                    >
                         <div className='w-full max-w-7xl px-4'>
                              {/* Back link */}
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='mb-8'>
                                   <Link
                                        href='/graphical-analysis'
                                        className='text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2'
                                   >
                                        <FaChartLine className='text-lg my-6' />
                                        <span className='text-lg'>{labels?.backToGraphical}</span>
                                   </Link>
                              </motion.div>

                              {/* Promo bar */}
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.2 }}
                                   className='mb-8'
                              >
                                   <div className='bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'>
                                        <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                                             <div className='text-green-100 text-lg'>{promo?.text}</div>
                                             <Button
                                                  onClick={() => setOpenLogin(true)}
                                                  className='normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300'
                                                  variant='contained'
                                                  size='medium'
                                             >
                                                  <HowToRegIcon className='mr-2' />
                                                  {promo?.cta}
                                             </Button>
                                        </div>
                                   </div>
                              </motion.div>

                              {/* Hero */}
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.3 }}
                                   className='text-center mb-12'
                              >
                                   <h1 className='text-3xl md:text-4xl font-bold text-green-500 mb-4'>
                                        {hero?.title}
                                   </h1>
                                   <p className='text-green-100 text-lg max-w-3xl mx-auto'>
                                        {hero?.subtitle}
                                   </p>
                              </motion.div>

                              {/* Video */}
                              <motion.div
                                   initial={{ opacity: 0, x: 20 }}
                                   animate={{ opacity: 1, x: 0 }}
                                   className='w-full my-5 bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-1 md:p-4 border border-green-500/20 flex flex-col'
                              >
                                   <video
                                        src='/videos/moving-average/moving-average.mp4'
                                        poster='/videos/moving-average/moving-average.png'
                                        controls
                                        playsInline
                                        preload='metadata'
                                        style={{ width: '100%', height: 'auto', borderRadius: 12 }}
                                        aria-description={t('video.aria')}
                                   />
                              </motion.div>

                              {/* Overview */}
                              <div className='space-y-8 my-6'>
                                   <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className='bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'
                                   >
                                        <div className='flex items-center gap-3 mb-4'>
                                             <FaInfoCircle className='text-green-500 text-2xl' />
                                             <h2 className='text-2xl font-bold text-green-700'>
                                                  {overview?.title}
                                             </h2>
                                        </div>
                                        <ul className='space-y-4'>
                                             {(overview?.bullets || []).map((b, i) => (
                                                  <li key={i} className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>•</span>
                                                       <span className='text-green-100'>{b}</span>
                                                  </li>
                                             ))}
                                        </ul>
                                   </motion.div>

                                   {/* How it works */}
                                   <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className='bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'
                                   >
                                        <div className='flex items-center gap-3 mb-4'>
                                             <FaLightbulb className='text-green-500 text-2xl' />
                                             <h2 className='text-2xl font-bold text-green-700'>
                                                  {how?.title}
                                             </h2>
                                        </div>
                                        <div className='space-y-4'>
                                             {(how?.items || []).map((item, i) => (
                                                  <div key={i} className='flex items-start gap-3'>
                                                       <span className='text-green-200 mt-1'>{i + 1}.</span>
                                                       <div>
                                                            <h3 className='text-green-200  mb-1'>
                                                                 {item.title}
                                                            </h3>
                                                            <p className='text-green-100'>{item.desc}</p>
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                   </motion.div>

                                   {/* Strategies */}
                                   <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className='bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'
                                   >
                                        <div className='flex items-center gap-3 mb-4'>
                                             <FaChartLine className='text-green-500 text-2xl' />
                                             <h2 className='text-2xl font-bold text-green-700'>
                                                  {strategies?.title}
                                             </h2>
                                        </div>
                                        <div className='space-y-6'>
                                             {(strategies?.items || []).map((card, idx) => (
                                                  <div key={idx}>
                                                       <h3 className='text-xl text-green-200 mb-3'>
                                                            {idx + 1}. {card.title}
                                                       </h3>
                                                       <ul className='space-y-3'>
                                                            {(card.points || []).map((p, j) => (
                                                                 <li key={j} className='flex items-start gap-3'>
                                                                      <span className='text-green-500 mt-1'>•</span>
                                                                      <span className='text-green-100'>{p}</span>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  </div>
                                             ))}
                                        </div>
                                   </motion.div>

                                   {/* Limitations */}
                                   <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 }}
                                        className='bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'
                                   >
                                        <div className='flex items-center gap-3 mb-4'>
                                             <FaExclamationTriangle className='text-green-500 text-2xl' />
                                             <h2 className='text-2xl font-bold text-green-700'>
                                                  {limitations?.title}
                                             </h2>
                                        </div>
                                        <ul className='space-y-4'>
                                             {(limitations?.bullets || []).map((b, i) => (
                                                  <li key={i} className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>•</span>
                                                       <span className='text-green-100'>{b}</span>
                                                  </li>
                                             ))}
                                        </ul>
                                   </motion.div>
                              </div>
                         </div>

                         <Registeration handleClose={handleClose} open={openLogin} isRegister />
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
                    ['common', 'movingAverages', 'nav', 'footer', 'auth'],
                    i18nConfig
               )),
          },
     }
}
