import React, { useEffect, useState } from 'react'
import axiosInstance from '../../network/axios'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Button from '@mui/material/Button'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import { Tooltip } from '@mui/material'
import Fade from '@mui/material/Fade'
import Collapse from '@mui/material/Collapse'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CopyTrade from './CopyTrade'
import { useSelector, useDispatch } from 'react-redux'
import { setLeaders, setFollowings } from '../../redux/slices/tradingSlice'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import { Avatar } from '@mui/material'
import { Box, Typography, Stack } from '@mui/material'

const steps = ['Choose your trader', 'Copy Trades']

const FollowingAndCopy = ({ unFollow, removingIds = [], setRemovingIds = () => { } }) => {
     const dispatch = useDispatch()
     const [activeStep, setActiveStep] = React.useState(0)
     const [chosenTrader, setChosenTrader] = React.useState({})
     const { followings = [], leaders = [] } = useSelector((store) => store.trading)

     const handleNext = () => {
          setActiveStep((prevActiveStep) => prevActiveStep + 1)
     }

     const handleBack = (step) => {
          if (step < activeStep) setActiveStep(step)
     }

     const handleReset = () => {
          setActiveStep(0)
     }

     const copyTrades = async (trader) => {
          setChosenTrader(trader)
          handleNext()
     }

     const fetchFollowData = async () => {
          try {
               const [followingsResponse, leadersResponse] = await Promise.all([
                    axiosInstance.get('/users/getFollowing'),
                    axiosInstance.get('/users/getLeaderTraders'),
               ])
               dispatch(setFollowings(followingsResponse))
               dispatch(setLeaders(leadersResponse))
          } catch (err) {
               console.error('Error fetching follow data:', err)
          }
     }

     useEffect(() => {
          fetchFollowData()
     }, [])

     const stopCopying = async (userId) => {
          try {
               await axiosInstance.post('/users/removeLeaderTrader', {
                    leadTraderId: userId,
               })
               setTimeout(() => {
                    dispatch(
                         setLeaders(
                              leaders.filter(
                                   (leader) =>
                                        leader.leadTraderId._id !== userId
                              )
                         )
                    )
                    setRemovingIds((prev) =>
                         prev.filter((removedId) => removedId !== userId)
                    )
               }, 500)
          } catch (e) {
               console.error('Error stopping copy:', e)
          }
     }

     return (
          <Box sx={{
               width: '100%',
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               gap: 2
          }}>
               <Stepper
                    activeStep={activeStep}
                    sx={{
                         width: '100%',
                         mb: 2,
                         // base circle color
                         '& .MuiStepLabel-root .MuiStepIcon-root': {
                              color: 'rgba(255,255,255,0.18)', // idle bg
                         },
                         // active & completed circle color
                         '& .MuiStepLabel-root .Mui-active .MuiStepIcon-root, & .MuiStepLabel-root .Mui-completed .MuiStepIcon-root': {
                              color: '#00d2ff', // green-500
                         },
                         // optional: connector color
                         '& .MuiStepConnector-line': {
                              borderColor: '#00d2ff',
                         },
                    }}
               >
                    {steps.map((label, index) => {
                         const stepProps = {}
                         const labelProps = {}
                         return (
                              <Step
                                   key={label}
                                   {...stepProps}
                                   onClick={() => handleBack(index)}
                              >
                                   <StepLabel
                                        {...labelProps}
                                        sx={{
                                             cursor: index < activeStep ? 'pointer' : 'default'
                                        }}
                                   >
                                        <Typography className='text-gray-300 text-xs lg:text-lg' >
                                             {label}
                                        </Typography>
                                   </StepLabel>
                              </Step>
                         )
                    })}
               </Stepper>

               <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                    <Button
                         color='inherit'
                         disabled={activeStep === 0}
                         onClick={() => handleBack(activeStep - 1)}
                         sx={{
                              display: activeStep === 0 ? 'none' : 'flex',
                              color: 'rgba(255, 255, 255, 0.7)',
                              borderColor: 'rgba(255, 255, 255, 0.1)'
                         }}
                    >
                         <ArrowBackIcon fontSize='small' sx={{ mr: 1 }} />
                         Back
                    </Button>
               </Box>

               {activeStep === 0 && (
                    <Stack spacing={2} sx={{ width: '100%' }}>
                         {followings && followings.length > 0 ? (
                              followings.map((following) => (
                                   <Collapse
                                        timeout={500}
                                        in={!removingIds.includes(following._id)}
                                        unmountOnExit
                                        key={following._id}
                                   >
                                        <Fade
                                             in={!removingIds.includes(following._id)}
                                             unmountOnExit
                                        >
                                             <Box sx={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'space-between',
                                                  p: 2,
                                                  borderRadius: 1,
                                                  background: 'rgba(255, 255, 255, 0.02)',
                                                  '&:hover': {
                                                       background: 'rgba(255, 255, 255, 0.05)'
                                                  }
                                             }}>
                                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                       <Avatar
                                                            src={
                                                                 following.profileImage
                                                                      ? following.profileImage.startsWith('https://lh3.googleusercontent.com')
                                                                           ? following.profileImage
                                                                           : `data:image/jpeg;base64,${following.profileImage}`
                                                                      : 'default-avatar.png'
                                                            }
                                                            alt={following.username}
                                                            sx={{
                                                                 width: 40,
                                                                 height: 40,
                                                                 border: '2px solid rgba(255, 255, 255, 0.1)'
                                                            }}
                                                       />
                                                       <Tooltip title={following.username} placement="top" arrow>
                                                            <Typography sx={{
                                                                 mx: 2,
                                                                 color: 'rgba(255, 255, 255, 0.9)',
                                                                 fontWeight: 500,
                                                                 maxWidth: '120px',
                                                                 overflow: 'hidden',
                                                                 textOverflow: 'ellipsis'
                                                            }}>
                                                                 {following.username}
                                                            </Typography>
                                                       </Tooltip>
                                                  </Box>

                                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                                       {!leaders.some(
                                                            (leader) =>
                                                                 leader.leadTraderId &&
                                                                 leader.leadTraderId._id === following._id
                                                       ) ? (
                                                            <>
                                                                 <Tooltip title="Unfollow" placement="top" arrow>
                                                                      <Button
                                                                           onClick={() => unFollow(following._id)}
                                                                           sx={{
                                                                                background: 'rgba(255, 255, 255, 0.05)',
                                                                                color: 'rgba(255, 255, 255, 0.7)',
                                                                                '&:hover': {
                                                                                     background: 'rgba(255, 0, 0, 0.1)'
                                                                                }
                                                                           }}
                                                                      >
                                                                           <PersonRemoveIcon sx={{ mr: 1 }} />
                                                                           <Typography sx={{ display: { xs: 'none', lg: 'block' } }}>
                                                                                Unfollow
                                                                           </Typography>
                                                                      </Button>
                                                                 </Tooltip>

                                                                 <Tooltip title="Copy trades" placement="top" arrow>
                                                                      <Button
                                                                           onClick={() => copyTrades(following)}
                                                                           sx={{
                                                                                background: 'rgba(255, 255, 255, 0.05)',
                                                                                color: 'rgba(255, 255, 255, 0.7)',
                                                                                '&:hover': {
                                                                                     background: 'rgba(33, 150, 243, 0.1)'
                                                                                }
                                                                           }}
                                                                      >
                                                                           <ContentCopyIcon sx={{ mr: 1 }} />
                                                                           <Typography sx={{ display: { xs: 'none', lg: 'block' } }}>
                                                                                Copy trades
                                                                           </Typography>
                                                                      </Button>
                                                                 </Tooltip>
                                                            </>
                                                       ) : (
                                                            <Tooltip title="Stop copying" placement="top" arrow>
                                                                 <Button
                                                                      onClick={() => stopCopying(following._id)}
                                                                      sx={{
                                                                           background: 'rgba(255, 255, 255, 0.05)',
                                                                           color: 'rgba(255, 255, 255, 0.7)',
                                                                           '&:hover': {
                                                                                background: 'rgba(255, 0, 0, 0.1)'
                                                                           }
                                                                      }}
                                                                 >
                                                                      <ContentCutIcon sx={{ mr: 1 }} />
                                                                      <Typography sx={{ display: { xs: 'none', lg: 'block' } }}>
                                                                           Stop copying
                                                                      </Typography>
                                                                 </Button>
                                                            </Tooltip>
                                                       )}
                                                  </Box>
                                             </Box>
                                        </Fade>
                                   </Collapse>
                              ))
                         ) : (
                              <Typography sx={{
                                   color: 'rgba(255, 255, 255, 0.6)',
                                   textAlign: 'center',
                                   py: 2
                              }}>
                                   You are not following anyone yet.
                              </Typography>
                         )}
                    </Stack>
               )}

               {activeStep === 1 && (
                    <CopyTrade
                         chosenTrader={chosenTrader}
                         handleReset={handleReset}
                    />
               )}
          </Box>
     )
}

export default FollowingAndCopy
