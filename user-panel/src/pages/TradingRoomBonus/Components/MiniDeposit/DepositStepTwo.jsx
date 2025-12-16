import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {
     setDepositAmount,
     setAmountInPaymentMethod,
     setPaymentInfo,
} from '../../../../redux/slices/depositSlice'
import axiosInstance from '../../../../network/axios'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CircularProgress from '@mui/material/CircularProgress'
import PercentIcon from '@mui/icons-material/Percent'
import { Fade } from '@mui/material'
import { toast } from 'react-toastify'
const DepositStepTwo = ({ handleNext, setActiveStep }) => {
     const inputRef = useRef(null)
     const dispatch = useDispatch()
     const [min, setMin] = useState(0)
     const [loading, setLoading] = useState(false)
     const [loadingMin, setLoadingMin] = useState(false)
     const [loadingBtn, setLoadingBtn] = useState(false)
     const [isFirstDepo, setIsFirstDepo] = useState(false)
     const { method, amount, amountInPaymentMethod } = useSelector(
          (store) => store.deposit
     )
     const setAmountAndCreatePayment = async () => {
          try {
               setLoadingBtn(true)
               const response = await axiosInstance.post(
                    '/deposit/createpayment',
                    {
                         pay_currency_title: method.title,
                         pay_currency: method.code.toLowerCase(),
                         price_amount: amount,
                         price_currency: 'usd',
                    }
               )
               dispatch(setPaymentInfo({ paymentInfo: response.data }))
               handleNext()
          } catch (e) {
          } finally {
               setLoadingBtn(false)
          }
     }
     const getMinDep = async () => {
          if (method.logo.startsWith('/payments')) {
               toast.error(
                    'service not available in your region choose another method'
               )
               setActiveStep(0)
               return
          }
          try {
               setLoadingMin(true)
               const response = await axiosInstance.post(
                    'deposit/getMinDeposit',
                    {
                         currency_from: method.code,
                    }
               )
               setMin(Math.ceil(response.data.fiat_equivalent))
          } catch (e) {
          } finally {
               setLoadingMin(false)
          }
     }
     const isFirstDeposit = async () => {
          try {
               const response = await axiosInstance.get(
                    'deposit/isFirstDeposit'
               )
               setIsFirstDepo(response.isFirstDeposit)
          } catch (e) {}
     }
     const getEstimatedPriceInCrypto = async () => {
          try {
               setLoading(true)
               const response = await axiosInstance.post(
                    'deposit/getEstimatedPriceCrypto',
                    {
                         amount,
                         currency_from: 'usd',
                         currency_to: method.code,
                    }
               )
               dispatch(
                    setAmountInPaymentMethod({
                         amountInPaymentMethod: response.data.estimated_amount,
                    })
               )
          } catch (e) {
          } finally {
               setLoading(false)
          }
     }
     useEffect(() => {
          if (inputRef.current) {
               inputRef.current.focus()
          }
          dispatch(setPaymentInfo({ paymentInfo: {} }))
          getMinDep()
          isFirstDeposit()
          return () => {
               dispatch(setDepositAmount(0))
               dispatch(
                    setAmountInPaymentMethod({
                         amountInPaymentMethod: 0,
                    })
               )
          }
     }, [method.code])
     useEffect(() => {
          if (amount && amount >= min) {
               getEstimatedPriceInCrypto()
          } else {
               dispatch(
                    setAmountInPaymentMethod({
                         amountInPaymentMethod: 0,
                    })
               )
          }
     }, [amount])
     return (
          <div className='flex justify-center items-center my-4 w-full gap-4 '>
               <div className='w-[380px] bg-DarkGreen border border-darkEnd rounded-lg p-5 flex flex-col justify-center items-center'>
                    <div className='flex items-center justify-start w-full'>
                         <img
                              alt='qption'
                              src={
                                   method.logo.startsWith('/payments')
                                        ? method.logo
                                        : 'https://nowpayments.io/' +
                                          method.logo
                              }
                              className='w-16 mx-2'
                         />
                         <div className='flex flex-col'>
                              <span className='text-sm font-semibold leading-5'>
                                   {method.title}
                              </span>
                              <span className='flex items-center font-semibold text-xs leading-5 my-1'>
                                   Min deposit :{' '}
                                   <Fade
                                        timeout={500}
                                        in={!loadingMin}
                                   >
                                        <span className='text-yellow flex items-center mx-2'>
                                             {min}
                                             <AttachMoneyIcon className='w-[14px]' />
                                        </span>
                                   </Fade>
                              </span>
                              <span className='text-xs leading-5 text-yellow '>
                                   Commission : 0
                                   <PercentIcon className='w-[12px] ' />
                              </span>
                         </div>
                    </div>
                    {isFirstDepo && (
                         <div className='flex items-center justify-start w-full'>
                              <span className='font-semibold leading-4 text-yellow my-3 '>
                                   Double Up or Triple Your Funds! &nbsp;
                                   <sub className='text-deepGrey'>
                                        Deposit between $100 and $1000 to double
                                        your money with a 100% bonus—or go big
                                        and deposit over $1000 to triple your
                                        funds with a 200% bonus
                                   </sub>
                              </span>
                         </div>
                    )}
                    <div className='flex items-center justify-between w-full my-5 text-xs'>
                         <span className='text-sm text-menuTxt'>Amount :</span>
                         <div className='relative'>
                              <span className='absolute inset-y-0 right-2 flex items-center pl-3 text-gray-500'>
                                   <AttachMoneyIcon fontSize='small' />
                              </span>
                              <input
                                   ref={inputRef}
                                   required
                                   type='number'
                                   className={`bg-[#20293E]  px-2 rounded-xs focus:outline-none h-[28px] w-[140px] text-xs rounded-lg ${
                                        amount < min && 'text-darkGrey'
                                   } `}
                                   autoComplete='off'
                                   value={amount ? amount : ''}
                                   onChange={(e) => {
                                        const inputVal = parseInt(
                                             e.target.value,
                                             10
                                        )
                                        if (isNaN(inputVal) || inputVal < min) {
                                             e.preventDefault()
                                        }
                                        dispatch(setDepositAmount(inputVal))
                                   }}
                              />
                         </div>
                    </div>
                    <div className='flex items-center justify-between w-full my-5 text-xs'>
                         <span className='text-sm text-menuTxt'>
                              {method.title} :
                         </span>
                         <div className='relative'>
                              <div className='absolute top-1 right-2 flex items-center pl-3'>
                                   <img
                                        alt='qption'
                                        src={
                                             'https://nowpayments.io/' +
                                             method.logo
                                        }
                                        className='w-5'
                                   />
                              </div>
                              <input
                                   className={`bg-[#20293E]  px-2 rounded-xs focus:outline-none h-[28px] w-[140px] text-xs rounded-lg`}
                                   autoComplete='off'
                                   value={
                                        loading
                                             ? ''
                                             : amountInPaymentMethod &&
                                               Number(
                                                    amountInPaymentMethod
                                               ).toFixed(9)
                                   }
                                   readOnly
                              />
                              {loading && (
                                   <div className='absolute inset-0 flex items-center justify-start px-2'>
                                        <CircularProgress
                                             size={16}
                                             className='text-lightGrey'
                                        />
                                   </div>
                              )}
                         </div>
                    </div>
                    <div className='flex flex-col items-center justify-around w-full my-5'>
                         <Button
                              disabled={
                                   !min ||
                                   loadingBtn ||
                                   loading ||
                                   !amount ||
                                   amount < min
                              }
                              onClick={setAmountAndCreatePayment}
                              variant='contained'
                              className='bg-LightNavy w-full'
                         >
                              {loadingBtn ? (
                                   <CircularProgress
                                        size={22}
                                        className='text-lightGrey'
                                   />
                              ) : (
                                   'Pay'
                              )}
                         </Button>
                         <div className='text-xs text-center leading-5 text-menuTxt py-5'>
                              The rate of exchange will be frozen for 20
                              minutes. If there are no incoming payments during
                              this period, the payment status changes to &apos;
                              expired &apos;
                         </div>
                    </div>
               </div>
          </div>
     )
}
export default DepositStepTwo
