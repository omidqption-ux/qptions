import React from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { Tabs, Tab, Box } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../next-i18next.config.cjs'
import SEOAlternates from '@/components/SEOAlternates'
import {
     FaChartLine,
     FaRobot,
     FaBrain,
     FaShieldAlt,
     FaBalanceScale,
     FaRocket,
} from 'react-icons/fa'
import { GiReceiveMoney } from 'react-icons/gi'
import { BsGraphUp, BsGraphUpArrow } from 'react-icons/bs'

export default function AITradingPage() {
     const { t, i18n } = useTranslation('AITrading')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

     const [selectedTab, setSelectedTab] = React.useState(0)
     const handleTabChange = (_e, v) => setSelectedTab(v)

     const seo = t('seo', { returnObjects: true })
     const tabs = t('tabs', { returnObjects: true })
     const labels = t('labels', { returnObjects: true })
     const plans = t('plans', { returnObjects: true }) || []
     const core = t('core', { returnObjects: true }) || []
     const advantages = t('advantages', { returnObjects: true }) || []

     const planIcons = [
          <FaShieldAlt key='con' className='text-orange-500 text-4xl mb-4' />,
          <GiReceiveMoney key='mod' className='text-orange-500 text-4xl mb-4' />,
          <FaRocket key='agg' className='text-orange-500 text-4xl mb-4' />,
     ]

     const strategyIconFor = (planIdx, stratIdx) => {
          if (planIdx === 0 && stratIdx === 0)
               return <BsGraphUp className='text-orange-500 mx-2' />
          if (planIdx === 0 && stratIdx === 1)
               return <FaBalanceScale className='text-orange-500 mx-2' />
          if (planIdx === 1 && stratIdx === 0)
               return <BsGraphUpArrow className='text-orange-500 mx-2' />
          if (planIdx === 2 && stratIdx === 0)
               return <FaRobot className='text-orange-500 mx-2' />
          return <FaBrain className='text-orange-500 mx-2' />
     }

     return (
          <>
               <Head>
                    <title>{seo?.title}</title>
                    <meta name='description' content={seo?.description} />
                    {seo?.keywords && <meta name='keywords' content={seo.keywords} />}
                    <meta property='og:type' content='website' />
                    <meta property='og:title' content={seo?.ogTitle || seo?.title} />
                    <meta property='og:description' content={seo?.ogDescription || seo?.description} />
                    {seo?.image && <meta property='og:image' content={seo.image} />}
                    {seo?.url && <meta property='og:url' content={seo.url} />}
                    <meta name='twitter:card' content='summary_large_image' />
                    <meta name='twitter:title' content={seo?.title} />
                    <meta name='twitter:description' content={seo?.description} />
                    {seo?.image && <meta name='twitter:image' content={seo.image} />}
               </Head>

               <SEOAlternates />

               <main
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className='text-lg leading-8 font-normal bg-linear-to-b from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start p-4 lg:p-12'
               >
                    {/* Hero */}
                    <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.8 }}
                         className='flex w-full text-center justify-center items-center py-20'
                    >
                         <div className='max-w-3xl'>
                              <h1 className='text-xl lg:text-4xl md:text-5xl font-bold text-green-500 mb-6'>
                                   {t('hero.title')}
                              </h1>
                              <p className={`text-lg leading-8 text-green-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                                   {t('hero.subtitle')}
                              </p>
                         </div>
                    </motion.div>

                    {/* Tabs + Plans */}
                    <div className='w-full max-w-[1200px] flex flex-col px-4 items-center justify-start'>
                         <Box className='relative' sx={{ width: '100%' }}>
                              <Tabs
                                   value={selectedTab}
                                   onChange={handleTabChange}
                                   className='mb-8'
                                   sx={{
                                        '& .MuiTab-root': {
                                             color: 'white',
                                             textTransform: 'none',
                                             fontSize: '1rem',
                                             minWidth: 'auto',
                                             padding: '12px 24px',
                                             '&.Mui-selected': { fontWeight: 'bold', color: '#00743f' },
                                        },
                                        '& .MuiTabs-indicator': { backgroundColor: '#00743f', height: 2 },
                                   }}
                              >
                                   <Tab label={tabs?.conservative} />
                                   <Tab label={tabs?.moderate} />
                                   <Tab label={tabs?.aggressive} />
                              </Tabs>
                              {plans.map((plan, index) => (
                                   <motion.div
                                        key={index}
                                        initial={{ opacity: 0 }}
                                        animate={{
                                             opacity: selectedTab === index ? 1 : 0,
                                             display: selectedTab === index ? 'block' : 'none',
                                        }}
                                        transition={{ duration: 0 }}
                                   >
                                        <div className='bg-linear-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'>
                                             <div className='flex items-center mb-4'>
                                                  {planIcons[index]}
                                                  <div className='mx-4'>
                                                       <h2 className='text-2xl font-normal text-green-700'>{plan.title}</h2>
                                                       <p className='text-lg text-green-100'>{plan.subtitle}</p>
                                                  </div>
                                             </div>
                                             <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                                  <div>
                                                       <h3 className='text-lg font-normal text-white mb-2'>{labels?.description}</h3>
                                                       <p className='text-green-100 text-base mb-4'>{plan.description}</p>
                                                       <div className='space-y-4'>
                                                            <div className='flex items-center'>
                                                                 <GiReceiveMoney className='text-orange-500 mx-2' />
                                                                 <span className='text-green-100'>{labels?.expectedReturns}:</span>
                                                                 <span className='text-orange-500 mx-2'>{plan.returns}</span>
                                                            </div>
                                                            <div className='flex items-center'>
                                                                 <FaShieldAlt className='text-orange-500 mx-2' />
                                                                 <span className='text-green-100'>{labels?.riskLevel}:</span>
                                                                 <span className='text-orange-500 mx-2'>{plan.risk}</span>
                                                            </div>
                                                            <div className='flex items-start'>
                                                                 <FaChartLine className='text-orange-500 mx-2 mt-1' />
                                                                 <span className='v w-[150px]'>{labels?.recommendedFor}:</span>
                                                                 <p className='text-green-100 mx-2'>{plan.recommended}</p>
                                                            </div>
                                                       </div>
                                                  </div>

                                                  <div>
                                                       <h3 className='text-lg font-normal text-white mb-4'>{labels?.strategiesUsed}</h3>
                                                       <div className='space-y-4'>
                                                            {(plan.strategies || []).map((strategy, i) => (
                                                                 <motion.div
                                                                      key={i}
                                                                      initial={{ opacity: 0, x: -20 }}
                                                                      animate={{ opacity: 1, x: 0 }}
                                                                      transition={{ delay: i * 0.08 }}
                                                                      className={` ${isRTL ? "border-r-2" : "border-l-2"} border-darkGrey/20 px-4 hover:border-orange-500 transition-colors duration-300`}
                                                                 >
                                                                      <div className='flex items-center'>
                                                                           {strategyIconFor(index, i)}
                                                                           <h4 className='text-white font-normal'>{strategy.title}</h4>
                                                                      </div>
                                                                      <p className='text-green-100  mt-1'>{strategy.description}</p>
                                                                 </motion.div>
                                                            ))}
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                   </motion.div>
                              ))}
                         </Box>
                         {/* Core Components */}
                         <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8 }}
                              className='mt-12'
                         >
                              <h2 className='text-2xl font-semibold text-green-700 mb-6'>{labels?.coreTitle}</h2>
                              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                   {core.map((c, idx) => (
                                        <motion.div
                                             key={idx}
                                             initial={{ opacity: 0, y: 20 }}
                                             whileInView={{ opacity: 1, y: 0 }}
                                             transition={{ duration: 0.5, delay: idx * 0.08 }}
                                             className='bg-linear-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'
                                        >
                                             <h3 className='text-lg font-normal mb-3 text-green-700'>{c.title}</h3>
                                             <p className='text-green-100 '>{c.description}</p>
                                        </motion.div>
                                   ))}
                              </div>
                         </motion.div>

                         {/* Advantages */}
                         <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.8 }}
                              className='mt-12'
                         >
                              <h2 className='text-2xl font-semibold text-green-700 mb-6'>{labels?.advantagesTitle}</h2>
                              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                   {advantages.map((a, idx) => (
                                        <motion.div
                                             key={idx}
                                             initial={{ opacity: 0, y: 20 }}
                                             whileInView={{ opacity: 1, y: 0 }}
                                             transition={{ duration: 0.5, delay: idx * 0.08 }}
                                             className='bg-linear-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20'
                                        >
                                             <h3 className='text-lg font-normal text-green-700 mb-3'>{a.title}</h3>
                                             <p className='text-green-100 '>{a.description}</p>
                                        </motion.div>
                                   ))}
                              </div>
                         </motion.div>
                    </div>
               </main>
          </>
     )
}

export async function getServerSideProps({ locale }) {
     return {
          props: {
               ...(await serverSideTranslations(
                    locale,
                    ['common', 'AITrading', 'nav', 'footer', 'auth'],
                    i18nConfig
               )),
          },
     }
}
