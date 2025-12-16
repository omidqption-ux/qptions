import React from 'react'
import Alert from '@mui/material/Alert'
import { Snackbar } from '@mui/material'
import { closeTradeMessage } from '../../../../redux/slices/tradingRoomSlices/tradeSlice'
import { useDispatch, useSelector } from 'react-redux'

const CustomSnackBar = () => {
     const dispatch = useDispatch()
     const handleClose = () => {
          dispatch(closeTradeMessage())
     }
     const { tradeMessage } = useSelector((store) => store.trade)

     return (
          <Snackbar
               anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
               }}
               open={tradeMessage.isOpen}
               onClose={handleClose}
               key={Math.random(1, 100000)}
               autoHideDuration={3000}
               className='absolute bottom-10 left-1/2 text-xs'
          >
               <Alert
                    onClose={handleClose}
                    severity={tradeMessage.isBuy ? 'success' : 'error'}
                    variant='filled'
                    sx={{ width: '100%' }}
               >
                    {tradeMessage.message}
               </Alert>
          </Snackbar>
     )
}
export default CustomSnackBar
