import React from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../next-i18next.config.cjs'
import SlideUpSection from '@/components/SlideUp/SlideUp'
import SEOAlternates from '@/components/SEOAlternates'
import styles from './ReturnPolicy.module.css'
import {
     FaFileInvoice,
     FaExchangeAlt,
     FaUserCheck,
     FaBan,
} from 'react-icons/fa'

const ICONS = {
     request: <FaFileInvoice className='text-green-700' />,
     originalMethod: <FaExchangeAlt className='text-green-700' />,
     accuracy: <FaUserCheck className='text-green-700' />,
     closure: <FaBan className='text-green-700' />,
}

export default function ReturnPolicy() {
     const { t: tRet, i18n } = useTranslation('returnPolicy')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     // Sections come from locale JSON as: [{ key, icon, title, items[] }]
     const sections = tRet('sections', { returnObjects: true }) || []

     return (
          <>
               <Head>
                    <title>{tRet('seo.title')}</title>
                    <meta name="description" content={tRet('seo.description')} />
                    <meta name="keywords" content={tRet('seo.keywords')} />

                    {/* Open Graph / Twitter */}
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={tRet('seo.ogTitle')} />
                    <meta property="og:description" content={tRet('seo.ogDescription')} />
                    <meta property="og:image" content={tRet('seo.image')} />
                    <meta property="og:url" content={tRet('seo.url')} />

                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content={tRet('seo.twitterSite')} />
                    <meta name="twitter:title" content={tRet('seo.twitterTitle')} />
                    <meta name="twitter:description" content={tRet('seo.twitterDescription')} />
                    <meta name="twitter:image" content={tRet('seo.twitterImage')} />

                    <link rel="canonical" href={tRet('seo.canonical')} />
                    <meta name="robots" content="index,follow" />
               </Head>

               <SEOAlternates />

               <SlideUpSection>
                    <main
                         dir={isRTL ? 'rtl' : 'ltr'}
                         className="font-normal px-4 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12"
                    >
                         <div className="text-green-500 text-xl lg:text-3xl font-bold my-6 mb-8 text-center">
                              <h1>{tRet('hero.title')}</h1>
                         </div>

                         <div className="max-w-7xl mx-auto text-lg leading-8 w-full">
                              {sections.map((sec, idx) => (
                                   <motion.div
                                        key={sec.key || idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + idx * 0.05 }}
                                        className="mb-8 w-full"
                                   >
                                        <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <div className={`
                                                  sectionTitle
                                                  relative mb-6 flex items-center gap-4 text-white
                                                  text-[1.5rem] font-medium pb-1
                                                  after:content-[''] after:absolute after:bottom-0 ${isRTL ? ' after:right-0 ' : ' after:left-0 '}
                                                  after:h-0.5 after:w-10
                                                  after:bg-linear-to-r after:from-[#21b474] after:to-[rgba(33,180,116,0.5)]
                                                  after:transition-[width] after:duration-300 after:ease-in-out
                                                  group-hover:after:w-[60px]
                                                  `}>
                                                  {ICONS[sec.icon] || <FaFileInvoice />}
                                                  <span className="text-green-700">{sec.title}</span>
                                             </div>

                                             <ul className={styles.list}>
                                                  {(sec.items || []).map((it, i) => (
                                                       <li className={`px-5 relative pl-6 mb-4 leading-[1.6] text-green-100 before:content-['•'] before:absolute ${isRTL ? 'before:right-0' : 'before:left-0'} before:text-[#21b474] before:text-[1.2rem]`}
                                                            key={i}>
                                                            {it}
                                                       </li>
                                                  ))}
                                             </ul>
                                        </div>
                                   </motion.div>
                              ))}
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
                    ['common', 'nav', 'footer', 'auth', 'returnPolicy'],
                    i18nConfig
               )),
          },
     }
}
