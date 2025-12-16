import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { QRCodeCanvas } from 'qrcode.react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DoneIcon from '@mui/icons-material/Done'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import DepositCounter from './DepositCounter'
import { updateBalance } from '../../redux/slices/userSlice'
import { toast } from 'react-toastify'
import { socketReal as socket } from '../../network/socket'
import { resetDeposit } from '../../redux/slices/depositSlice'

const DepositStepThree = ({ setActiveStep }) => {
     const dispatch = useDispatch()
     const { method, paymentInfo } = useSelector((store) => store.deposit)
     const [copiedAddress, setCopiedAddress] = useState(false)
     const [copiedAmount, setCopiedAmount] = useState(false)
     const [address, setAddress] = useState('')

     const chooseAddress = async () => {
          setAddress(paymentInfo.pay_address)
     }
     useEffect(() => {
          if (paymentInfo.pay_address && paymentInfo.pay_amount) {
               chooseAddress()
          }

          socket.emit('joinBalanceCheckRoom')
          socket.on('balanceUpdate', (message) => {
               dispatch(updateBalance(message.balance.amount))
               dispatch(resetDeposit())
               toast.success(
                    `${message.price_amount} was added to your account successfully`
               )
               setActiveStep(0)
          })
          socket.onerror = () => {
               socket.disconnect('balanceUpdate')
          }
          return () => {
               setCopiedAddress(false)
               setCopiedAmount(false)
               socket.disconnect('balanceUpdate')
          }
     }, [paymentInfo.pay_address, paymentInfo.pay_amount])

     const handleCopy = (inputValue, isAddress) => {
          navigator.clipboard
               .writeText(inputValue)
               .then(() => {
                    isAddress ? setCopiedAddress(true) : setCopiedAmount(true)
                    setTimeout(
                         () =>
                              isAddress
                                   ? setCopiedAddress(false)
                                   : setCopiedAmount(false),
                         2000
                    )
               })
               .catch((err) => console.error('Failed to copy: ', err))
     }

     return (
          <div className='flex justify-center items-center my-4 w-full gap-4'>
               <div className='w-[380px] bg-DarkGreen border border-darkGrey rounded-lg p-5 flex flex-col justify-center items-center'>
                    <div className='flex items-start justify-between w-full'>
                         <div className='flex items-center'>
                              <img
                                   alt='qption'
                                   src={'https://nowpayments.io/' + method.logo}
                                   className='w-16 mx-2'
                              />
                              <div className='flex flex-col gap-2'>
                                   <span className='text-sm font-semibold leading-5'>
                                        {method.title}
                                   </span>
                                   <span className='flex items-center leading-5 font-semibold'>
                                        Deposit Amount :
                                        <span className='flex items-center text-sm  mx-1'>
                                             {paymentInfo.deposit_amount}
                                             <AttachMoneyIcon className='w-[14px]' />
                                        </span>
                                   </span>
                              </div>
                         </div>
                         <DepositCounter setActiveStep={setActiveStep} />
                    </div>
                    <div className='border-dashed border border-lightYellow w-full py-4 px-2 my-4 rounded-lg text-yellow text-center text-xs'>
                         <div className='mb-2 font-semibold'>
                              In order to get your {paymentInfo.pay_network}
                              &nbsp; payment processed automatically
                         </div>
                         <ol className='list-disc text-left px-6 leading-6'>
                              <li>
                                   The exact {paymentInfo.pay_network} amount
                                   should reach the specified address
                              </li>
                              <li>
                                   Use only {paymentInfo.pay_network} network
                                   for your transfer
                              </li>
                              <li>
                                   Generate a new payment form for each new
                                   deposit
                              </li>
                         </ol>
                    </div>
                    <div className='flex flex-col items-center justify-start  w-full my-5 text-md'>
                         <span className='w-full'>
                              To complete the payment, please transfer
                         </span>
                         <div className='relative w-full'>
                              <span className='absolute inset-y-0 right-2 flex items-center pl-3 text-gray-500'>
                                   {!copiedAmount ? (
                                        <ContentCopyIcon
                                             onClick={() =>
                                                  handleCopy(
                                                       paymentInfo.pay_amount +
                                                       paymentInfo.pay_currency.toUpperCase(),
                                                       false
                                                  )
                                             }
                                             className='cursor-pointer'
                                             fontSize='small'
                                        />
                                   ) : (
                                        <DoneIcon fontSize='small' />
                                   )}
                              </span>

                              <input
                                   className={`bg-[#20293E]  px-2 rounded-xs focus:outline-none h-[28px] w-full text-xs rounded-lg`}
                                   autoComplete='off'
                                   value={
                                        paymentInfo.pay_amount +
                                        paymentInfo.pay_currency.toUpperCase()
                                   }
                                   readOnly
                              />
                         </div>
                         <span className='w-full'>
                              to the address via {paymentInfo.pay_network}&nbsp;
                              network
                         </span>
                         <div className='relative w-full'>
                              <span className='absolute inset-y-0 right-2 flex items-center pl-3 text-gray-500'>
                                   {!copiedAddress ? (
                                        <ContentCopyIcon
                                             onClick={() =>
                                                  handleCopy(
                                                       address,
                                                       true
                                                  )
                                             }
                                             className='cursor-pointer'
                                             fontSize='small'
                                        />
                                   ) : (
                                        <DoneIcon fontSize='small' />
                                   )}
                              </span>
                              <input
                                   className={`bg-[#20293E]  px-2 rounded-xs focus:outline-none h-[28px] w-full text-xs rounded-lg`}
                                   autoComplete='off'
                                   value={address}
                                   readOnly
                              />
                         </div>
                         <div className='w-full flex items-center px-1 py-4'>
                              {address && (
                                   <QRCodeCanvas
                                        value={address}
                                        size={128}
                                        fgColor='#000000'
                                        bgColor='#ffffff'
                                        level='H'
                                   />
                              )}
                              <span className='text-xs px-2'>
                                   Or simply scan the generated Qr code to make
                                   your payment.
                              </span>
                         </div>
                    </div>
               </div>
          </div>
     )
}
export default DepositStepThree