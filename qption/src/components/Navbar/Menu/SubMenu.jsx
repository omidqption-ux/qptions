'use client'

import React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

const SubMenu = ({ menuItems, item }) => {
     const [anchorEl, setAnchorEl] = React.useState(null)
     const open = Boolean(anchorEl)
     const handleClick = (event) => {
          setAnchorEl(event.currentTarget)
     }
     const handleClose = () => {
          setAnchorEl(null)
     }
     return (
          <>
               <span
                    onClick={handleClick}
                    className='transition-all hover:text-DarkBlue hover:-translate-y-0.5 hover:scale-110 duration-300 cursor-pointer mx-2 '
               >
                    {item}
               </span>
               <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    slotProps={{
                         paper: {
                              elevation: 0,
                              sx: {
                                   overflow: 'visible',
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
                                        left: '50%',
                                        width: 10,
                                        height: 10,
                                        bgcolor: '#0D5C75',
                                        transform:
                                             'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                   },
                              },
                         },
                    }}
                    transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                    className='[&>.MuiPaper-root]:bg-linear-to-b [&>.MuiPaper-root]:from-DarkBlue [&>.MuiPaper-root]:from-35% [&>.MuiPaper-root]:via-LightBlue [&>.MuiPaper-root]:via-100%  [&>.MuiPaper-root]:to-DarkBlue [&>.MuiPaper-root]:to-50%'
               >
                    {menuItems.map((item, index) => (
                         <MenuItem
                              className='transition-all hover:text-DarkBlue  hover:scale-105 duration-300 text-OffWhite text-sm font-semibold'
                              onClick={handleClose}
                              key={item.title + '-' + index}
                         >
                              {item.title}
                         </MenuItem>
                    ))}
               </Menu>
          </>
     )
}
export default SubMenu
