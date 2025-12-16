import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Button } from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../../next-i18next.config.cjs'
import SEOAlternates from '@/components/SEOAlternates'
import { FaChartLine } from 'react-icons/fa'

const Registeration = dynamic(
     () => import('@/components/RegisterationModal/Registeration'),
     { ssr: false }
)

export default function VBouncePage() {
     const { t: tVB, i18n } = useTranslation('v-bounce')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     return (
          <>
               <Head>
                    {/* Primary SEO */}
                    <title>{tVB('seo.title')}</title>
                    <meta name="description" content={tVB('seo.description')} />
                    <meta name="keywords" content={tVB('seo.keywords')} />

                    {/* Open Graph / Twitter */}
                    <meta property="og:type" content="article" />
                    <meta property="og:site_name" content="Qption" />
                    <meta property="og:title" content={tVB('seo.title')} />
                    <meta property="og:description" content={tVB('seo.description')} />
                    <meta property="og:url" content="https://qption.com/trading-strategy/v-bounce" />
                    <meta property="og:image" content="https://qption.com/videos/v-bounce-strategy.jpg" />
                    <meta property="og:image:alt" content={tVB('seo.ogAlt')} />
                    <meta property="og:image:width" content="1200" />
                    <meta property="og:image:height" content="630" />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={tVB('seo.title')} />
                    <meta name="twitter:description" content={tVB('seo.description')} />
                    <meta name="twitter:image" content="https://qption.com/videos/v-bounce-strategy.jpg" />

                    {/* Canonical */}
                    <link rel="canonical" href="https://qption.com/trading-strategy/v-bounce" />

                    {/* JSON-LD */}
                    <script
                         type="application/ld+json"
                         // localized json-ld
                         dangerouslySetInnerHTML={{
                              __html: JSON.stringify({
                                   '@context': 'https://schema.org',
                                   '@type': 'TechArticle',
                                   headline: tVB('seo.ld.headline'),
                                   description: tVB('seo.description'),
                                   inLanguage: i18n.language,
                                   mainEntityOfPage: 'https://qption.com/trading-strategy/v-bounce',
                                   image: 'https://qption.com/videos/v-bounce-strategy.jpg',
                                   publisher: { '@type': 'Organization', name: 'Qption' },
                                   about: [
                                        { '@type': 'Thing', name: 'Support and Resistance' },
                                        { '@type': 'Thing', name: 'Breakout' },
                                        { '@type': 'Thing', name: 'Pullback' },
                                        { '@type': 'Thing', name: 'Fractals (technical analysis)' },
                                        { '@type': 'Thing', name: 'Volume Spike' },
                                        { '@type': 'Thing', name: 'Options (60-second)' }
                                   ],
                                   articleSection: [
                                        'Overview',
                                        'Role of Support and Resistance',
                                        'Break or Bounce Spot',
                                        'Why It Matters',
                                        'Breakout Strike & First Pullback (Boomerang)',
                                        'Trading Bounces',
                                        'Bounce Using Fractals'
                                   ]
                              })
                         }}
                    />
               </Head>

               <SEOAlternates />

               <main
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className="bg-linear-to-b from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start p-4 lg:p-12 text-green-100"
               >
                    {/* Breadcrumb */}
                    <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.6 }}
                         className="w-full max-w-7xl mx-auto"
                    >
                         <Link
                              href="/trading-strategy"
                              className="text-green-500 hover:text-green-400 transition-colors duration-300 inline-flex items-center gap-2"
                         >
                              <FaChartLine className="text-lg" />
                              <span className="text-lg">{tVB('breadcrumb.tradingStrategy')}</span>
                         </Link>
                    </motion.div>

                    {/* CTA strip */}
                    <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.6, delay: 0.1 }}
                         className="w-full max-w-7xl mx-auto my-6"
                    >
                         <div className="bg-linear-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20 w-full">
                              <div className="flex md:flex-row items-center justify-between gap-4">
                                   <div className="text-lg">{tVB('cta.ready')}</div>
                                   <Button
                                        onClick={handleOpen}
                                        className="normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
                                        variant="contained"
                                        size="medium"
                                   >
                                        <HowToRegIcon className="mr-2" />
                                        {tVB('cta.startTrading')}
                                   </Button>
                              </div>
                         </div>
                    </motion.div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-4xl  mb-6 text-green-500 text-center">
                         {tVB('hero.title')}
                    </h1>
                    <div className='lg:text-lg  font-normal max-w-7xl text-center mb-6' >
                         {tVB('hero.subtitle')}
                    </div>
                    {/* Video */}
                    <motion.div
                         initial={{ opacity: 0, x: 20 }}
                         whileInView={{ opacity: 1, x: 0 }}
                         transition={{ duration: 0.6 }}
                         className="w-full max-w-7xl mx-auto my-5 bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-1 md:p-4 border border-green-500/20"
                    >
                         <video
                              src="/videos/v-bounce-strategy/v-bounce-strategy.mp4"
                              poster="/videos/v-bounce-strategy/v-bounce-strategy.png"
                              controls
                              playsInline
                              preload="metadata"
                              style={{ width: '100%', height: 'auto', borderRadius: 12 }}
                              aria-description={tVB('hero.subtitle')}
                         />
                    </motion.div>



                    {/* Section: S&R */}
                    <section className="w-full max-w-7xl mx-auto px-4 font-normal">
                         <h2 className=" text-2xl my-6 text-green-700">
                              {tVB('sr.title')}
                         </h2>

                         <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6 }}
                              className="mb-6"
                         >
                              <div className="text-lg leading-8 bg-linear-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                   <p className="mb-3">{tVB('sr.p1')}</p>
                                   <p>{tVB('sr.p2')}</p>
                              </div>
                         </motion.div>

                         <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.05 }}
                              className="mb-8"
                         >
                              <div className="bg-linear-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                   <p className="mb-2  text-green-700 text-xl">
                                        {tVB('sr.list.title')}
                                   </p>
                                   <ul className="p-4 font-normal leading-9 my-2 list-disc">
                                        {['i1', 'i2', 'i3', 'i4', 'i5'].map((k) => (
                                             <li key={k}>
                                                  <span className="font-bold text-lg text-green-200">
                                                       {tVB(`sr.list.${k}.h`)}:
                                                  </span>
                                                  <span className='mx-2 text-lg' >
                                                       {tVB(`sr.list.${k}.p`)}
                                                  </span>
                                             </li>
                                        ))}
                                   </ul>
                              </div>
                         </motion.div>
                    </section>

                    {/* Section: Break or Bounce */}
                    <section className="w-full max-w-7xl mx-auto">
                         <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6 }}
                              className="mb-8"
                         >
                              <div className="leading-7 bg-linear-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                   <h2 className="text-green-700 my-2  text-2xl">
                                        {tVB('bb.title')}
                                   </h2>
                                   <p className="mt-2 font-normal text-lg">{tVB('bb.p')}</p>
                              </div>
                         </motion.div>
                    </section>

                    {/* Section: Why important + Strike/Boomerang */}
                    <section className="w-full max-w-7xl mx-auto font-normal text-lg">
                         <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6 }}
                              className="mb-8"
                         >
                              <div className="bg-linear-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                   <h2 className="my-2 text-2xl text-green-700">
                                        {tVB('why.title')}
                                   </h2>
                                   <ul className="text-lg p-4 font-normal my-2 list-disc">
                                        {['l1', 'l2'].map((k) => (
                                             <li key={k}>{tVB(`why.${k}`)}</li>
                                        ))}
                                   </ul>

                                   <p className="my-2 text-lg leading-6">{tVB('why.p1')}</p>

                                   <ul className="p-4 font-normal text-lg my-2 list-disc">
                                        {['strike', 'boomerang'].map((k) => (
                                             <li key={k}>
                                                  <span className="font-bold text-lg text-green-200 mx-2">
                                                       {tVB(`why.${k}.h`)}:
                                                  </span>
                                                  {tVB(`why.${k}.p`)}
                                             </li>
                                        ))}
                                   </ul>

                                   <p className="text-lg">{tVB('why.p2')}</p>
                              </div>
                         </motion.div>
                    </section>

                    {/* Section: Trading Bounces + Fractals */}
                    <section className="w-full max-w-7xl mx-auto text-lg font-normal">
                         <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6 }}
                              className="mb-8"
                         >
                              <div className="bg-linear-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                                   <h2 className="my-2  text-2xl">{tVB('bounce.title')}</h2>
                                   <p className="my-2 text-lg">{tVB('bounce.p1')}</p>
                                   <p className="my-2">{tVB('bounce.p2')}</p>
                                   <ul className="p-4 font-normal leading-9 my-2 list-disc">
                                        {['direct', 'confirm', 'breakAfter'].map((k) => (
                                             <li key={k}>
                                                  <span className="font-bold text-lg text-green-200 mx-2">
                                                       {tVB(`bounce.${k}.h`)}:
                                                  </span>
                                                  {tVB(`bounce.${k}.p`)}
                                             </li>
                                        ))}
                                   </ul>

                                   <h3 className="my-6  text-2xl text-green-700 mx-2">
                                        {tVB('fractals.title')}
                                   </h3>
                                   <p className="my-2 text-green-200">{tVB('fractals.lead')}</p>
                                   <ul className="p-4 font-normal text-lg leading-8 my-2 list-disc list-inside marker:text-xl">
                                        {[1, 2, 3, 4, 5].map((n) => (
                                             <li key={n}>{tVB(`fractals.steps.${n}`)}</li>
                                        ))}
                                   </ul>
                                   <p className="my-2 text-green-200">{tVB('fractals.meanTitle')}</p>
                                   <p className="p-4 leading-6 text-lg">{tVB('fractals.meanBody')}</p>
                              </div>
                         </motion.div>
                    </section>

                    {/* Register modal */}
                    <Registeration handleClose={handleClose} open={openLogin} isRegister />
               </main>
          </>
     )
}

export async function getServerSideProps({ locale }) {
     return {
          props: {
               ...(await serverSideTranslations(
                    locale,
                    ['common', 'nav', 'footer', 'auth', 'v-bounce'],
                    i18nConfig
               ))
          }
     }
}
