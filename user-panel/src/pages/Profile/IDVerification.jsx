import React, { useEffect, useState } from 'react'
import { countries } from 'countries-list'
import { useSelector, useDispatch } from 'react-redux'
import {
     setIssuingCountry,
     setDocumentType,
     setDocumentBase64,
     setVerification,
     setDocumentBackImage64,
} from '../../redux/slices/verificationSlice'
import { Stepper, Step, StepLabel, CircularProgress, Button } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/UploadFile'
import ImageSearchIcon from '@mui/icons-material/ImageSearch'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import axiosInstance from '../../network/axios'
import { compressImage } from '../../utils/convertFiletoBase64'
import TakeSelfie from './TakeSelfie'
import { toast } from 'react-toastify'
import { setUserProfile } from '../../redux/slices/userSlice'
import styles from './IDVerification.module.css'
import idStyles from './IdentityInformation.module.css'

const allowedExtensions = ['jpg', 'jpeg', 'png', 'HEIC', 'WEBP', 'PDF']
const maxSizeInBytes = 50 * 1024 * 1024 // 50 MB
const minSizeInBytes = 1 * 1024 // 100KB

function validateFile(file) {
     if (!file) return { valid: false, error: 'No file selected.' }
     const fileExtension = file.name.split('.').pop().toLowerCase()
     if (!allowedExtensions.includes(fileExtension)) {
          return { valid: false, error: 'Allowed: JPG, PNG, HEIC, WEBP, PDF.' }
     }
     if (file.size > maxSizeInBytes) {
          return { valid: false, error: 'File size exceeds 50 MB.' }
     }
     if (file.size < minSizeInBytes) {
          return { valid: false, error: 'File size must be at least 100KB.' }
     }
     return { valid: true, error: null }
}

