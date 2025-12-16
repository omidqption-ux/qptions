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

const BollingerBands = () => {
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
                                             Ready to trade with Bollinger
                                             Bands?
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
                                   Bollinger Bands Strategy
                              </h1>
                              <p className='text-grey text-lg max-w-3xl mx-auto'>
                                   Master volatility and price action trading
                                   with our comprehensive Bollinger Bands
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
                                                  Bollinger Bands are a
                                                  volatility indicator that
                                                  consists of a middle band
                                                  (SMA) and two outer bands that
                                                  are standard deviations away
                                                  from the middle band.
                                             </span>
                                        </li>
                                        <li className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  •
                                             </span>
                                             <span className='text-grey'>
                                                  The bands expand during
                                                  periods of high volatility and
                                                  contract during periods of low
                                                  volatility.
                                             </span>
                                        </li>
                                        <li className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  •
                                             </span>
                                             <span className='text-grey'>
                                                  Bollinger Bands are
                                                  particularly useful for
                                                  identifying
                                                  overbought/oversold conditions
                                                  and potential trend reversals.
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
                                             How Bollinger Bands Work
                                        </h2>
                                   </div>
                                   <div className='space-y-4'>
                                        <div className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  1.
                                             </span>
                                             <div>
                                                  <h3 className='text-white font-semibold mb-1'>
                                                       Middle Band
                                                  </h3>
                                                  <p className='text-grey'>
                                                       A 20-period simple moving
                                                       average that represents
                                                       the average price over
                                                       the specified period.
                                                  </p>
                                             </div>
                                        </div>
                                        <div className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  2.
                                             </span>
                                             <div>
                                                  <h3 className='text-white font-semibold mb-1'>
                                                       Upper Band
                                                  </h3>
                                                  <p className='text-grey'>
                                                       The middle band plus two
                                                       standard deviations,
                                                       indicating potential
                                                       resistance levels.
                                                  </p>
                                             </div>
                                        </div>
                                        <div className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  3.
                                             </span>
                                             <div>
                                                  <h3 className='text-white font-semibold mb-1'>
                                                       Lower Band
                                                  </h3>
                                                  <p className='text-grey'>
                                                       The middle band minus two
                                                       standard deviations,
                                                       indicating potential
                                                       support levels.
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
                                                  1. Band Breakout
                                             </h3>
                                             <ul className='space-y-3'>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Buy when price
                                                            breaks above the
                                                            upper band with
                                                            strong momentum.
                                                       </span>
                                                  </li>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Sell when price
                                                            breaks below the
                                                            lower band with
                                                            strong momentum.
                                                       </span>
                                                  </li>
                                             </ul>
                                        </div>

                                        <div>
                                             <h3 className='text-xl font-semibold text-white mb-3'>
                                                  2. Mean Reversion
                                             </h3>
                                             <ul className='space-y-3'>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Buy when price
                                                            touches or crosses
                                                            below the lower band
                                                            in an uptrend.
                                                       </span>
                                                  </li>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Sell when price
                                                            touches or crosses
                                                            above the upper band
                                                            in a downtrend.
                                                       </span>
                                                  </li>
                                             </ul>
                                        </div>

                                        <div>
                                             <h3 className='text-xl font-semibold text-white mb-3'>
                                                  3. Squeeze
                                             </h3>
                                             <ul className='space-y-3'>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Look for periods of
                                                            low volatility when
                                                            the bands contract
                                                            (squeeze).
                                                       </span>
                                                  </li>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Prepare for
                                                            potential breakouts
                                                            when the squeeze
                                                            ends and volatility
                                                            increases.
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
                                                  Bollinger Bands can give false
                                                  signals in trending markets
                                                  when price moves strongly in
                                                  one direction.
                                             </span>
                                        </li>
                                        <li className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  •
                                             </span>
                                             <span className='text-grey'>
                                                  They work best in ranging
                                                  markets and may be less
                                                  effective during strong
                                                  trends.
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

export default BollingerBands
