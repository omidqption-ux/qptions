import { useEffect, useState } from 'react'
import { Avatar, Tooltip, Box, Button } from '@mui/material'
import { useSelector } from 'react-redux'
import CurrencyDisplay from '../../../components/NumberFormat/NumberFormat'
import {
     setDemoBalance,
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
import TroubleshootRoundedIcon from '@mui/icons-material/TroubleshootRounded'
import SchoolIcon from '@mui/icons-material/School'

const Navbar = ({ socket, toggleFullScreen, isFullScreen, toggleSoundSettings }) => {
     const dispatch = useDispatch()
     const [balanceLoading, setBalanceLoading] = useState(false)
     const {
          demoBalance,
          userSettings,
          profile,
     } = useSelector((store) => store.user)
     const { amountIsMoreThanBalance } = useSelector(
          (store) => store.tradingRoom
     )
     //// logic
     const toggleDemo = () => {
          userSettings.soundControl.notification && playClick()
          window.location.href = '/TradingRoom'
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
               dispatch(setDemoBalance(data.balance.demo))
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
               dispatch(setDemoBalance(res.demoBalance))
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
               const res = await axiosInstance.put('/users/refreshDemoBalance')
               dispatch(setDemoBalance(res.demoBalance))
          } catch (e) { }
          finally {
               setTimeout(() => {
                    setBalanceLoading(false)
               }, 1000);
          }
     }


     return (
          <div className='w-full h-[64px] flex justify-between items-center px-0 py-2 bg-footerBg border-b border-darkGrey/20'>
               <div className='flex gap-1 items-center text-orange-400 font-medium cursor-pointer ' >
                    <SchoolIcon className='lg:text-sm text-xs' />
                    <span className='text-xs mx-0.5' >
                         Demo
                    </span>
                    <SelectedTickers />
               </div>
               <div className='flex items-center gap-4'>
                    <Box className="text-LightGray gap-1 flex items-center" >
                         <Box
                              sx={{
                                   display: 'flex',
                                   alignItems: 'center',
                                   gap: '8px',
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
                              }}>
                              <Button
                                   component='a'
                                   href='/TradingRoom'
                                   className={" text-xs lg:text-sm  text-blue-300"}
                              >
                                   <TroubleshootRoundedIcon
                                        className='text-xs lg:text-sm mx-1'
                                   />
                                   Trade <span className='mx-1 text-xs' >Now</span>
                              </Button>
                         </Box>
                         <BonusBanner />
                    </Box>
               </div>
               <div className='flex items-center gap-2'>
                    <div className='flex items-center'>
                         <div className='flex items-center'>
                              <div className='flex items-center gap-1 px-1 py-1.5 rounded-lg bg-darkGrey/20 backdrop-blur-sm'>
                                   <ShakingDiv shake={amountIsMoreThanBalance} className='flex items-center' >
                                        <WalletIcon
                                             className='text-orange-400 lg:text-sm text-xs mx-1'
                                        />
                                        <CurrencyDisplay
                                             amount={Number(
                                                  demoBalance
                                             )}
                                             currency='USD'
                                             loading={balanceLoading}
                                             className='lg:text-sm text-xs font-medium text-orange-400 min-w-[80px]'
                                        />
                                   </ShakingDiv>
                                   <RefreshIcon
                                        onClick={fetchUserBalance}
                                        fontSize='small'
                                        className={`lg:text-sm text-xs text-orange-400   ${balanceLoading ? 'animate-spin  cursor-pointer' : 'cursor-pointer'}`}
                                   />
                              </div>
                         </div>
                    </div>
                    <div className='flex items-center gap-2 rounded-lg bg-darkGrey/20 backdrop-blur-sm'>
                         <div className='relative inline-block'>
                              <Tooltip
                                   title={
                                        <span className="text-xs font-normal text-orange-400">
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
                                        className='h-8 w-8 border-2 border-orange-400'
                                   />
                              </Tooltip>
                         </div>
                    </div>
               </div>
          </div>
     )
}
export default Navbar
