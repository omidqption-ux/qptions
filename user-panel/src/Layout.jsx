import React, { useState, useEffect, useMemo } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import {
     Box,
     Drawer,
     AppBar,
     Toolbar,
     List,
     Divider,
     IconButton,
     ListItemButton,
     Avatar,
     Button,
     Tooltip,
     Menu,
     MenuItem,
     Badge,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import RefreshIcon from '@mui/icons-material/Refresh'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import logoT from './assets/logo-t.png'
import TroubleshootRoundedIcon from '@mui/icons-material/TroubleshootRounded'
import DepositIcon from '@mui/icons-material/CreditScore'
import SchoolIcon from '@mui/icons-material/School'
import FingerprintIcon from '@mui/icons-material/Fingerprint'
import WorkHistoryIcon from '@mui/icons-material/WorkHistory'
import WithdrawalIcon from '@mui/icons-material/AttachMoney'
import AffiliateIcon from '@mui/icons-material/Campaign'
import BalanceIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import axiosInstance from './network/axios'
import { useDispatch, useSelector } from 'react-redux'
import {
     setUserBalance,
     setUserProfile,
     setUserBonusBalance,
} from './redux/slices/userSlice'
import { Link, useLocation, Outlet } from 'react-router-dom'
import CurrencyDisplay from './components/NumberFormat/NumberFormat'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import Notifications from './components/Notifications/Notifications'
import { setNotificationsCount } from './redux/slices/notificationSlice'
import RedeemIcon from '@mui/icons-material/Redeem'
import styles from './Layout.module.css'
import SettingsIcon from '@mui/icons-material/Settings'
import { Link as RouterLink } from 'react-router-dom';

const drawerWidth = 160
const openedMixin = (theme) => ({
     width: drawerWidth,
     transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
     }),
     overflowX: 'hidden',
})

const closedMixin = (theme) => ({
     transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
     }),
     overflowX: 'hidden',
     width: '0px',
     [theme.breakpoints.up('md')]: {
          width: `calc(${theme.spacing(8)} + 1px)`,
     },
})

const StyledAppBar = styled(AppBar, {
     shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
     zIndex: theme.zIndex.drawer + 1,
     transition: theme.transitions.create(['margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
     }),
     ...(open && {
          width: `100%`,
          transition: theme.transitions.create(['margin'], {
               easing: theme.transitions.easing.sharp,
               duration: theme.transitions.duration.enteringScreen,
          }),
     }),
}))

const StyledDrawer = styled(Drawer, {
     shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
     width: drawerWidth,
     flexShrink: 0,
     whiteSpace: 'nowrap',
     boxSizing: 'border-box',
     ...(open && {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
     }),
     ...(!open && {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
     }),
}))

