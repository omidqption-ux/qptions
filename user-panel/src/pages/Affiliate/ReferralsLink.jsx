import { useEffect, useState } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import {
     Box,
     Tooltip,
     Typography,
     Stepper,
     Step,
     StepLabel,
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableRow,
     IconButton,
} from '@mui/material'
import DoneIcon from '@mui/icons-material/Done'
import InfoIcon from '@mui/icons-material/Info'
import axiosInstance from '../../network/axios'
import { setReferalLink } from '../../redux/slices/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import {
     FaUserFriends,
     FaUserTie,
     FaCrown,
} from 'react-icons/fa'

const steps = [
     {
          title: 'Share your invite link.',
          desc: 'Refer a friend new to Qption and make sure they use your link to register',
     },
     {
          title: 'Level Up & Receive',
          desc: '30-Days progression starts immediately after the referred user has created an account',
     },
     {
          title: 'Get 5,000 USDT',
          desc: 'Your friends activity level will determine your reward',
     },
]

export const rewardLevels = [
     // BASIC (5–10%)
     { key: "basic-1", tier: "basic", label: "Basic 1", level: 1, points: '2,500', rewardAmount: 25, rewardPct: 5 },
     { key: "basic-2", tier: "basic", label: "Basic 2", level: 2, points: '10,000', rewardAmount: 50, rewardPct: 7.5 },
     { key: "basic-3", tier: "basic", label: "Basic 3", level: 3, points: '25,000', rewardAmount: 75, rewardPct: 10 },

     // PRO (10–15%)
     { key: "pro-1", tier: "pro", label: "Pro 1", level: 4, points: '50,000', rewardAmount: 125, rewardPct: 10 },
     { key: "pro-2", tier: "pro", label: "Pro 2", level: 5, points: '100,000', rewardAmount: 200, rewardPct: 12.5 },
     { key: "pro-3", tier: "pro", label: "Pro 3", level: 6, points: '500,000', rewardAmount: '1,000', rewardPct: 15 },

     // ELITE (15–20%)
     { key: "elite-1", tier: "elite", label: "Elite 1", level: 7, points: '1,500,000', rewardAmount: '2,500', rewardPct: 15 },
     { key: "elite-2", tier: "elite", label: "Elite 2", level: 8, points: '3,000,000', rewardAmount: '5,000', rewardPct: 17.5 },
     { key: "elite-3", tier: "elite", label: "Elite 3", level: 9, points: '6,000,000', rewardAmount: '10,000', rewardPct: 20 },
];

