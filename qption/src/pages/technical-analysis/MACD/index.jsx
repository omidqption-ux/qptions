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

const MACD = () => {
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
                                             Ready to trade with MACD?
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
                                   MACD Strategy
                              </h1>
                              <p className='text-grey text-lg max-w-3xl mx-auto'>
                                   Master trend and momentum trading with our
                                   comprehensive MACD analysis
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
                                                  MACD (Moving Average
                                                  Convergence Divergence) is a
                                                  trend-following momentum
                                                  indicator that shows the
                                                  relationship between two
                                                  moving averages of a
                                                  security's price.
                                             </span>
                                        </li>
                                        <li className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  •
                                             </span>
                                             <span className='text-grey'>
                                                  It consists of three
                                                  components: the MACD line,
                                                  signal line, and histogram,
                                                  which together help identify
                                                  trend direction and momentum.
                                             </span>
                                        </li>
                                        <li className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  •
                                             </span>
                                             <span className='text-grey'>
                                                  MACD is particularly useful
                                                  for identifying trend
                                                  reversals and momentum shifts
                                                  in the market.
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
                                             How MACD Works
                                        </h2>
                                   </div>
                                   <div className='space-y-4'>
                                        <div className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  1.
                                             </span>
                                             <div>
                                                  <h3 className='text-white font-semibold mb-1'>
                                                       MACD Line
                                                  </h3>
                                                  <p className='text-grey'>
                                                       Calculated by subtracting
                                                       the 26-period EMA from
                                                       the 12-period EMA,
                                                       showing the short-term
                                                       momentum.
                                                  </p>
                                             </div>
                                        </div>
                                        <div className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  2.
                                             </span>
                                             <div>
                                                  <h3 className='text-white font-semibold mb-1'>
                                                       Signal Line
                                                  </h3>
                                                  <p className='text-grey'>
                                                       A 9-period EMA of the
                                                       MACD line, used to
                                                       generate trading signals.
                                                  </p>
                                             </div>
                                        </div>
                                        <div className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  3.
                                             </span>
                                             <div>
                                                  <h3 className='text-white font-semibold mb-1'>
                                                       Histogram
                                                  </h3>
                                                  <p className='text-grey'>
                                                       Represents the difference
                                                       between the MACD line and
                                                       signal line, showing
                                                       momentum strength.
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
                                                  1. MACD Crossover
                                             </h3>
                                             <ul className='space-y-3'>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Buy when the MACD
                                                            line crosses above
                                                            the signal line
                                                            (bullish crossover).
                                                       </span>
                                                  </li>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Sell when the MACD
                                                            line crosses below
                                                            the signal line
                                                            (bearish crossover).
                                                       </span>
                                                  </li>
                                             </ul>
                                        </div>

                                        <div>
                                             <h3 className='text-xl font-semibold text-white mb-3'>
                                                  2. Zero Line Crossover
                                             </h3>
                                             <ul className='space-y-3'>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Buy when the MACD
                                                            line crosses above
                                                            zero, indicating a
                                                            potential uptrend.
                                                       </span>
                                                  </li>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Sell when the MACD
                                                            line crosses below
                                                            zero, indicating a
                                                            potential downtrend.
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
                                                            lows but MACD makes
                                                            higher lows.
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
                                                            highs but MACD makes
                                                            lower highs.
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
                                                  MACD can give false signals in
                                                  choppy or sideways markets.
                                             </span>
                                        </li>
                                        <li className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  •
                                             </span>
                                             <span className='text-grey'>
                                                  It works best in trending
                                                  markets and may lag in
                                                  fast-moving markets.
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

export default MACD
