import { useRef, useState, useEffect } from 'react'
import { Button } from '@mui/material'
import CameraFrontIcon from '@mui/icons-material/CameraFront'
import ReplayIcon from '@mui/icons-material/Replay'
import axiosInstance from '../../network/axios'
import CircularProgress from '@mui/material/CircularProgress'
import { compressImage } from '../../utils/convertFiletoBase64'

const TARGET_MB = 6            // keep under your server cap
const MAX_START_DIM = 1600     // start big; we’ll step down if needed

const blobSizeMB = (blob) => blob.size / (1024 * 1024)

async function encodeCanvasToJpeg(canvas, quality) {
     return await new Promise((resolve, reject) => {
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/jpeg', quality)
     })
}

// Try {maxDim, quality} combos until <= targetMB
async function captureAdaptive(video, targetMB) {
     const vw = video.videoWidth || 1280
     const vh = video.videoHeight || 720

     const dims = [MAX_START_DIM, 1280, 1024, 900, 800, 720, 640]
     const qualities = [0.9, 0.85, 0.8, 0.75, 0.7, 0.6]

     const canvas = document.createElement('canvas')
     const ctx = canvas.getContext('2d')

     for (const maxDim of dims) {
          const scale = Math.min(1, maxDim / Math.max(vw, vh))
          const tw = Math.max(1, Math.round(vw * scale))
          const th = Math.max(1, Math.round(vh * scale))

          canvas.width = tw
          canvas.height = th
          ctx.drawImage(video, 0, 0, tw, th)

          for (const q of qualities) {
               const blob = await encodeCanvasToJpeg(canvas, q)
               if (blobSizeMB(blob) <= targetMB) {
                    return { blob, tw, th, q }
               }
          }
     }
     // fallback: smallest/highly-compressed
     const blob = await encodeCanvasToJpeg(canvas, 0.6)
     return { blob, tw: canvas.width, th: canvas.height, q: 0.6 }
}