const ReferralLink = () => {
     const [isCopied, setIsCopied] = useState(false)
     const dispatch = useDispatch()
     const { referalLink } = useSelector((store) => store.user)

     const handleCopy = (inputValue) => {
          navigator.clipboard
               .writeText(inputValue)
               .then(() => {
                    setIsCopied(true)
                    setTimeout(() => setIsCopied(false), 2000)
               })
               .catch((err) => console.error('Failed to copy: ', err))
     }

     const getReferalLink = async () => {
          try {
               const referalLinkRes = await axiosInstance.get(
                    '/users/generateReferralLink'
               )
               dispatch(setReferalLink(referalLinkRes.referralLink))
          } catch (e) { }
     }

     useEffect(() => {
          getReferalLink()
     }, [])


     return (
          <Box className="w-full px-2 lg:px-10" >
               <Box
                    sx={{
                         display: 'flex',
                         flexDirection: { xs: 'column', lg: 'row' },
                         gap: { xs: 2, lg: 3 },
                    }}
               >
                    <Box
                         elevation={0}
                         className='bg-gradient-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-5 md:p-4 border border-green-500/20 flex flex-col '
                         sx={{
                              flex: 1,
                              background: 'transparent',
                              borderRadius: '12px',
                              p: { xs: 1.5, sm: 2, md: 3 },
                         }}
                    >
                         <Typography
                              variant='h6'
                              sx={{
                                   fontWeight: 600,
                                   mb: 3,
                                   fontSize: {
                                        xs: '1rem',
                                        sm: '1.1rem',
                                        md: '1.25rem',
                                   },
                                   textAlign: { xs: 'center', md: 'left' },
                              }}
                              className='text-gray-300'
                         >
                              How does it work?
                         </Typography>
                         <Stepper
                              activeStep={3}
                              orientation='vertical'
                              sx={{
                                   '& .MuiStepLabel-root .Mui-completed': {
                                        color: '#00d2ff',
                                   },
                                   '& .MuiStepLabel-root .Mui-active': {
                                        color: '#00d2ff',
                                   },
                              }}
                         >
                              {steps.map((label) => (
                                   <Step key={label.title}>
                                        <StepLabel>
                                             <Typography
                                                  sx={{
                                                       fontWeight: 500,
                                                       fontSize: {
                                                            xs: '0.85rem',
                                                            sm: '0.9rem',
                                                            md: '1rem',
                                                       },
                                                  }}
                                                  className='text-green-400'
                                             >
                                                  {label.title}
                                             </Typography>
                                             <Typography
                                                  sx={{
                                                       fontSize: {
                                                            xs: '0.7rem',
                                                            sm: '0.75rem',
                                                            md: '0.8rem',
                                                       },
                                                       mt: 0.5,
                                                  }}
                                                  className=''
                                             >
                                                  {label.desc}
                                             </Typography>
                                        </StepLabel>
                                   </Step>
                              ))}
                         </Stepper>
                    </Box>
                    <Box
                         elevation={0}
                         className='w-full bg-gradient-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-5 md:p-4 border border-green-500/20 flex flex-col '
                         sx={{
                              flex: 1,
                              borderRadius: '12px',
                              p: { xs: 1.5, sm: 2, md: 3 },
                         }}
                    >
                         <Typography
                              variant='h6'
                              sx={{
                                   fontWeight: 600,
                                   mb: 2,
                                   fontSize: {
                                        xs: '1rem',
                                        sm: '1.1rem',
                                        md: '1.25rem',
                                   },
                                   textAlign: { xs: 'center', md: 'left' },
                              }}
                              className='text-gray-300'
                         >
                              Reward levels
                         </Typography>
                         <Typography
                              variant='body2'
                              sx={{
                                   mb: 3,
                                   fontSize: {
                                        xs: '0.8rem',
                                        sm: '0.85rem',
                                        md: '0.9rem',
                                   },
                                   textAlign: { xs: 'center', md: 'left' },
                              }}
                              className='text-green-700'
                         >
                              For each 1 USDT your friend invests, you will get
                              1 point.
                         </Typography>
                         <div
                              className='bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl'
                         >
                              <Table>
                                   <TableHead>
                                        <TableRow
                                             sx={{
                                                  '& th': {
                                                       color: 'rgba(255,255,255,0.7)',
                                                       borderBottom:
                                                            '1px solid rgba(255,255,255,0.1)',
                                                       fontWeight: 600,
                                                       whiteSpace: 'nowrap',
                                                       fontSize: {
                                                            xs: '0.7rem',
                                                            sm: '0.75rem',
                                                            md: '0.875rem',
                                                       },
                                                       px: { xs: 1, sm: 2 },
                                                  },
                                             }}
                                        >
                                             <TableCell className='text-green-400' >Level</TableCell>
                                             <TableCell className='text-green-400' > Points</TableCell>
                                             <TableCell className='text-green-400' >Reward Type</TableCell>
                                        </TableRow>
                                   </TableHead>
                                   <TableBody>
                                        {rewardLevels.map((row) => (
                                             <TableRow
                                                  key={row.key}
                                                  sx={{
                                                       '&:hover': {
                                                            background:
                                                                 'rgba(255,255,255,0.05)',
                                                       },
                                                       '& td': {
                                                            color: 'rgba(255,255,255,0.9)',
                                                            borderBottom:
                                                                 '1px solid rgba(255,255,255,0.1)',
                                                            fontSize: {
                                                                 xs: '0.7rem',
                                                                 sm: '0.75rem',
                                                                 md: '0.875rem',
                                                            },
                                                            px: {
                                                                 xs: 1,
                                                                 sm: 2,
                                                            },
                                                       },
                                                  }}
                                             >
                                                  <TableCell>
                                                       <div className='flex items-center gap-1 text-[#00d2ff]' >
                                                            {
                                                                 row.tier === 'basic' ? (
                                                                      <FaUserFriends />
                                                                 ) : row.tier === 'pro' ? (
                                                                      <FaUserTie />
                                                                 ) : <FaCrown />
                                                            }
                                                            {row.label}
                                                       </div>
                                                  </TableCell>
                                                  <TableCell className='text-[#00d2ff]' >
                                                       {row.points}
                                                  </TableCell>
                                                  <TableCell>
                                                       <Box className="text-[#00d2ff]"
                                                       >
                                                            {row.rewardAmount}{' '}
                                                            <span>$</span>
                                                       </Box>
                                                  </TableCell>
                                             </TableRow>
                                        ))}
                                   </TableBody>
                              </Table>
                         </div>
                    </Box>
               </Box>
               <Box
                    elevation={0}
                    className='w-full my-5  bg-gradient-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-5 md:p-4 border border-green-500/20 flex flex-col '
                    sx={{
                         borderRadius: '12px',
                         p: { xs: 1.5, sm: 2, md: 3 },
                         mb: 3,
                    }}
               >
                    <Box
                         sx={{
                              display: 'flex',
                              flexDirection: { xs: 'column', md: 'row' },
                              gap: { xs: 1.5, md: 3 },
                         }}
                    >
                         <Box
                              sx={{
                                   flex: 1,
                                   width: '100%',
                              }}
                         >
                              <Typography
                                   variant='h5'
                                   sx={{
                                        fontWeight: 600,
                                        mb: 2,
                                        fontSize: {
                                             xs: '1.1rem',
                                             sm: '1.2rem',
                                             md: '1.5rem',
                                        },
                                        textAlign: { xs: 'center', md: 'left' },
                                   }}
                                   className='text-gray-300'
                              >
                                   Invite friends and earn up to 10,000 USDT
                                   <Tooltip title='Share your referral link and earn rewards'>
                                        <IconButton
                                             size='small'
                                             sx={{
                                                  ml: 1,
                                                  color: 'rgba(255,255,255,0.5)',
                                             }}
                                        >
                                             <InfoIcon fontSize='small' />
                                        </IconButton>
                                   </Tooltip>
                              </Typography>

                              <Box
                                   sx={{
                                        display: 'flex',
                                        flexDirection: {
                                             xs: 'column',
                                             sm: 'row',
                                        },
                                        gap: 1,
                                        mb: 2,
                                        width: '100%',
                                   }}
                              >
                                   <Box
                                        sx={{
                                             flex: 1,
                                             position: 'relative',
                                             width: '100%',
                                        }}
                                   >
                                        <input
                                             className={`${isCopied
                                                  ? 'text-deepGrey'
                                                  : 'text-lightGrey'
                                                  } bg-DarkGreen px-3 rounded-xs focus:outline-none h-[40px] w-full text-sm rounded-lg`}
                                             autoComplete='off'
                                             value={referalLink}
                                             readOnly
                                        />
                                        <IconButton
                                             onClick={() =>
                                                  handleCopy(referalLink)
                                             }
                                             sx={{
                                                  position: 'absolute',
                                                  right: 8,
                                                  top: '50%',
                                                  transform: 'translateY(-50%)',

                                             }}
                                             className={`hover:text-green-600   ${isCopied ? 'text-green-300' : 'text-gray-300'}`}
                                        >
                                             {isCopied ? (
                                                  <DoneIcon />
                                             ) : (
                                                  <ContentCopyIcon />
                                             )}
                                        </IconButton>
                                   </Box>

                              </Box>
                              <Typography
                                   variant='body2'
                                   sx={{
                                        color: '#00d2ff',
                                        fontSize: {
                                             xs: '0.7rem',
                                             sm: '0.75rem',
                                             md: '0.8rem',
                                        },
                                        textAlign: { xs: 'center', md: 'left' },
                                   }}
                              >
                                   By proceeding, I accept the Referral Terms &
                                   Conditions and understand that my use of
                                   Qption will be visible to anyone with my
                                   invite link.
                              </Typography>
                         </Box>
                         <Box
                              sx={{
                                   flex: 1,
                                   display: 'flex',
                                   justifyContent: 'center',
                                   alignItems: 'center',
                                   mt: { xs: 2, md: 0 },
                                   minHeight: { xs: '200px', sm: '250px' },
                              }}
                         >
                              <div className='network-animation'>
                                   <div className='network-center'>
                                        <img
                                             src='/avatars/avatar-2.png'
                                             alt='Center Avatar'
                                             className='avatar center-avatar'
                                        />
                                   </div>
                                   <div className='network-orbits'>
                                        <div className='orbit orbit-1'>
                                             <img
                                                  src='/avatars/avatar-3.png'
                                                  alt='Avatar 1'
                                                  className='avatar orbit-avatar'
                                             />
                                        </div>
                                        <div className='orbit orbit-2'>
                                             <img
                                                  src='/avatars/avatar-4.png'
                                                  alt='Avatar 2'
                                                  className='avatar orbit-avatar'
                                             />
                                        </div>
                                        <div className='orbit orbit-3'>
                                             <img
                                                  src='/avatars/avatar-5.png'
                                                  alt='Avatar 3'
                                                  className='avatar orbit-avatar'
                                             />
                                        </div>
                                        <div className='orbit orbit-4'>
                                             <img
                                                  src='/avatars/avatar-6.png'
                                                  alt='Avatar 4'
                                                  className='avatar orbit-avatar'
                                             />
                                        </div>
                                   </div>
                              </div>
                         </Box>
                    </Box>
               </Box>
               <style jsx>{`
                    .network-animation {
                         position: relative;
                         width: 200px;
                         height: 200px;
                         display: flex;
                         justify-content: center;
                         align-items: center;
                    }
                    @media (max-width: 600px) {
                         .network-animation {
                              width: 180px;
                              height: 180px;
                         }
                         .avatar {
                              width: 32px;
                              height: 32px;
                         }
                         .orbit-avatar {
                              top: -16px;
                         }
                         .orbit-1 {
                              width: 90%;
                              height: 90%;
                         }
                         .orbit-2 {
                              width: 70%;
                              height: 70%;
                         }
                         .orbit-3 {
                              width: 50%;
                              height: 50%;
                         }
                         .orbit-4 {
                              width: 30%;
                              height: 30%;
                         }
                    }
                    .network-center {
                         position: absolute;
                         z-index: 2;
                    }
                    .avatar {
                         width: 35px;
                         height: 35px;
                         border-radius: 50%;
                         border: 2px solid #cecece;
                         object-fit: cover;
                    }
                    .center-avatar {
                         animation: pulse 2s infinite;
                    }
                    .network-orbits {
                         position: absolute;
                         width: 100%;
                         height: 100%;
                    }
                    .orbit {
                         position: absolute;
                         width: 100%;
                         height: 100%;
                         border: 1px dashed rgba(206, 206, 206, 0.3);
                         border-radius: 50%;
                    }
                    .orbit-1 {
                         width: 80%;
                         height: 80%;
                         top: 10%;
                         left: 10%;
                         animation: rotate 20s linear infinite;
                    }
                    .orbit-2 {
                         width: 60%;
                         height: 60%;
                         top: 20%;
                         left: 20%;
                         animation: rotate 15s linear infinite reverse;
                    }
                    .orbit-3 {
                         width: 40%;
                         height: 40%;
                         top: 30%;
                         left: 30%;
                         animation: rotate 25s linear infinite;
                    }
                    .orbit-4 {
                         width: 20%;
                         height: 20%;
                         top: 40%;
                         left: 40%;
                         animation: rotate 18s linear infinite reverse;
                    }
                    .orbit-avatar {
                         position: absolute;
                         top: -17.5px;
                         left: 50%;
                         transform: translateX(-50%);
                         animation: float 3s ease-in-out infinite;
                    }
                    @keyframes rotate {
                         from {
                              transform: rotate(0deg);
                         }
                         to {
                              transform: rotate(360deg);
                         }
                    }
                    @keyframes pulse {
                         0% {
                              transform: scale(1);
                              box-shadow: 0 0 0 0 rgba(206, 206, 206, 0.4);
                         }
                         70% {
                              transform: scale(1.05);
                              box-shadow: 0 0 0 5px rgba(206, 206, 206, 0);
                         }
                         100% {
                              transform: scale(1);
                              box-shadow: 0 0 0 0 rgba(206, 206, 206, 0);
                         }
                    }
                    @keyframes float {
                         0% {
                              transform: translateX(-50%) translateY(0px);
                         }
                         50% {
                              transform: translateX(-50%) translateY(-5px);
                         }
                         100% {
                              transform: translateX(-50%) translateY(0px);
                         }
                    }
               `}</style>
          </Box>
     )
}

export default ReferralLink
