import React, { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import {
     setDepositMethod,
     setPaymentMethods,
} from '../../redux/slices/depositSlice'
import axiosInstance from '../../network/axios'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import PaymentMethod from '../../components/PaymentMethod/PaymentMethod'
import Accordion from '../../components/Accordion/Accordion'
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
          getCurrencies()
     }, [])

     const loadMoreCryptos = () => {
          setDisplayedCryptos((prev) => prev + 24)
     }

     const popularMethods = [
          {
               title: 'Visa',
               code: 'visa',
               logo: '/payments/visa.png',
          },
          {
               title: 'Master Card',
               code: 'MasterCard',
               logo: '/payments/master.png',
          },
          {
               title: 'Perfect Money',
               code: 'PerfectMoney',
               logo: '/payments/PM.png',
          },
          {
               title: 'PayPal',
               code: 'PayPal',
               logo: '/payments/paypal.png',
          },
          {
               title: 'WebMoney',
               code: 'WebMoney',
               logo: '/payments/webMoney.png',
          },
          {
               title: 'Tether USD (Tron)',
               code: 'USDTTRC20',
               logo: '/images/coins/usdttrc20.svg',
               chain: 'TRON'
          },
          {
               title: 'Tether USD',
               code: 'USDTERC20',
               logo: '/images/coins/usdterc20.svg',
               chain: 'ETH'
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
               chain: 'TRON'
          },
          {
               title: 'Tether USD (Ethereum)',
               code: 'USDTERC20',
               logo: '/images/coins/usdterc20.svg',
               chain: 'ETH'
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
          <div className='p-4 md:p-6'>
               {currencyLoading ? (
                    <div className='w-full flex justify-center items-center h-[250px]'>
                         <CircularProgress
                              size={24}
                              className='text-primary'
                         />
                    </div>
               ) : paymentMethods && paymentMethods.length > 0 ? (
                    <div className='space-y-4'>
                         <Accordion
                              title='Popular Payment Methods'
                              icon={<StarIcon className='text-primary' />}
                              defaultExpanded={true}
                         >
                              <div className='grid items-center gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                                   2xl:grid-cols-5 3xl:grid-cols-6'>
                                   {popularMethods.map((method, index) => (
                                        <PaymentMethod
                                             key={index}
                                             onClick={() =>
                                                  setPaymentMethod(method)
                                             }
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
                              <div className='grid items-center gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6'>
                                   {stableCoins.map((method, index) => (
                                        <PaymentMethod
                                             key={index}
                                             onClick={() =>
                                                  setPaymentMethod(method)
                                             }
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
                              <div className='grid items-center gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6'>
                                   {majorCoins.map((method, index) => (
                                        <PaymentMethod
                                             key={index}
                                             onClick={() =>
                                                  setPaymentMethod(method)
                                             }
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
                              <div className='grid items-center gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6'>
                                   {paymentMethods
                                        .slice(0, displayedCryptos)
                                        .map((pMethod, index) => (
                                             <PaymentMethod
                                                  key={index}
                                                  onClick={() =>
                                                       setPaymentMethod({
                                                            title: pMethod.code,
                                                            code: pMethod.code,
                                                            minDeposit: '',
                                                            logo: pMethod.logo_url,
                                                       })
                                                  }
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
                                             onClick={loadMoreCryptos}
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
