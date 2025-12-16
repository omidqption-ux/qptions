import React, { useEffect, useState, useRef } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import {
     setDepositMethod,
     setPaymentMethods,
} from '../../../../redux/slices/depositSlice'
import axiosInstance from '../../../../network/axios'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import PaymentMethod from '../../../../components/PaymentMethod/PaymentMethod'
import Accordion from '../../../../components/Accordion/Accordion'
import StarIcon from '@mui/icons-material/Star'
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin'
import LocalAtmIcon from '@mui/icons-material/LocalAtm'
import { Button } from '@mui/material'

const DepositStepOne = ({ handleNext }) => {
     const dispatch = useDispatch()
     const [currencyLoading, setCurrencyLoading] = React.useState(false)
     const [selectedMethod, setSelectedMethod] = useState(null)
     const [displayedCryptos, setDisplayedCryptos] = useState(24)
     const { paymentMethods } = useSelector((store) => store.deposit)
     const lastCryptoRef = useRef(null)

     const setPaymentMethod = (method) => {
          setSelectedMethod(method.code)
          dispatch(setDepositMethod(method))
          handleNext()
     }

     const getCurrencies = async () => {
          try {
               setCurrencyLoading(true)
               const coinsRes = await axiosInstance.get('deposit/getCoins')
               dispatch(
                    setPaymentMethods({ paymentMethods: coinsRes.currencies })
               )
          } catch (e) {
               toast.error(e.message)
          } finally {
               setCurrencyLoading(false)
          }
     }
     useEffect(() => {
          if (lastCryptoRef.current) {
               lastCryptoRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
               })
          }
     }, [displayedCryptos])
     useEffect(() => {
          getCurrencies()
     }, [])

     const loadMoreCryptos = (e) => {
          setDisplayedCryptos((prev) => prev + 8)
          e.stopPropagation()
     }

     const popularMethods = [
          {
               title: 'Visa',
               code: 'visa',
               logo: '/payments/visa.png',
          },
          {
               title: 'Master Card',
               code: 'USDTTRC20',
               logo: '/payments/master.png',
          },
          {
               title: 'Perfect Money',
               code: 'USDTTRC20',
               logo: '/payments/PM.png',
          },
          {
               title: 'PayPal',
               code: 'USDTTRC20',
               logo: '/payments/paypal.png',
          },
          {
               title: 'WebMoney',
               code: 'USDTTRC20',
               logo: '/payments/webMoney.png',
          },
          {
               title: 'Tether USD (Tron)',
               code: 'USDTTRC20',
               logo: '/images/coins/usdttrc20.svg',
          },
          {
               title: 'Tether USD',
               code: 'USDTERC20',
               logo: '/images/coins/usdterc20.svg',
          },
          {
               title: 'Bitcoin',
               code: 'BTC',
               logo: '/images/coins/btc.svg',
          },
          {
               title: 'Ripple',
               code: 'XRP',
               logo: '/images/coins/xrp.svg',
          },
          {
               title: 'Tron',
               code: 'TRX',
               logo: '/images/coins/trx.svg',
          },
          {
               title: 'Ethereum',
               code: 'ETH',
               logo: '/images/coins/eth.svg',
          },
     ]

     const stableCoins = [
          {
               title: 'Tether USD (Tron)',
               code: 'USDTTRC20',
               logo: '/images/coins/usdttrc20.svg',
          },
          {
               title: 'Tether USD (Ethereum)',
               code: 'USDTERC20',
               logo: '/images/coins/usdterc20.svg',
          },
          {
               title: 'USD Coin',
               code: 'USDC',
               logo: '/images/coins/usdc.svg',
          },
     ]

     const majorCoins = [
          {
               title: 'Bitcoin',
               code: 'BTC',
               logo: '/images/coins/btc.svg',
          },
          {
               title: 'Ethereum',
               code: 'ETH',
               logo: '/images/coins/eth.svg',
          },
          {
               title: 'Ripple',
               code: 'XRP',
               logo: '/images/coins/xrp.svg',
          },
     ]

     return (
          <div className='py-4 px-2 h-[calc(100vh-8rem)] overflow-y-scroll'>
               {currencyLoading ? (
                    <div className='w-full flex justify-center items-center h-[250px]'>
                         <CircularProgress
                              size={24}
                              className='text-primary'
                         />
                    </div>
               ) : paymentMethods && paymentMethods.length > 0 ? (
                    <div className='space-y-2 py-4 px-2 '>
                         <Accordion
                              title='Popular Payment Methods'
                              icon={<StarIcon className='text-primary' />}
                              defaultExpanded={true}
                         >
                              <div className='grid items-center gap-1 grid-cols-1'>
                                   {popularMethods.map((method, index) => (
                                        <PaymentMethod
                                             key={index}
                                             onClick={(e) => {
                                                  setPaymentMethod(method)
                                                  e.stopPropagation()
                                             }}
                                             code={method.code}
                                             title={method.title}
                                             logo={method.logo}
                                             isSelected={
                                                  selectedMethod === method.code
                                             }
                                        />
                                   ))}
                              </div>
                         </Accordion>
                         <Accordion
                              title='Stable Coins'
                              icon={<LocalAtmIcon className='text-primary' />}
                         >
                              <div className='grid items-center gap-2 grid-cols-1 '>
                                   {stableCoins.map((method, index) => (
                                        <PaymentMethod
                                             key={index}
                                             onClick={(e) => {
                                                  setPaymentMethod(method)
                                                  e.stopPropagation()
                                             }}
                                             code={method.code}
                                             title={method.title}
                                             logo={method.logo}
                                             isSelected={
                                                  selectedMethod === method.code
                                             }
                                        />
                                   ))}
                              </div>
                         </Accordion>

                         <Accordion
                              title='Major Cryptocurrencies'
                              icon={
                                   <CurrencyBitcoinIcon className='text-primary' />
                              }
                         >
                              <div className='grid items-center gap-4 grid-cols-1'>
                                   {majorCoins.map((method, index) => (
                                        <PaymentMethod
                                             key={index}
                                             onClick={(e) => {
                                                  setPaymentMethod(method)
                                                  e.stopPropagation()
                                             }}
                                             code={method.code}
                                             title={method.title}
                                             logo={method.logo}
                                             isSelected={
                                                  selectedMethod === method.code
                                             }
                                        />
                                   ))}
                              </div>
                         </Accordion>

                         <Accordion
                              title='All Cryptocurrencies'
                              icon={
                                   <CurrencyBitcoinIcon className='text-primary' />
                              }
                         >
                              <div className='grid items-center gap-4 grid-cols-1 '>
                                   {paymentMethods
                                        .slice(0, displayedCryptos)
                                        .map((pMethod, index) => (
                                             <PaymentMethod
                                                  onClick={(e) => {
                                                       setPaymentMethod({
                                                            title: pMethod.code,
                                                            code: pMethod.code,
                                                            minDeposit: '',
                                                            logo: pMethod.logo_url,
                                                       })
                                                       e.stopPropagation()
                                                  }}
                                                  title={pMethod.name}
                                                  code={pMethod.code}
                                                  logo={pMethod.logo_url}
                                                  isSelected={
                                                       selectedMethod ===
                                                       pMethod.code
                                                  }
                                             />
                                        ))}
                              </div>
                              {displayedCryptos < paymentMethods.length && (
                                   <div className='flex justify-center mt-6'>
                                        <Button
                                             ref={lastCryptoRef}
                                             onClick={(e) => loadMoreCryptos(e)}
                                             className='bg-primary/10 hover:bg-primary/20 text-primary px-6 py-2 rounded-lg transition-all duration-300'
                                        >
                                             Load More
                                        </Button>
                                   </div>
                              )}
                         </Accordion>
                    </div>
               ) : (
                    <div className='text-googleRed text-lg flex items-center justify-center h-[250px] bg-darkBlue/10 rounded-xl backdrop-blur-sm'>
                         Bad internet connection try again
                    </div>
               )}
          </div>
     )
}
export default DepositStepOne