const IDVerification = () => {
     const dispatch = useDispatch()
     const { issuingCountry, documentType, documentImage, documentBackImage } =
          useSelector((store) => store.verification)
     const { profile: userProfile } = useSelector((store) => store.user)

     const countryOptions = React.useMemo(() => Object.entries(countries).map(([code, data]) => ({
          value: data.name,
          label: data.name,
     })).sort((a, b) => a.label.localeCompare(b.label)), [])

     const documentOptions = React.useMemo(() => [
          { id: 'ID', label: 'ID Card' },
          { id: 'Passport', label: 'Passport' },
          { id: 'Resident', label: 'Resident Permit' },
     ], [])

     const steps = ['Select Document', 'Upload Document', 'Take Selfie']
     const [activeStep, setActiveStep] = React.useState(0)
     const [loading, setLoading] = useState({ initial: false, step0: false, docUpload: false })

     const setLoadingState = React.useCallback((key, value) => setLoading(prev => ({ ...prev, [key]: value })), [])

     const getVerificationInfo = React.useCallback(async () => {
          setLoadingState('initial', true)
          try {
               const response = await axiosInstance.get('/verification/getVerification')
               dispatch(
                    setVerification({
                         issuingCountry:
                              response.verification.issuingCountry ?? '',
                         documentType:
                              response.verification.documentType ?? 'ID',
                         documentImage:
                              response.verification.documentImage ?? null,
                         selfieImage: response.verification.selfieImage ?? null,
                         documentBackImage:
                              response.verification.documentBackImage ?? null,
                    })
               )
          } catch (e) {
               console.error("Get Verification Error:", e)
          } finally {
               setLoadingState('initial', false)
          }
     }, [dispatch, setLoadingState])

     const getUserInfo = React.useCallback(async () => {
          try {
               const response = await axiosInstance.get('/users/profile')
               dispatch(
                    setUserProfile({
                         username: response.username ?? '',
                         firstName: response.firstName ?? '',
                         lastName: response.lastName ?? '',
                         dateOfBirth: response.dateOfBirth ?? '',
                         email: response.email ?? '',
                         phone: response.phone ?? '',
                         country: response.country ?? '',
                         isPhoneVerified: response.isPhoneVerified ?? false,
                         isEmailVerified: response.isEmailVerified ?? false,
                         profileImage: response.profileImage,
                         isIDVerified: response.isIDVerified,
                    })
               )
          } catch (e) {
               console.error("Get User Info Error:", e)
          }
     }, [dispatch])

     useEffect(() => {
          getUserInfo()
          getVerificationInfo()
     }, [getUserInfo, getVerificationInfo])

     const saveVerificationInfo = React.useCallback(async (info) => {
          setLoadingState('step0', true)
          const payload = { issuingCountry: info.issuingCountry ?? issuingCountry, documentType: info.documentType ?? documentType }
          try {
               const response = await axiosInstance.post('/verification/saveDocType', payload)
               dispatch(setIssuingCountry(response.verification.issuingCountry))
               dispatch(setDocumentType(response.verification.documentType))
          } catch (e) {
               toast.error("Failed to save document type.")
               console.error("Save Doc Type Error:", e)
          } finally {
               setLoadingState('step0', false)
          }
     }, [dispatch, issuingCountry, documentType, setLoadingState])

     const handleFileUpload = React.useCallback(async (file, isBackSide = false) => {
          const validation = validateFile(file)
          if (!validation.valid) {
               toast.error(validation.error)
               return
          }

          setLoadingState('docUpload', true)
          try {
               const base64 = await compressImage(file)
               const endpoint = isBackSide ? '/verification/uploadIDDocBack' : '/verification/uploadIDDoc'
               const response = await axiosInstance.post(endpoint, { photo: base64 })
               if (isBackSide) {
                    dispatch(setDocumentBackImage64(response.verification.documentBackImage))
               } else {
                    dispatch(setDocumentBase64(response.verification.documentImage))
               }
          } catch (error) {
               toast.error("Upload failed. Please try again.")
               console.error("Upload Error:", error)
          } finally {
               setLoadingState('docUpload', false)
          }
     }, [dispatch, setLoadingState])

     const handleNext = () => setActiveStep((prev) => prev + 1)
     const handleBack = (step) => {
          if (step < activeStep && activeStep !== steps.length)
               setActiveStep(step)
     }

     const prerequisitesMet = React.useMemo(() => {
          const phoneVerified = userProfile?.phone && userProfile?.isPhoneVerified
          const emailVerified = userProfile?.email && userProfile?.isEmailVerified
          return (phoneVerified || emailVerified) && userProfile?.dateOfBirth && userProfile?.firstName && userProfile?.lastName
     }, [userProfile])

     if (loading.initial) {
          return <div className={styles.loadingContainer}><CircularProgress sx={{ color: '#94a3b8' }} /></div>
     }

     if (userProfile?.isIDVerified) {
          return (
               <div className={styles.container}>
                    <div className={`${idStyles.verifiedBanner}  text-lightYellow`}>
                         <span className={idStyles.verifiedBannerTitle + " text-lightYellow"}>Your ID is verified.</span>
                         <span className={idStyles.verifiedBannerCaption + " text-lightYellow"}>Identity information cannot be changed. Contact support if needed.</span>
                    </div>
               </div>
          )
     }

     if (!prerequisitesMet) {
          return (
               <div className={styles.container}>
                    <div className={styles.prerequisitesMessage + " text-lightYellow"}>
                         Please complete your profile first. Verify your{' '}
                         <span>Email</span> or{' '}
                         <span>Phone</span>, and ensure{' '}
                         <span>First Name</span>,{' '}
                         <span>Last Name</span>, and{' '}
                         <span>Date of Birth</span> are set in the Identity Information tab.
                    </div>
               </div>
          )
     }

     const canProceedStep0 = !!issuingCountry && !!documentType
     const canProceedStep1 = !!documentImage && (documentType === 'Passport' || !!documentBackImage)

     return (
          <div className={styles.container}>
               <Stepper
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
                    activeStep={activeStep}
                    className={styles.stepper}
                    alternativeLabel
               >
                    {steps.map((label, index) => (
                         <Step key={label} completed={index < activeStep} onClick={() => index < activeStep && handleBack(index)} sx={{ cursor: index < activeStep ? 'pointer' : 'default' }}>
                              <StepLabel>{label}</StepLabel>
                         </Step>
                    ))}
               </Stepper>

               <div className={styles.stepCard}>
                    {activeStep === 0 && (
                         <>
                              <div className={styles.stepHeader + " text-gray-300"}>Select Document</div>
                              <p className={styles.stepDescription}>Choose the type and issuing country of the identity document you want to use for verification.</p>
                              <div className={styles.formContainer}>
                                   <div className={idStyles.fieldGroup}>
                                        <label htmlFor="issuingCountry" className={idStyles.label}>Issuing Country</label>
                                        <div className={styles.selectWrapper}>
                                             <select
                                                  id="issuingCountry"
                                                  value={issuingCountry}
                                                  onChange={(e) => saveVerificationInfo({ issuingCountry: e.target.value })}
                                                  className={styles.select_like_mui}
                                                  disabled={loading.step0}

                                             >
                                                  <option value="" disabled>Select a country...</option>
                                                  {countryOptions.map((cOption) => (
                                                       <option key={cOption.value} value={cOption.value}>{cOption.label}</option>
                                                  ))}
                                             </select>
                                        </div>
                                        <p className={idStyles.errorMessage}>{'\u00A0'}</p>
                                   </div>

                                   <div className={idStyles.fieldGroup}>
                                        <label className={idStyles.label}>Document Type</label>
                                        <div className={styles.radioGroup}>
                                             {documentOptions.map((option) => (
                                                  <label key={option.id} className={documentType === option.id ? styles.radioLabelSelected : styles.radioLabel} onClick={() => !loading.step0 && saveVerificationInfo({ documentType: option.id })}>
                                                       <span>{option.label}</span>
                                                       <span className={styles.radioCircle}>
                                                            {documentType === option.id && <span className={styles.radioInnerCircle}></span>}
                                                       </span>
                                                  </label>
                                             ))}
                                        </div>
                                        <p className={idStyles.errorMessage}>{'\u00A0'}</p>
                                   </div>

                                   <Button type="button" className='bg-green-700 p-2 text-gray-300' onClick={handleNext} disabled={!canProceedStep0 || loading.step0}>
                                        {loading.step0 ? <CircularProgress size={20} color="inherit" /> : 'Continue'}
                                   </Button>
                              </div>
                         </>
                    )}

                    {activeStep === 1 && (
                         <>
                              <div className={styles.stepHeader}>Upload Document</div>
                              <p className={styles.stepDescription}>
                                   Upload a clear, colour image or PDF of your{' '}
                                   <strong>{documentOptions.find(op => op.id === documentType)?.label || 'Document'}</strong>.
                                   Ensure all details are readable.
                              </p>
                              <div className={styles.formContainer}>
                                   <div className={styles.uploadButtonContainer}>
                                        <label htmlFor="docFrontUpload" className={styles.uploadButton}>
                                             {loading.docUpload && !documentImage ? <CircularProgress size={30} sx={{ color: '#94a3b8', width: '100px', height: '65px' }} /> : (documentImage ?
                                                  <div className={styles.uploadPreview}><img src={`data:image/jpeg;base64,${documentImage}`} alt="Document Front Preview" /></div> :
                                                  <div className={styles.uploadIconContainer}><ImageSearchIcon /><span>Front Side</span></div>
                                             )}
                                             <div className={styles.uploadTextContainer}>
                                                  <span className={styles.uploadTextPrimary}>{documentType === 'Passport' ? 'Upload Passport Page' : 'Upload Front Side'}</span>
                                                  <span className={styles.uploadTextSecondary}>Click or tap to upload file</span>
                                             </div>
                                             <CloudUploadIcon sx={{ color: '#64748b', fontSize: '1.8rem', marginLeft: 'auto' }} />
                                        </label>
                                        <input id="docFrontUpload" type="file" className={idStyles.hiddenInput} accept={allowedExtensions.map(ext => `.${ext}`).join(',')} onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], false)} disabled={loading.docUpload} />
                                   </div>

                                   {documentType !== 'Passport' && (
                                        <div className={styles.uploadButtonContainer}>
                                             <label htmlFor="docBackUpload" className={styles.uploadButton}>
                                                  {loading.docUpload && !documentBackImage ? <CircularProgress size={30} sx={{ color: '#94a3b8', width: '100px', height: '65px' }} /> : (documentBackImage ?
                                                       <div className={styles.uploadPreview}><img src={`data:image/jpeg;base64,${documentBackImage}`} alt="Document Back Preview" /></div> :
                                                       <div className={styles.uploadIconContainer}><ImageSearchIcon /><span>Back Side</span></div>
                                                  )}
                                                  <div className={styles.uploadTextContainer}>
                                                       <span className={styles.uploadTextPrimary}>Upload Back Side</span>
                                                       <span className={styles.uploadTextSecondary}>Click or tap to upload file</span>
                                                  </div>
                                                  <CloudUploadIcon sx={{ color: '#64748b', fontSize: '1.8rem', marginLeft: 'auto' }} />
                                             </label>
                                             <input id="docBackUpload" type="file" className={idStyles.hiddenInput} accept={allowedExtensions.map(ext => `.${ext}`).join(',')} onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], true)} disabled={loading.docUpload} />
                                        </div>
                                   )}

                                   <ul className={styles.rulesList}>
                                        <li><CheckCircleOutlineIcon className={styles.ruleSuccess} /> JPG, PNG, HEIC, WEBP, PDF (100KB - 50MB)</li>
                                        <li><CheckCircleOutlineIcon className={styles.ruleSuccess} /> Upload a clear, coloured photo/scan</li>
                                        <li><CheckCircleOutlineIcon className={styles.ruleSuccess} /> Ensure good lighting, no blur</li>
                                        <li><HighlightOffIcon className={styles.ruleError} /> Do not edit or crop the document image</li>
                                   </ul>

                                   <button type="button" className='bg-green-700 p-2 text-gray-300' onClick={handleNext} disabled={!canProceedStep1 || loading.docUpload}>
                                        Continue
                                   </button>
                              </div>
                         </>
                    )}

                    {activeStep === 2 && (
                         <div className={styles.selfieContainer}>
                              <TakeSelfie handleNext={handleNext} />
                         </div>
                    )}

                    {activeStep === steps.length && (
                         <div className={styles.pendingMessage}>
                              We have received your documents and are currently verifying your account. This usually takes a few minutes, but can sometimes take longer. We'll notify you once it's complete.
                         </div>
                    )}
               </div>
          </div>
     )
}
export default IDVerification
