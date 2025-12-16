import { useState, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../next-i18next.config.cjs'

import SEOAlternates from '@/components/SEOAlternates'
import { motion } from 'framer-motion'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Head from 'next/head'
import dynamic from 'next/dynamic'
const Registeration = dynamic(() => import('../../components/RegisterationModal/Registeration'), { ssr: false })

const planOrder = ['basic', 'silver', 'gold', 'platinum', 'diamond', 'exclusive']
const rtlLocales = new Set(['ar', 'fa'])

const Accounttypes = () => {
     const { t, i18n } = useTranslation('accTypes')
     const dir = rtlLocales.has(i18n.language) ? 'rtl' : 'ltr'

     // Pull plans (titles/descs/features/from) from i18n
     const plans = t('plans', { returnObjects: true })
     const page = t('page', { returnObjects: true })
     const seo = t('seo', { returnObjects: true })
     const withdrawal = t('withdrawal', { returnObjects: true })

     // Attach your UI-only fields (icon/colors) while keeping text from translations
     const accountTypes = useMemo(() => {
          const uiMap = {
               basic: { icon: '💫', color: 'from-DarkBlue/20 to-DarkBlue/30', borderColor: 'border-DarkBlue/40' },
               silver: { icon: '✨', color: 'from-darkGrey/20 to-darkGrey/30', borderColor: 'border-darkGrey/40' },
               gold: { icon: '🌟', color: 'from-[#142B47]/20 to-[#142B47]/30', borderColor: 'border-[#142B47]/40' },
               platinum: { icon: '👑', color: 'from-[#142B47]/20 to-darkEnd/30', borderColor: 'border-[#142B47]/40' },
               diamond: { icon: '💎', color: 'from-DarkBlue/20 to-darkEnd/30', borderColor: 'border-DarkBlue/40' },
               exclusive: { icon: '🎯', color: 'from-darkEnd/20 to-DarkBlue/30', borderColor: 'border-darkEnd/40' },
          }
          return planOrder.map(key => ({
               key,
               ...plans[key],
               ...uiMap[key],
          }))
     }, [plans])

     const container = {
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } },
     }
     const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

     const [openLogin, setOpenLogin] = useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     return (
          <>
               <Head>
                    {/* Primary SEO meta from i18n */}
                    <title>{seo?.title}</title>
                    <meta name="description" content={seo?.description} />
                    <meta name="keywords" content={seo?.keywords} />
                    {/* Open Graph */}
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={seo?.ogTitle} />
                    <meta property="og:description" content={seo?.ogDescription} />
                    <meta property="og:url" content={seo?.ogUrl} />
                    <meta property="og:image" content={seo?.ogImage} />
                    {/* Twitter Card */}
                    <meta name="twitter:card" content={seo?.twitterCard} />
                    <meta name="twitter:site" content={seo?.twitterSite} />
                    <meta name="twitter:title" content={seo?.twitterTitle} />
                    <meta name="twitter:description" content={seo?.twitterDescription} />
                    <meta name="twitter:image" content={seo?.twitterImage} />
                    {/* Canonical / robots */}
                    <link rel="canonical" href={seo?.canonical} />
                    <meta name="robots" content={seo?.robots || 'index,follow'} />
               </Head>

               {/* Optional: your hreflang component */}
               <SEOAlternates canonical={seo?.canonical} />

               <main dir={dir} className="font-normal bg-linear-to-b from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start p-4 lg:p-12">
                    <Registeration handleClose={handleClose} open={openLogin} isRegister={true} />

                    <div className="text-center mb-8 text-green-500 w-full">
                         <h1 className="text-3xl md:text-4xl font-bold text-green-500 mb-3">
                              {page?.h1}
                         </h1>
                         <p className="text-xl text-green-100">
                              {page?.subtitle}
                         </p>
                    </div>

                    <motion.div
                         variants={container}
                         initial="hidden"
                         animate="show"
                         className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full py-8 px-4 max-w-[1200px]"
                    >
                         {accountTypes.map((acc) => (
                              <motion.div
                                   key={acc.key}
                                   variants={item}
                                   className="group relative overflow-hidden rounded-lg bg-linear-to-br p-0.5 hover:scale-[1.02] transition-all duration-300"
                              >
                                   <div className="relative bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20 h-full">
                                        <div className="flex items-center justify-between mb-3">
                                             <span className="text-3xl drop-shadow-lg">{acc.icon}</span>
                                             <span className="text-xl font-normal text-green-100">{acc.title}</span>
                                        </div>

                                        <p className="text-green-100 mb-8  leading-6 text-lg text-justify">
                                             {acc.desc}
                                        </p>

                                        <div className="mb-4">
                                             {acc.features?.map((feature, i) => (
                                                  <div key={i} className="flex items-center gap-2 mb-1.5">
                                                       <span className="text-green-500 text-sm drop-shadow-sm">✓</span>
                                                       <span className="text-green-100 text-lg ">{feature}</span>
                                                  </div>
                                             ))}
                                        </div>

                                        <div className="mt-auto">
                                             <div className="text-center mb-3">
                                                  <span className="text-2xl font-normal text-green-200 drop-shadow-sm">
                                                       {acc.from === page?.invitationOnly
                                                            ? page?.invitationOnly
                                                            : `${page?.fromPrefix || '$'}${acc.from}`}
                                                  </span>
                                             </div>
                                             <span className="translate-x-0 inline-block mt-4 text-sm font-medium text-green-400 transition-transform duration-500 group-hover:translate-x-3">
                                                  <span onClick={handleOpen} className="cursor-pointer">
                                                       {page?.cta}
                                                  </span>
                                                  <ArrowForwardIcon className={dir === 'rtl' ? 'mr-1 rotate-180' : 'ml-1'} style={{ fontSize: '1rem' }} />
                                             </span>
                                        </div>
                                   </div>
                              </motion.div>
                         ))}
                    </motion.div>

                    <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.5 }}
                         className="w-full max-w-[1200px] px-4 mt-12"
                    >
                         <div className="bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                              <h2 className="text-2xl  text-green-700 mb-4">
                                   {withdrawal?.title}
                              </h2>
                              <p className="text-green-100 text-lg  leading-relaxed  text-justify">
                                   {withdrawal?.body1}
                              </p>
                              <p className="text-green-400 mt-3 ">
                                   {withdrawal?.highlight}
                              </p>
                         </div>
                    </motion.div>
               </main>
          </>
     )
}

export default Accounttypes

export async function getServerSideProps({ locale }) {
     return {
          props: {
               ...(await serverSideTranslations(locale, ['common', 'nav', 'footer', 'accTypes', 'auth'], i18nConfig)),
          },
     }
}
