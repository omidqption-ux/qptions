import React from 'react'
import Link from 'next/link'
import SlideUpSection from '@/components/SlideUp/SlideUp'
import dynamic from 'next/dynamic'
const Registeration = dynamic(() => import('@/components/RegisterationModal/Registeration'), { ssr: false })
import Head from 'next/head'
import { Button } from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import { FaChartLine } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../../next-i18next.config.cjs'

export default function BreakOut() {
     const { t, i18n } = useTranslation('strategy-breakout')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     // SEO (localized)
     const title = t('seo.title')
     const description = t('seo.description')
     const url = t('seo.url')
     const image = t('seo.image')

     const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: t('seo.jsonLd.headline'),
          description,
          mainEntityOfPage: url,
          image,
          publisher: { '@type': 'Organization', name: 'Qption' },
          about: t('seo.jsonLd.about', { returnObjects: true }),
          articleSection: t('seo.jsonLd.articleSection', { returnObjects: true })
     }

     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     return (
          <>
               <Head>
                    {/* Primary meta */}
                    <title>{title}</title>
                    <meta name='description' content={description} />
                    <meta name='keywords' content={t('seo.keywords')} />

                    {/* Open Graph */}
                    <meta property='og:type' content='article' />
                    <meta property='og:site_name' content='Qption' />
                    <meta property='og:title' content={title} />
                    <meta property='og:description' content={description} />
                    <meta property='og:url' content={url} />
                    <meta property='og:image' content={image} />
                    <meta property='og:image:alt' content={t('seo.imageAlt')} />
                    <meta property='og:image:width' content='1200' />
                    <meta property='og:image:height' content='630' />

                    {/* Twitter Card */}
                    <meta name='twitter:card' content='summary_large_image' />
                    <meta name='twitter:title' content={title} />
                    <meta name='twitter:description' content={description} />
                    <meta name='twitter:image' content={image} />

                    {/* Canonical */}
                    <link rel='canonical' href={url} />

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
                         className='px-4 text-green-100 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 text-lg leading-8'
                    >
                         <div className='my-12 flex flex-col items-start w-full max-w-7xl mx-auto'>
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='my-6'>
                                   <Link
                                        href='/trading-strategy'
                                        className='text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2'
                                   >
                                        <FaChartLine className='text-lg' />
                                        <span className='text-lg'>{t('breadcrumb')}</span>
                                   </Link>
                              </motion.div>

                              <h3 className='text-4xl font-semibold mb-8 text-green-500 w-full text-center'>
                                   {t('title')}
                              </h3>

                              {/* CTA card */}
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='mb-8 w-full'>
                                   <div className='bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'>
                                        <div className='w-full flex md:flex-row items-center justify-between gap-4'>
                                             <div className='text-green-100 text-lg'>{t('cta.prompt')}</div>
                                             <Button
                                                  onClick={handleOpen}
                                                  className='normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300'
                                                  variant='contained'
                                                  size='medium'
                                             >
                                                  <HowToRegIcon className='mr-2' />
                                                  {t('cta.button')}
                                             </Button>
                                        </div>
                                   </div>
                              </motion.div>

                              {/* Video */}
                              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className='w-full my-5 bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-1 md:p-4 border border-green-500/20 flex flex-col'>
                                   <video
                                        src='/videos/breakout-strategy/breakout-strategy.mp4'
                                        poster='/videos/breakout-strategy/breakout-strategy.png'
                                        controls
                                        playsInline
                                        preload='metadata'
                                        style={{ width: '100%', height: 'auto', borderRadius: 12 }}
                                        aria-description={t('video.aria')}
                                   />
                              </motion.div>

                              {/* Key Concepts */}
                              <span className='text-2xl font-semibold my-6 text-green-700'>
                                   {t('sections.keyConcepts.title')}
                              </span>
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='mb-8 w-full'>
                                   <div className='bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'>
                                        <ul className='font-normal text-lg leading-8 my-2 list-decimal list-inside marker:text-xl'>
                                             <li>
                                                  <span className='text-lg text-green-200'>{t('sections.keyConcepts.items.levels.title')}</span>
                                                  <br />{t('sections.keyConcepts.items.levels.desc')}
                                             </li>
                                             <li>
                                                  <span className='text-lg text-green-200'>{t('sections.keyConcepts.items.volume.title')}</span>
                                                  <br />{t('sections.keyConcepts.items.volume.desc')}
                                             </li>
                                             <li>
                                                  <span className='text-lg text-green-200'>{t('sections.keyConcepts.items.types.title')}</span>
                                                  <br />
                                                  {t('sections.keyConcepts.items.types.bull')}<br />
                                                  {t('sections.keyConcepts.items.types.bear')}
                                             </li>
                                             <li>
                                                  <span className='text-lg text-green-200'>{t('sections.keyConcepts.items.indicators.title')}</span>
                                                  <br />{t('sections.keyConcepts.items.indicators.desc')}
                                             </li>
                                             <li>
                                                  <span className='text-lg text-green-200'>{t('sections.keyConcepts.items.false.title')}</span>
                                                  <br />{t('sections.keyConcepts.items.false.desc')}
                                             </li>
                                        </ul>
                                   </div>
                              </motion.div>

                              {/* How to Use */}
                              <span className='text-2xl font-semibold my-6 text-green-700'>
                                   {t('sections.howTo.title')}
                              </span>
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='mb-8 w-full'>
                                   <div className='bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'>
                                        <ul className='font-normal text-lg leading-8 my-2 list-decimal list-inside marker:text-xl'>
                                             <li>
                                                  <span className='font-bold text-lg leading-8 text-green-200'>{t('sections.howTo.items.levels.title')}</span>
                                                  <br />{t('sections.howTo.items.levels.desc')}
                                             </li>
                                             <li>
                                                  <span className='font-bold text-lg leading-8 text-green-200'>{t('sections.howTo.items.confirm.title')}</span>
                                                  <br />{t('sections.howTo.items.confirm.desc')}
                                             </li>
                                             <li>
                                                  <span className='font-bold text-lg leading-8 text-green-200'>{t('sections.howTo.items.indicators.title')}</span>
                                                  <br />{t('sections.howTo.items.indicators.desc')}
                                             </li>
                                             <li>
                                                  <span className='font-bold text-lg leading-8 text-green-200'>{t('sections.howTo.items.entriesExits.title')}</span>
                                                  <br />{t('sections.howTo.items.entriesExits.desc')}
                                             </li>
                                             <li>
                                                  <span className='font-bold text-lg leading-8 text-green-200'>{t('sections.howTo.items.risk.title')}</span>
                                                  <br />{t('sections.howTo.items.risk.desc')}
                                             </li>
                                        </ul>
                                   </div>
                              </motion.div>

                              {/* Pros & Cons */}
                              <span className='text-2xl font-semibold my-6 leading-8 text-green-700'>
                                   {t('sections.prosCons.title')}
                              </span>
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='mb-8 w-full'>
                                   <div className='bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'>
                                        <span className='text-2xl font-semibold mb-2 text-green-200'>{t('sections.prosCons.pros.title')}</span>
                                        <ul className='font-normal  leading-8 my-2 list-decimal list-inside marker:text-xl'>
                                             <li>
                                                  <span className='font-bold text-lg text-green-200'>{t('sections.prosCons.pros.items.reward.title')}</span>
                                                  <br />{t('sections.prosCons.pros.items.reward.desc')}
                                             </li>
                                             <li>
                                                  <span className='font-bold text-lg text-green-200'>{t('sections.prosCons.pros.items.momentum.title')}</span>
                                                  <br />{t('sections.prosCons.pros.items.momentum.desc')}
                                             </li>
                                             <li>
                                                  <span className='font-bold text-lg text-green-200'>{t('sections.prosCons.pros.items.markets.title')}</span>
                                                  <br />{t('sections.prosCons.pros.items.markets.desc')}
                                             </li>
                                        </ul>

                                        <span className='text-2xl font-semibold mb-2 text-green-200'>{t('sections.prosCons.cons.title')}</span>
                                        <ul className='font-normal  leading-8 my-2 list-decimal list-inside marker:text-xl'>
                                             <li>
                                                  <span className='font-bold text-lg text-green-200'>{t('sections.prosCons.cons.items.falseBreakouts.title')}</span>
                                                  <br />{t('sections.prosCons.cons.items.falseBreakouts.desc')}
                                             </li>
                                             <li>
                                                  <span className='font-bold text-lg text-green-200'>{t('sections.prosCons.cons.items.timing.title')}</span>
                                                  <br />{t('sections.prosCons.cons.items.timing.desc')}
                                             </li>
                                        </ul>
                                   </div>
                              </motion.div>

                              {/* Example */}
                              <span className='text-2xl font-semibold mb-2 text-green-700'>
                                   {t('sections.example.title')}
                              </span>
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='mb-8 w-full'>
                                   <div className='bg-linear-to-b text-lg leading-8 w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20 font-normal'>
                                        <span>{t('sections.example.p1')}</span>
                                        <span>{t('sections.example.p2')}</span>
                                   </div>
                              </motion.div>
                         </div>

                         <Registeration handleClose={handleClose} open={openLogin} isRegister={true} />
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
                    ['common', 'nav', 'footer', 'auth', 'strategy-breakout'],
                    i18nConfig
               ))
          }
     }
}
