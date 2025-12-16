import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { motion } from 'framer-motion'
import {
     FaQuestionCircle, FaChartLine, FaIdCard, FaMoneyBillWave, FaWallet, FaHandshake,
     FaCoins, FaExchangeAlt, FaClock, FaCreditCard, FaLock, FaChartBar,
     FaExclamationTriangle, FaTools, FaHeadset
} from 'react-icons/fa'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../next-i18next.config.cjs'
import SEOAlternates from '@/components/SEOAlternates'

const StyledAccordion = styled(Accordion)(() => ({
     backgroundColor: 'rgba(26, 42, 58, 0.5)',
     backdropFilter: 'blur(10px)',
     border: '1px solid rgba(33, 180, 116, 0.2)',
     borderRadius: '8px',
     overflow: 'hidden',
     boxShadow: '0 4px 6px rgba(33, 180, 116, 0.1)',
     '&:hover': { boxShadow: '0 4px 6px rgba(33, 180, 116, 0.2)' },
     '& .MuiAccordionSummary-root': {
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(33, 180, 116, 0.05)' },
     },
     '& .MuiAccordionDetails-root': {
          color: 'white',
          backgroundColor: 'rgba(26, 42, 58, 0.3)',
     },
}))

// map simple icon keys from translations -> actual icons
const iconMap = {
     chartLine: <FaChartLine className="text-2xl text-[#21b474]" />,
     idCard: <FaIdCard className="text-2xl text-[#21b474]" />,
     moneyBill: <FaMoneyBillWave className="text-2xl text-[#21b474]" />,
     wallet: <FaWallet className="text-2xl text-[#21b474]" />,
     handshake: <FaHandshake className="text-2xl text-[#21b474]" />,
     coins: <FaCoins className="text-2xl text-[#21b474]" />,
     exchange: <FaExchangeAlt className="text-2xl text-[#21b474]" />,
     clock: <FaClock className="text-2xl text-[#21b474]" />,
     creditCard: <FaCreditCard className="text-2xl text-[#21b474]" />,
     lock: <FaLock className="text-2xl text-[#21b474]" />,
     chartBar: <FaChartBar className="text-2xl text-[#21b474]" />,
     warning: <FaExclamationTriangle className="text-2xl text-[#21b474]" />,
     tools: <FaTools className="text-2xl text-[#21b474]" />,
     headset: <FaHeadset className="text-2xl text-[#21b474]" />,
}

export default function Faq() {
     const { t, i18n } = useTranslation('faq')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.resolvedLanguage || i18n.language)

     // SEO block from locales
     const seo = t('seo', { returnObjects: true })
     // FAQs array from locales
     const faqs = t('faqs', { returnObjects: true }) || []

     return (
          <>
               <Head>
                    <title>{seo.title}</title>
                    <meta name="description" content={seo.description} />
                    {seo.keywords && <meta name="keywords" content={seo.keywords} />}

                    {/* Open Graph */}
                    <meta property="og:type" content="website" />
                    <meta property="og:site_name" content="Qption" />
                    <meta property="og:title" content={seo.title} />
                    <meta property="og:description" content={seo.ogDescription || seo.description} />
                    <meta property="og:url" content={seo.url} />
                    <meta property="og:image" content={seo.ogImage} />
                    <meta property="og:image:width" content="1200" />
                    <meta property="og:image:height" content="630" />

                    {/* Twitter */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content="@qption" />
                    <meta name="twitter:title" content={seo.title} />
                    <meta name="twitter:description" content={seo.twitterDescription || seo.description} />
                    <meta name="twitter:image" content={seo.ogImage} />
                    <meta name="twitter:image:alt" content={seo.title} />

                    {/* Let SEOAlternates own canonical */}
                    <meta name="robots" content={seo.robots || 'index,follow'} />
               </Head>

               <SEOAlternates />

               <main
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className="font-normal text-lg bg-linear-to-b from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start p-4 lg:p-12"
               >
                    <div className="absolute inset-0 overflow-hidden">
                         <motion.div
                              animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
                              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                              className="absolute -top-40 -right-40 w-[120%] h-96 bg-[#21b474]/5 rounded-full blur-3xl"
                         />
                         <motion.div
                              animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0] }}
                              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                              className="absolute -bottom-40 -left-40 w-[120%] h-96 bg-[#132a46]/5 rounded-full blur-3xl"
                         />
                    </div>

                    <div className="flex flex-col items-center w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
                         <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8 }}
                              className="text-center mb-12"
                         >
                              <div className="flex items-center justify-center gap-3 my-4">
                                   <FaQuestionCircle className="text-4xl text-green-500" />
                                   <h1 className="text-xl sm:text-5xl font-bold text-green-500">{t('page.title')}</h1>
                              </div>
                              <p className="text-xl text-blue-100 max-w-2xl mx-auto">{t('page.subtitle')}</p>
                         </motion.div>

                         <div className="w-full space-y-4 my-4">
                              {Array.isArray(faqs) &&
                                   faqs.map((faq, i) => (
                                        <motion.div
                                             key={i}
                                             initial={{ opacity: 0, y: 20 }}
                                             whileInView={{ opacity: 1, y: 0 }}
                                             transition={{ duration: 0.5, delay: i * 0.1 }}
                                        >
                                             <StyledAccordion defaultExpanded={i === 0} className="group">
                                                  <AccordionSummary expandIcon={<ExpandMoreIcon className="text-green-700" />}>
                                                       <div className="flex items-center gap-3 text-green-700">
                                                            {iconMap[faq.icon] || iconMap.chartLine}
                                                            <h3 className="group-hover:text-green-300 transition-colors duration-300">
                                                                 {faq.q}
                                                            </h3>
                                                       </div>
                                                  </AccordionSummary>
                                                  <AccordionDetails>
                                                       <p className="text-green-200 leading-relaxed">{faq.a}</p>
                                                  </AccordionDetails>
                                             </StyledAccordion>
                                        </motion.div>
                                   ))}
                         </div>
                    </div>
               </main>
          </>
     )
}

export async function getServerSideProps({ locale }) {
     return {
          props: {
               ...(await serverSideTranslations(locale, ['common', 'nav', 'footer', 'faq', 'auth'], i18nConfig)),
          },
     }
}
