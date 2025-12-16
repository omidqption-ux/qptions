import { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import CssBaseline from '@mui/material/CssBaseline'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import { Button, Tooltip, IconButton, List } from '@mui/material'
import axiosInstance from './network/axios'
import { useDispatch, useSelector } from 'react-redux'
import {
     setMode,
     setTradingRoom,
     setCollapsedMenu,
} from './redux/slices/tradingRoomSlices/tradingRoomSlice'
import { useNavigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import SupportIcon from '@mui/icons-material/SupportAgentRounded'
import BalanceIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import RadarIcon from '@mui/icons-material/Radar'
import ZoomOutMapRoundedIcon from '@mui/icons-material/ZoomOutMapRounded'
import ZoomInMapRoundedIcon from '@mui/icons-material/ZoomInMapRounded'
import Navbar from './pages/TradingRoom/Components/Navbar'
import CurrencyDisplay from './components/NumberFormat/NumberFormat'
import { setUserSettings } from './redux/slices/userSlice'
import logo from './assets/logo.png'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import PeopleIcon from '@mui/icons-material/People'
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import BottomTradesHistory from './pages/TradingRoom/Components/TradeHistory/BottomTradesHistory'
import { playClick } from './utils/sounds'
import { resetActiveTicker } from "./redux/slices/tradingRoomSlices/tickerSlice"
import { toast } from 'react-toastify'
import Loading from './components/Loading/Loading'
import DepositIcon from '@mui/icons-material/CreditScore'

const drawerWidth = 160
const openedMixin = (theme) => ({
     width: drawerWidth,
     transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: 300,
     }),
     overflowX: 'hidden',
})
const closedMixin = (theme) => ({
     transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: 300,
     }),
     overflowX: 'hidden',
     width: `calc(${theme.spacing(7)} + 1px)`,
     [theme.breakpoints.up('sm')]: {
          width: `calc(${theme.spacing(8)} + 1px)`,
     },
})
const DrawerHeader = styled('div')(({ theme }) => ({
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'flex-end',
     padding: theme.spacing(0, 1),
     // necessary for content to be below app bar
     ...theme.mixins.toolbar,
}))
const AppBar = styled(MuiAppBar, {
     shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
     zIndex: theme.zIndex.drawer + 1,
     transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: 300,
     }),
     variants: [
          {
               props: ({ open }) => open,
               style: {
                    marginLeft: drawerWidth,
                    width: `calc(100% - ${drawerWidth}px)`,
                    transition: theme.transitions.create(['width', 'margin'], {
                         easing: theme.transitions.easing.sharp,
                         duration: 300,
                    }),
               },
          },
     ],
}))

const Drawer = styled(MuiDrawer, {
     shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
     width: drawerWidth,
     flexShrink: 0,
     whiteSpace: 'nowrap',
     boxSizing: 'border-box',
     variants: [
          {
               props: ({ open }) => open,
               style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
               },
          },
          {
               props: ({ open }) => !open,
               style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
               },
          },
     ],
}))

