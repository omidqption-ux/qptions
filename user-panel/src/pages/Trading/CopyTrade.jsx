import { Tooltip, Avatar } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Button from '@mui/material/Button'
import { useState } from 'react'
import axiosInstance from '../../network/axios'
import { useDispatch } from 'react-redux'
import { addALeader } from '../../redux/slices/tradingSlice'
const CopyTrade = ({ chosenTrader, handleReset }) => {
     const dispatch = useDispatch()
     const [zarib, setZarib] = useState('1/10')
     const copyTrader = async () => {
          try {
               const res = await axiosInstance.post('/users/addLeaderTrader', {
                    leadTraderId: chosenTrader._id,
                    factor: zarib,
               })
               dispatch(addALeader(res.addedTrader))
               handleReset()
          } catch (e) { }
     }
     return (
          <div className='flex flex-col items-center justify-center'>
               <div className='py-2 flex items-center'>
                    <Avatar
                         src={
                              chosenTrader.profileImage
                                   ? chosenTrader.profileImage.startsWith(
                                        'https://lh3.googleusercontent.com'
                                   )
                                        ? chosenTrader.profileImage
                                        : `data:image/jpeg;base64,${chosenTrader.profileImage}`
                                   : '/default-avatar.png'
                         }
                         alt={chosenTrader.username}
                         className='w-10 h-10 rounded-full mr-3'
                    />
                    <span className='font-medium w-[128px] overflow-hidden truncate mx-2'>
                         <Tooltip
                              title={chosenTrader.username}
                              placement='top'
                              arrow
                         >
                              {chosenTrader.username}
                         </Tooltip>
                    </span>
                    <select
                         value={zarib}
                         onChange={(e) => setZarib(e.target.value)}
                         className='m-4 bg-[#20293E] w-[90px] rounded-lg border-none outline-none p-2 focus:ring-0'
                    >
                         <option value='1/10'>1/10X</option>
                         <option value='2/10'>2/10X</option>
                         <option value='3/10'>3/10X</option>
                         <option value='5/10'>5/10X</option>
                         <option value='1'>X</option>
                         <option value='2'>2X</option>
                         <option value='5'>5X</option>
                         <option value='10'>10X</option>
                    </select>
                    <div className='relative inline-block'>
                         <Button
                              className='bg-Orange text-Navy rounded-md px-2 py-1 font-semibold text-xs hover:bg-LightOrange'
                              variant='contained'
                              onClick={() => copyTrader(chosenTrader)}
                         >
                              <ContentCopyIcon
                                   fontSize='small'
                                   className='w-4'
                              />
                              <span className='lg:flex hidden'>copy</span>
                         </Button>
                    </div>
               </div>
               <span className='text-yellow leading-6 text-center'>
                    Every trade executed by{' '}
                    <span className='text-menuTxt'>
                         {chosenTrader.username}
                    </span>{' '}
                    will be automatically replicated in your account, scaled by
                    a factor of <span className='text-menuTxt'>{zarib}X</span>.
               </span>
          </div>
     )
}
export default CopyTrade
