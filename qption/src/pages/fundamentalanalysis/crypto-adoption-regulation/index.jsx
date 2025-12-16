import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../../next-i18next.config.cjs'

import SlideUpSection from '@/components/SlideUp/SlideUp'
import dynamic from 'next/dynamic'
const Registeration = dynamic(() => import('@/components/RegisterationModal/Registeration'), { ssr: false })

import { Button } from '@mui/material'
import { motion } from 'framer-motion'
import { FaChartLine } from 'react-icons/fa'
import HowToRegIcon from '@mui/icons-material/HowToReg'

export default function CryptoAdoptionPage() {
     const { t, i18n } = useTranslation('cryptoAdoption')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)
     const [openLogin, setOpenLogin] = React.useState(false)

     const seo = t('seo', { returnObjects: true })

     return (
          <>
               <Head>
                    <title>{seo.title}</title>
                    <meta name="description" content={seo.description} />
                    <meta name="keywords" content={seo.keywords} />
                    <meta property="og:type" content="article" />
                    <meta property="og:title" content={seo.title} />
                    <meta property="og:description" content={seo.description} />
                    <meta property="og:image:alt" content={seo.ogAlt} />
                    <script
                         type="application/ld+json"
                         dangerouslySetInnerHTML={{
                              __html: JSON.stringify({
                                   "@context": "https://schema.org",
                                   "@type": "TechArticle",
                                   headline: seo.ld.headline,
                                   description: seo.description,
                                   mainEntityOfPage: '',
                                   publisher: { "@type": "Organization", name: 'Qption' },
                              }),
                         }}
                    />
               </Head>

               <SlideUpSection>
                    <main
                         dir={isRTL ? 'rtl' : 'ltr'}
                         className="font-normal min-h-screen w-full flex flex-col items-center justify-start py-12 px-4 text-green-100 text-lg leading-8 bg-linear-to-br from-[#142B47] to-[#142B47]/90"
                    >
                         <div className="w-full max-w-7xl mx-auto">
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   className="mb-8"
                              >
                                   <Link
                                        href="/fundamentalanalysis"
                                        className="text-green-500 hover:text-green-400 flex items-center gap-2"
                                   >
                                        <FaChartLine className="text-lg" />
                                        <span>{t('breadcrumb.fundamentalAnalysis')}</span>
                                   </Link>
                              </motion.div>

                              <div className="text-center my-6">
                                   <h1 className="text-2xl font-bold text-green-500">
                                        {t('hero.title')}
                                   </h1>
                              </div>

                              {/* CTA */}
                              <div className="mb-10 border border-green-500/20 rounded-xl p-4 bg-green-500/5 backdrop-blur-3xl">
                                   <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                        <span className="text-lg">{t('cta.ready')}</span>
                                        <div>
                                             <Registeration open={openLogin} handleClose={() => setOpenLogin(false)} isRegister={true} />
                                             <Button
                                                  variant="contained"
                                                  onClick={() => setOpenLogin(true)}
                                                  className="normal-case bg-green-500 hover:bg-green-600 text-white"
                                             >
                                                  <HowToRegIcon className="mr-2" />
                                                  {t('cta.startTrading')}
                                             </Button>
                                        </div>
                                   </div>
                              </div>
                              <div className='border-green-500/20 rounded-xl p-4 bg-green-500/5 backdrop-blur-3xl' >
                                   {/* Section Renderer */}
                                   {Object.entries(t('sections', { returnObjects: true })).map(([sectionKey, sectionValue]) => {
                                        return (
                                             <div key={sectionKey} className="py-4 space-y-6 border-b border-green-500/10 last:border-none">
                                                  <h2 className="text-2xl font-semibold text-green-700">
                                                       {sectionValue.title}
                                                  </h2>

                                                  {/* Bullet Points */}
                                                  {sectionValue.points && (
                                                       <ul className="list-disc list-inside marker:text-xl space-y-2 text-green-100">
                                                            {sectionValue.points.map((point, idx) => (
                                                                 <li key={idx}>{point}</li>
                                                            ))}
                                                       </ul>
                                                  )}

                                                  {/* Numbered List (like drivers) */}
                                                  {sectionValue.list && (
                                                       <ul className="list-decimal list-inside space-y-3 text-green-100">
                                                            {sectionValue.list.map((item, idx) => (
                                                                 <li key={idx} className="text-green-200">
                                                                      {item.title}:
                                                                      <span className="text-green-100 ml-2">{item.text}</span>
                                                                 </li>
                                                            ))}
                                                       </ul>
                                                  )}

                                                  {/* Nested SubSections (like regulationImpact or reactions) */}
                                                  {sectionValue.subSections &&
                                                       sectionValue.subSections.map((sub, i) => (
                                                            <div key={i} className="space-y-3">
                                                                 <h3 className="text-xl  text-green-200">{sub.title}</h3>
                                                                 <ul className="list-disc list-inside marker:text-xl space-y-2 text-green-100">
                                                                      {sub.points.map((pt, idx) => (
                                                                           <li key={idx}>{pt}</li>
                                                                      ))}
                                                                 </ul>
                                                            </div>
                                                       ))}
                                             </div>
                                        )
                                   })}
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
                    ['common', 'nav', 'footer', 'auth', 'cryptoAdoption'],
                    i18nConfig
               ))
          }
     }
}
