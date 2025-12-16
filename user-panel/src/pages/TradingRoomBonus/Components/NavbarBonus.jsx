import { useEffect, useState } from 'react'
import { Avatar, Tooltip, Box, Button } from '@mui/material'
import { useSelector } from 'react-redux'
import CurrencyDisplay from '../../../components/NumberFormat/NumberFormat'
import {
     setUserBonusBalance,
     setUserProfile,
} from '../../../redux/slices/userSlice'
import { useDispatch } from 'react-redux'
import WalletIcon from '@mui/icons-material/AccountBalanceWallet'
import RefreshIcon from '@mui/icons-material/Refresh'
import './styles.css'
import { styled, keyframes } from '@mui/system'
import {
     setAmountIsMoreThanBalance,
} from '../../../redux/slices/tradingRoomSlices/tradingRoomSlice'
import axiosInstance from '../../../network/axios'
import SelectedTickers from ".//Tickers/SelectedTickers"
import TroubleshootRoundedIcon from '@mui/icons-material/TroubleshootRounded'
import SchoolIcon from '@mui/icons-material/School'


const Navbar = ({ socket }) => {
     const dispatch = useDispatch()
     const [balanceLoading, setBalanceLoading] = useState(false)
     const {
          bonusBalance,
          profile,
     } = useSelector((store) => store.user)
     const { amountIsMoreThanBalance } = useSelector(
          (store) => store.tradingRoom
     )
     //// logic     
     const shakeAnimation = keyframes`
          0% { transform: translateX(0) }
          25% { transform: translateX(-5px) }
          50% { transform: translateX(5px) }
          75% { transform: translateX(-5px) }
          100% { transform: translateX(0) }
          `
     const ShakingDiv = styled('div')(({ shake }) => ({
          display: 'inline-block',
          animation: shake ? `${shakeAnimation} 0.3s ease-in-out` : 'none',
     }))
     useEffect(() => {
          if (amountIsMoreThanBalance)
               setTimeout(() => dispatch(setAmountIsMoreThanBalance()), 500)
     }, [amountIsMoreThanBalance])
     useEffect(() => {
          getUserBalanceAndUsername()
     }, [])
     useEffect(() => {
          socket.emit('joinBalanceCheckRoom')
          socket.on('balanceUpdate', (data) => {
               setBalanceLoading(true)
               dispatch(setUserBonusBalance(data.balance.bonus))
               setBalanceLoading(false)
          })
          return () => {
               socket.off('balanceUpdate')
               socket.emit('leaveBalanceCheckRoom')
          }
     }, [profile.username])
     const getUserBalanceAndUsername = async () => {
          try {
               setBalanceLoading(true)
               const res = await axiosInstance.get(
                    '/users/getUserBalanceAndUsername'
               )
               dispatch(setUserBonusBalance(res.bonusBalance))
               dispatch(
                    setUserProfile({
                         username: res.username,
                         profileImage: res.avatar,
                    })
               )
          } catch (e) {
          } finally {
               setBalanceLoading(false)
          }
     }
     const fetchUserBalance = async () => {
          try {
               setBalanceLoading(true)
               const res = await axiosInstance.get('/users/balance')
               dispatch(setUserBonusBalance(res.bonusBalance))
          } catch (e) { }
          finally {
               setTimeout(() => {
                    setBalanceLoading(false)
               }, 1000);
          }
     }


     return (
          <div className='w-full h-[64px] flex justify-between items-center px-0 py-2 bg-footerBg border-b border-darkGrey/20'>
               <div className='flex gap-1 items-center' >
                    <div
                         className='flex items-center gap-2 px-3 py-1.5 rounded-lg bg-darkGrey/20 backdrop-blur-sm cursor-pointer hover:bg-darkGrey/30 transition-all duration-300'
                    >
                         <img

                              src='/bonus.png'
                              alt='Bonus'
                              style={{
                                   objectFit: 'contain',
                                   filter: 'brightness(1.2) drop-shadow(0 0 5px rgba(0, 195, 255, 0.5))',
                              }}
                              className='lg:w-[24px] lg:h-[24px] w-[18px] h-[18px]'
                         />
                    </div>
                    <SelectedTickers />
               </div>
               <div className='flex items-center gap-4'>
                    <Box className="text-LightGray gap-1" >
                         <Button
                              component='a'
                              href='/TradingRoom'
                              className={" text-xs lg:text-sm bg-Navy text-blue-300 mx-2"}
                         >
                              <TroubleshootRoundedIcon
                                   className='text-xs lg:text-sm mx-1'
                              />
                              Trade <span className='mx-1 hidden lg:flex' >Now</span>
                         </Button>
                         <Button
                              component='a'
                              href='/TradingRoomDemo'
                              className={" text-xs lg:text-sm bg-Navy text-blue-300"}
                         >
                              <SchoolIcon className='text-xs lg:text-sm mx-1' />
                              <span className='mx-1 hidden lg:flex' >Try</span> Demo
                         </Button>
                    </Box>
                    <div className='flex items-center gap-4 pl-4'>
                         <div className='flex items-center gap-2'>
                              <div className='flex items-center gap-2 px-3 py-1.5 rounded-lg bg-darkGrey/20 backdrop-blur-sm'>
                                   <ShakingDiv shake={amountIsMoreThanBalance} className='flex items-center' >
                                        <WalletIcon
                                             style={{
                                                  color: '#3B82F6',
                                             }}
                                             className='lg:text-[16px] text-[14px]'
                                        />
                                        <CurrencyDisplay
                                             amount={Number(
                                                  bonusBalance
                                             )}
                                             currency='USD'
                                             loading={balanceLoading}
                                             style={{
                                                  color: '#3B82F6',
                                             }}
                                             className='lg:text-sm text-xs font-medium'
                                        />
                                   </ShakingDiv>
                                   <RefreshIcon
                                        onClick={fetchUserBalance}
                                        fontSize='small'
                                        style={{ color: '#3B82F6' }}
                                        className={balanceLoading ? "animate-spin  cursor-pointer lg:text-[16px] text-[14px]" : "cursor-pointer lg:text-[16px] text-[14px]"}
                                   />
                              </div>
                         </div>
                    </div>
                    <div className='flex items-center gap-2  rounded-lg bg-darkGrey/20 backdrop-blur-sm'>
                         <div className='relative inline-block'>
                              <Tooltip
                                   title={
                                        <span className="text-xs font-normal text-offBlue">
                                             {profile?.username}
                                        </span>
                                   }
                                   arrow
                                   slotProps={{
                                        tooltip: { className: "bg-gray-900  rounded-md" },
                                        arrow: { className: "text-gray-900 " },
                                   }}
                              >
                                   <Avatar
                                        src={
                                             profile?.profileImage
                                                  ? profile.profileImage.startsWith(
                                                       'https://lh3.googleusercontent.com'
                                                  )
                                                       ? profile.profileImage
                                                       : `data:image/jpeg;base64,${profile.profileImage}`
                                                  : 'default-avatar.png'
                                        }
                                        style={{
                                             borderColor: '#3B82F6',
                                        }}
                                        className='h-8 w-8 border-2'
                                   />
                              </Tooltip>
                         </div>
                    </div>
               </div>
          </div>
     )
}
export default Navbar
