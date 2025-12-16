import React, { useEffect, useState } from 'react'
import axiosInstance from '../../network/axios'
import {
     Button,
     Tooltip,
     Fade,
     Collapse,
     Avatar,
     CircularProgress,
     Select,
     MenuItem,
     Box,
     Typography,
     Card,
     CardContent,
     Stack,
     IconButton
} from '@mui/material'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import FollowingAndCopy from './Following'
import { useSelector, useDispatch } from 'react-redux'
import {
     setLeaders,
     setFollowers,
     setFollowings,
     updateLeaders,
} from '../../redux/slices/tradingSlice'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns'

const FollowersFollowings = () => {
     const dispatch = useDispatch()
     const [loading, setLoading] = useState(false)
     const [removingIds, setRemovingIds] = useState([])
     const { followers, followings, leaders } = useSelector((store) => store.trading)
     const [updateLeadersLoading, setupdateLeadersLoading] = useState(null)

     useEffect(() => {
          const fetchFollowData = async () => {
               try {
                    setLoading(true)
                    const [
                         followersResponse,
                         followingsResponse,
                         leadersResponse,
                    ] = await Promise.all([
                         axiosInstance.get('/users/getFollowers'),
                         axiosInstance.get('/users/getFollowing'),
                         axiosInstance.get('/users/getLeaderTraders'),
                    ])
                    dispatch(setFollowers(followersResponse))
                    dispatch(setFollowings(followingsResponse))
                    dispatch(setLeaders(leadersResponse))
               } catch (err) {
               } finally {
                    setLoading(false)
               }
          }

          fetchFollowData()
          return () => {
               dispatch(setFollowers([]))
               dispatch(setFollowings([]))
               dispatch(setLeaders([]))
          }
     }, [])

     const unFollow = async (followingId) => {
          try {
               await axiosInstance.post('/users/unFollowUser', {
                    userId: followingId,
               })
               setTimeout(() => {
                    dispatch(
                         setFollowings(
                              followings.filter(
                                   (following) => following._id !== followingId
                              )
                         )
                    )
                    setRemovingIds((prev) =>
                         prev.filter((removedId) => removedId !== followingId)
                    )
               }, 500)
          } catch (e) {
          } finally {
          }
     }

     const removeFollower = async (followerId) => {
          try {
               await axiosInstance.post('/users/removeFollower', {
                    userId: followerId,
               })
               setTimeout(() => {
                    dispatch(
                         setFollowers(
                              followers.filter(
                                   (follower) => follower._id !== followerId
                              )
                         )
                    )
                    setRemovingIds((prev) =>
                         prev.filter((removedId) => removedId !== followerId)
                    )
               }, 500)
          } catch (e) {
          } finally {
          }
     }

     const follow = async (userId) => {
          try {
               const res = await axiosInstance.post('/users/followUser', {
                    userId,
               })
               setTimeout(() => {
                    dispatch(setFollowings([...followings, res.user]))
                    setRemovingIds((prev) =>
                         prev.filter((removedId) => removedId !== userId)
                    )
               }, 500)
          } catch (e) {
          } finally {
          }
     }

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
          } catch (e) { }
     }

     const changeCopyingFactor = async (factor, leadTraderId) => {
          try {
               setupdateLeadersLoading(leadTraderId)
               const res = await axiosInstance.post(
                    '/users/changeFactorOfLeader',
                    {
                         leadTraderId,
                         factor,
                    }
               )
               dispatch(updateLeaders(res.leader))
          } catch (e) {
          } finally {
               setupdateLeadersLoading(null)
          }
     }

     return (
          <Fade timeout={500} in={!loading}>
               <Box sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    p: 3
               }}>
                    <Stack direction={{ xs: 'column', xl: 'row' }} spacing={3}>
                         <Box
                              className='flex flex-1 bg-gradient-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl'
                         >
                              <CardContent>
                                   <Box
                                        sx={{
                                             display: 'flex',
                                             alignItems: 'center',
                                             gap: 1,
                                             mb: 2
                                        }}
                                        cla
                                   >
                                        <FollowTheSignsIcon sx={{ color: '#00d2ff' }} />
                                        <Typography
                                             variant="h6"
                                             sx={{
                                                  fontWeight: 600
                                             }}
                                             className='text-gray-300'
                                        >
                                             Followers
                                        </Typography>
                                   </Box>

                                   {followers.length === 0 ? (
                                        <Typography className='text-gray-400'>
                                             You have no followers yet.
                                        </Typography>
                                   ) : (
                                        <Stack spacing={2}>
                                             {followers.map((follower) => (
                                                  <Collapse
                                                       timeout={500}
                                                       in={!removingIds.includes(follower.id)}
                                                       unmountOnExit
                                                       key={follower.id}
                                                  >
                                                       <Fade
                                                            timeout={500}
                                                            in={!removingIds.includes(follower.id)}
                                                            unmountOnExit
                                                       >
                                                            <Box sx={{
                                                                 display: 'flex',
                                                                 alignItems: 'center',
                                                                 p: 1,
                                                                 borderRadius: 1,
                                                                 '&:hover': {
                                                                      background: 'rgba(255, 255, 255, 0.02)'
                                                                 }
                                                            }}>
                                                                 <Avatar
                                                                      src={
                                                                           follower.profileImage
                                                                                ? follower.profileImage.startsWith('https://lh3.googleusercontent.com')
                                                                                     ? follower.profileImage
                                                                                     : `data:image/jpeg;base64,${follower.profileImage}`
                                                                                : 'default-avatar.png'
                                                                      }
                                                                      alt={follower.username}
                                                                      sx={{
                                                                           width: 40,
                                                                           height: 40,
                                                                           border: '2px solid rgba(255, 255, 255, 0.1)'
                                                                      }}
                                                                 />
                                                                 <Tooltip title={follower.username} placement="top" arrow>
                                                                      <Typography sx={{
                                                                           mx: 2,
                                                                           color: 'rgba(255, 255, 255, 0.9)',
                                                                           fontWeight: 500,
                                                                           maxWidth: '120px',
                                                                           overflow: 'hidden',
                                                                           textOverflow: 'ellipsis'
                                                                      }}>
                                                                           {follower.username}
                                                                      </Typography>
                                                                 </Tooltip>
                                                                 <Box sx={{ ml: 'auto' }}>
                                                                      <Tooltip title="Remove follower" placement="top" arrow>
                                                                           <IconButton
                                                                                onClick={() => removeFollower(follower._id)}
                                                                                sx={{
                                                                                     background: 'rgba(255, 255, 255, 0.05)',
                                                                                     '&:hover': {
                                                                                          background: 'rgba(255, 0, 0, 0.1)'
                                                                                     }
                                                                                }}
                                                                           >
                                                                                <PersonRemoveIcon sx={{ color: '#F44336' }} />
                                                                           </IconButton>
                                                                      </Tooltip>
                                                                      {!followings.find(
                                                                           (following) =>
                                                                                following._id === follower._id
                                                                      ) && (
                                                                                <Tooltip title="Follow back" placement="top" arrow>
                                                                                     <IconButton
                                                                                          onClick={() => follow(follower._id)}
                                                                                          sx={{
                                                                                               ml: 1,
                                                                                               background: 'rgba(255, 255, 255, 0.05)',
                                                                                               '&:hover': {
                                                                                                    background: 'rgba(76, 175, 80, 0.1)'
                                                                                               }
                                                                                          }}
                                                                                     >
                                                                                          <PersonAddIcon sx={{ color: '#4CAF50' }} />
                                                                                     </IconButton>
                                                                                </Tooltip>
                                                                           )}
                                                                 </Box>
                                                            </Box>
                                                       </Fade>
                                                  </Collapse>
                                             ))}
                                        </Stack>
                                   )}
                              </CardContent>
                         </Box>

                         <Box
                              className='flex flex-1 bg-gradient-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl'>
                              <CardContent>
                                   <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        mb: 2
                                   }}>
                                        <EmojiEventsIcon sx={{ color: '#FFD700' }} />
                                        <Typography variant="h6" sx={{
                                             fontWeight: 600
                                        }}
                                             className='text-gray-300'
                                        >
                                             Leaders
                                        </Typography>
                                   </Box>

                                   {leaders.length === 0 ? (
                                        <Typography className='text-gray-400' >
                                             You are not copying any traders yet.
                                        </Typography>
                                   ) : (
                                        <Stack spacing={2}>
                                             {leaders.map((leader) => (
                                                  <Collapse
                                                       timeout={500}
                                                       in={!removingIds.includes(leader.leadTraderId._id)}
                                                       unmountOnExit
                                                       key={leader.leadTraderId._id}
                                                  >
                                                       <Fade
                                                            timeout={500}
                                                            in={!removingIds.includes(leader.leadTraderId._id)}
                                                            unmountOnExit
                                                       >
                                                            <Box sx={{
                                                                 display: 'flex',
                                                                 alignItems: 'center',
                                                                 p: 1,
                                                                 borderRadius: 1,
                                                                 '&:hover': {
                                                                      background: 'rgba(255, 255, 255, 0.02)'
                                                                 }
                                                            }}>
                                                                 <Avatar
                                                                      src={
                                                                           leader.leadTraderId.profileImage
                                                                                ? leader.leadTraderId.profileImage.startsWith('https://lh3.googleusercontent.com')
                                                                                     ? leader.leadTraderId.profileImage
                                                                                     : `data:image/jpeg;base64,${leader.leadTraderId.profileImage}`
                                                                                : 'default-avatar.png'
                                                                      }
                                                                      alt={leader.leadTraderId.username}
                                                                      sx={{
                                                                           width: 40,
                                                                           height: 40,
                                                                           border: '2px solid rgba(255, 255, 255, 0.1)'
                                                                      }}
                                                                 />
                                                                 <Tooltip title={leader.leadTraderId.username} placement="top" arrow>
                                                                      <Typography sx={{
                                                                           mx: 2,
                                                                           color: 'rgba(255, 255, 255, 0.9)',
                                                                           fontWeight: 500,
                                                                           maxWidth: '120px',
                                                                           overflow: 'hidden',
                                                                           textOverflow: 'ellipsis'
                                                                      }}>
                                                                           {leader.leadTraderId.username}
                                                                      </Typography>
                                                                 </Tooltip>
                                                                 <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                      <Select
                                                                           value={leader.factor}
                                                                           onChange={(e) => changeCopyingFactor(e.target.value, leader.leadTraderId._id)}
                                                                           size="small"
                                                                           sx={{
                                                                                background: 'rgba(255, 255, 255, 0.05)',
                                                                                color: 'rgba(255, 255, 255, 0.7)',
                                                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                                                borderRadius: 1,
                                                                                '& .MuiSelect-select': {
                                                                                     py: 0.5,
                                                                                     px: 1
                                                                                }
                                                                           }}
                                                                      >
                                                                           <MenuItem value={0.25}>25%</MenuItem>
                                                                           <MenuItem value={0.5}>50%</MenuItem>
                                                                           <MenuItem value={0.75}>75%</MenuItem>
                                                                           <MenuItem value={1}>100%</MenuItem>
                                                                      </Select>
                                                                      {updateLeadersLoading === leader.leadTraderId._id ? (
                                                                           <CircularProgress size={20} sx={{ color: '#2196F3' }} />
                                                                      ) : (
                                                                           <Tooltip title="Stop copying" placement="top" arrow>
                                                                                <IconButton
                                                                                     onClick={() => stopCopying(leader.leadTraderId._id)}
                                                                                     sx={{
                                                                                          background: 'rgba(255, 255, 255, 0.05)',
                                                                                          '&:hover': {
                                                                                               background: 'rgba(255, 0, 0, 0.1)'
                                                                                          }
                                                                                     }}
                                                                                >
                                                                                     <ContentCutIcon sx={{ color: '#F44336' }} />
                                                                                </IconButton>
                                                                           </Tooltip>
                                                                      )}
                                                                 </Box>
                                                            </Box>
                                                       </Fade>
                                                  </Collapse>
                                             ))}
                                        </Stack>
                                   )}
                              </CardContent>
                         </Box>
                    </Stack>

                    <FollowingAndCopy />
               </Box>
          </Fade>
     )
}

export default FollowersFollowings
