import dynamic from 'next/dynamic'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic'
import React from 'react'
import { motion } from 'framer-motion'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'
import LocationPinIcon from '@mui/icons-material/LocationPin'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import SEOAlternates from '@/components/SEOAlternates'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../next-i18next.config.cjs'
const MapLeaflet = dynamic(() => import('../../components/MapLeafLet/MapLeafLet'), { ssr: false })

const ContactUs = () => {
     const { t, i18n } = useTranslation('contact')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.resolvedLanguage || i18n.language)

     const seo = t('seo', { returnObjects: true })

     return (
          <>
               <Head>
                    <title>{seo.title}</title>
                    <meta name="description" content={seo.description} />
                    <meta name="keywords" content={seo.keywords} />
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={seo.title} />
                    <meta property="og:description" content={seo.ogDescription} />
                    <meta property="og:url" content={seo.url} />
                    <meta property="og:image" content={seo.ogImage} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content="@qption" />
                    <meta name="twitter:title" content={seo.title} />
                    <meta name="twitter:description" content={seo.twitterDescription} />
                    <meta name="twitter:image" content={seo.ogImage} />
                    <link rel="canonical" href={seo.url} />
                    <meta name="robots" content={seo.robots} />
               </Head>
               <SEOAlternates />
               <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-normal bg-linear-to-b from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start p-1 lg:p-12 min-h-[calc(100vh-495px)]"
                    dir={isRTL ? 'rtl' : 'ltr'}
               >
                    <span className="my-8 flex items-center text-4xl text-green-500 font-bold gap-2">
                         <MailOutlineIcon fontSize="large" />
                         {t('page.title')}
                    </span>

                    <div className="max-w-5xl grid grid-cols-1 xl:grid-cols-2 gap-5">
                         <motion.div
                              initial={{ opacity: 0, x: 40 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 }}
                              className="w-full mx-auto bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 border border-green-500/20"
                         >
                              <div className="relative flex max-w-[360px] flex-col items-start justify-center rounded-lg bg-opacity-40 p-4 py-6 leading-9">
                                   <div className="flex items-center gap-1">
                                        <HeadsetMicIcon className="text-green-700" fontSize="small" />
                                        <span className="text-xl text-green-700">{t('page.support')}</span>
                                   </div>
                                   <span className="leading-4 p-2 text-green-100 text-lg">{t('page.supportHours')}</span>

                                   <div className="flex items-center gap-1 mt-4">
                                        <AlternateEmailIcon className="text-green-700" fontSize="small" />
                                        <span className="text-xl text-green-700">{t('page.email')}</span>
                                   </div>
                                   <span dir='ltr' className="leading-4 p-2 text-green-100 text-lg">support@qption.com</span>

                                   <div className="flex items-center gap-1 mt-4">
                                        <LocalPhoneIcon className="text-green-700" fontSize="small" />
                                        <span className="text-xl text-green-700">{t('page.phone')}</span>
                                   </div>
                                   <span dir='ltr' className="leading-4 p-2 text-green-100 text-lg">+46766926599</span>

                                   <div className="flex items-center gap-1 mt-4">
                                        <LocationPinIcon className="text-green-700" fontSize="small" />
                                        <span className="text-xl text-green-700">{t('page.address')}</span>
                                   </div>
                                   <span className="leading-5 p-2 text-green-100 text-lg">{t('page.cityCountry')}</span>
                              </div>
                         </motion.div>

                         <motion.div
                              initial={{ opacity: 0, x: 40 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8 }}
                              className="w-full mx-auto bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-2 border border-green-500/20"
                         >
                              <MapLeaflet />
                         </motion.div>
                    </div>
               </motion.div>
          </>
     )
}

export default ContactUs

export async function getServerSideProps({ locale }) {
     return {
          props: {
               ...(await serverSideTranslations(locale, ['common', 'contact', 'nav', 'footer', 'auth'], i18nConfig)),
          }
     }
}
