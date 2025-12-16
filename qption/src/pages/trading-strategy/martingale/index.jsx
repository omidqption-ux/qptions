import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Button } from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import { motion } from 'framer-motion'
import { FaChartLine } from 'react-icons/fa'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../../next-i18next.config.cjs'
import SEOAlternates from '@/components/SEOAlternates'
import SlideUpSection from '@/components/SlideUp/SlideUp'

const Registeration = dynamic(
     () => import('@/components/RegisterationModal/Registeration'),
     { ssr: false }
)

export default function MartingalePage() {
     const { t: tMG, i18n } = useTranslation('martingale')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     return (
          <>
               <Head>
                    {/* Primary SEO */}
                    <title>{tMG('seo.title')}</title>
                    <meta name="description" content={tMG('seo.description')} />
                    <meta name="keywords" content={tMG('seo.keywords')} />

                    {/* Open Graph / Twitter */}
                    <meta property="og:type" content="article" />
                    <meta property="og:site_name" content="Qption" />
                    <meta property="og:title" content={tMG('seo.title')} />
                    <meta property="og:description" content={tMG('seo.description')} />
                    <meta property="og:url" content="https://qption.com/trading-strategy/martingale" />
                    <meta property="og:image" content="https://qption.com/videos/martingale-strategy/martingale-strategy.jpg" />
                    <meta property="og:image:alt" content={tMG('seo.ogAlt')} />
                    <meta property="og:image:width" content="1200" />
                    <meta property="og:image:height" content="630" />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={tMG('seo.title')} />
                    <meta name="twitter:description" content={tMG('seo.description')} />
                    <meta name="twitter:image" content="https://qption.com/videos/martingale-strategy/martingale-strategy.jpg" />

                    {/* Canonical */}
                    <link rel="canonical" href="https://qption.com/trading-strategy/martingale" />

                    {/* JSON-LD (localized) */}
                    <script
                         type="application/ld+json"
                         dangerouslySetInnerHTML={{
                              __html: JSON.stringify({
                                   '@context': 'https://schema.org',
                                   '@type': 'TechArticle',
                                   headline: tMG('seo.ld.headline'),
                                   description: tMG('seo.description'),
                                   inLanguage: i18n.language,
                                   mainEntityOfPage: 'https://qption.com/trading-strategy/martingale',
                                   image: 'https://qption.com/videos/martingale-strategy/martingale-strategy.jpg',
                                   publisher: { '@type': 'Organization', name: 'Qption' },
                                   about: [
                                        { '@type': 'Thing', name: 'Martingale' },
                                        { '@type': 'Thing', name: 'Position Sizing' },
                                        { '@type': 'Thing', name: 'Risk Management' },
                                        { '@type': 'Thing', name: 'Doubling Strategy' },
                                        { '@type': 'Thing', name: 'Anti-Martingale' }
                                   ],
                                   articleSection: [
                                        'Overview',
                                        'How Martingale Works (Doubling After Loss)',
                                        'Entry/Exit Framework',
                                        'Risk Controls & Capital Caps',
                                        'Examples & Sizing Ladders',
                                        'Pros and Cons',
                                        'Alternatives (Anti-Martingale / Fixed Fractional)'
                                   ]
                              })
                         }}
                    />
               </Head>

               <SEOAlternates />

               <SlideUpSection>
                    <main
                         dir={isRTL ? 'rtl' : 'ltr'}
                         className="px-4 text-green-100 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 text-lg leading-8"
                    >
                         <div className="lg:my-12 my-4 flex flex-col items-start w-full max-w-7xl mx-auto">

                              {/* Breadcrumb */}
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="my-6">
                                   <Link
                                        href="/trading-strategy"
                                        className="text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2"
                                   >
                                        <FaChartLine className="text-lg" />
                                        <span className="text-lg">{tMG('breadcrumb.tradingStrategy')}</span>
                                   </Link>
                              </motion.div>

                              {/* CTA strip */}
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8 w-full">
                                   <div className="bg-linear-to-b w-full from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                        <div className="w-full flex md:flex-row items-center justify-between gap-4">
                                             <div className="text-green-100 text-lg">{tMG('cta.ready')}</div>
                                             <Button
                                                  onClick={handleOpen}
                                                  className="normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
                                                  variant="contained"
                                                  size="medium"
                                             >
                                                  <HowToRegIcon className="mr-2" />
                                                  {tMG('cta.startTrading')}
                                             </Button>
                                        </div>
                                   </div>
                              </motion.div>

                              {/* Page title */}
                              <h1 className="text-2xl font-semibold mb-6 text-green-500 w-full text-center">
                                   {tMG('hero.title')}
                              </h1>

                              {/* Intro card */}
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
                                   <p className='font-normal' >{tMG('hero.p1')}</p>
                                   <p className="my-6 font-normal">{tMG('hero.p2')}</p>
                              </motion.div>

                              {/* Video */}
                              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full my-5 bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-1 md:p-4 border border-green-500/20">
                                   <video
                                        src="/videos/martingale-strategy/martingale-strategy.mp4"
                                        poster="/videos/martingale-strategy/martingale-strategy.png"
                                        controls
                                        playsInline
                                        preload="metadata"
                                        style={{ width: '100%', height: 'auto', borderRadius: 12 }}
                                        aria-description={tMG('video.aria')}
                                   />
                              </motion.div>
                              <div className='font-normal' >
                                   {/* What is Martingale */}
                                   <h2 className="text-2xl font-semibold mt-6 mb-2 text-green-700">
                                        {tMG('what.title')}
                                   </h2>
                                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
                                        <div className="bg-linear-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <p className="my-4 leading-7 text-lg">{tMG('what.p1')}</p>
                                        </div>
                                   </motion.div>

                                   {/* How it works */}
                                   <h2 className="text-2xl font-semibold mt-6 mb-2 text-green-700">
                                        {tMG('how.title')}
                                   </h2>
                                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
                                        <div className="bg-linear-to-b leading-7 text-lg from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <p className="my-6">{tMG('how.p1')}</p>
                                             <p>{tMG('how.p2')}</p>
                                        </div>
                                   </motion.div>

                                   {/* Applying on Qption */}
                                   <h2 className="text-2xl font-semibold mt-6 mb-2 text-green-700">
                                        {tMG('apply.title')}
                                   </h2>
                                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
                                        <div className="bg-linear-to-b leading-7 text-lg from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <p className="mt-2">{tMG('apply.p1')}</p>
                                             <p className="my-2">{tMG('apply.p2')}</p>
                                             <p>{tMG('apply.p3')}</p>
                                        </div>
                                   </motion.div>

                                   {/* Considerations */}
                                   <h2 className="text-2xl font-semibold mt-6 mb-2 text-green-700">
                                        {tMG('consider.title')}
                                   </h2>
                                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
                                        <div className="bg-linear-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <ul className="font-normal text-lg leading-9 my-2 list-decimal list-inside marker:text-xl">
                                                  {[1, 2, 3, 4, 5, 6].map(n => (
                                                       <li key={n}>
                                                            <span className={`font-bold text-lg ${n === 1 ? 'text-green-100' : 'text-green-200'}`}>
                                                                 {tMG(`consider.items.${n}.h`)}
                                                            </span>
                                                            <span> — {tMG(`consider.items.${n}.p`)}</span>
                                                       </li>
                                                  ))}
                                             </ul>
                                        </div>
                                   </motion.div>

                                   {/* Step-by-step */}
                                   <h2 className="text-2xl font-semibold mt-6 mb-2 text-green-700">
                                        {tMG('steps.title')}
                                   </h2>
                                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
                                        <div className="bg-linear-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                             <p className="leading-7 text-xl text-green-400">{tMG('steps.lead')}</p>
                                             <ul className="font-normal text-lg leading-9 my-2 list-decimal list-inside marker:text-xl">
                                                  {[1, 2, 3, 4, 5, 6, 7].map(n => (
                                                       <li key={n}>
                                                            <span className="font-bold text-lg text-green-200">
                                                                 {tMG(`steps.items.${n}.h`)}
                                                            </span>
                                                            <span> — {tMG(`steps.items.${n}.p`)}</span>
                                                       </li>
                                                  ))}
                                             </ul>
                                             <p className="my-2 leading-8 text-lg">{tMG('steps.p1')}</p>
                                             <p className="my-2 leading-8 text-lg">{tMG('steps.p2')}</p>
                                        </div>
                                   </motion.div>

                              </div>
                         </div>
                         {/* Register modal */}
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
                    ['common', 'nav', 'footer', 'auth', 'martingale'],
                    i18nConfig
               ))
          }
     }
}
