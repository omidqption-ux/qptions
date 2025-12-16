import * as React from 'react'
import {
     Card,
     CardContent,
     Avatar,
     Button,
     Fade,
     Box,
     Typography,
     Stack,
} from '@mui/material'
import axiosInstance from '../../network/axios'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import PercentIcon from '@mui/icons-material/Percent'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

export default function LeaderBoardCard({ data, period, rank }) {
     const [loading, setLoading] = React.useState(false)
     const [userInfo, setUserInfo] = React.useState(null)
     const [isFollowing, setIsFollowing] = React.useState(null)

     React.useEffect(() => {
          getUserPublicInfo()
     }, [data.userId])
     const getUserPublicInfo = async () => {
          try {
               const resp = await axiosInstance.get(
                    '/users/getUserPublicInfo',
                    {
                         params: { userId: data.userId },
                    }
               )
               setUserInfo(resp)
          } catch (e) { }
     }
     const follow = async () => {
          try {
               setLoading(true)
               await axiosInstance.post('/users/followUser', {
                    userId: data.userId,
               })
               setIsFollowing(!isFollowing)
          } catch (e) {
          } finally {
               setLoading(false)
          }
     }

     const unFollow = async () => {
          try {
               setLoading(true)
               await axiosInstance.post('/users/unFollowUser', {
                    userId: data.userId,
               })
               setIsFollowing(!isFollowing)
          } catch (e) {
          } finally {
               setLoading(false)
          }
     }

     const isFollowingF = async () => {
          try {
               setLoading(true)
               const resp = await axiosInstance.post('/users/isFollowing', {
                    userId: data.userId,
               })
               setIsFollowing(resp.isFollowing)
          } catch (e) {
          } finally {
               setLoading(false)
          }
     }

     React.useEffect(() => {
          isFollowingF()
     }, [])

     return (
          <Card
               sx={{
                    width: { xs: '100%', sm: 360 },
                    background: 'rgba(0, 100, 0, 0.1)',
                    border: '1px solid rgba(0, 100, 0, 0.2)',
                    borderRadius: 2,
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                         transform: 'translateY(-5px)',
                         boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    },
               }}
          >
               <Box
                    sx={{
                         position: 'absolute',
                         top: 0,
                         left: 0,
                         background:
                              'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
                         color: '#1a1f2e',
                         fontSize: { xs: '0.65rem', sm: '0.75rem' },
                         px: { xs: 1, sm: 1.5 },
                         py: { xs: 0.25, sm: 0.5 },
                         fontWeight: 600,
                         borderRadius: '0 0 8px 0',
                         boxShadow: 'inset 0 0 0 4px rgba(254, 234, 154, 0.5)',
                         zIndex: 1,
                         minWidth: { xs: '20px', sm: '24px' },
                         textAlign: 'center',
                    }}
                    className="select-none"
               >
                    {rank}
               </Box>

               <Box sx={{ p: { xs: 1.5, sm: 2 }, pl: { xs: 3, sm: 4 } }}>
                    <Box
                         sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: { xs: 0.5, sm: 1 },
                              flexDirection: { xs: 'column', sm: 'row' },
                              gap: { xs: 1, sm: 0 },
                         }}
                    >
                         <Box
                              sx={{
                                   display: 'flex',
                                   alignItems: 'center',
                                   gap: 1,
                                   width: '100%',
                              }}
                         >
                              <Avatar
                                   src={
                                        userInfo && userInfo.profileImage
                                             ? userInfo.profileImage.startsWith(
                                                  'https://lh3.googleusercontent.com'
                                             )
                                                  ? userInfo.profileImage
                                                  : `data:image/jpeg;base64,${userInfo.profileImage}`
                                             : '/default-avatar.png'
                                   }
                                   sx={{
                                        width: { xs: 32, sm: 40 },
                                        height: { xs: 32, sm: 40 },
                                        border: '2px solid rgba(255, 255, 255, 0.1)',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                   }}
                              >
                                   {userInfo &&
                                        userInfo.username
                                             ?.slice(0, 1)
                                             .toUpperCase()}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                   <Typography
                                        component='span'
                                        variant='subtitle1'
                                        title={userInfo && userInfo.username}
                                        sx={{
                                             color: 'rgba(255, 255, 255, 0.9)',
                                             fontWeight: 600,
                                             fontSize: {
                                                  xs: '0.75rem',
                                                  sm: '0.875rem',
                                             },
                                        }}
                                        className='mx-1'
                                   >
                                        {userInfo &&
                                             (userInfo.username.length > 12
                                                  ? userInfo.username.slice(
                                                       0,
                                                       12
                                                  ) + '...'
                                                  : userInfo.username ||
                                                  'Qption user')}
                                   </Typography>
                                   <Typography
                                        component='span'
                                        variant='body2'
                                        sx={{
                                             color: 'rgba(255, 255, 255, 0.6)',
                                             fontSize: {
                                                  xs: '0.65rem',
                                                  sm: '0.75rem',
                                             },
                                        }}
                                   >
                                        {userInfo && userInfo.followersCount}{' '}
                                        Followers
                                   </Typography>
                              </Box>
                         </Box>

                         {!loading && (
                              <Fade
                                   timeout={1000}
                                   in={!loading}
                              >
                                   <Button
                                        variant='contained'
                                        onClick={
                                             isFollowing ? unFollow : follow
                                        }
                                        sx={{
                                             background: isFollowing
                                                  ? 'linear-gradient(45deg, #2196F3 30%, #1976D2 90%)'
                                                  : 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
                                             color: isFollowing
                                                  ? '#fff'
                                                  : '#1a1f2e',
                                             borderRadius: 2,
                                             px: { xs: 1, sm: 1.5 },
                                             py: { xs: 0.25, sm: 0.5 },
                                             fontSize: {
                                                  xs: '0.65rem',
                                                  sm: '0.75rem',
                                             },
                                             fontWeight: 600,
                                             textTransform: 'none',
                                             minWidth: {
                                                  xs: '70px',
                                                  sm: '80px',
                                             },
                                             width: { xs: '100%', sm: 'auto' },
                                             '&:hover': {
                                                  background: isFollowing
                                                       ? 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)'
                                                       : 'linear-gradient(45deg, #FFA500 30%, #FFD700 90%)',
                                             },
                                        }}
                                   >
                                        {isFollowing ? (
                                             <>
                                                  <RemoveIcon
                                                       fontSize='small'
                                                       sx={{ mr: 0.2 }}
                                                  />
                                                  Unfollow
                                             </>
                                        ) : (
                                             <>
                                                  <AddIcon
                                                       fontSize='small'
                                                       sx={{ mr: 0.2 }}
                                                  />
                                                  Follow
                                             </>
                                        )}
                                   </Button>
                              </Fade>
                         )}
                    </Box>

                    <CardContent sx={{ p: 0 }}>
                         <Stack
                              direction='row'
                              spacing={1}
                              sx={{ mb: { xs: 0.5, sm: 1 } }}
                         >
                              <Box
                                   sx={{
                                        flex: 1,
                                        textAlign: 'center',
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        borderRadius: 1,
                                        p: { xs: 0.75, sm: 1 },
                                   }}
                              >
                                   <Typography
                                        variant='body2'
                                        sx={{
                                             color: 'rgba(255, 255, 255, 0.6)',
                                             fontSize: {
                                                  xs: '0.65rem',
                                                  sm: '0.75rem',
                                             },
                                             mb: { xs: 0.25, sm: 0.5 },
                                        }}
                                   >
                                        {period.toUpperCase()} ROI
                                   </Typography>
                                   <Typography
                                        variant='h6'
                                        sx={{
                                             color: '#FFD700',
                                             display: 'flex',
                                             alignItems: 'center',
                                             justifyContent: 'center',
                                             gap: 0.5,
                                             fontSize: {
                                                  xs: '0.875rem',
                                                  sm: '1rem',
                                             },
                                        }}
                                   >
                                        {parseFloat(data.roi?.toFixed(4))}
                                        <PercentIcon
                                             sx={{
                                                  fontSize: { xs: 14, sm: 16 },
                                             }}
                                        />
                                   </Typography>
                              </Box>
                              <Box
                                   sx={{
                                        flex: 1,
                                        textAlign: 'center',
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        borderRadius: 1,
                                        p: { xs: 0.75, sm: 1 },
                                   }}
                              >
                                   <Typography
                                        variant='body2'
                                        sx={{
                                             color: 'rgba(255, 255, 255, 0.6)',
                                             fontSize: {
                                                  xs: '0.65rem',
                                                  sm: '0.75rem',
                                             },
                                             mb: { xs: 0.25, sm: 0.5 },
                                        }}
                                   >
                                        {period.toUpperCase()} PNL
                                   </Typography>
                                   <Typography
                                        variant='h6'
                                        sx={{
                                             color: '#FFD700',
                                             display: 'flex',
                                             alignItems: 'center',
                                             justifyContent: 'center',
                                             gap: 0.5,
                                             fontSize: {
                                                  xs: '0.875rem',
                                                  sm: '1rem',
                                             },
                                        }}
                                   >
                                        {data.totalNetProfit}
                                        <AttachMoneyIcon
                                             sx={{
                                                  fontSize: { xs: 14, sm: 16 },
                                             }}
                                        />
                                   </Typography>
                              </Box>
                         </Stack>
                    </CardContent>
               </Box>
          </Card>
     )
}