export default function MiniDrawer() {
     const theme = useTheme()
     const { pathname } = useLocation()
     const dispatch = useDispatch()

     const [open, setOpen] = useState(false)
     const [balanceLoading, setBalanceLoading] = useState(false)
     const [isScrolled, setIsScrolled] = useState(false)
     const [anchorEl, setAnchorEl] = useState(null)
     const [loading, setLoading] = useState(false)

     const {
          profile: userProfile,
          balance: userBalance,
          bonusBalance,
     } = useSelector((state) => state.user)
     const { notificationsCount } = useSelector((state) => state.notification)

     const handleDrawerOpen = (e) => {
          e.stopPropagation()
          setOpen(true)
     }
     const handleDrawerClose = () => {
          setOpen(false)
     }
     const handleClickAvatar = (event) => {
          setAnchorEl(event.currentTarget)
     }
     const handleCloseAvatar = () => {
          setAnchorEl(null)
     }

     const logOut = async () => {
          handleCloseAvatar()
          try {
               await axiosInstance.post('/auth/logout')
               window.location.replace(
                    process.env.NODE_ENV !== 'development'
                         ? 'https://qption.com'
                         : 'http://localhost:3000'
               )
          } catch (e) {
               console.error('Logout error:', e)
          }
     }

     useEffect(() => {
          const handleScroll = () => setIsScrolled(window.scrollY > 10)
          window.addEventListener('scroll', handleScroll)
          return () => window.removeEventListener('scroll', handleScroll)
     }, [])

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
     useEffect(() => {
          const getUserData = async () => {
               setLoading(true)
               try {
                    const [profileRes, balanceRes, bonusRes, countRes] =
                         await Promise.all([
                              axiosInstance.get('/users/profile'),
                              axiosInstance.get('/users/balance'),
                              axiosInstance.get('/users/getUserBonusAmount'),
                              axiosInstance.get(
                                   '/notifications/getNotificationCount'
                              ),
                         ])
                    dispatch(setUserBalance(balanceRes.balance))
                    dispatch(
                         setUserProfile({
                              firstName: profileRes.firstName ?? '',
                              username: profileRes.username ?? '',
                              lastName: profileRes.lastName ?? '',
                              dateOfBirth: profileRes.dateOfBirth ?? '',
                              email: profileRes.email ?? '',
                              phone: profileRes.phone ?? '',
                              country: profileRes.country ?? '',
                              isPhoneVerified:
                                   profileRes.isPhoneVerified ?? false,
                              isEmailVerified:
                                   profileRes.isEmailVerified ?? false,
                              isIDVerified: profileRes.isIDVerified ?? false,
                              profileImage: profileRes.profileImage,
                         })
                    )
                    dispatch(setUserBonusBalance(bonusRes.bonus))
                    dispatch(setNotificationsCount(countRes.count > 0 ? countRes.count : 0))
               } catch (e) {
                    console.error('Error fetching user data:', e)
               } finally {
                    setLoading(false)
               }
          }
          getUserData()
     }, [dispatch])

     useEffect(() => {
          window.__lc = window.__lc || {}
          window.__lc.license = 19355391

          const script = document.createElement('script')
          script.src = 'https://cdn.livechatinc.com/tracking.js'
          script.async = true

          document.body.appendChild(script)

          return () => {
               if (document.body.contains(script))
                    document.body.removeChild(script)
          }
     }, [])

     const menuItems = useMemo(
          () => [
               { txt: 'Trading', link: '/Trading', icon: <WorkHistoryIcon className='text-green-700' /> },
               { txt: 'Deposit', link: '/Deposit', icon: <DepositIcon className='text-green-700' /> },
               {
                    txt: 'Verification',
                    link: '/Profile',
                    icon: <FingerprintIcon className='text-green-700' />,
               },
               {
                    txt: 'Withdrawal',
                    link: '/Withdrawal',
                    icon: <WithdrawalIcon className='text-green-700' />,
               },
               {
                    txt: 'Affiliate',
                    link: '/Affiliate',
                    icon: <AffiliateIcon className='text-green-700' />,
               },
          ],
          []
     )
     return (
          <div>
               <StyledAppBar
                    open={open}
                    className={` ${styles.appBar} ${open ? 'z-50' : ''}`}
                    elevation={0}
               >
                    <Toolbar
                         disableGutters
                         className='flex justify-between px-2 w-full'
                    >
                         <div className={styles.appBarLeft + " mx-2"}>
                              <IconButton
                                   color='inherit'
                                   aria-label='open drawer'
                                   onClick={handleDrawerOpen}
                                   edge='start'
                                   className={
                                        styles.menuButton +
                                        `mx-3`
                                   }
                              >
                                   <MenuIcon className='text-green-700' />
                              </IconButton>
                         </div>
                         <Box className={styles.appBarCenter}>
                              <Button
                                   component='a'
                                   href='/TradingRoom'
                                   className={styles.tradeButton}
                              >
                                   <TroubleshootRoundedIcon
                                        className='text-green-500 text-xs lg:text-sm '
                                   />
                                   <span className='text-green-500 flex items-center' >
                                        Trade<span className='hidden lg:flex mx-1' >Now</span>
                                   </span>
                              </Button>
                              <Button
                                   component='a'
                                   href='/TradingRoomDemo'
                                   className={styles.tradeButton}
                              >
                                   <SchoolIcon className='text-green-500 text-xs lg:text-sm' />
                                   <span className='text-green-500 flex items-center gap-1' >
                                        <span className='hidden lg:flex' >Try</span> Demo
                                   </span>
                              </Button>
                         </Box>
                         <div className={styles.appBarRight}>
                              <Box className={styles.avatarContainer}>
                                   <Tooltip
                                        title='Account & Notifications'
                                        arrow
                                   >
                                        <div
                                             className={styles.avatarWrapper}
                                             onClick={handleClickAvatar}
                                        >
                                             <Badge
                                                  badgeContent={
                                                       notificationsCount
                                                  }
                                                  color='primary'
                                                  max={9}
                                                  overlap='rectangular'
                                                  anchorOrigin={{
                                                       vertical: 'top',
                                                       horizontal: 'left',
                                                  }}
                                                  sx={{
                                                       '& .MuiBadge-badge': {
                                                            transform:
                                                                 'scale(0.8) translate(25%, -25%)',
                                                       },
                                                  }}
                                             >
                                                  <Avatar
                                                       src={
                                                            userProfile?.profileImage
                                                                 ? userProfile.profileImage.startsWith(
                                                                      'https://'
                                                                 )
                                                                      ? userProfile.profileImage
                                                                      : `data:image/jpeg;base64,${userProfile.profileImage}`
                                                                 : '/default-avatar.png'
                                                       }
                                                       alt={
                                                            userProfile?.username ||
                                                            'User'
                                                       }
                                                       className={styles.avatar}
                                                  />
                                             </Badge>
                                        </div>
                                   </Tooltip>
                                   <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleCloseAvatar}
                                        transformOrigin={{
                                             horizontal: 'right',
                                             vertical: 'top',
                                        }}
                                        anchorOrigin={{
                                             horizontal: 'right',
                                             vertical: 'bottom',
                                        }}
                                        PaperProps={{
                                             sx: {
                                                  // gradient + blur like the Select menu
                                                  backgroundImage:
                                                       'linear-gradient(to bottom, rgba(18,52,51), rgba(16,41,47))',
                                                  bgcolor: 'transparent',
                                                  backdropFilter: 'blur(64px)',
                                                  WebkitBackdropFilter: 'blur(64px)',
                                                  boxShadow: '0 12px 28px rgba(0,0,0,0.35)',
                                                  borderRadius: 2,
                                                  border: 'none',         // no hard border
                                                  outline: 'none',        // no focus outline
                                                  overflow: 'hidden',

                                                  // menu items
                                                  '& .MuiMenuItem-root': {
                                                       color: 'rgba(255,255,255,0.9)',
                                                       outline: 'none',
                                                       // spacing to feel like the Select menu
                                                       py: 1,
                                                       px: 2,
                                                       '&:hover': { backgroundColor: 'rgba(34,197,94,0.12)' },
                                                       '&.Mui-selected, &.Mui-selected:hover': {
                                                            backgroundColor: 'rgba(34,197,94,0.18)',
                                                            color: '#22c55e', // green-500 for selected text
                                                       },
                                                       '&.Mui-focusVisible': { outline: 'none' },
                                                  },

                                                  // optional divider tint if you use <Divider />
                                                  '& .MuiDivider-root': {
                                                       borderColor: 'rgba(34,197,94,0.20)',
                                                  },
                                             },
                                        }}
                                   >
                                        <MenuItem
                                             onClick={fetchUserBalance}
                                             className={`${styles.menuItem} ${styles.menuItemBalance}`}
                                        >
                                             <Tooltip
                                                  title={userProfile?.username || ''}
                                                  arrow
                                                  className='lg:flex hidden '
                                                  placement='top'
                                             >
                                                  <span className={styles.usernameDisplay + " text-green-700 justify-center items-center flex w-full text-lg font-semibold"}>
                                                       {userProfile?.username || 'User'}
                                                  </span>
                                             </Tooltip>
                                        </MenuItem>
                                        <MenuItem
                                             onClick={fetchUserBalance}
                                             className={`${styles.menuItem} ${styles.menuItemBalance}`}
                                        >
                                             <RefreshIcon
                                                  className={`text-xs lg:text-sm  ${balanceLoading ? "text-green-300 animate-spin " : "text-green-700 "} `}
                                             />
                                             <CurrencyDisplay
                                                  className="text-green-700"
                                                  loading={balanceLoading}
                                                  amount={userBalance}
                                                  currency='USD'
                                             />

                                        </MenuItem>
                                        {bonusBalance > 0 && (
                                             <MenuItem
                                                  component={Link}
                                                  to='/Deposit'
                                                  onClick={handleCloseAvatar}
                                                  className={`${styles.menuItem} ${styles.menuItemBalance}`}
                                                  sx={{
                                                       color: '#facc15 !important',

                                                  }}
                                             >
                                                  <RedeemIcon className='text-green-700' />
                                                  <CurrencyDisplay
                                                       className="text-green-700"
                                                       amount={bonusBalance}
                                                       currency='USD'
                                                  />
                                             </MenuItem>
                                        )}
                                        <MenuItem
                                             component={RouterLink}
                                             to="/Settings"
                                             className={`${styles.menuItem} ${styles.menuItemBalance} `}
                                        >
                                             <SettingsIcon
                                                  fontSize='small'
                                                  className='text-green-700'
                                             />
                                             <span className='text-green-700' >
                                                  Setting
                                             </span>
                                        </MenuItem>
                                        <Divider
                                             sx={{
                                                  my: 0.5,
                                                  mx: 1.5,
                                                  borderColor: '#2196F3',
                                             }}
                                        />
                                        <Notifications
                                             closeUserMenu={handleCloseAvatar}
                                             menuItemClassName={styles.menuItem}
                                        />
                                        <Divider
                                             sx={{
                                                  m: 0.5,
                                                  borderColor: '#2196F3',
                                             }}
                                        />
                                        <MenuItem
                                             onClick={logOut}
                                             className={`${styles.menuItem}   flex items-center justify-center w-full`}
                                        >
                                             <ExitToAppIcon className='text-[#2196F3]' />
                                             <span className='text-[#2196F3]' >
                                                  Logout
                                             </span>
                                        </MenuItem>
                                   </Menu>
                              </Box>
                         </div>
                    </Toolbar>
               </StyledAppBar>
               <StyledDrawer
                    variant='permanent'
                    open={open}
                    className={` [&_.MuiDrawer-paper]:border-r
                                   [&_.MuiDrawer-paper]:border-[#142B47]/90
                              absolute lg:relative z-50
                              
                       ${open
                              ? '[&>.MuiDrawer-paper]:w-[160px] [&_.MuiDrawer-paper]:bg-linear-to-b [&_.MuiDrawer-paper]:from-[#142B47]  [&_.MuiDrawer-paper]:to-[#142B47]/90'
                              : '[&>.MuiDrawer-paper]:w-0 [&>.MuiDrawer-paper]:lg:w-[76px]'
                         }  `}
               >
                    <div className={styles.drawerPaper}>
                         <div className={styles.drawerHeader}>
                              <img
                                   src={logoT}
                                   alt='Qption Logo'
                                   className={`${styles.drawerHeaderLogo} ${!open
                                        ? styles.drawerHeaderLogoHidden
                                        : ''
                                        }`}
                              />
                              <IconButton
                                   onClick={handleDrawerClose}
                                   className={styles.drawerHeaderButton}
                                   sx={{ ...(!open && { display: 'none' }) }}
                              >
                                   <MenuOpenIcon />
                              </IconButton>
                         </div>
                         <List className={styles.drawerList}>
                              <div
                                   className={
                                        styles.drawerBalanceButtonContainer
                                   }
                              >
                                   <Button
                                        className={`${styles.drawerBalanceButton
                                             } ${!open
                                                  ? styles.drawerBalanceButtonClosed
                                                  : ''
                                             }`}
                                        onClick={fetchUserBalance}
                                   >
                                        {!open ? (
                                             <BalanceIcon
                                                  className='text-green-700'
                                                  sx={{ fontSize: '1.1rem' }}
                                             />) : (

                                             <div className='flex justify-center items-center w-full'>
                                                  <RefreshIcon
                                                       className={`text-xs lg:text-sm  ${balanceLoading ? "text-green-300 animate-spin " : "text-green-700 "} `}
                                                  />
                                                  <CurrencyDisplay
                                                       loading={balanceLoading}
                                                       amount={userBalance}
                                                       currency='USD'
                                                       className="text-green-700"
                                                  />
                                             </div>
                                        )}
                                   </Button>
                              </div>
                              {menuItems.map((item) => {
                                   const isActive =
                                        pathname === item.link ||
                                        (pathname === '/' &&
                                             item.link === '/Trading')
                                   return (
                                        <ListItemButton
                                             key={item.txt}
                                             component={Link}
                                             to={item.link}
                                             selected={isActive}
                                             onClick={handleDrawerClose}
                                             className={`${styles.listItem} ${open
                                                  ? styles.listItemOpen
                                                  : styles.listItemClosed
                                                  } ${isActive
                                                       ? styles.listItemActive
                                                       : ''
                                                  }`}
                                        >
                                             <Tooltip
                                                  title={!open ? item.txt : ''}
                                                  arrow
                                                  placement='right'
                                             >
                                                  <span
                                                       className={`${styles.listItemIcon
                                                            } ${open
                                                                 ? styles.listItemIconOpen
                                                                 : styles.listItemIconClosed
                                                            }`}
                                                  >
                                                       {React.cloneElement(
                                                            item.icon,
                                                            {
                                                                 fontSize:
                                                                      'small',
                                                            }
                                                       )}
                                                  </span>
                                             </Tooltip>
                                             <span
                                                  className={`text-green-700 ${styles.listItemText
                                                       } ${!open
                                                            ? styles.listItemTextHidden
                                                            : ''
                                                       }`}
                                             >
                                                  {item.txt}
                                             </span>
                                        </ListItemButton>
                                   )
                              })}
                         </List>
                    </div>
               </StyledDrawer>
               <Box
                    onClick={handleDrawerClose}
                    component='main'
                    className={styles.mainContent + " ml-0 lg:ml-12 min-h-screen"}
                    sx={{
                         transition: theme.transitions.create('margin', {
                              easing: theme.transitions.easing.sharp,
                              duration: open
                                   ? theme.transitions.duration.enteringScreen
                                   : theme.transitions.duration.leavingScreen,
                         }),
                    }}
               >
                    <Toolbar className={styles.contentSpacer} />
                    <Outlet />
               </Box>
          </div>
     )
}
