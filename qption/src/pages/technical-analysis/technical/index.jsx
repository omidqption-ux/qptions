import React from 'react'
import Link from 'next/link'
import SlideUpSection from '@/components/SlideUp/SlideUp'
import dynamic from 'next/dynamic'
import { Button } from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import { motion } from 'framer-motion'
import { FaChartLine, FaInfoCircle, FaLightbulb, FaExclamationTriangle } from 'react-icons/fa'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../../next-i18next.config.cjs'
import SEOAlternates from '@/components/SEOAlternates'

const Registeration = dynamic(() => import('@/components/RegisterationModal/Registeration'), { ssr: false })

export default function TechnicalPage() {
     const { t, i18n } = useTranslation('technical')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     const seo = t('seo', { returnObjects: true })

     const overview = t('overview', { returnObjects: true })
     const core = t('core', { returnObjects: true })
     const indicators = t('indicators', { returnObjects: true })
     const limitations = t('limitations', { returnObjects: true })

     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     return (
          <SlideUpSection>
               <Head>
                    <title>{seo?.title}</title>
                    <meta name='description' content={seo?.description} />
                    {seo?.keywords && <meta name='keywords' content={seo.keywords} />}
                    <meta property='og:type' content='website' />
                    <meta property='og:site_name' content='Qption' />
                    <meta property='og:title' content={seo?.ogTitle || seo?.title} />
                    <meta property='og:description' content={seo?.ogDescription || seo?.description} />
                    {seo?.image && <meta property='og:image' content={seo.image} />}
                    {seo?.url && <meta property='og:url' content={seo.url} />}
                    <meta name='robots' content='index,follow' />
               </Head>

               <SEOAlternates />

               <main dir={isRTL ? 'rtl' : 'ltr'} className='min-h-screen bg-linear-to-br from-[#142B47]  to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 text-lg leading-8'>
                    <div className='w-full max-w-7xl px-4'>
                         {/* Back link */}
                         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className='mb-8'>
                              <Link href='/technical-analysis' className='text-green-500 hover:text-green-400 transition-colors duration-500 flex items-center gap-2'>
                                   <FaChartLine className='text-lg my-6' />
                                   <span className='text-lg'>{t('labels.backToTechnical')}</span>
                              </Link>
                         </motion.div>

                         {/* Promo CTA */}
                         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className='mb-8'>
                              <div className='bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'>
                                   <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                                        <div className='text-green-100 text-lg'>{t('promo.text')}</div>
                                        <Button onClick={handleOpen} className='normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-500' variant='contained' size='medium'>
                                             <HowToRegIcon className='mr-2' />
                                             {t('promo.cta')}
                                        </Button>
                                   </div>
                              </div>
                         </motion.div>

                         {/* Hero */}
                         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className='text-center mb-12'>
                              <h1 className='text-3xl md:text-4xl font-bold text-green-500 mb-4'>{t('hero.title')}</h1>
                              <p className='text-green-100 text-lg max-w-3xl mx-auto'>{t('hero.subtitle')}</p>
                         </motion.div>

                         <div className='space-y-8 my-4 font-normal'>
                              {/* Overview */}
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} whileHover={{ scale: 1.01 }} className='bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'>
                                   <div className='flex items-center gap-3 mb-4'>
                                        <FaInfoCircle className='text-green-500 text-2xl' />
                                        <h2 className='text-2xl font-bold text-green-700'>{overview?.title}</h2>
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

                              {/* Core Concepts */}
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} whileHover={{ scale: 1.01 }} className='bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'>
                                   <div className='flex items-center gap-3 mb-4'>
                                        <FaLightbulb className='text-green-500 text-2xl' />
                                        <h2 className='text-2xl font-bold text-green-700'>{core?.title}</h2>
                                   </div>
                                   <div className='space-y-4'>
                                        {(core?.items || []).map((it, i) => (
                                             <div key={i} className='flex items-start gap-3'>
                                                  <span className='text-green-200 mt-1'>{i + 1}.</span>
                                                  <div>
                                                       <h3 className='text-green-200  mb-1'>{it.title}</h3>
                                                       <p className='text-green-100'>{it.desc}</p>
                                                  </div>
                                             </div>
                                        ))}
                                   </div>
                              </motion.div>

                              {/* Popular Indicators */}
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} whileHover={{ scale: 1.01 }} className='bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'>
                                   <div className='flex items-center gap-3 mb-4'>
                                        <FaChartLine className='text-green-500 text-2xl' />
                                        <h2 className='text-2xl font-bold text-green-500'>{indicators?.title}</h2>
                                   </div>
                                   <div className='space-y-6'>
                                        {(indicators?.items || []).map((box, bIdx) => (
                                             <div key={bIdx}>
                                                  <h3 className='text-xl  text-green-200 mb-3'>{`${bIdx + 1}. ${box.title}`}</h3>
                                                  <ul className='space-y-3'>
                                                       {(box.points || []).map((p, i) => (
                                                            <li key={i} className='flex items-start gap-3'>
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
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }} whileHover={{ scale: 1.01 }} className='bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'>
                                   <div className='flex items-center gap-3 mb-4'>
                                        <FaExclamationTriangle className='text-green-500 text-2xl' />
                                        <h2 className='text-2xl font-bold text-green-700'>{limitations?.title}</h2>
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

                    <Registeration handleClose={handleClose} open={openLogin} isRegister={true} />
               </main>
          </SlideUpSection>
     )
}

export async function getServerSideProps({ locale }) {
     return {
          props: {
               ...(await serverSideTranslations(locale, ['common', 'technical', 'nav', 'footer', 'auth'], i18nConfig)),
          },
     }
}
