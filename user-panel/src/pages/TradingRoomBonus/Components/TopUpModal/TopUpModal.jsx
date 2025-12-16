import * as React from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import CloseIcon from '@mui/icons-material/Close'
import { Checkbox, Divider } from '@mui/material'

const style = {
     position: 'absolute',
     top: '50%',
     left: '50%',
     transform: 'translate(-50%, -50%)',
     width: 400,
     boxShadow: 24,
     p: 4,
}

const TopUp = ({ open, handleClose }) => {
     return (
          <div>
               <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby='Login'
                    aria-describedby='qption login'
               >
                    <Box
                         sx={style}
                         className='flex flex-col justify-center bg-black bg-opacity-40 backdrop-blur-lg py-6 rounded-lg shadow-lg relative'
                    >
                         <CloseIcon
                              onClick={handleClose}
                              className='text-OffWhite cursor-pointer absolute top-4 right-3  hover:scale-110 duration-300'
                         />
                         <Box className='w-full text-OffWhite'>
                              <div className='flex flex-col gap-4 h-[200px]'>
                                   <div className='flex items-center'>
                                        <Checkbox />
                                        <span className='text-xs text-lightGrey hover:text-footerTxt'>
                                             You don not have enough balance
                                        </span>
                                   </div>
                              </div>
                              <Divider />
                         </Box>
                    </Box>
               </Modal>
          </div>
     )
}
export default TopUp
