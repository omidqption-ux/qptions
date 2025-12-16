import React, { useState } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import {
     FaUserFriends,
     FaUserTie,
     FaCrown,
     FaChartLine,
     FaMoneyBillWave,
     FaNetworkWired,
     FaGift,
     FaTrophy,
     FaShieldAlt,
     FaArrowRight,
} from 'react-icons/fa'
import { GiReceiveMoney, GiGrowth, GiMoneyStack } from 'react-icons/gi'
import { BsGraphUpArrow, BsCashStack, BsCheckCircle } from 'react-icons/bs'
import { Tabs, Tab, Box } from '@mui/material'
import dynamic from 'next/dynamic'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../next-i18next.config.cjs'
import SEOAlternates from '@/components/SEOAlternates'

const Registeration = dynamic(
     () => import('../../components/RegisterationModal/Registeration'),
     { ssr: false }
)

export default function Affiliate() {
     const { t, i18n } = useTranslation('affiliate')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     const [selectedTab, setSelectedTab] = useState(0)
     const handleTabChange = (_event, newValue) => setSelectedTab(newValue)
     const [openLogin, setOpenLogin] = useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     // Helpers to make i18n object-or-array safe
     const toArray = (v) => (Array.isArray(v) ? v : v && typeof v === 'object' ? Object.values(v) : [])

     // i18n payloads
     const seo = t('seo', { returnObjects: true })
     const tabs = t('tabs', { returnObjects: true })
     const labels = t('labels', { returnObjects: true })
     const hero = t('hero', { returnObjects: true })

     const plans = toArray(t('plans', { returnObjects: true }))
     const benefits = toArray(t('benefits', { returnObjects: true }))
     const stats = toArray(t('stats', { returnObjects: true }))

     // Icons are UI-level, not part of translations
     const planIcons = [
          <FaUserFriends key='basic' className='text-green-500 text-6xl' />,
          <FaUserTie key='pro' className='text-green-500 text-6xl' />,
          <FaCrown key='elite' className='text-green-500 text-6xl' />,
     ]

     const featureIconFor = (planIdx, featIdx) => {
          if (planIdx === 0 && featIdx === 0) return <GiReceiveMoney className='text-green-500 text-2xl' />
          if (planIdx === 0 && featIdx === 1) return <FaGift className='text-green-500 text-2xl' />
          if (planIdx === 1 && featIdx === 1) return <FaNetworkWired className='text-green-500 text-2xl' />
          if (planIdx === 1 && featIdx === 3) return <BsGraphUpArrow className='text-green-500 text-2xl' />
          if (planIdx === 2 && featIdx === 2) return <BsCashStack className='text-green-500 text-2xl' />
          if (planIdx === 2 && featIdx === 4) return <FaShieldAlt className='text-green-500 text-2xl' />
          if (featIdx === 2) return <FaTrophy className='text-green-500 text-2xl' />
          return <FaChartLine className='text-green-500 text-2xl' />
     }

     const statIcons = [
          <FaUserFriends key='s1' className='text-green-500 text-3xl' />,
          <GiMoneyStack key='s2' className='text-green-500 text-3xl' />,
          <BsCheckCircle key='s3' className='text-green-500 text-3xl' />,
     ]

     const benefitIcons = [
          <GiGrowth key='b1' className='text-green-500 text-4xl' />,
          <BsGraphUpArrow key='b2' className='text-green-500 text-4xl' />,
          <FaTrophy key='b3' className='text-green-500 text-4xl' />,
     ]

     return (
          <>
               <Head>
                    <title>{seo?.title}</title>
                    <meta name='description' content={seo?.description} />
                    {seo?.keywords && <meta name='keywords' content={seo.keywords} />}
                    <meta property='og:type' content='website' />
                    <meta property='og:title' content={seo?.ogTitle || seo?.title} />
                    <meta property='og:description' content={seo?.ogDescription || seo?.description} />
                    {seo?.url && <meta property='og:url' content={seo.url} />}
                    {seo?.image && <meta property='og:image' content={seo.image} />}
                    <meta name='twitter:card' content='summary_large_image' />
                    <meta name='twitter:title' content={seo?.title} />
                    <meta name='twitter:description' content={seo?.description} />
                    {seo?.image && <meta name='twitter:image' content={seo.image} />}
                    {seo?.url && <link rel='canonical' href={seo.url} />}
                    <meta name='robots' content='index,follow' />
               </Head>

               <SEOAlternates />

               <main
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className='font-normal min-h-screen bg-linear-to-br from-[#142B47]  to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12'
               >
                    <Registeration handleClose={handleClose} open={openLogin} isRegister={true} />

                    {/* Hero */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='text-center mb-4 md:mb-8'>
                         <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-green-500 mb-2'>
                              {hero?.title}
                         </h1>
                         <p className={`text-green-100 text-base md:text-lg max-w-2xl mx-auto px-4 text-center`}>
                              {hero?.subtitle}
                         </p>
                    </motion.div>

                    {/* Stats */}
                    <div className='w-full max-w-[1200px] px-2 md:px-4'>
                         <div className='grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8'>
                              {stats.map((stat, index) => (
                                   <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className='bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'
                                   >
                                        <div className='flex items-center justify-between'>
                                             <div>
                                                  <h3 className='text-green-300 text-sm md:text-base'>{stat.title}</h3>
                                                  <p className='text-green-500 text-lg md:text-xl font-bold'>{stat.value}</p>
                                             </div>
                                             <div className='bg-green-500/20 p-2 rounded-lg'>{statIcons[index]}</div>
                                        </div>
                                   </motion.div>
                              ))}
                         </div>

                         {/* Tabs */}
                         <Box className='w-full'>
                              <Tabs
                                   value={selectedTab}
                                   onChange={handleTabChange}
                                   className='mb-8'
                                   sx={{
                                        '& .MuiTab-root': {
                                             textTransform: 'none',
                                             fontSize: '1.1rem',
                                             minWidth: 'auto',
                                             padding: '12px 24px',
                                             '&.Mui-selected': { fontWeight: 'bold' },
                                        },
                                        '& .MuiTabs-indicator': { backgroundColor: 'rgb(34 197 94)', height: 3 },
                                   }}
                              >
                                   <Tab className='text-green-100' label={tabs?.basic} />
                                   <Tab className='text-green-100' label={tabs?.pro} />
                                   <Tab className='text-green-100' label={tabs?.elite} />
                              </Tabs>

                              {/* Plans */}
                              <div>
                                   {plans.map((plan, index) => (
                                        <motion.div
                                             key={index}
                                             initial={{ opacity: 0 }}
                                             animate={{
                                                  opacity: selectedTab === index ? 1 : 0,
                                                  display: selectedTab === index ? 'block' : 'none',
                                             }}
                                             transition={{ duration: 0.3 }}
                                        >
                                             <div className={`${plan.gradient} backdrop-blur-3xl rounded-2xl p-4 md:p-6 border border-green-500/20 shadow-lg`}>
                                                  <div className='flex items-start mb-3 md:mb-4'>
                                                       <div className='bg-green-500/20 p-2 md:p-3 rounded-xl mx-3 md:mx-4'>{planIcons[index]}</div>
                                                       <div>
                                                            <h2 className='text-lg md:text-xl font-bold text-green-100 mb-1'>{plan.title}</h2>
                                                            <p className='text-green-200 text-sm md:text-base'>{plan.subtitle}</p>
                                                       </div>
                                                  </div>

                                                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4'>
                                                       <div>
                                                            <p className='text-blue-100 text-sm md:text-base mb-3 md:mb-4'>{plan.description}</p>
                                                            <div className='space-y-2'>
                                                                 <div className='flex items-center bg-green-500/10 p-2 md:p-3 rounded-xl'>
                                                                      <GiReceiveMoney className='text-green-500 text-lg md:text-xl mx-2 md:mx-3' />
                                                                      <div>
                                                                           <span className='text-green-100 text-sm md:text-base'>{labels?.commission}: </span>
                                                                           <span className='text-green-500 font-bold mx-1'>{plan.commission}</span>
                                                                      </div>
                                                                 </div>
                                                                 <div className='flex items-center bg-green-500/10 p-2 md:p-3 rounded-xl'>
                                                                      <FaMoneyBillWave className='text-green-500 text-lg md:text-xl mx-2 md:mx-3' />
                                                                      <div>
                                                                           <span className='text-green-100 text-sm md:text-base'>{labels?.incomePotential}: </span>
                                                                           <span className='text-green-500 font-bold mx-1'>{plan.income}</span>
                                                                      </div>
                                                                 </div>
                                                            </div>
                                                       </div>

                                                       <div>
                                                            <h3 className='text-base md:text-lg font-bold text-green-100 mb-3 md:mb-4'>{labels?.featuresTitle}</h3>
                                                            <div className='space-y-2'>
                                                                 {toArray(plan.features).map((feature, i) => (
                                                                      <motion.div
                                                                           key={i}
                                                                           initial={{ opacity: 0, x: -20 }}
                                                                           animate={{ opacity: 1, x: 0 }}
                                                                           transition={{ delay: i * 0.1 }}
                                                                           className='bg-green-700/20 p-2 md:p-3 rounded-xl hover:bg-green-500/10 transition-colors duration-300'
                                                                      >
                                                                           <div className='flex items-center'>
                                                                                <div className='bg-green-500/20 p-2 rounded-lg mx-2 md:mx-3'>{featureIconFor(index, i)}</div>
                                                                                <div>
                                                                                     <h4 className='text-green-300 font-bold text-xs md:text-sm'>{feature.title}</h4>
                                                                                     <p className='text-green-100 text-xs mt-1'>{feature.description}</p>
                                                                                </div>
                                                                           </div>
                                                                      </motion.div>
                                                                 ))}
                                                            </div>
                                                       </div>
                                                  </div>
                                             </div>
                                        </motion.div>
                                   ))}
                              </div>
                         </Box>

                         {/* Benefits */}
                         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className='mt-6 md:mt-12'>
                              <h2 className='text-xl md:text-2xl font-semibold text-green-700 my-5 md:mb-4 text-center'>
                                   {labels?.benefitsTitle}
                              </h2>
                              <div className='grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4'>
                                   {benefits.map((benefit, index) => (
                                        <motion.div
                                             key={index}
                                             initial={{ opacity: 0, y: 20 }}
                                             animate={{ opacity: 1, y: 0 }}
                                             transition={{ delay: 0.2 * index }}
                                             className={`${benefit.gradient} backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20`}
                                        >
                                             <div className='bg-green-500/20 p-2 md:p-3 rounded-xl w-fit mb-2'>
                                                  {benefitIcons[index]}
                                             </div>
                                             <h3 className='text-base md:text-lg font-bold text-green-700 mb-2'>{benefit.title}</h3>
                                             <p className='text-green-100 text-xs md:text-sm'>{benefit.description}</p>
                                        </motion.div>
                                   ))}
                              </div>
                         </motion.div>

                         {/* CTA */}
                         <motion.div dir='ltr' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className='mt-6 group relative overflow-hidden rounded-lg  bg-linear-to-br  p-0.5 hover:scale-[1.02] transition-all duration-300'>
                              <span className='translate-x-0 inline-block  mt-4 text-sm font-medium text-green-400 transition-transform duration-500 group-hover:translate-x-3 '>
                                   <button onClick={handleOpen} className='bg-linear-to-r cursor-pointer from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-xl transition-all duration-300 flex items-center mx-auto shadow-lg hover:shadow-green-500/20'>
                                        <span className='flex items-center text-green-300'>
                                             {t('cta.join')}
                                             <FaArrowRight className='mx-2' />
                                        </span>
                                   </button>
                              </span>
                         </motion.div>
                    </div>
               </main>
          </>
     )
}

export async function getServerSideProps({ locale }) {
     return {
          props: {
               ...(await serverSideTranslations(locale, ['common', 'affiliate', 'nav', 'footer', 'auth'], i18nConfig)),
          },
     }
}
