import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setReferrals } from '../../redux/slices/userSlice'
import axiosInstance from '../../network/axios'
import {
     Fade,
     LinearProgress,
     Box,
     Divider
} from '@mui/material'
import { formatDateTime } from '../../utils/timeAgo'
import DownIcon from '@mui/icons-material/KeyboardArrowDown'
import UpIcon from '@mui/icons-material/KeyboardArrowUp'

const Referrals = () => {
     const dispatch = useDispatch()
     const [loading, setLoading] = useState(false)
     const [total, setTotal] = useState(0)
     const [sortColumn, setSortColumn] = useState('createdAt')
     const [sortDirection, setSortDirection] = useState('desc')

     const { referrals } = useSelector((store) => store.user)

     const getReferrals = async (page = 1) => {
          try {
               setLoading(true)
               const res = await axiosInstance.get('/users/getUserReferrals', {
                    params: {
                         page,
                         limit: 10,
                         sortColumn,
                         sortDirection,
                    },
               })
               setTotal(res.count)
               dispatch(setReferrals(res.referrals))
          } catch (e) {
          } finally {
               setLoading(false)
          }
     }

     useEffect(() => {
          getReferrals()
     }, [sortColumn, sortDirection])

     const handleSort = (column) => {
          if (sortColumn === column) {
               setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
          } else {
               setSortColumn(column)
               setSortDirection('asc')
          }
     }

     const getRewardAmount = (totalTradeAmount) => {
          if (totalTradeAmount < 2500) return '0'
          if (totalTradeAmount < 10000) return '25 USDT'
          if (totalTradeAmount < 25000) return '50 USDT'
          if (totalTradeAmount < 50000) return '75 USDT'
          if (totalTradeAmount < 100000) return '125 USDT'
          if (totalTradeAmount < 500000) return '200 USDT'
          if (totalTradeAmount < 1500000) return '1000 USDT'
          if (totalTradeAmount < 3000000) return '2500 USDT'
          return '5000 USDT'
     }

     return (
          <Box className="w-full lg:px-10">
               <div className='bg-gradient-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl px-2 overflow-x-scroll thin-scrollbar'>
                    <div className='text-lg font-medium  w-full p-6 rounded-t-sm text-green-700 '>
                         Referrals List
                    </div>
                    <div className='grid grid-cols-4 place-items-center py-3 text-green-500 text-xs lg:text-sm'>
                         <span
                              className='cursor-pointer'
                              onClick={() => handleSort('username')}
                         >
                              Username
                              {sortColumn === 'username' &&
                                   (sortDirection === 'asc' ? (
                                        <UpIcon fontSize='small' />
                                   ) : (
                                        <DownIcon fontSize='small' />
                                   ))}
                         </span>
                         <span
                              className='cursor-pointer'
                              onClick={() => handleSort('totalTradeAmount')}
                         >
                              Amount
                              {sortColumn === 'totalTradeAmount' &&
                                   (sortDirection === 'asc' ? (
                                        <UpIcon fontSize='small' />
                                   ) : (
                                        <DownIcon fontSize='small' />
                                   ))}
                         </span>
                         <span
                              className='cursor-pointer'
                              onClick={() => handleSort('createdAt')}
                         >
                              Date
                              {sortColumn === 'createdAt' &&
                                   (sortDirection === 'asc' ? (
                                        <UpIcon fontSize='small' />
                                   ) : (
                                        <DownIcon fontSize='small' />
                                   ))}
                         </span>
                         <span
                              className='cursor-pointer'
                              onClick={() => handleSort('totalTradeAmount')}
                         >
                              Your Profit
                              {sortColumn === 'totalTradeAmount' &&
                                   (sortDirection === 'asc' ? (
                                        <UpIcon fontSize='small' />
                                   ) : (
                                        <DownIcon fontSize='small' />
                                   ))}
                         </span>
                    </div>
                    {loading ? (
                         <Box className='w-full'>
                              <LinearProgress color='success' className='text-green-300 bg-green-800 mx-5 h-0.5' />
                         </Box>
                    ) : (
                         <Divider className='bg-green-800 mx-5' />
                    )}
                    <Fade
                         timeout={500}
                         in={!loading}
                    >

                         <div className='min-w-[1010px] text-xs lg:text-sm' >

                              {referrals && referrals.length > 0 ? (
                                   referrals.map((referral) => (
                                        <div key={referral.createdAt}>
                                             <div className='grid grid-cols-4 place-items-center py-3 text-green-500'>
                                                  <span>{referral.username}</span>
                                                  <span>{referral.totalTradeAmount} USDT</span>
                                                  <span>{formatDateTime(referral.createdAt)}</span>
                                                  <span>
                                                       <Box sx={{
                                                            color: '#00d2ff',
                                                            fontWeight: 600
                                                       }}>
                                                            {getRewardAmount(referral.totalTradeAmount)}
                                                       </Box>
                                                  </span>
                                             </div>
                                             <Divider className='bg-green-800' />
                                        </div>
                                   ))
                              ) : (
                                   <span className=' flex justify-center text-center w-full text-green-800 py-4'>
                                        No Referral&apos;s been found!
                                   </span>
                              )}
                         </div>
                    </Fade>
               </div>
          </Box>
     )
}

export default Referrals
