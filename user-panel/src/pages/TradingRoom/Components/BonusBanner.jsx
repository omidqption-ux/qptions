import React, { useEffect, useState } from 'react'
import { Box, Typography, Tooltip } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { playClick } from '../../../utils/sounds'
import Menu from '@mui/material/Menu'
import CurrencyDisplay from '../../../components/NumberFormat/NumberFormat'
import axiosInstance from '../../../network/axios'
import { setUserBonusBalance } from '../../../redux/slices/userSlice'

const BonusBanner = () => {
     const [bonusLoading, setBonusLoading] = useState(true)
     const dispatch = useDispatch()
     const { bonusBalance, userSettings } = useSelector(store => store.user)
     const bonusTrading = () => {
          userSettings.soundControl.notification && playClick()
          window.location.href = '/TradingRoomBonus'
     }
     const [anchorBonus, setAnchorBonus] = React.useState(null)
     const openBonus = Boolean(anchorBonus)
     const openBonusExplanation = (event) => {
          userSettings.soundControl.notification && playClick()
          setAnchorBonus(event.currentTarget)
     }
     const closeBonusExplanation = () => {
          userSettings.soundControl.notification && playClick()
          setAnchorBonus(null)
     }
     const getUserBalanceAndUsername = async () => {
          try {
               const res = await axiosInstance.get(
                    '/users/getUserBalanceAndUsername'
               )
               dispatch(setUserBonusBalance(res.bonusBalance || 0))

          } catch (e) {
          } finally {
               setBonusLoading(false)
          }
     }
     useEffect(() => {
          getUserBalanceAndUsername()
     }, [])
     return (
          <>
               {bonusBalance === 0 ? (
                    <Box
                         onClick={openBonusExplanation}
                         className="cursor-pointer"
                         sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '4px',
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
                         }}
                    >
                         <div className='flex items-center'  >
                              <img
                                   src='/bonus.png'
                                   alt='Bonus'
                                   style={{
                                        objectFit: 'contain',
                                        filter: 'brightness(1.2) drop-shadow(0 0 5px rgba(0, 195, 255, 0.5))',
                                   }}
                                   className='lg:w-[24px] lg:h-[24px] w-[16px] h-[16px]'
                              />
                              <Typography
                                   sx={{
                                        color: 'rgba(0, 195, 255, 0.95)',
                                        fontWeight: '600',
                                        letterSpacing: '0.2px',
                                        textShadow:
                                             '0 0 10px rgba(0, 195, 255, 0.5)',
                                   }}
                                   className='xl:flex hidden mx-1 lg:text-[12px] text-[10px]'
                              >
                                   Get 200% bonus
                              </Typography>
                         </div>
                    </Box>
               ) : (
                    <Tooltip
                         arrow
                         placement='bottom'
                         title='Trade Bonus Money'
                         className='flex items-center gap-1 cursor-pointer'
                    >
                         <Box
                              className="cursor-pointer"
                              onClick={bonusTrading}
                              sx={{
                                   display: 'flex',
                                   alignItems: 'center',
                                   gap: '8px',
                                   padding: '4px',
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
                              }}
                         >
                              <img

                                   src='/bonus.png'
                                   alt='Bonus'
                                   style={{
                                        objectFit: 'contain',
                                        filter: 'brightness(1.2) drop-shadow(0 0 5px rgba(0, 195, 255, 0.5))',
                                   }}
                                   className='lg:w-[24px] lg:h-[24px] w-[16px] h-[16px]'
                              />
                              <CurrencyDisplay
                                   amount={Number(
                                        bonusBalance
                                   )}
                                   currency='USD'
                                   loading={bonusLoading}
                                   style={{
                                        color: '#cecece',
                                   }}
                                   className='text-xs lg:text-sm font-medium'
                              />
                         </Box>
                    </Tooltip>
               )}
               <Menu
                    anchorEl={anchorBonus}
                    open={openBonus}
                    onClose={closeBonusExplanation}
                    slotProps={{
                         paper: {
                              elevation: 0,
                              sx: {
                                   overflow: 'visible',
                                   filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                   mt: 1.5,
                                   '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                   },
                                   '&::before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 174,
                                        width: 10,
                                        height: 10,
                                        bgcolor: '#161a25',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                   },
                              },
                         },
                    }}
                    transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                    className='[&>.MuiPaper-root>ul.css-1toxriw-MuiList-root-MuiMenu-list]:pt-0 
                              [&>.MuiPaper-root]:rounded-md [&>.MuiPaper-root]:bg-Navy  [&>.MuiPaper-root]:text-lightGrey'
               >
                    <ul className='px-2 py-1 font-normal text-xs leading-6 list-disc list-inside'>
                         <li>Welcome bonus <sub className='text-Gray' > Get 200% bonus on first deposit</sub></li>
                         <li>Referral Bonus <sub className='text-Gray' > Once the referred user: completes KYC + deposits</sub></li>
                         <li>Complete at least 100 valid trades</li>
                         <li>Streak/engagement rewards <sub className='text-Gray' > Trade on at least 5 distinct days in a month</sub></li>
                         <li>Bug bounties / feedback credits <sub className='text-Gray' >Meaningful UX or security reports</sub></li>
                    </ul>
               </Menu>
          </>
     )
}

export default BonusBanner
