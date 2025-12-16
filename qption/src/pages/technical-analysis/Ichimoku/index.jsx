'use client'

import React from 'react'
import Link from 'next/link'
import SlideUpSection from '@/components/SlideUp/SlideUp'
import dynamic from "next/dynamic";

const Registeration = dynamic(() => import("@/components/RegisterationModal/Registeration"), { ssr: false })
import { Button } from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import { motion } from 'framer-motion'
import {
     FaChartLine,
     FaInfoCircle,
     FaLightbulb,
     FaExclamationTriangle,
} from 'react-icons/fa'

const Ichimoku = () => {
     const [openLogin, setOpenLogin] = React.useState(false)
     const handleOpen = () => setOpenLogin(true)
     const handleClose = () => setOpenLogin(false)

     return (
          <SlideUpSection>
               <div className='min-h-screen bg-linear-to-b from-darkEnd via-darkStart to-darkStart w-full flex flex-col items-center py-12'>
                    <div className='w-full max-w-7xl px-4'>
                         <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className='mb-8'
                         >
                              <Link
                                   href='/technical-analysis'
                                   className='text-green-500 hover:text-green-400 transition-colors duration-300 flex items-center gap-2'
                              >
                                   <FaChartLine className='text-lg' />
                                   <span className='text-lg'>
                                        Technical Analysis
                                   </span>
                              </Link>
                         </motion.div>

                         <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className='mb-8'
                         >
                              <div className='bg-black/40 backdrop-blur-3xl rounded-2xl p-6 border border-green-500/20 shadow-lg'>
                                   <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                                        <div className='text-white text-lg'>
                                             Ready to trade with Ichimoku?
                                        </div>
                                        <Button
                                             onClick={handleOpen}
                                             className='normal-case bg-green-500 hover:bg-green-600 text-white transition-colors duration-300'
                                             variant='contained'
                                             size='medium'
                                        >
                                             <HowToRegIcon className='mr-2' />
                                             Start Trading
                                        </Button>
                                   </div>
                              </div>
                         </motion.div>

                         <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className='text-center mb-12'
                         >
                              <h1 className='text-3xl md:text-4xl font-bold text-white mb-4'>
                                   Ichimoku Strategy
                              </h1>
                              <p className='text-grey text-lg max-w-3xl mx-auto'>
                                   Master trend following and momentum trading
                                   with our comprehensive Ichimoku analysis
                              </p>
                         </motion.div>

                         <div className='space-y-8'>
                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.4 }}
                                   className='bg-black/40 backdrop-blur-3xl rounded-2xl p-6 border border-green-500/20 shadow-lg'
                              >
                                   <div className='flex items-center gap-3 mb-4'>
                                        <FaInfoCircle className='text-green-500 text-2xl' />
                                        <h2 className='text-2xl font-bold text-white'>
                                             Overview
                                        </h2>
                                   </div>
                                   <ul className='space-y-4'>
                                        <li className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  •
                                             </span>
                                             <span className='text-grey'>
                                                  Ichimoku Cloud is a
                                                  comprehensive indicator that
                                                  provides information about
                                                  support/resistance, trend
                                                  direction, momentum, and
                                                  trading signals.
                                             </span>
                                        </li>
                                        <li className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  •
                                             </span>
                                             <span className='text-grey'>
                                                  It consists of five
                                                  components: Tenkan-sen,
                                                  Kijun-sen, Senkou Span A,
                                                  Senkou Span B, and Chikou
                                                  Span.
                                             </span>
                                        </li>
                                        <li className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  •
                                             </span>
                                             <span className='text-grey'>
                                                  The cloud (Kumo) is
                                                  particularly useful for
                                                  identifying trend direction
                                                  and potential
                                                  support/resistance levels.
                                             </span>
                                        </li>
                                   </ul>
                              </motion.div>

                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.5 }}
                                   className='bg-black/40 backdrop-blur-3xl rounded-2xl p-6 border border-green-500/20 shadow-lg'
                              >
                                   <div className='flex items-center gap-3 mb-4'>
                                        <FaLightbulb className='text-green-500 text-2xl' />
                                        <h2 className='text-2xl font-bold text-white'>
                                             How Ichimoku Works
                                        </h2>
                                   </div>
                                   <div className='space-y-4'>
                                        <div className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  1.
                                             </span>
                                             <div>
                                                  <h3 className='text-white font-semibold mb-1'>
                                                       Tenkan-sen (Conversion
                                                       Line)
                                                  </h3>
                                                  <p className='text-grey'>
                                                       A 9-period moving average
                                                       that shows short-term
                                                       momentum and potential
                                                       trend reversals.
                                                  </p>
                                             </div>
                                        </div>
                                        <div className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  2.
                                             </span>
                                             <div>
                                                  <h3 className='text-white font-semibold mb-1'>
                                                       Kijun-sen (Base Line)
                                                  </h3>
                                                  <p className='text-grey'>
                                                       A 26-period moving
                                                       average that shows
                                                       medium-term momentum and
                                                       potential
                                                       support/resistance
                                                       levels.
                                                  </p>
                                             </div>
                                        </div>
                                        <div className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  3.
                                             </span>
                                             <div>
                                                  <h3 className='text-white font-semibold mb-1'>
                                                       Senkou Span A & B
                                                       (Leading Spans)
                                                  </h3>
                                                  <p className='text-grey'>
                                                       Form the cloud (Kumo) and
                                                       indicate future
                                                       support/resistance
                                                       levels.
                                                  </p>
                                             </div>
                                        </div>
                                        <div className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  4.
                                             </span>
                                             <div>
                                                  <h3 className='text-white font-semibold mb-1'>
                                                       Chikou Span (Lagging
                                                       Span)
                                                  </h3>
                                                  <p className='text-grey'>
                                                       Shows the current closing
                                                       price plotted 26 periods
                                                       back, helping to confirm
                                                       trend direction.
                                                  </p>
                                             </div>
                                        </div>
                                   </div>
                              </motion.div>

                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.6 }}
                                   className='bg-black/40 backdrop-blur-3xl rounded-2xl p-6 border border-green-500/20 shadow-lg'
                              >
                                   <div className='flex items-center gap-3 mb-4'>
                                        <FaChartLine className='text-green-500 text-2xl' />
                                        <h2 className='text-2xl font-bold text-white'>
                                             Key Strategies
                                        </h2>
                                   </div>
                                   <div className='space-y-6'>
                                        <div>
                                             <h3 className='text-xl font-semibold text-white mb-3'>
                                                  1. Cloud Breakout
                                             </h3>
                                             <ul className='space-y-3'>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Buy when price
                                                            breaks above the
                                                            cloud in an uptrend.
                                                       </span>
                                                  </li>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Sell when price
                                                            breaks below the
                                                            cloud in a
                                                            downtrend.
                                                       </span>
                                                  </li>
                                             </ul>
                                        </div>

                                        <div>
                                             <h3 className='text-xl font-semibold text-white mb-3'>
                                                  2. TK Cross
                                             </h3>
                                             <ul className='space-y-3'>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Buy when Tenkan-sen
                                                            crosses above
                                                            Kijun-sen in an
                                                            uptrend.
                                                       </span>
                                                  </li>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Sell when Tenkan-sen
                                                            crosses below
                                                            Kijun-sen in a
                                                            downtrend.
                                                       </span>
                                                  </li>
                                             </ul>
                                        </div>

                                        <div>
                                             <h3 className='text-xl font-semibold text-white mb-3'>
                                                  3. Kumo Twist
                                             </h3>
                                             <ul className='space-y-3'>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Look for potential
                                                            trend reversals when
                                                            Senkou Span A
                                                            crosses Senkou Span
                                                            B.
                                                       </span>
                                                  </li>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Use Chikou Span to
                                                            confirm the trend
                                                            direction.
                                                       </span>
                                                  </li>
                                             </ul>
                                        </div>
                                   </div>
                              </motion.div>

                              <motion.div
                                   initial={{ opacity: 0, y: 20 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.7 }}
                                   className='bg-black/40 backdrop-blur-3xl rounded-2xl p-6 border border-green-500/20 shadow-lg'
                              >
                                   <div className='flex items-center gap-3 mb-4'>
                                        <FaExclamationTriangle className='text-green-500 text-2xl' />
                                        <h2 className='text-2xl font-bold text-white'>
                                             Limitations
                                        </h2>
                                   </div>
                                   <ul className='space-y-4'>
                                        <li className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  •
                                             </span>
                                             <span className='text-grey'>
                                                  Ichimoku can give false
                                                  signals in ranging or choppy
                                                  markets.
                                             </span>
                                        </li>
                                        <li className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  •
                                             </span>
                                             <span className='text-grey'>
                                                  It works best on higher time
                                                  frames and may be less
                                                  effective on shorter time
                                                  frames.
                                             </span>
                                        </li>
                                   </ul>
                              </motion.div>
                         </div>
                    </div>
                    <Registeration
                         handleClose={handleClose}
                         open={openLogin}
                         isRegister={true}
                    />
               </div>
          </SlideUpSection>
     )
}

export default Ichimoku
