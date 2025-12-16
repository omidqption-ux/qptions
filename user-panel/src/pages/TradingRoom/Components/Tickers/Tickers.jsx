import { useState } from 'react'
import { Menu, Zoom } from '@mui/material'
import LeftMenu from './LeftMenu'
import TickersList from './TickersList'

const Tickers = ({
     anchorEl,
     open,
     handleClose,
}) => {
     const [loading, setLoading] = useState(false)
     const [value, setValue] = useState("")
     const safeClose = (e) => {
          const active = document.activeElement
          if (active && active instanceof HTMLElement) active.blur()
          handleClose?.(e)
          queueMicrotask(() => anchorEl?.focus?.())
     }
     return (
          <Menu
               anchorEl={anchorEl}
               open={open}
               onClose={safeClose}
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
                                   bgcolor: '#334155',
                                   transform: 'translateY(-50%) rotate(45deg)',
                                   zIndex: 0,
                              },
                         },
                    },
               }}
               keepMounted
               TransitionComponent={Zoom}
               MenuListProps={{ autoFocus: false }}
               TransitionProps={{
                    timeout: { enter: 440, exit: 120 },
                    onExit: () => {
                         const el = document.activeElement
                         if (el && el instanceof HTMLElement) el.blur()
                    },
                    onExited: () => anchorEl?.focus?.(),
               }}
               transformOrigin={{ horizontal: 'center', vertical: 'top' }}
               anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
               className='[&>.MuiPaper-root>ul.css-1toxriw-MuiList-root-MuiMenu-list]:pt-0 
                    [&>.MuiPaper-root]:rounded-md [&>.MuiPaper-root]:bg-Navy-700'
          >
               <div className='flex w-full gap-2'>
                    <div className='flex flex-col xl:p-2 px-2 py-1'>
                         <LeftMenu setLoading={setLoading} setValue={setValue} />
                         <TickersList
                              handleClose={safeClose}
                              loading={loading}
                              setLoading={setLoading}
                              setValue={setValue}
                              value={value}
                         />
                    </div>
               </div>
          </Menu>
     )
}
export default Tickers
