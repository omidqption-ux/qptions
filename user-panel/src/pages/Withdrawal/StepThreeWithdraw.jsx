import { Button } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axiosInstance from '../../network/axios'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CircularProgress from '@mui/material/CircularProgress'
import {
     setAmountInPaymentMethod,
     setWalletAddress,
     setWalletType,
} from '../../redux/slices/withdrawSlice'
import { updateBalance } from '../../redux/slices/userSlice'
import { capitalizeFirstLetter } from '../../utils/stringFunctions'
import { isValidCryptoAddress } from '../../utils/wallet'
import { toast } from 'react-toastify'
import { Select, MenuItem } from '@mui/material'
import styles from '../Profile/IdentityInformation.module.css'

const walletTypes = [
     'bitcoin',
     'ethereum',
     'litecoin',
     'dogecoin',
     'ripple',
     'tron',
     'cardano',
     'polkadot',
]
const StepThreeWithdraw = ({ handleNext, setActiveStep }) => {
     const dispatch = useDispatch()
     const inputRef = useRef(null)
     const [loading, setLoading] = useState(false)
     const {
          amount,
          method,
          amountInPaymentMethod,
          walletAddress,
          walletType,
     } = useSelector((store) => store.withdraw)
     const getPriceCrypto = async () => {
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
                    setAmountInPaymentMethod(response.data.estimated_amount)
               )
          } catch (e) {
          } finally {
               setLoading(false)
          }
     }
     useEffect(() => {
          if (method.logo.startsWith('/payments')) {
               toast.error(
                    'service not available in your region choose another method'
               )
               setActiveStep(1)
               return
          }
          if (inputRef.current) {
               inputRef.current.focus()
          }
          if (method.code) getPriceCrypto()
     }, [method.code])
     const withdraw = async () => {
          if (!isValidCryptoAddress(walletAddress, walletType)) {
               toast.error('Invalid wallet address')
               return
          }
          try {
               setLoading(true)
               const res = await axiosInstance.post('/withdraw/makeAWithdraw', {
                    methodTitle: method.title,
                    methodCode: method.code,
                    amount,
                    walletAddress: walletType + ':' + walletAddress,
               })
               dispatch(updateBalance(res.userBalance))
               handleNext()
          } catch (e) {
          } finally {
               setLoading(false)
          }
     }
     return (
          <div className='flex justify-center items-center my-10 w-full gap-4'>
               <div className='w-[380px] bg-gradient-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl p-8 rounded-xl  flex flex-col'>
                    <div className='flex items-start justify-between w-full'>
                         <div className='flex items-center justify-center w-full'>
                              <div className='flex flex-col gap-2 items-center w-full'>
                                   <span className='text-lg font-semibold leading-5 flex w-full justify-center items-center my-3'>
                                        <img
                                             alt='qption'
                                             src={
                                                  'https://nowpayments.io/' +
                                                  method.logo
                                             }
                                             className='w-8 mx-2'
                                        />
                                        {method.title}
                                   </span>
                                   <span className='flex  items-center justify-center leading-5 font-semibold my-3 text-green-500'>
                                        <span className='flex items-center text-sm  mx-1 '>
                                             {amount}
                                             <AttachMoneyIcon className='w-[15px]' />
                                             &asymp;
                                        </span>
                                        <span className='flex justify-end text-sm  mx-1 w-full'>
                                             {loading ? (
                                                  <CircularProgress
                                                       size={16}
                                                       className='text-lightGrey'
                                                  />
                                             ) : (
                                                  <>
                                                       {amountInPaymentMethod}
                                                       &nbsp;
                                                       {method.code}
                                                  </>
                                             )}
                                        </span>
                                   </span>
                                   <div className='flex items-center justify-center w-full'>
                                        <Select
                                             className={`w-1/4 bg-[#20293E]  px-1 rounded-r-none   focus:outline-none h-[30px] text-xs rounded-l-lg cursor-pointer `}
                                             onChange={(e) =>
                                                  dispatch(
                                                       setWalletType(
                                                            e.target.value
                                                       )
                                                  )
                                             }
                                             sx={{
                                                  color: 'rgba(255,255,255,0.7)',
                                                  borderRadius: 1,

                                                  // Remove the outlined border in all states
                                                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                                  '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },

                                                  // Also catch the native fieldset selector
                                                  '& fieldset': { border: 'none' },

                                                  // Remove any focus ring/outline
                                                  '& .MuiSelect-select:focus': { outline: 'none' },
                                                  '& .MuiSelect-select': {
                                                       color: '#22c55e', // green-500
                                                       py: { xs: 0.5, sm: 1 },
                                                       px: { xs: 1, sm: 2 },
                                                       borderRadius: 1,
                                                  },
                                                  '& .MuiSelect-icon': {
                                                       color: '#86efac',            // Tailwind green-300
                                                  },
                                                  // optional: keep it green on hover/focus too
                                                  '&.Mui-focused .MuiSelect-icon, &:hover .MuiSelect-icon': {
                                                       color: '#86efac',
                                                  },

                                             }}
                                             MenuProps={{
                                                  PaperProps: {
                                                       sx: {
                                                            // DROPDOWN PANEL background
                                                            backgroundImage:
                                                                 'linear-gradient(to bottom, rgba(34,197,94,0.10), rgba(34,197,94,0.05))',
                                                            bgcolor: 'transparent',
                                                            backdropFilter: 'blur(64px)',           // optional: matches backdrop-blur-3xl
                                                            WebkitBackdropFilter: 'blur(64px)',
                                                            border: '1px solid rgba(34,197,94,0.20)',
                                                            boxShadow: '0 12px 28px rgba(0,0,0,0.35)',
                                                            color: 'rgba(255,255,255,0.9)',
                                                            // item styles
                                                            '& .MuiMenuItem-root': {
                                                                 '&:hover': {
                                                                      backgroundColor: 'rgba(34,197,94,0.12)',
                                                                 },
                                                                 '&.Mui-selected, &.Mui-selected:hover': {
                                                                      backgroundColor: 'rgba(34,197,94,0.18)',
                                                                 },
                                                            },
                                                       },
                                                  },
                                             }}
                                        >
                                             {walletTypes.map((type) => (
                                                  <MenuItem
                                                       key={type}
                                                       value={type}
                                                  >
                                                       {capitalizeFirstLetter(
                                                            type
                                                       )}
                                                  </MenuItem>
                                             ))}
                                        </Select>
                                        <input
                                             ref={inputRef}
                                             placeholder='Wallet Address'
                                             required
                                             className={`${styles.inputBase} border-none  px-2 rounded-xs focus:outline-none h-[30px] w-3/4 text-xs rounded-r-lg rounded-l-none`}
                                             autoComplete='off'
                                             value={walletAddress}
                                             onChange={(e) =>
                                                  dispatch(
                                                       setWalletAddress(
                                                            e.target.value
                                                       )
                                                  )
                                             }
                                        />
                                   </div>
                              </div>
                         </div>
                    </div>
                    <Button
                         variant='contained'
                         className='bg-green-700 text-green-300 w-full hover:bg-green-500 mt-6'
                         onClick={withdraw}
                         disabled={!walletAddress}
                    >
                         Request withdrawal
                    </Button>
               </div>
          </div>
     )
}
export default StepThreeWithdraw