const TakeSelfie = ({ handleNext }) => {
     const [hasCameraPermission, setHasCameraPermission] = useState(true)
     const [loading, setLoading] = useState(false)
     const [errorMsg, setErrorMsg] = useState('')
     const [captured, setCaptured] = useState(false)
     const [selfieBlob, setSelfieBlob] = useState(null)
     const [selfieURL, setSelfieURL] = useState('')

     const videoRef = useRef(null)
     const streamRef = useRef(null)

     useEffect(() => {
          const start = async () => {
               try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                         video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
                         audio: false
                    })
                    streamRef.current = stream
                    if (videoRef.current) {
                         videoRef.current.srcObject = stream
                         await new Promise((res) => {
                              if (videoRef.current.readyState >= 1) return res()
                              videoRef.current.onloadedmetadata = () => res()
                         })
                         await videoRef.current.play()
                    }
               } catch (err) {
                    console.error('Camera access denied:', err)
                    setHasCameraPermission(false)
                    setErrorMsg('Camera access denied. Please allow access in your browser settings.')
               }
          }
          start()

          return () => {
               if (streamRef.current) {
                    streamRef.current.getTracks().forEach(t => t.stop())
                    streamRef.current = null
               }
               if (videoRef.current) videoRef.current.srcObject = null
               if (selfieURL) URL.revokeObjectURL(selfieURL)
          }
     }, [])

     const takeSelfie = async () => {
          try {
               setErrorMsg('')
               setLoading(true)
               const video = videoRef.current
               if (!video) return

               const { blob } = await captureAdaptive(video, TARGET_MB)

               // swap to captured image in the same box
               video.pause()
               if (selfieURL) URL.revokeObjectURL(selfieURL)
               const url = URL.createObjectURL(blob)

               setSelfieBlob(blob)
               setSelfieURL(url)
               setCaptured(true)
          } catch (e) {
               console.error(e)
               setErrorMsg('Could not take selfie. Please try again.')
          } finally {
               setLoading(false)
          }
     }

     const retake = async () => {
          try {
               setErrorMsg('')
               setCaptured(false)
               setSelfieBlob(null)
               if (selfieURL) {
                    URL.revokeObjectURL(selfieURL)
                    setSelfieURL('')
               }

               // reattach current stream to the (new) video node
               if (streamRef.current && videoRef.current) {
                    videoRef.current.srcObject = streamRef.current
                    await new Promise((res) => {
                         if (videoRef.current.readyState >= 1) return res()
                         videoRef.current.onloadedmetadata = () => res()
                    })
                    await videoRef.current.play()
                    return
               }

               // if stream stopped, request again
               const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
                    audio: false
               })
               streamRef.current = stream
               if (videoRef.current) {
                    videoRef.current.srcObject = stream
                    await new Promise((res) => {
                         if (videoRef.current.readyState >= 1) return res()
                         videoRef.current.onloadedmetadata = () => res()
                    })
                    await videoRef.current.play()
               }
          } catch (e) {
               console.error(e)
               setErrorMsg('Could not access camera for retake.')
          }
     }

     const finish = async () => {
          try {
               setErrorMsg('')
               setLoading(true)

               if (!selfieBlob) {
                    setErrorMsg('Please take a selfie first.')
                    return
               }

               // 1) Convert Blob -> File so we can reuse compressImage logic
               const selfieFile = new File([selfieBlob], 'selfie.jpg', {
                    type: 'image/jpeg',
               })

               // 2) Compress and convert to base64 (same util as ID docs)
               //    compressImage should return a base64 string (like documentImage)
               const base64 = await compressImage(selfieFile)

               // (Optional, client-side safety check against 6MB server limit)
               const bytesFromBase64 = (b64) => {
                    const len = b64.length
                    const padding = b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0
                    return (len * 3) / 4 - padding
               }
               const maxBytes = 6 * 1024 * 1024
               if (bytesFromBase64(base64) > maxBytes) {
                    setErrorMsg(
                         'Selfie is still too large after compression. Please move closer and retake with a tighter crop.'
                    )
                    return
               }

               // 3) Send JSON { photo } — same style as /verification/uploadIDDoc
               await axiosInstance.post('/verification/uploadSelfie', {
                    photo: base64,
               })

               await axiosInstance.post('/verification/changeStatus', {
                    status: 'pending',
               })

               // stop camera
               if (streamRef.current) {
                    streamRef.current.getTracks().forEach((t) => t.stop())
                    streamRef.current = null
               }
               if (videoRef.current) videoRef.current.srcObject = null

               handleNext()
          } catch (e) {
               console.error(e)
               setErrorMsg(
                    e?.response?.status === 413
                         ? 'Upload too large. Please retake a smaller selfie or try again.'
                         : 'Upload failed. Please try again.'
               )
          } finally {
               setLoading(false)
          }
     }

     return (
          <div className='selfie-camera'>
               {hasCameraPermission ? (
                    <>
                         <div className='video-preview flex flex-col items-center justify-center bordered border-4 border-darkGrey p-1 w-full'>
                              {!captured ? (
                                   <video
                                        ref={videoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        className='w-full h-auto'
                                   />
                              ) : (
                                   <img
                                        src={selfieURL}
                                        alt='Your Selfie'
                                        className='w-full h-auto'
                                   />
                              )}
                         </div>

                         <div className='flex gap-2 my-2'>
                              {!captured ? (
                                   <Button
                                        className='bg-blueBg flex-1 text-lightGrey'
                                        onClick={takeSelfie}
                                        disabled={loading}
                                        startIcon={<CameraFrontIcon fontSize='small' />}
                                   >
                                        {loading ? 'Capturing…' : 'Take Selfie'}
                                   </Button>
                              ) : (
                                   <div className='flex flex-col gap-2 items-center justify-center w-full'>
                                        <Button
                                             variant='outlined'
                                             onClick={retake}
                                             disabled={loading}
                                             startIcon={<ReplayIcon fontSize='small' />}
                                        >
                                             Retake
                                        </Button>
                                        <Button
                                             variant='contained'
                                             onClick={finish}
                                             disabled={loading}
                                        >
                                             {loading ? <CircularProgress size={22} className='text-lightGrey' /> : 'Update identity information'}
                                        </Button>
                                   </div>
                              )}
                         </div>

                         {errorMsg && <p className='text-red-400 text-sm mt-2'>{errorMsg}</p>}
                    </>
               ) : (
                    <p>Permission to access camera is denied. Please allow access to the camera.</p>
               )}
          </div>
     )
}

export default TakeSelfie
