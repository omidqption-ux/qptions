'use client'

import React from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../next-i18next.config.cjs'

import SlideUpSection from '@/components/SlideUp/SlideUp'
import SEOAlternates from '@/components/SEOAlternates'
import styles from './TermsAndCondition.module.css'

import {
     FaFileContract,
     FaExclamationTriangle,
     FaBook,
     FaUserShield,
     FaIdCard,
     FaMoneyBillWave,
     FaShieldAlt,
     FaHandHoldingUsd,
     FaCloudShowersHeavy,
     FaTimesCircle,
     FaFileAlt,
} from 'react-icons/fa'

const ICONS = {
     intro: FaFileContract,
     risk: FaExclamationTriangle,
     definitions: FaBook,
     account: FaUserShield,
     verification: FaIdCard,
     payments: FaMoneyBillWave,
     dataProtection: FaShieldAlt,
     aml: FaHandHoldingUsd,
     forceMajeure: FaCloudShowersHeavy,
     termination: FaTimesCircle,
     file: FaFileAlt, // fallback
}

export default function TermsAndCondition() {
     const { t: tTerms, i18n } = useTranslation('terms')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     const sections = tTerms('sections', { returnObjects: true }) || []
     // English base sections for stable metadata (icon keys) as a fallback
     const baseEn = tTerms('sections', { returnObjects: true, lng: 'en' }) || []

     const getIconKey = (iconKey, idx) => {
          const k1 = typeof iconKey === 'string' ? iconKey.trim() : ''
          if (k1 && ICONS[k1]) return k1
          const k2 = typeof baseEn[idx]?.icon === 'string' ? baseEn[idx].icon.trim() : ''
          if (k2 && ICONS[k2]) return k2
          return 'file'
     }

     return (
          <>
               <Head>
                    <title>{tTerms('seo.title')}</title>
                    <meta name="description" content={tTerms('seo.description')} />
                    <meta name="keywords" content={tTerms('seo.keywords')} />

                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={tTerms('seo.ogTitle')} />
                    <meta property="og:description" content={tTerms('seo.ogDescription')} />
                    <meta property="og:image" content={tTerms('seo.image')} />
                    <meta property="og:url" content={tTerms('seo.url')} />

                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content={tTerms('seo.twitterSite')} />
                    <meta name="twitter:title" content={tTerms('seo.twitterTitle')} />
                    <meta name="twitter:description" content={tTerms('seo.twitterDescription')} />
                    <meta name="twitter:image" content={tTerms('seo.twitterImage')} />

                    <link rel="canonical" href={tTerms('seo.canonical')} />
                    <meta name="robots" content="index,follow" />
               </Head>

               <SEOAlternates />

               <SlideUpSection>
                    <main
                         dir={isRTL ? 'rtl' : 'ltr'}
                         className="font-normal min-h-screen px-4 bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12"
                    >
                         <div className="max-w-7xl mx-auto text-lg leading-8 w-full">
                              <div className={`${styles.title} my-6 text-center`}>
                                   <span className="text-green-500 text-xl lg:text-3xl">
                                        {tTerms('hero.title')}
                                   </span>
                              </div>

                              {sections.map((sec, idx) => {
                                   const Icon = ICONS[getIconKey(sec.icon, idx)] || ICONS.file
                                   return (
                                        <motion.div
                                             key={sec.key || idx}
                                             initial={{ opacity: 0, y: 20 }}
                                             animate={{ opacity: 1, y: 0 }}
                                             transition={{ delay: 0.08 + idx * 0.04 }}
                                             className="my-6 w-full"
                                        >
                                             <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
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
               </SlideUpSection>
          </>
     )
}

export async function getServerSideProps({ locale }) {
     return {
          props: {
               ...(await serverSideTranslations(
                    locale,
                    ['common', 'nav', 'footer', 'auth', 'terms'],
                    i18nConfig
               )),
          },
     }
}
