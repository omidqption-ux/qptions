'use client'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
     faCcVisa,
     faCcMastercard,
     faCcPaypal,
     faBitcoin,
     faEthereum,
} from '@fortawesome/free-brands-svg-icons'
import webMoney from '@/assets/webmoney.png'
import perfectMoney from '@/assets/perfect.png'
import tether from '@/assets/tether.png'
import Image from 'next/image'
import styles from '../Footer/Footer.module.css'
import { useTranslation } from 'next-i18next'

const PaymentMethods = () => {
     const { t } = useTranslation('footer')

     return (
          <div className='text-gray-400 flex  flex-col justify-start w-full'>
               <span className='text-lg font-semibold mb-2'>
                    <span className={' mx-1 text-gray-300 ' + styles.sectionTitle}>
                         {t("payments")}
                    </span>
               </span>
               <div className='grid grid-cols-4 gap-4 xl:gap-6'>
                    <div className='flex flex-col justify-center items-start'>
                         <div className='text-orange-500 w-full text-center flex flex-col items-center justify-center  icon-shadow'>
                              <FontAwesomeIcon
                                   className='text-orange-500'
                                   icon={faCcVisa}
                                   size='1x'
                              />
                              <span className='text-sm text-center text-LightOrange'>
                                   Visa
                              </span>
                         </div>
                    </div>
                    <div className='flex flex-col justify-center items-start'>
                         <div className=' text-orange-500 w-full flex flex-col text-center items-center justify-center  icon-shadow'>
                              <FontAwesomeIcon
                                   className='text-orange-500'
                                   icon={faCcMastercard}
                                   size='1x'
                              />
                              <span className='text-sm text-Orange'>
                                   Mastercard
                              </span>
                         </div>
                    </div>
                    <div className='flex flex-col justify-center items-start'>
                         <div className='text-blue-500 w-full text-center flex flex-col items-center justify-center  icon-shadow'>
                              <FontAwesomeIcon
                                   icon={faCcPaypal}
                                   size='1x'
                              />
                              <span className='text-sm text-LightBlue'>
                                   PayPal
                              </span>
                         </div>
                    </div>
                    <div className='flex flex-col justify-center items-center'>
                         <div className='text-red-400 w-full text-center flex flex-col items-center justify-center icon-shadow'>
                              <FontAwesomeIcon
                                   icon={faBitcoin}
                                   size='1x'
                              />
                              <span className='text-sm text-tomato'>
                                   Bitcoin
                              </span>
                         </div>
                    </div>
                    <div className='flex flex-col justify-center items-center'>
                         <div className='text-blue-700 w-full text-center flex flex-col items-center justify-center icon-shadow'>
                              <FontAwesomeIcon
                                   icon={faEthereum}
                                   size='1x'
                              />
                              <span className='text-sm text-ethBlue'>
                                   Ethereum
                              </span>
                         </div>
                    </div>
                    <div className='flex flex-col justify-center items-center'>
                         <div className='text-blue-700 w-full text-center flex flex-col items-center justify-center  icon-shadow'>
                              <Image
                                   alt='webmoney'
                                   src={webMoney}
                                   width={20}
                                   height={20}
                              />
                              <span className='text-sm '>WebMoney</span>
                         </div>
                    </div>
                    <div className='flex flex-col justify-center items-center'>
                         <div className='w-full text-center flex flex-col items-center justify-center icon-shadow'>
                              <Image
                                   alt='tether'
                                   src={tether}
                                   width={20}
                                   height={20}
                              />
                              <span className='text-sm text-green-500'>
                                   Tether
                              </span>
                         </div>
                    </div>
                    <div className='flex flex-col justify-center items-center'>
                         <div className='w-full text-center flex flex-col items-center justify-center icon-shadow'>
                              <Image
                                   alt='perfectMoney'
                                   src={perfectMoney}
                                   width={20}
                                   height={20}
                              />
                              <span className='text-sm text-red-500'>
                                   PerfectMoney
                              </span>
                         </div>
                    </div>
               </div>
          </div>
     )
}
export default PaymentMethods
