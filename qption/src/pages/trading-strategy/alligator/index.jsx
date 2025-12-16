import React from 'react'
import Link from 'next/link'
import SlideUpSection from '@/components/SlideUp/SlideUp'
import { Button } from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import { motion } from 'framer-motion'
import { FaChartLine } from 'react-icons/fa'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../../next-i18next.config.cjs'

const Registeration = dynamic(
     () => import('@/components/RegisterationModal/Registeration'),
     { ssr: false }
)

function SectionCard({ children }) {
     return (
          <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20 mb-8">
               {children}
          </div>
     )
}

export default function AlligatorStrategyPage() {
     const { t, i18n } = useTranslation('strategy-alligator')
     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: t('seo.jsonLd.headline'),
          description: t('seo.description'),
          mainEntityOfPage: t('seo.url'),
          image: t('seo.image'),
          publisher: { '@type': 'Organization', name: 'Qption' },
          about: t('seo.jsonLd.about', { returnObjects: true }),
          articleSection: t('seo.jsonLd.articleSection', { returnObjects: true }),
          additionalProperty: t('seo.jsonLd.additionalProperty', { returnObjects: true })
     }

     return (
          <>
               <Head>
                    <title>{t('seo.title')}</title>
                    <meta name="description" content={t('seo.description')} />
                    <meta name="keywords" content={t('seo.keywords')} />

                    <meta property="og:type" content="article" />
                    <meta property="og:site_name" content="Qption" />
                    <meta property="og:title" content={t('seo.title')} />
                    <meta property="og:description" content={t('seo.description')} />
                    <meta property="og:url" content={t('seo.url')} />
                    <meta property="og:image" content={t('seo.image')} />
                    <meta property="og:image:alt" content={t('seo.imageAlt')} />
                    <meta property="og:image:width" content="1200" />
                    <meta property="og:image:height" content="630" />

                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={t('seo.title')} />
                    <meta name="twitter:description" content={t('seo.description')} />
                    <meta name="twitter:image" content={t('seo.image')} />

                    <link rel="canonical" href={t('seo.url')} />
                    <meta name="robots" content="index,follow" />

                    <script
                         type="application/ld+json"
                         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                    />
               </Head>

               <SlideUpSection>
                    <main
                         dir={isRTL ? 'rtl' : 'ltr'}
                         className="px-4 text-green-100 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 text-lg leading-8"
                    >
                         <div className="lg:my-12 my-4 flex flex-col items-start w-full max-w-7xl mx-auto">
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="my-6">
                                   <Link
                                        href="/trading-strategy"
                                        className="text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2"
                                   >
                                        <FaChartLine className="text-lg" />
                                        <span className="text-lg">{t('breadcrumb')}</span>
                                   </Link>
                              </motion.div>

                              <span className="text-2xl font-semibold mb-8 text-green-500 w-full text-center">
                                   {t('title')}
                              </span>

                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8 w-full">
                                   <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                        <div className="w-full flex md:flex-row flex-col items-center justify-between gap-4">
                                             <div className="text-green-100 text-lg">{t('cta.prompt')}</div>
                                             <Button
                                                  onClick={handleOpen}
                                                  className="normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
                                                  variant="contained"
                                                  size="medium"
                                             >
                                                  <HowToRegIcon className={isRTL ? 'ml-2' : 'mr-2'} />
                                                  {t('cta.button')}
                                             </Button>
                                        </div>
                                   </div>
                              </motion.div>

                              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full my-5 bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-1 md:p-4 border border-green-500/20 flex flex-col">
                                   <video
                                        src="/videos/alligator-strategy/alligator-strategy.mp4"
                                        poster="/videos/alligator-strategy/alligator-strategy.png"
                                        controls
                                        playsInline
                                        preload="metadata"
                                        style={{ width: '100%', height: 'auto', borderRadius: 12 }}
                                        aria-description={t('video.aria')}
                                   />
                              </motion.div>
                              <div className='font-normal' >
                                   <span className="text-2xl font-semibold my-6 text-green-700">
                                        {t('sections.keyConcepts.title')}
                                   </span>
                                   <SectionCard>
                                        <ol className="font-normal text-lg leading-8 my-2 list-decimal list-inside marker:text-xl">
                                             <li>
                                                  <span className=" text-lg text-green-200">{t('sections.keyConcepts.items.jaw.title')}</span>
                                                  <br />
                                                  <span className='m-4' >
                                                       {t('sections.keyConcepts.items.jaw.desc')}
                                                  </span>
                                             </li>
                                             <li>
                                                  <span className="text-lg text-green-200">{t('sections.keyConcepts.items.teeth.title')}</span>
                                                  <br />
                                                  <span className='m-4' >
                                                       {t('sections.keyConcepts.items.teeth.desc')}
                                                  </span>
                                             </li>
                                             <li>
                                                  <span className="text-lg text-green-200">{t('sections.keyConcepts.items.lips.title')}</span>
                                                  <br />
                                                  <span className='m-4' >
                                                       {t('sections.keyConcepts.items.lips.desc')}
                                                  </span>
                                             </li>
                                        </ol>
                                   </SectionCard>

                                   <span className="text-2xl font-semibold mb-2 text-green-700">
                                        {t('sections.behavior.title')}
                                   </span>
                                   <SectionCard>
                                        <span className="my-2">{t('sections.behavior.intro')}</span>
                                        <ol className="font-normal text-lg leading-8 my-2 list-decimal list-inside marker:text-xl">
                                             <li>
                                                  <span className="text-lg text-green-200">{t('sections.behavior.items.sleeping.title')}</span>
                                                  <br />
                                                  <span className='m-4' >
                                                       {t('sections.behavior.items.sleeping.desc')}
                                                  </span>
                                             </li>
                                             <li>
                                                  <span className=" text-lg text-green-200">{t('sections.behavior.items.waking.title')}</span>
                                                  <br />
                                                  <span className='m-4' >
                                                       {t('sections.behavior.items.waking.desc')}
                                                  </span>
                                             </li>
                                             <li>
                                                  <span className="text-lg text-green-200">{t('sections.behavior.items.feeding.title')}</span>
                                                  <br />
                                                  <span className='m-4' >
                                                       {t('sections.behavior.items.feeding.desc')}
                                                  </span>
                                             </li>
                                             <li>
                                                  <span className="text-lg text-green-200">{t('sections.behavior.items.sated.title')}</span>
                                                  <br />
                                                  <span className='m-4' >
                                                       {t('sections.behavior.items.sated.desc')}
                                                  </span>
                                             </li>
                                        </ol>
                                   </SectionCard>

                                   <span className="text-2xl font-semibold mb-4 mt-6 text-green-700">
                                        {t('sections.apply.title')}
                                   </span>
                                   <SectionCard>
                                        <ol className="font-normal text-lg leading-8 my-2 list-decimal list-inside marker:text-xl">
                                             <li>
                                                  <span className="text-lg text-green-200">{t('sections.apply.items.identify.title')}</span>
                                                  <br />
                                                  <span className='m-4' >
                                                       {t('sections.apply.items.identify.desc')}
                                                  </span>
                                             </li>
                                             <li>
                                                  <span className="text-lg text-green-200">{t('sections.apply.items.enter.title')}</span>
                                                  <br />
                                                  <span className='m-4' >
                                                       {t('sections.apply.items.enter.desc')}
                                                  </span>
                                             </li>
                                             <li>
                                                  <span className="text-lg text-green-200">{t('sections.apply.items.hold.title')}</span>
                                                  <br />
                                                  <span className='m-4' >
                                                       {t('sections.apply.items.hold.desc')}
                                                  </span>
                                             </li>
                                             <li>
                                                  <span className="text-lg text-green-200">{t('sections.apply.items.exit.title')}</span>
                                                  <br />
                                                  <span className='m-4' >
                                                       {t('sections.apply.items.exit.desc')}
                                                  </span>
                                             </li>
                                        </ol>

                                        <span className="text-2xl font-semibold mb-2 mt-4 text-green-700">
                                             {t('sections.combine.title')}
                                        </span>
                                        <ol className="font-normal text-lg leading-8 my-2 list-decimal list-inside marker:text-xl">
                                             <li>
                                                  <span className=" text-lg text-green-200">{t('sections.combine.items.fractals.title')}</span>
                                                  <br />
                                                  <span className='m-4' >
                                                       {t('sections.combine.items.fractals.desc')}
                                                  </span>
                                             </li>
                                             <li>
                                                  <span className=" text-lg text-green-200">{t('sections.combine.items.momentum.title')}</span>
                                                  <br />
                                                  <span className='m-4' >
                                                       {t('sections.combine.items.momentum.desc')}
                                                  </span>
                                             </li>
                                             <li>
                                                  <span className="text-lg text-green-200">{t('sections.combine.items.volume.title')}</span>
                                                  <br />
                                                  <span className='m-4' >
                                                       {t('sections.combine.items.volume.desc')}
                                                  </span>
                                             </li>
                                        </ol>
                                   </SectionCard>

                                   <span className="text-2xl font-semibold mb-2 text-green-700">
                                        {t('sections.example.title')}
                                   </span>
                                   <SectionCard>
                                        <p className="text-lg leading-9">{t('sections.example.p1')}</p>
                                        <p className="text-lg leading-9">{t('sections.example.p2')}</p>
                                   </SectionCard>
                                   <span className="text-2xl font-semibold mb-2 mt-4 text-green-700">
                                        {t('sections.prosCons.title')}
                                   </span>
                                   <SectionCard>
                                        <span className="text-2xl font-semibold mb-2 text-green-200">
                                             {t('sections.prosCons.pros.title')}
                                        </span>
                                        <ol className="font-normal text-sm leading-8 my-2 list-decimal list-inside marker:text-xl">
                                             <li>
                                                  <span className="font-bold text-lg text-green-200">{t('sections.prosCons.pros.items.clarity.title')}</span>
                                                  <br />
                                                  <span className='m-4' >
                                                       {t('sections.prosCons.pros.items.clarity.desc')}
                                                  </span>
                                             </li>
                                             <li>
                                                  <span className="font-bold text-lg text-green-200">{t('sections.prosCons.pros.items.timeframes.title')}</span>
                                                  <br />
                                                  <span className='m-4' >
                                                       {t('sections.prosCons.pros.items.timeframes.desc')}
                                                  </span>
                                             </li>
                                             <li>
                                                  <span className="font-bold text-lg text-green-200">{t('sections.prosCons.pros.items.compatible.title')}</span>
                                                  <br />
                                                  <span className='m-4' >
                                                       {t('sections.prosCons.pros.items.compatible.desc')}
                                                  </span>
                                             </li>
                                        </ol>

                                        <span className="text-2xl font-semibold mb-2 text-green-200">
                                             {t('sections.prosCons.cons.title')}
                                        </span>
                                        <ol className="font-normal text-sm leading-8 my-2 list-decimal list-inside marker:text-xl">
                                             <li>
                                                  <span className=" text-lg">{t('sections.prosCons.cons.items.lag.title')}</span>
                                                  <br />
                                                  <span className='m-4' >
                                                       {t('sections.prosCons.cons.items.lag.desc')}
                                                  </span>
                                             </li>
                                             <li>
                                                  <span className="text-lg text-green-200">{t('sections.prosCons.cons.items.false.title')}</span>
                                                  <br />
                                                  <span className='m-4' >
                                                       {t('sections.prosCons.cons.items.false.desc')}
                                                  </span>
                                             </li>
                                        </ol>
                                   </SectionCard>

                                   <span className="text-2xl font-semibold mb-2 mt-4 text-green-700">
                                        {t('sections.chart.title')}
                                   </span>
                                   <SectionCard>
                                        <p className="my-2">{t('sections.chart.p1')}</p>
                                        <p className="my-2">{t('sections.chart.p2')}</p>
                                   </SectionCard>
                              </div>
                         </div>
                    </main>

                    <Registeration handleClose={handleClose} open={openLogin} isRegister />
               </SlideUpSection>
          </>
     )
}

export async function getServerSideProps({ locale }) {
     return {
          props: {
               ...(await serverSideTranslations(locale, ['common', 'nav', 'footer', 'auth', 'strategy-alligator'], i18nConfig))
          }
     }
}
