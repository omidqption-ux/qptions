import React from 'react'
import { Menu, Zoom } from '@mui/material'
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import TimeFreames from './TimeFreames'
import { useSelector } from 'react-redux'
import { formatTimeSmall } from '../../../../utils/timeAgo'
import { playClick } from '../../../../utils/sounds'
const CustomTextField = () => {
     const { timer } = useSelector((store) => store.trade)
     const { userSettings } = useSelector((store) => store.user)
     const [anchorEl, setAnchorEl] = React.useState(null)
     const open = Boolean(anchorEl)
     const handleClick = (event) => {
          userSettings.soundControl.notification && playClick()
          setAnchorEl(event.currentTarget)
     }
     const handleClose = () => {
          setAnchorEl(null)
     }

     return (
          <div className='w-full px-1' >
               <div className='items-center gap-1 hidden lg:flex'>
                    <span className={`text-menuTxt text-xs font-semibold `}>
                         Time
                    </span>
                    <HelpOutlineRoundedIcon
                         className={`w-[16px] text-menuTxt `}
                    />
               </div>
               <div
                    onClick={handleClick}
                    className='cursor-pointer flex items-center justify-center bg-[#161C2A] 
                         rounded-xs  h-[30px]  text-xs    '
               >
                    <HourglassEmptyRoundedIcon className='lg:text-16 text-[16px]' />
                    {formatTimeSmall(timer)}
               </div>
               <Menu
                    keepMounted
                    TransitionComponent={Zoom}
                    TransitionProps={{
                         timeout: { enter: 440, exit: 320 },
                         onExit: () => {
                              const el = document.activeElement
                              if (el && el instanceof HTMLElement) el.blur()
                         },
                         onExited: () => anchorEl?.focus?.(),
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
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
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: '#22293D',
                                        transform:
                                             'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                   },
                              },
                         },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    className='[&>.MuiPaper-root>ul.css-1toxriw-MuiList-root-MuiMenu-list]:pt-0 
                    [&>.MuiPaper-root]:rounded-md [&>.MuiPaper-root]:bg-Navy-700 [&>.MuiPaper-root]:border-none'
               >
                    <TimeFreames
                         handleClose={handleClose}
                    />
               </Menu>
          </div>
     )
}

export default CustomTextField