export default function MiniDrawer({ socket }) {
     const dispatch = useDispatch()
     const navigate = useNavigate()
     const [isFullScreen, setisFullScreen] = useState(false)
     const [open, setOpen] = useState(false)
     const [balanceLoading, setBalanceLoading] = useState(true)
     const [tickerIsActive, setTickerIsActive] = useState(false)
     const { fetchLoading } = useSelector((store) => store.trade)

     const {
          balance: userBalance,
          userSettings,
     } = useSelector((state) => state.user)
     const handleDrawerOpen = (e) => {
          e.stopPropagation()
          setOpen(true)
     }
     const handleDrawerClose = () => {
          setOpen(false)
     }
     //// active ticker
     const { activeTicker } = useSelector(store => store.ticker)
     const checkTickermarketStatus = async () => {
          try {
               const res = await axiosInstance.get('/tickers/checkMarketStatus', { params: { market: activeTicker.market } })
               if (!res.isOpen) {
                    toast("Forex is closed right now, so we've switched you to crypto.", { type: 'error' })
                    dispatch(resetActiveTicker())
                    setTickerIsActive(false)
               }
               else setTickerIsActive(true)
          } catch (e) { }
     }
     useEffect(() => {
          checkTickermarketStatus()
     }, [activeTicker.symbol])
     ///// avatar menu
     const getUserTradingRoomInfo = async () => {
          try {
               const tradingRoomRes = await axiosInstance.post(
                    '/tradingRoom/setTradingRoom'
               )
               const responseSettings = await axiosInstance.get(
                    'users/settings'
               )
               dispatch(setUserSettings(responseSettings))
               dispatch(setTradingRoom({ tradingRoomId: tradingRoomRes._id }))
               dispatch(setMode('real'))
          } catch (e) {
          } finally {
               setBalanceLoading(false)
          }
     }
     useEffect(() => {
          getUserTradingRoomInfo()
          return () => setBalanceLoading(true)
     }, [])

     const getMenuItemIcon = (text) => {
          switch (text) {
               case 'Chat':
                    return <SupportIcon fontSize='small' />
               case 'Deposit':
                    return <DepositIcon fontSize='small' />
               case 'Positions':
                    return <RadarIcon fontSize='small' />
               case 'Social Trading':
                    return <PeopleIcon fontSize='small' />
               case 'Signal':
                    return <SignalCellularAltIcon fontSize='small' />
               case 'Tournament':
                    return <EmojiEventsIcon fontSize='small' />
          }
     }
     const toggleFullScreen = () => {
          userSettings.soundControl.notification && playClick()
          if (!document.fullscreenElement) {
               document.documentElement.requestFullscreen().catch((err) => {
                    alert(
                         `Error attempting to enable full-screen mode: ${err.message}`
                    )
               })
               setisFullScreen(true)
          } else {
               document.exitFullscreen()
               setisFullScreen(false)
          }
     }
     const handleChange = (e, secCollapsedItem) => {
          userSettings.soundControl.notification && playClick()
          e.stopPropagation()
          handleDrawerClose()
          if (secCollapsedItem === 'Deposit') {
               navigate('/Deposit')
               navigate(0)
          }
          else if (secCollapsedItem === 'Chat') toggleChat()
          else dispatch(setCollapsedMenu(secCollapsedItem))
     }
     const handleClickAway = () => {
          handleDrawerClose()
          dispatch(setCollapsedMenu(''))
     }
     useEffect(() => {
          const style = document.createElement('style')
          style.innerHTML = `
            /* hide the minimized launcher forever */
            #chat-widget-minimized {
              display: none !important;
            }
          `
          document.head.appendChild(style)

          /* 2 ─ Load LiveChat as usual */
          window.__lc = window.__lc || {}
          window.__lc.license = 19355391

          const script = document.createElement('script')
          script.src = 'https://cdn.livechatinc.com/tracking.js'
          script.async = true
          document.body.appendChild(script)

          const hide = (n) => n && n.style && (n.style.display = 'none')
          const mo = new MutationObserver((muts) =>
               muts.forEach((m) =>
                    m.addedNodes.forEach((n) => {
                         if (
                              n.id === 'chat-widget-minimized' ||
                              n.querySelector?.('#chat-widget-minimized')
                         ) {
                              hide(
                                   n.id === 'chat-widget-minimized'
                                        ? n
                                        : n.querySelector(
                                             '#chat-widget-minimized'
                                        )
                              )
                         }
                    })
               )
          )
          mo.observe(document.body, { childList: true, subtree: true })
          return () => {
               mo.disconnect()
               document.body.removeChild(script)
               document.head.removeChild(style)
          }
     }, [])
     const openWhenReady = () => {
          if (
               window.LC_API &&
               typeof window.LC_API.open_chat_window === 'function'
          ) {
               window.LC_API.open_chat_window()
          } else {
               setTimeout(openWhenReady, 150)
          }
     }

     const toggleChat = () => {
          openWhenReady() // no error, just opens when ready
     }
     const toggleSoundSettings = async () => {
          try {
               const response = await axiosInstance.put(
                    '/users/userSoundSettings',
                    {
                         ...userSettings.soundControl,
                         notification: !userSettings.soundControl.notification,
                    }
               )
               dispatch(
                    setUserSettings({
                         ...userSettings,
                         soundControl: response.soundControl,
                    })
               )
          } catch (e) { }
     }
     return (
          <Box className='select-none relative flex bg-darkStart'>
               <CssBaseline />
               <AppBar className={`z-0 bg-footerBg`}>
                    <Toolbar
                         onClick={handleClickAway}
                         className={`w-full z-50 h-[50px] transition-transform duration-300 bg-footerBg`}
                         style={{ transition: 'transform 1s ease' }}
                    >
                         <IconButton
                              color='inherit'
                              onClick={(e) => handleDrawerOpen(e)}
                              className={` lg:ml-14 hidden lg:flex `}
                         >
                              <MenuIcon className='text-[#3B82F6]' /> {/*>lg screen */}
                         </IconButton>
                         <Navbar socket={socket} />
                    </Toolbar>
               </AppBar>
               <Drawer
                    variant='permanent'
                    open={open}
                    className={` [&_.MuiDrawer-paper]:border-r [&_.MuiDrawer-paper]:border-LightNavy
                              absolute lg:relative z-50
                       ${open
                              ? '[&>.MuiDrawer-paper]:w-[160px]'
                              : '[&>.MuiDrawer-paper]:w-0 [&>.MuiDrawer-paper]:lg:w-[76px]'
                         }  `}
               >
                    <DrawerHeader
                         className={`flex justify-end bg-darkStart text-sm `}
                    >
                         <img
                              src={logo}
                              alt='qption'
                              className={`w-[80px] mx-auto`}
                         />
                         <IconButton
                              onClick={handleClickAway}
                              className={`${open ? 'flex' : 'hidden'} `}
                         >
                              <MenuOpenIcon
                                   className={`text-menuTxt ${open ? 'flex' : 'hidden'
                                        } `}
                              />
                         </IconButton>
                    </DrawerHeader>
                    <List className='bg-darkStart h-full text-menuTxt flex justify-between flex-col'>
                         <div className='flex flex-col gap-1  justify-start items-center w-full '>
                              <div className='w-full flex justify-center mb-2'>
                                   <Button
                                        className={`text-xs bg-ethBlue my-1  min-w-fit transition-all duration-300 mx-2 hidden xl:flex`}
                                        variant='contained  '
                                   >
                                        {open ? (
                                             <div className='flex items-center'>
                                                  <BalanceIcon
                                                       fontSize='small'
                                                       className={`mx-2`}
                                                  />
                                                  <span className='w-[122px] flex flex-start'  >
                                                       {
                                                            <CurrencyDisplay
                                                                 amount={Number(
                                                                      userBalance
                                                                 )}
                                                                 currency='USD'
                                                                 loading={
                                                                      balanceLoading
                                                                 }
                                                            />
                                                       }
                                                  </span>
                                             </div>
                                        ) : (
                                             <Tooltip
                                                  arrow
                                                  title={
                                                       <CurrencyDisplay
                                                            amount={Number(
                                                                 userBalance
                                                            )}
                                                            currency='USD'
                                                            loading={balanceLoading}
                                                       />
                                                  }
                                                  placement='top-start'
                                                  className='flex justify-center items-center '
                                             >
                                                  <BalanceIcon fontSize='small' />
                                             </Tooltip>
                                        )}
                                   </Button>
                              </div>
                              {[
                                   { txt: 'Deposit', link: 'Deposit' },
                                   {
                                        txt: 'Social Trading',
                                        link: 'SocialTrading',
                                   },
                                   { txt: 'Signal', link: 'Signal' },
                                   { txt: 'Tournament', link: 'Tournament' },
                                   { txt: 'Chat', link: 'Chat' },
                              ].map((item, index) => (
                                   <Button
                                        key={index}
                                        className='text-xs bg-footerBg min-w-fit hover:bg-LightNavy transition-all duration-300'
                                        variant='contained'
                                        onClick={(e) =>
                                             handleChange(e, item.link)
                                        }
                                   >
                                        <Tooltip
                                             title={open ? '' : item.txt}
                                             placement='right'
                                             arrow
                                             className='flex justify-center items-center'
                                        >
                                             <div className='flex'>
                                                  {getMenuItemIcon(item.txt)}
                                                  <span
                                                       className={`${open
                                                            ? 'flex'
                                                            : 'hidden'
                                                            }`}
                                                  >
                                                       <span className='w-[110px] flex flex-start mx-2'>
                                                            {item.txt}
                                                       </span>
                                                  </span>
                                             </div>
                                        </Tooltip>
                                   </Button>
                              ))}
                         </div>

                         <div className='w-full bg-transparent flex mb-5 justify-around' >
                              <button
                                   onClick={toggleSoundSettings}
                                   className='flex flex-col items-center justify-center p-2 bg-DarkGreen  text-lightGrey text-xs group'>
                                   {userSettings.soundControl.notification ? (
                                        <VolumeUpIcon className="transition-colors group-hover:text-LightGray" fontSize='small' />
                                   ) : (
                                        <VolumeOffIcon className="transition-colors group-hover:text-LightGray" fontSize='small' />
                                   )}
                              </button>
                              <button
                                   onClick={toggleFullScreen}
                                   className='flex flex-col items-center justify-center p-2 bg-DarkGreen  text-lightGrey text-xs group'
                              >
                                   {isFullScreen ? (
                                        <ZoomInMapRoundedIcon className="transition-colors group-hover:text-LightGray" fontSize='small' />
                                   ) : (
                                        <ZoomOutMapRoundedIcon className="transition-colors group-hover:text-LightGray" fontSize='small' />
                                   )}
                              </button>
                         </div>
                    </List>
               </Drawer>
               <Box
                    onClick={handleClickAway}
                    component='main'
                    className={` ${open ? 'lg:ml-0' : 'lg:ml-2'
                         }  mt-[64px] h-[calc(100vh-64px)]  text-sm font-normal p-1 leading-8 bg-gradient-to-b from-darkStart via-darkStart to-LightNavy w-full flex flex-col items-center justify-center text-menuTxt`}
               >
                    {!balanceLoading && tickerIsActive && (
                         <Outlet />
                    )}
                    {
                         fetchLoading && <Loading />
                    }

               </Box>
               <BottomTradesHistory
                    sideDraweropen={open}
                    drawerWidth={drawerWidth}
               />
          </Box>
     )
}
