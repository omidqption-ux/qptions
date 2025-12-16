import React, { useEffect, useState } from 'react'
import {
     Fade,
     CircularProgress,
     Chip,
     Box,
     Typography,
     Select,
     MenuItem,
     Card,
     CardContent,
     useMediaQuery,
     useTheme,
} from '@mui/material'
import axiosInstance from '../../network/axios'
import { useSelector, useDispatch } from 'react-redux'
import { setLeaderBoard } from '../../redux/slices/tradingSlice'
import LeaderBoardCard from './LeaderBoardCard'

const LeaderBoard = () => {
     const [period, setPeriod] = useState('weekly')
     const [type, setType] = useState('roi')
     const dispatch = useDispatch()
     const [loading, setLoading] = React.useState(false)
     const { leaderBoard } = useSelector((state) => state.trading)
     const theme = useTheme()
     const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

     const getLeadeBoard = async () => {
          try {
               setLoading(true)
               if (type === 'roi') {
                    const roiResponse = await axiosInstance.get(
                         '/trading/leaderBoardRoi',
                         {
                              query: { period },
                         }
                    )
                    dispatch(setLeaderBoard(roiResponse.sortedRoi))
               } else if (type === 'pnl') {
                    const pnlResponse = await axiosInstance.get(
                         '/trading/leaderBoardPnl',
                         {
                              query: { period },
                         }
                    )
                    dispatch(setLeaderBoard(pnlResponse.sortedNetProfit))
               } else if (type === 'polpular') {
                    const Response = await axiosInstance.get(
                         '/trading/popularTraders'
                    )
                    dispatch(setLeaderBoard(Response))
               }
          } catch (e) {
          } finally {
               setTimeout(() => {
                    setLoading(false)
               }, 500)
          }
     }

     useEffect(() => {
          getLeadeBoard()
     }, [period, type])

     const handlePeriodChange = (e) => {
          setPeriod(e.target.value)
     }
     const handleTypeChange = (v) => {
          setType(v)
     }

     return (
          <Fade
               timeout={500}
               in={true}
          >
               <Box
                    sx={{
                         width: '100%',
                         display: 'flex',
                         flexDirection: 'column',
                         alignItems: 'center',
                         gap: { xs: 2, sm: 3 },
                         p: { xs: 1, sm: 2, md: 3 },
                    }}
               >
                    <Box
                         sx={{
                              width: '100%',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: 2,
                              background: 'rgba(255, 255, 255, 0.02)',
                              backdropFilter: 'blur(10px)',
                              p: { xs: 1, sm: 2 },
                         }}
                    >
                         <div className='flex flex-row lg:flex-col' >
                              <Box
                                   sx={{
                                        justifyContent: 'center',
                                        mb: { xs: 2, sm: 3 },
                                   }}
                                   className=" w-full flex items-start flex-col lg:flex-row lg:items-center gap-1"
                              >
                                   <Chip
                                        label='Top ROI traders'
                                        onClick={() => handleTypeChange('roi')}
                                        size={isMobile ? 'small' : 'medium'}
                                        sx={{
                                             background:
                                                  type === 'roi'
                                                       ? 'rgba(33, 150, 243, 0.2)'
                                                       : 'rgba(255, 255, 255, 0.05)',
                                             color:
                                                  type === 'roi'
                                                       ? '#00d2ff'
                                                       : 'rgba(255, 255, 255, 0.7)',
                                             '&:hover': {
                                                  background:
                                                       'rgba(33, 150, 243, 0.2)',
                                                  color: '#00d2ff',
                                             },
                                        }}
                                        className='h-[32px] rounded-none text-xs lg:text-lg'
                                   />
                                   <Chip
                                        label='Top PNL traders'
                                        onClick={() => handleTypeChange('pnl')}
                                        size={isMobile ? 'small' : 'medium'}
                                        sx={{
                                             background:
                                                  type === 'pnl'
                                                       ? 'rgba(33, 150, 243, 0.2)'
                                                       : 'rgba(255, 255, 255, 0.05)',
                                             color:
                                                  type === 'pnl'
                                                       ? '#00d2ff'
                                                       : 'rgba(255, 255, 255, 0.7)',
                                             '&:hover': {
                                                  background:
                                                       'rgba(33, 150, 243, 0.2)',
                                                  color: '#00d2ff',
                                             },
                                        }}
                                        className='h-[32px] rounded-none text-xs lg:text-lg'
                                   />
                                   <Chip
                                        label='Popular traders'
                                        onClick={() => handleTypeChange('polpular')}
                                        size={isMobile ? 'small' : 'medium'}
                                        sx={{
                                             background:
                                                  type === 'polpular'
                                                       ? 'rgba(33, 150, 243, 0.2)'
                                                       : 'rgba(255, 255, 255, 0.05)',
                                             color:
                                                  type === 'polpular'
                                                       ? '#00d2ff'
                                                       : 'rgba(255, 255, 255, 0.7)',
                                             '&:hover': {
                                                  background:
                                                       'rgba(33, 150, 243, 0.2)',
                                                  color: '#00d2ff',
                                             },
                                        }}
                                        className='h-[32px] rounded-none text-xs lg:text-lg'
                                   />
                              </Box>

                              {type !== 'polpular' ? (
                                   <Box
                                        sx={{
                                             display: 'flex',
                                             justifyContent: 'flex-end',
                                             mb: 2,
                                        }}
                                   >
                                        <Select
                                             value={period}
                                             onChange={handlePeriodChange}
                                             size={isMobile ? 'small' : 'medium'}
                                             className='text-sm lg:text-md'
                                             sx={{
                                                  color: 'rgba(255,255,255,0.7)',
                                                  borderRadius: 1,

                                                  // Remove the outlined border in all states
                                                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                                  '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },

                                                  // Also catch the native fieldset selector
                                                  '& fieldset': { border: 'none' },

                                                  // Remove any focus ring/outline
                                                  '& .MuiSelect-select:focus': { outline: 'none' },
                                                  '& .MuiSelect-select': {
                                                       color: '#22c55e', // green-500
                                                       py: 0,
                                                       px: 0,
                                                       borderRadius: 1,
                                                  },
                                                  '& .MuiSelect-icon': {
                                                       color: '#86efac',            // Tailwind green-300
                                                  },
                                                  // optional: keep it green on hover/focus too
                                                  '&.Mui-focused .MuiSelect-icon, &:hover .MuiSelect-icon': {
                                                       color: '#86efac',
                                                  },

                                             }}
                                             MenuProps={{
                                                  PaperProps: {
                                                       sx: {
                                                            // DROPDOWN PANEL background
                                                            backgroundImage:
                                                                 'linear-gradient(to bottom, rgba(18,52,51), rgba(16,41,47))',
                                                            bgcolor: 'transparent',
                                                            backdropFilter: 'blur(64px)',           // optional: matches backdrop-blur-3xl
                                                            WebkitBackdropFilter: 'blur(64px)',
                                                            border: '1px solid rgba(34,197,94,0.20)',
                                                            boxShadow: '0 12px 28px rgba(0,0,0,0.35)',
                                                            color: 'rgba(255,255,255,0.9)',
                                                            // item styles
                                                            '& .MuiMenuItem-root': {
                                                                 '&:hover': {
                                                                      backgroundColor: 'rgba(34,197,94,0.12)',
                                                                 },
                                                                 '&.Mui-selected, &.Mui-selected:hover': {
                                                                      backgroundColor: 'rgba(34,197,94,0.18)',
                                                                 },
                                                            },
                                                       },
                                                  },
                                             }}
                                        >
                                             <MenuItem value="weekly" className='text-green-600 text-sm lg:text-md ' >Weekly</MenuItem>
                                             <MenuItem value="monthly" className='text-green-600 text-sm lg:text-md' >Monthly</MenuItem>
                                             <MenuItem value="yearly" className='text-green-600 text-sm lg:text-md' >Yearly</MenuItem>
                                             <MenuItem value="All Time" className='text-green-600 text-sm lg:text-md' >All Time</MenuItem>
                                        </Select>
                                   </Box>
                              ) : (
                                   <Box
                                        sx={{
                                             display: 'flex',
                                             justifyContent: 'flex-end',
                                             mb: 2,
                                        }}
                                   >
                                        <Chip
                                             label='All Time'
                                             size={isMobile ? 'small' : 'medium'}
                                             sx={{
                                                  background:
                                                       'rgba(255, 255, 255, 0.05)',
                                                  color: 'rgba(255, 255, 255, 0.7)',
                                             }}
                                        />
                                   </Box>
                              )}
                         </div>
                         <Fade
                              in={!loading}
                              timeout={500}
                         >
                              <Box
                                   sx={{
                                        minHeight: '200px',
                                        gap: { xs: 1, sm: 2 },
                                        p: { xs: 1, sm: 2 },
                                   }}
                                   className='grid grid-cols-1 1xl:grid-cols-2 3xl:grid-cols-3'
                              >
                                   {loading ? (
                                        <Box
                                             sx={{
                                                  display: 'flex',
                                                  justifyContent: 'center',
                                                  width: '100%',
                                                  gridColumn: '1 / -1',
                                             }}
                                        >
                                             <CircularProgress
                                                  sx={{ color: '#2196F3' }}
                                             />
                                        </Box>
                                   ) : (
                                        leaderBoard &&
                                        leaderBoard.length > 0 &&
                                        leaderBoard.map((data, index) => (
                                             <LeaderBoardCard
                                                  key={index}
                                                  data={data}
                                                  rank={index + 1}
                                                  period={period}
                                             />
                                        ))
                                   )}
                              </Box>
                         </Fade>

                         <Box
                              sx={{
                                   display: 'flex',
                                   flexDirection: 'column',
                                   gap: { xs: 1, sm: 2 },
                                   mt: { xs: 2, sm: 3 },
                              }}
                         >
                              <Card
                                   sx={{
                                        border: '1px solid rgba(0, 100, 0, 0.2)',
                                        borderRadius: 2,
                                   }}
                                   style={{
                                        background: 'linear-gradient(to bottom,rgba(34, 197, 94, 0.10),rgba(34, 197, 94, 0.05))'
                                   }}
                              >
                                   <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                                        <Typography
                                             component='div'
                                             variant={
                                                  isMobile ? 'caption' : 'body2'
                                             }
                                             className='text-[#00d2ff] flex items-center'
                                        >
                                             ROI =
                                             <Box
                                                  component='span'
                                                  sx={{
                                                       display: 'inline-flex',
                                                       flexDirection: 'column',
                                                       alignItems: 'center',
                                                       mx: 1,
                                                  }}
                                             >
                                                  <Typography
                                                       component='span'
                                                       variant={
                                                            isMobile
                                                                 ? 'caption'
                                                                 : 'body2'
                                                       }
                                                  >
                                                       Net Profit (PNL)
                                                  </Typography>
                                                  <Box
                                                       sx={{
                                                            width: '100%',
                                                            height: '1px',
                                                            background:
                                                                 '#00d2ff',
                                                            my: 0.5,
                                                       }}
                                                  />
                                                  <Typography
                                                       component='div'
                                                       variant={
                                                            isMobile
                                                                 ? 'caption'
                                                                 : 'body2'
                                                       }
                                                  >
                                                       Initial Investment
                                                  </Typography>
                                             </Box>
                                             × 100%
                                        </Typography>
                                   </CardContent>
                              </Card>
                              <Card
                                   sx={{
                                        border: '1px solid rgba(0, 100, 0, 0.2)',
                                        borderRadius: 2,
                                   }}
                                   style={{
                                        background: 'linear-gradient(to bottom,rgba(34, 197, 94, 0.10),rgba(34, 197, 94, 0.05))'
                                   }}
                              >
                                   <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                                        <Typography
                                             component='div'
                                             variant={
                                                  isMobile ? 'caption' : 'body2'
                                             }
                                             className='text-[#00d2ff]'
                                        >
                                             PNL =
                                             <Box
                                                  component='span'
                                                  sx={{
                                                       display: 'inline-flex',
                                                       alignItems: 'center',
                                                       mx: 1,
                                                  }}
                                             >
                                                  <Typography
                                                       variant={
                                                            isMobile
                                                                 ? 'caption'
                                                                 : 'body2'
                                                       }
                                                  >
                                                       Q<sub>units</sub> ×
                                                  </Typography>
                                                  (P<sub>sell</sub> – P
                                                  <sub>buy</sub>)
                                             </Box>
                                        </Typography>
                                        <Typography
                                             variant={
                                                  isMobile ? 'caption' : 'body2'
                                             }
                                             className='text-gray-400 my-1'
                                        >
                                             If you bought Q<sub>units</sub> of
                                             an asset at a price of P
                                             <sub>buy</sub> and sold them at P
                                             <sub>sell</sub>
                                        </Typography>
                                   </CardContent>
                              </Card>
                         </Box>
                    </Box>
               </Box>
          </Fade >
     )
}

export default LeaderBoard
