'use client'

import React from 'react'
import Link from 'next/link'
import dynamic from "next/dynamic"

import SlideUpSection from '@/components/SlideUp/SlideUp'
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

const Stochastic = () => {
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
                                             Ready to trade with Stochastic?
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
                                   Stochastic Strategy
                              </h1>
                              <p className='text-grey text-lg max-w-3xl mx-auto'>
                                   Master momentum and overbought/oversold
                                   trading with our comprehensive Stochastic
                                   analysis
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
                                                  Stochastic Oscillator is a
                                                  momentum indicator that
                                                  compares a security's closing
                                                  price to its price range over
                                                  a specific period.
                                             </span>
                                        </li>
                                        <li className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  •
                                             </span>
                                             <span className='text-grey'>
                                                  It consists of two lines: %K
                                                  (fast line) and %D (slow
                                                  line), which help identify
                                                  overbought and oversold
                                                  conditions.
                                             </span>
                                        </li>
                                        <li className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  •
                                             </span>
                                             <span className='text-grey'>
                                                  Stochastic is particularly
                                                  useful for identifying
                                                  potential trend reversals and
                                                  momentum shifts.
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
                                             How Stochastic Works
                                        </h2>
                                   </div>
                                   <div className='space-y-4'>
                                        <div className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  1.
                                             </span>
                                             <div>
                                                  <h3 className='text-white font-semibold mb-1'>
                                                       %K Line (Fast Line)
                                                  </h3>
                                                  <p className='text-grey'>
                                                       Measures the current
                                                       price relative to the
                                                       high-low range over a
                                                       specific period,
                                                       typically 14 periods.
                                                  </p>
                                             </div>
                                        </div>
                                        <div className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  2.
                                             </span>
                                             <div>
                                                  <h3 className='text-white font-semibold mb-1'>
                                                       %D Line (Slow Line)
                                                  </h3>
                                                  <p className='text-grey'>
                                                       A 3-period moving average
                                                       of %K, used to generate
                                                       trading signals and
                                                       reduce false signals.
                                                  </p>
                                             </div>
                                        </div>
                                        <div className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  3.
                                             </span>
                                             <div>
                                                  <h3 className='text-white font-semibold mb-1'>
                                                       Overbought/Oversold
                                                       Levels
                                                  </h3>
                                                  <p className='text-grey'>
                                                       Readings above 80
                                                       indicate overbought
                                                       conditions, while
                                                       readings below 20
                                                       indicate oversold
                                                       conditions.
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
                                                  1. Overbought/Oversold Trading
                                             </h3>
                                             <ul className='space-y-3'>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Buy when Stochastic
                                                            crosses above 20
                                                            (oversold) and sell
                                                            when it crosses
                                                            below 80
                                                            (overbought).
                                                       </span>
                                                  </li>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Use additional
                                                            confirmation from
                                                            price action or
                                                            other indicators.
                                                       </span>
                                                  </li>
                                             </ul>
                                        </div>

                                        <div>
                                             <h3 className='text-xl font-semibold text-white mb-3'>
                                                  2. Stochastic Crossover
                                             </h3>
                                             <ul className='space-y-3'>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Buy when %K crosses
                                                            above %D in oversold
                                                            territory.
                                                       </span>
                                                  </li>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Sell when %K crosses
                                                            below %D in
                                                            overbought
                                                            territory.
                                                       </span>
                                                  </li>
                                             </ul>
                                        </div>

                                        <div>
                                             <h3 className='text-xl font-semibold text-white mb-3'>
                                                  3. Divergence Trading
                                             </h3>
                                             <ul className='space-y-3'>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Look for bullish
                                                            divergence when
                                                            price makes lower
                                                            lows but Stochastic
                                                            makes higher lows.
                                                       </span>
                                                  </li>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Look for bearish
                                                            divergence when
                                                            price makes higher
                                                            highs but Stochastic
                                                            makes lower highs.
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
                                                  Stochastic can remain in
                                                  overbought/oversold territory
                                                  for extended periods during
                                                  strong trends.
                                             </span>
                                        </li>
                                        <li className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  •
                                             </span>
                                             <span className='text-grey'>
                                                  False signals can occur in
                                                  ranging or choppy markets.
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

export default Stochastic
