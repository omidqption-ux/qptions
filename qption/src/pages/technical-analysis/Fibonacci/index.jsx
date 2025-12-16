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

const Fibonacci = () => {
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
                                             Ready to trade with Fibonacci?
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
                                   Fibonacci Strategy
                              </h1>
                              <p className='text-grey text-lg max-w-3xl mx-auto'>
                                   Master price retracement and extension
                                   trading with our comprehensive Fibonacci
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
                                                  Fibonacci retracement levels
                                                  are horizontal lines that
                                                  indicate where support and
                                                  resistance are likely to
                                                  occur.
                                             </span>
                                        </li>
                                        <li className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  •
                                             </span>
                                             <span className='text-grey'>
                                                  They are based on the
                                                  Fibonacci sequence and ratios
                                                  (23.6%, 38.2%, 50%, 61.8%, and
                                                  78.6%).
                                             </span>
                                        </li>
                                        <li className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  •
                                             </span>
                                             <span className='text-grey'>
                                                  Fibonacci levels are
                                                  particularly useful for
                                                  identifying potential reversal
                                                  points in trending markets.
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
                                             How Fibonacci Works
                                        </h2>
                                   </div>
                                   <div className='space-y-4'>
                                        <div className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  1.
                                             </span>
                                             <div>
                                                  <h3 className='text-white font-semibold mb-1'>
                                                       Retracement Levels
                                                  </h3>
                                                  <p className='text-grey'>
                                                       Used to identify
                                                       potential support levels
                                                       during a pullback in an
                                                       uptrend or resistance
                                                       levels during a rally in
                                                       a downtrend.
                                                  </p>
                                             </div>
                                        </div>
                                        <div className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  2.
                                             </span>
                                             <div>
                                                  <h3 className='text-white font-semibold mb-1'>
                                                       Extension Levels
                                                  </h3>
                                                  <p className='text-grey'>
                                                       Used to identify
                                                       potential profit targets
                                                       beyond the initial trend
                                                       move (161.8%, 261.8%,
                                                       423.6%).
                                                  </p>
                                             </div>
                                        </div>
                                        <div className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  3.
                                             </span>
                                             <div>
                                                  <h3 className='text-white font-semibold mb-1'>
                                                       Time Zones
                                                  </h3>
                                                  <p className='text-grey'>
                                                       Vertical lines that
                                                       indicate potential
                                                       reversal points based on
                                                       the Fibonacci sequence.
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
                                                  1. Retracement Trading
                                             </h3>
                                             <ul className='space-y-3'>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Buy at 38.2% or
                                                            61.8% retracement
                                                            levels in an uptrend
                                                            with confirmation
                                                            from other
                                                            indicators.
                                                       </span>
                                                  </li>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Sell at 38.2% or
                                                            61.8% retracement
                                                            levels in a
                                                            downtrend with
                                                            confirmation from
                                                            other indicators.
                                                       </span>
                                                  </li>
                                             </ul>
                                        </div>

                                        <div>
                                             <h3 className='text-xl font-semibold text-white mb-3'>
                                                  2. Extension Trading
                                             </h3>
                                             <ul className='space-y-3'>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Set profit targets
                                                            at 161.8% or 261.8%
                                                            extension levels.
                                                       </span>
                                                  </li>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Use extension levels
                                                            to identify
                                                            potential reversal
                                                            points after strong
                                                            trend moves.
                                                       </span>
                                                  </li>
                                             </ul>
                                        </div>

                                        <div>
                                             <h3 className='text-xl font-semibold text-white mb-3'>
                                                  3. Multiple Time Frame
                                                  Analysis
                                             </h3>
                                             <ul className='space-y-3'>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Use Fibonacci levels
                                                            on higher time
                                                            frames to identify
                                                            major support and
                                                            resistance levels.
                                                       </span>
                                                  </li>
                                                  <li className='flex items-start gap-3'>
                                                       <span className='text-green-500 mt-1'>
                                                            •
                                                       </span>
                                                       <span className='text-grey'>
                                                            Look for confluence
                                                            between Fibonacci
                                                            levels and other
                                                            technical
                                                            indicators.
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
                                                  Fibonacci levels work best in
                                                  trending markets and may be
                                                  less effective in ranging
                                                  markets.
                                             </span>
                                        </li>
                                        <li className='flex items-start gap-3'>
                                             <span className='text-green-500 mt-1'>
                                                  •
                                             </span>
                                             <span className='text-grey'>
                                                  Different traders may draw
                                                  Fibonacci levels differently,
                                                  leading to subjective
                                                  interpretations.
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

export default Fibonacci
