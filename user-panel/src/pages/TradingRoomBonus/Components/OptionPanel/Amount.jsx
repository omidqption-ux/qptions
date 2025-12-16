import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import { IconButton, InputAdornment, Menu, Zoom } from '@mui/material'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import CalculateIcon from '@mui/icons-material/Calculate'
import AiOutlineMinus from '@mui/icons-material/Remove'
import AiOutlinePlus from '@mui/icons-material/Add'
import Calculator from './Calculator'
import { useSelector, useDispatch } from 'react-redux'
import {
     chnageAmountIzZero,
     setAmount,
} from '../../../../redux/slices/tradingRoomSlices/tradeSlice'
import { styled, keyframes } from '@mui/system'
import { setAmountIsMoreThanBalance } from '../../../../redux/slices/tradingRoomSlices/tradingRoomSlice'
import { playClick, playLose } from '../../../../utils/sounds'

const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`

const ShakingDiv = styled('div')(({ shake }) => ({
     display: 'inline-block',
     animation: shake ? `${shakeAnimation} 0.3s ease-in-out` : 'none',
}))

const Amount = () => {
     const dispatch = useDispatch()

     const {
          bonusBalance,
          userSettings,
     } = useSelector((store) => store.user)
     const { mode } = useSelector((store) => store.tradingRoom)

     const [anchorEl, setAnchorEl] = React.useState(null)
     const open = Boolean(anchorEl)

     const handleClick = (event) => {
          setAnchorEl(event.currentTarget)
     }
     const handleClose = () => {
          setAnchorEl(null)
     }
     const { amount, amountIsZero } = useSelector((store) => store.trade)
     const [isIncrement, setIsIncrement] = useState(null) // Track animation direction

     const handleIncrement = (e) => {
          e.stopPropagation()
          userSettings.soundControl.notification && playClick()
          if (amount >= Math.floor(bonusBalance)) {
               dispatch(setAmountIsMoreThanBalance())
               userSettings.soundControl.notification && playLose()
               return
          }
          setIsIncrement(true)
          dispatch(setAmount({ amount: amount + 1 }))
     }
     const handleDecrement = (e) => {
          e.stopPropagation()
          userSettings.soundControl.notification && playClick()
          setIsIncrement(false)
          dispatch(
               setAmount({ amount: amount > 0 ? amount - 1 : 0 + 1 })
          )
     }
     const changeAmount = (raw) => {
          // keep only digits
          const digitsOnly = String(raw).replace(/\D+/g, "");

          // allow clearing the field
          if (digitsOnly === "") {
               dispatch(setAmount({ amount: "" }));
               return;
          }

          let num = parseInt(digitsOnly, 10);
          if (!Number.isFinite(num)) return;

          // clamp to positive integers (>= 1)
          if (num < 1) num = 1;

          // balance guard (strictly less than bonuBalance as you had)
          if (num >= bonusBalance) {
               dispatch(setAmountIsMoreThanBalance());
               return;
          }

          dispatch(setAmount({ amount: Number(num) }));
     }
     useEffect(() => {
          if (amountIsZero)
               setTimeout(
                    () =>
                         dispatch(
                              chnageAmountIzZero({
                                   amountIsZero: false,
                              })
                         ),
                    500
               )
          return () => {
               dispatch(setAmount({ amount: 10 }))
          }
     }, [amountIsZero])

     return (
          <div className='w-full px-1' >
               <div className='items-center gap-1 lg:flex hidden'>
                    <span className={`text-xs font-semibold text-menuTxt`}>
                         Amount
                    </span>
                    <HelpOutlineRoundedIcon className='w-[16px]' />
               </div>
               <ShakingDiv shake={amountIsZero}>
                    <div className='relative flex w-full  items-center justify-center'>
                         <button
                              onClick={(e) => handleIncrement(e)}
                              className={`absolute right-0 -top-0.5 z-10 flex h-1/2 w-[16px] group items-center justify-center bg-gray-500 hover:-translate-y-[1px]`}
                         >
                              <AiOutlinePlus className='h-[12px] w-[12px] text-xl text-gray-100 group-hover:text-green-300' />
                         </button>
                         <button
                              onClick={(e) => handleDecrement(e)}
                              className={`absolute -bottom-0.5 right-0 z-10 flex h-1/2 w-[16px] group items-center justify-center bg-gray-500 hover:translate-y-[1px]`}
                         >
                              <AiOutlineMinus className='h-[12px] w-[12px] text-xl text-gray-100 group-hover:text-red-500' />
                         </button>
                         <TextField
                              onChange={(e) => changeAmount(e.target.value)}
                              onKeyDown={(e) => {
                                   // Block non-integer entry keys
                                   if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                              }}
                              type="number"
                              variant="outlined"
                              placeholder="10"
                              value={amount}
                              onAnimationEnd={() => setIsIncrement(null)} // Reset animation
                              sx={{
                                   height: '30px',
                                   width: '100%',
                                   backgroundColor: '#161C2A',
                                   borderRadius: '2px', // Rounded corners
                                   '& .MuiOutlinedInput-root': {
                                        height: '30px',
                                        color: amountIsZero ? 'red' : '#AFBCDE', // Text color
                                        padding: 0,
                                        alignItems: 'center',
                                        '&:hover fieldset': {
                                             borderColor: 'transparent', // No border on hover
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                             border: 'none', // Removes the default border as well
                                        },
                                   },
                                   '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
                                   {
                                        display: 'none',
                                   },
                                   '& input[type=number]': {
                                        MozAppearance: 'textfield',
                                   },
                              }}
                              inputProps={{
                                   min: 1,
                                   step: 1,
                                   inputMode: 'numeric',
                                   pattern: '\\d*',
                                   className: 'text-center',
                                   cursor: 'pointer',
                                   style: {
                                        transition: 'transform 0.2s ease, color 0.2s ease',
                                        transform:
                                             isIncrement === null
                                                  ? 'scale(1)'
                                                  : isIncrement
                                                       ? 'scale(1.2)'
                                                       : 'scale(0.8)',
                                        color:
                                             isIncrement === null
                                                  ? 'inherit'
                                                  : isIncrement
                                                       ? '#26A079'
                                                       : '#EA4335',
                                   },
                              }}
                              InputProps={{
                                   style: { fontSize: '12px' },
                                   startAdornment: (
                                        <InputAdornment
                                             position='start'
                                             onClick={handleClick}
                                        >
                                             <IconButton
                                                  sx={{
                                                       color: '#ffffff', // Default icon color
                                                       cursor: 'pointer',
                                                       '&:hover': {
                                                            color: '#b3b8c9', // Lighter color on hover
                                                       },
                                                       backgroundColor:
                                                            '#3C4459',
                                                  }}
                                                  className='rounded-none lg:h-[28px] h-[15px] lg:w-[28px] w-[15px]'
                                             >
                                                  <CalculateIcon
                                                       className={`text-blue-300`}
                                                  />
                                             </IconButton>
                                        </InputAdornment>
                                   ),
                              }}
                         />
                    </div>
               </ShakingDiv>
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
                                        bgcolor: '#334155',
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
                    [&>.MuiPaper-root]:rounded-md [&>.MuiPaper-root]:bg-Navy-700'
               >
                    <Calculator
                         closeCalc={handleClose}
                    />
               </Menu>
          </div>
     )
}

export default Amount
