import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Avatar, Box } from '@mui/material'
import axiosInstance from '../../network/axios'
import CircularProgress from '@mui/material/CircularProgress'

const VisuallyHiddenInput = styled('input')({
     clip: 'rect(0 0 0 0)',
     clipPath: 'inset(50%)',
     height: 1,
     overflow: 'hidden',
     position: 'absolute',
     bottom: 0,
     left: 0,
     whiteSpace: 'nowrap',
     width: 1,
})

export default function InputFileUpload({ base64String }) {
     const [loading, setLoading] = useState(false)
     const [error, setError] = useState('')
     const [preview, setPreview] = useState(null)
     const allowedExtensions = ['jpg', 'jpeg', 'png']
     const maxSizeInBytes = 2 * 1024 * 1024 // 2 MB

     function validateFile() {
          if (base64String) {
               const mimeMatch = base64String.match(
                    /^data:image\/(png|jpg|jpeg);base64,/i
               )
               if (!mimeMatch) {
                    return {
                         valid: false,
                         error: 'Invalid file format. Only JPG, JPEG, or PNG are allowed.',
                    }
               }
               const extension = mimeMatch[1].toLowerCase()
               if (!allowedExtensions.includes(extension)) {
                    return {
                         valid: false,
                         error: 'Unsupported file extension.',
                    }
               }
               const rawBase64 = base64String.split(',')[1]
               const decodedSizeInBytes = Math.ceil((rawBase64.length * 3) / 4)
               if (decodedSizeInBytes > maxSizeInBytes) {
                    return { valid: false, error: 'File size exceeds 2 MB.' }
               }
               return { valid: true }
          }
          return { valid: true }
     }

     const handleFileChange = (e) => {
          setLoading(true)
          e.preventDefault()
          const file = e.target.files[0]
          if (file) {
               const reader = new FileReader()
               reader.onloadend = () => {
                    const base64String = reader.result

                    const validation = validateFile(base64String)
                    if (validation.valid) {
                         setError('')
                    } else {
                         setError(validation.error)
                    }
               }

               reader.readAsDataURL(file)
               handleUpload()
          }
     }

     const handleUpload = async () => {
          try {
               const response = await axiosInstance.put(
                    '/users/profile/upload',
                    { photo: base64String }
               )
               setPreview(response.photo)
          } catch (error) {
          } finally {
               setTimeout(() => {
                    setLoading(false)
               }, 1000)
          }
     }
     return (
          <div className='flex flex-col gap-4 p-4 justify-start items-center relative'>
               <Button
                    component='label'
                    role={undefined}
                    variant='contained'
                    tabIndex={-1}
                    className='normal-case bg-LightNavy flex flex-col py-2 px-6'
               >
                    {loading ? (
                         <CircularProgress
                              color='green'
                              className='w-20 h-20  text-Green rounded-full'
                         >
                              <Avatar
                                   src={
                                        base64String
                                             ? base64String.startsWith(
                                                  'https://lh3.googleusercontent.com'
                                             )
                                                  ? base64String
                                                  : `data:image/jpeg;base64,${base64String}`
                                             : '/default-avatar.png'
                                   }
                                   className='w-20 h-20'
                              />
                         </CircularProgress>
                    ) : (
                         <Box
                              className=' bordered border-4  border-Green'
                              sx={{ p: 1, borderRadius: '50%' }}
                         >
                              <Avatar
                                   src={
                                        base64String
                                             ? base64String.startsWith(
                                                  'https://lh3.googleusercontent.com'
                                             )
                                                  ? base64String
                                                  : `data:image/jpeg;base64,${base64String}`
                                             : '/default-avatar.png'
                                   }
                                   className='w-20 h-20'
                              />
                         </Box>
                    )}

                    <Box className='flex gap-2 items-center justify-center my-2 '>
                         <CloudUploadIcon />{' '}
                         <span className='text-sm font-normal text-menuTxt'>
                              Click to upload Profile Picture{' '}
                         </span>
                    </Box>
                    <VisuallyHiddenInput
                         type='file'
                         onChange={handleFileChange}
                         accept='.jpg, .jpeg, .png'
                    />
               </Button>
               {error && (
                    <span className='text-googleRed text-xs'>{error}</span>
               )}
          </div>
     )
}
