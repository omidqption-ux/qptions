'use client'

import React from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../next-i18next.config.cjs'

import SlideUpSection from '@/components/SlideUp/SlideUp'
import SEOAlternates from '@/components/SEOAlternates'
import styles from '../AMLAndKYC/AMLAndKYC.module.css'

import {
     FaUserShield,
     FaDatabase,
     FaChartLine,
     FaBullseye,
     FaIdCard,
     FaCheckCircle,
     FaEnvelope,
     FaLock,
     FaChartBar,
     FaFileAlt,
     FaShieldAlt,
     FaArchive,
     FaSearch,
     FaShieldVirus,
     FaKey,
     FaUserLock,
     FaCreditCard,
     FaTrashAlt,
     FaHistory,
     FaCookie,
} from 'react-icons/fa'

const ICONS = {
     consent: FaUserShield,
     info: FaDatabase,
     use: FaChartLine,
     purpose: FaBullseye,
     identification: FaIdCard,
     accuracy: FaCheckCircle,
     marketing: FaEnvelope,
     disclosure: FaLock,
     nonPersonal: FaChartBar,
     verification: FaFileAlt,
     confidentiality: FaShieldAlt,
     storage: FaArchive,
     review: FaSearch,
     protection: FaShieldVirus,
     credentials: FaKey,
     unauthorized: FaUserLock,
     cardSecurity: FaCreditCard,
     deletion: FaTrashAlt,
     retention: FaHistory,
     cookies: FaCookie,
}

export default function PrivacyPolicy() {
     const { t: tPP, i18n } = useTranslation('privacyPolicy')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)
     const sections = tPP('sections', { returnObjects: true }) || []

     const baseSections = tPP('sections', { returnObjects: true, lng: 'en' }) || []
     const getIconKey = (secIcon, index) => {
          // prefer current locale icon if present (and not accidentally translated)
          const k1 = typeof secIcon === 'string' ? secIcon.trim() : ''
          if (k1 && ICONS[k1]) return k1
          // fallback to English base section's icon
          const enIcon = baseSections[index]?.icon
          const k2 = typeof enIcon === 'string' ? enIcon.trim() : ''
          if (k2 && ICONS[k2]) return k2
          // final fallback
          return 'file'
     }
     return (
          <>
               <Head>
                    <title>{tPP('seo.title')}</title>
                    <meta name="description" content={tPP('seo.description')} />
                    <meta name="keywords" content={tPP('seo.keywords')} />

                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={tPP('seo.ogTitle')} />
                    <meta property="og:description" content={tPP('seo.ogDescription')} />
                    <meta property="og:image" content={tPP('seo.image')} />
                    <meta property="og:url" content={tPP('seo.url')} />

                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content={tPP('seo.twitterSite')} />
                    <meta name="twitter:title" content={tPP('seo.twitterTitle')} />
                    <meta name="twitter:description" content={tPP('seo.twitterDescription')} />
                    <meta name="twitter:image" content={tPP('seo.twitterImage')} />

                    <link rel="canonical" href={tPP('seo.canonical')} />
                    <meta name="robots" content="index,follow" />
               </Head>

               <SEOAlternates />

               <SlideUpSection>
                    <main
                         dir={isRTL ? 'rtl' : 'ltr'}
                         className="font-normal px-4 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12"
                    >
                         <div className="max-w-7xl mx-auto text-lg leading-8 w-full">
                              <div className={`${styles.title} my-6 text-center`}>
                                   <span className="text-green-500 text-xl lg:text-3xl">
                                        {tPP('hero.title')}
                                   </span>
                              </div>

                              {sections.map((sec, idx) => {
                                   const iconKey = getIconKey(sec.icon, idx)
                                   const Icon = ICONS[iconKey] || ICONS.file
                                   return (
                                        <motion.div key={sec.key || idx} className="my-2 w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + idx * 0.04 }}>
                                             <div className="bg-linear-to-br w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                                  <div className={`                                                  
                                                  relative mb-6 flex items-center gap-4 text-white
                                                  text-[1.5rem] font-medium pb-1
                                                  after:content-[''] after:absolute after:bottom-0 ${isRTL ? ' after:right-0 ' : ' after:left-0 '}
                                                  after:h-0.5 after:w-10
                                                  after:bg-linear-to-r after:from-[#21b474] after:to-[rgba(33,180,116,0.5)]
                                                  after:transition-[width] after:duration-300 after:ease-in-out
                                                  group-hover:after:w-[60px]
                                                  `}>
                                                       <Icon className="text-green-700" />
                                                       <span className="text-green-700">{sec.title}</span>
                                                  </div>
                                                  <ul className={styles.list}>
                                                       {(sec.items || []).map((it, i) => (
                                                            <li className={`px-5 relative pl-6 mb-4 leading-[1.6] text-green-100 before:content-['•'] before:absolute ${isRTL ? ' before:right-0 ' : ' before:left-0 '} before:text-[#21b474] before:text-[1.2rem]`} key={i}>
                                                                 {it}
                                                            </li>
                                                       ))}
                                                  </ul>
                                             </div>
                                        </motion.div>
                                   )
                              })}
                         </div>
                    </main>
               </SlideUpSection >
          </>
     )
}

export async function getServerSideProps({ locale }) {
     return {
          props: {
               ...(await serverSideTranslations(
                    locale,
                    ['common', 'nav', 'footer', 'auth', 'privacyPolicy'],
                    i18nConfig
               )),
          },
     }
}
