import { useEffect, useState } from 'react'
import { Avatar, Tooltip, Box, Button } from '@mui/material'
import { useSelector } from 'react-redux'
import CurrencyDisplay from '../../../components/NumberFormat/NumberFormat'
import {
     setUserBalance,
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
import { playClick } from '../../../utils/sounds'
import axiosInstance from '../../../network/axios'
import BonusBanner from './BonusBanner'
import SelectedTickers from ".//Tickers/SelectedTickers"
import SchoolIcon from '@mui/icons-material/School'
import TroubleshootRoundedIcon from '@mui/icons-material/TroubleshootRounded'



const Navbar = ({ socket }) => {
     const dispatch = useDispatch()
     const [balanceLoading, setBalanceLoading] = useState(false)
     const {
          balance: userBalance,
          userSettings,
          profile,
     } = useSelector((store) => store.user)
     const { amountIsMoreThanBalance } = useSelector(
          (store) => store.tradingRoom
     )
     //// logic
     const toggleDemo = () => {
          userSettings.soundControl.notification && playClick()
          window.location.href = '/TradingRoomDemo'
     }
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
               dispatch(setUserBalance(data.balance.amount))
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
               dispatch(setUserBalance(res.balance))
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
               dispatch(setUserBalance(res.balance))
          } catch (e) { }
          finally {
               setTimeout(() => {
                    setBalanceLoading(false)
               }, 1000);
          }
     }
     const baseBtn =
          "inline-flex items-center justify-center rounded-md px-3 py-0 text-xs font-medium transition-all duration-200 will-change-transform";
     const tradeButtonDemo =
          `${baseBtn} bg-gradient-to-b from-[#3b82f6] to-[#2563eb] border border-[#2563eb] shadow-none mx-1
   hover:from-[#2563eb] hover:to-[#3b82f6]
   hover:shadow-[0_2px_5px_rgba(59,130,246,0.3)]
   hover:-translate-y-px text-menuTxt h-[34px] hidden xl:flex`;
     return (
          <div className='w-full h-[64px] flex justify-between items-center px-0 py-2 bg-footerBg border-b border-darkGrey/20'>
               <div className='flex gap-1 items-center text-[#3B82F6] ' >
                    <TroubleshootRoundedIcon className='lg:text-[14px] text-[12px]' />
                    <span className='text-xs lg:text-sm' >
                         Real
                    </span>
                    <SelectedTickers />
               </div>
               <Box className="text-LightGray gap-1 flex items-center" >
                    <Box
                         sx={{
                              display: 'flex',
                              alignItems: 'center',
                              background:
                                   'linear-gradient(135deg, rgba(0, 119, 255, 0.15) 0%, rgba(0, 195, 255, 0.1) 100%)',
                              borderRadius: '8px',
                              border: '1px solid rgba(0, 195, 255, 0.2)',
                              backdropFilter: 'blur(8px)',
                              transition: 'all 0.3s ease',
                              position: 'relative',
                              overflow: 'hidden',
                              '&:hover': {
                                   background:
                                        'linear-gradient(135deg, rgba(0, 119, 255, 0.25) 0%, rgba(0, 195, 255, 0.15) 100%)',
                                   borderColor: 'rgba(0, 195, 255, 0.3)',
                                   boxShadow: '0 0 15px rgba(0, 195, 255, 0.2)',
                              },
                              '&::before': {
                                   content: '""',
                                   position: 'absolute',
                                   top: 0,
                                   left: 0,
                                   right: 0,
                                   bottom: 0,
                                   background:
                                        'radial-gradient(circle at 50% 50%, rgba(0, 195, 255, 0.1) 0%, rgba(0, 119, 255, 0) 70%)',
                                   animation: 'pulse 2s infinite',
                              },
                              '@keyframes pulse': {
                                   '0%': { opacity: 0.5 },
                                   '50%': { opacity: 1 },
                                   '100%': { opacity: 0.5 },
                              },
                         }} >
                         <Button
                              component='a'
                              href='/TradingRoomDemo'
                              className='p-1 m-0'
                         >
                              <SchoolIcon className='text-xs lg:text-sm mx-1' />
                              <span className="text-xs lg:text-sm" >Try Demo</span>
                         </Button>
                    </Box>
                    <BonusBanner />
               </Box>
               <div className='flex items-center gap-4'>

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
                                                  userBalance
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
                                        arrow: { className: "text-gray-900 " }, // arrow color = same as bg
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
