import React, { useEffect, useState } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Box, Tooltip, Typography, Button, IconButton } from '@mui/material'
import DoneIcon from '@mui/icons-material/Done'
import IosShareIcon from '@mui/icons-material/IosShare'
import InfoIcon from '@mui/icons-material/Info'
import { useDispatch, useSelector } from 'react-redux'
import axiosInstance from '../../../../network/axios'
import { setReferalLink } from '../../../../redux/slices/userSlice'
const SocailTrading = () => {
     const dispatch = useDispatch()

     const [isCopied, setIsCopied] = useState(false)
     const { referalLink } = useSelector((store) => store.user)
     const handleCopy = (e, inputValue) => {
          navigator.clipboard
               .writeText(inputValue)
               .then(() => {
                    setIsCopied(true)
                    setTimeout(() => setIsCopied(false), 2000)
               })
               .catch((err) => console.error('Failed to copy: ', err))
          e.stopPropagation()
     }
     const getReferalLink = async () => {
          try {
               const referalLinkRes = await axiosInstance.get(
                    '/users/generateReferralLink'
               )
               dispatch(setReferalLink(referalLinkRes.referralLink))
          } catch (e) {}
     }

     useEffect(() => {
          getReferalLink()
     }, [])
     const handleNativeShare = async (e) => {
          if (navigator.share) {
               try {
                    e.stopPropagation()
                    await navigator.share({
                         title: 'Join me on Qption!',
                         text: 'Sign up with my referral link to Qption!',
                         url: referalLink,
                    })
               } catch (error) {
                    console.error('Error sharing:', error)
               }
          }
     }
     return (
          <Box
               sx={{
                    flex: 1,
                    width: '100%',
               }}
          >
               <Typography
                    sx={{
                         color: '#fff',
                         fontWeight: 600,
                         m: 4,
                         fontSize: { xs: '0.7rem', sm: '0.8rem', md: '1rem' },
                         textAlign: { xs: 'center', md: 'center' },
                    }}
               >
                    Invite friends and earn up to 5,000 USDT
                    <Tooltip title='Share your referral link and earn rewards'>
                         <IconButton
                              size='small'
                              sx={{ ml: 1, color: 'rgba(255,255,255,0.5)' }}
                         >
                              <InfoIcon fontSize='small' />
                         </IconButton>
                    </Tooltip>
               </Typography>
               <Box
                    sx={{
                         display: 'flex',
                         flexDirection: 'column',
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
                              paddingX: 1,
                         }}
                    >
                         <input
                              className={`${
                                   isCopied ? 'text-deepGrey' : 'text-lightGrey'
                              } bg-DarkGreen px-3 rounded-xs focus:outline-none h-[40px] w-full text-xs rounded-lg`}
                              autoComplete='off'
                              value={referalLink}
                              readOnly
                         />
                         <IconButton
                              onClick={(e) => handleCopy(e, referalLink)}
                              sx={{
                                   position: 'absolute',
                                   right: 8,
                                   top: '50%',
                                   transform: 'translateY(-50%)',
                                   color: isCopied
                                        ? '#00d2ff'
                                        : 'rgba(255,255,255,0.5)',
                                   '&:hover': {
                                        color: '#00d2ff',
                                   },
                              }}
                         >
                              {isCopied ? (
                                   <DoneIcon fontSize='small' />
                              ) : (
                                   <ContentCopyIcon fontSize='small' />
                              )}
                         </IconButton>
                    </Box>
                    <Button
                         variant='contained'
                         onClick={(e) => handleNativeShare(e)}
                         startIcon={<IosShareIcon />}
                         sx={{
                              background:
                                   'linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)',
                              color: '#fff',
                              borderRadius: '8px',
                              textTransform: 'none',
                              m: 'auto',
                              my: '4px',
                              width: '50%',
                              '&:hover': {
                                   background:
                                        'linear-gradient(90deg, #3a7bd5 0%, #00d2ff 100%)',
                              },
                         }}
                    >
                         Share
                    </Button>
               </Box>
          </Box>
     )
}
export default SocailTrading
