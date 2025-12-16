import { useCallback, useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Counter from '../../components/Counter/Counter'
import PhoneInput from '../../components/phoneInput/phoneInput'
import * as Yup from 'yup'
import { Formik } from 'formik'
import VerifyEmailIcon from '@mui/icons-material/MarkEmailRead'
import VerifyMobileIcon from '@mui/icons-material/MobileFriendly'
import DoneIcon from '@mui/icons-material/Done'
import { Button, Chip, IconButton, Tooltip } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import axiosInstance from '../../network/axios'
import { setUserProfile } from '../../redux/slices/userSlice'
import Backdrop from '@mui/material/Backdrop'
import styles from './IdentityInformation.module.css'
import LoadingDots from "../../components/LoadingDots"
import ProfileImage from "./components/profileImage"
import { isValidEmail } from '../../utils/emailValidation'
const currentYear = new Date().getFullYear()
const minimumYear = 1900
const maximumYear = currentYear - 18
const validationSchemaProfile = Yup.object().shape({
     firstName: Yup.string().matches(/^[a-zA-Z\s]+$/, 'Invalid first name'),
     lastName: Yup.string().matches(/^[a-zA-Z\s]+$/, 'Invalid last name'),
     yearOfBirth: Yup.string()
          .required('Year is required')
          .matches(/^\d{4}$/, 'Year must be 4 digits')
          .test(
               'valid-year-range',
               `Year must be between ${minimumYear} and ${maximumYear}`,
               (value) => {
                    const year = parseInt(value, 10)
                    return year >= minimumYear && year <= maximumYear
               }
          ),
     monthOfBirth: Yup.string()
          .required('Month is required')
          .matches(/^\d{1,2}$/, 'Month must be a number')
          .test('valid-month', 'Month must be between 1 and 12', (value) => {
               const month = parseInt(value, 10)
               return month >= 1 && month <= 12
          }),

     dayOfBirth: Yup.string()
          .required('Day is required')
          .matches(/^\d{1,2}$/, 'Day must be a number')
          .test('valid-day', 'Day must be between 1 and 31', (value) => {
               const day = parseInt(value, 10)
               return day >= 1 && day <= 31
          }),
     // Either email or phone must be provided
})
const validationSchemaEmailOrPhone = Yup.object().shape({
     email: Yup.string()
          .email('Invalid email address')
          .test(
               'email-or-phone',
               'Either email or phone must be provided',
               function (value) {
                    const { phone } = this.parent // Access sibling field (phone)
                    if (!value && !phone) {
                         return false // If both email and phone are empty, return false
                    }
                    return true // Either email or phone is provided
               }
          ),
     phone: Yup.string()
          .matches(
               /^$|\+[1-9]\d{7,14}$/, //(code)number
               'Invalid Phone number'
          )
          .test(
               'allow-empty',
               'Either email or phone must be provided',
               function (value) {
                    const { email } = this.parent // Access sibling field (email)
                    if (!value && !email) {
                         return false // If both email and phone are empty, return false
                    }
                    return true // Either email or phone is provided
               }
          ),
})

const IdentityInformation = () => {
     const [emailVerificationDigits, setEmailVerificationDigits] = useState('')
     const [PhoneVerificationDigits, setPhoneVerificationDigits] = useState('')
     const [otpExpiredEmail, setOtpExpiredEmail] = useState(false)
     const [otpExpiredPhone, setOtpExpiredPhone] = useState(false)
     const dispatch = useDispatch()
     const [loading, setLoading] = useState(false)
     const { profile: userProfile } = useSelector((store) => store.user)
     const [userName, setUserName] = useState(userProfile.username)
     const [emailVerified, setEmailVerified] = useState(false)
     const [phoneVerified, setPhoneVerified] = useState(false)

     useEffect(() => {
          setUserName(userProfile.username)
          return () => {
               setEmailVerified(false)
               setPhoneVerified(false)
          }
     }, [userProfile.username])
     const getUserInfo = useCallback(async () => {
          try {
               setLoading(true)
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
                         isIDVerified: response.isIDVerified ?? false,
                         isPhoneVerified: response.isPhoneVerified ?? false,
                         isEmailVerified: response.isEmailVerified ?? false,
                         profileImage: response.profileImage ?? '',
                    })
               )
          } catch (e) {
          } finally {
               setLoading(false)
          }
     }, [])

     const updateUserProfileF = async (values) => {
          try {
               const res = await axiosInstance.put('/users/profile', values)
               getUserInfo()
          } catch (e) { }
     }
     const [emailVerificationLoading, setEmailVerificationLoading] =
          useState(false)
     const [emailVerificationSent, setemailVerificationSent] = useState(false)
     const sendEmailVerification = async (email) => {
          try {
               if (!isValidEmail(email)) {
                    return
               }
               setOtpExpiredEmail(false)
               setEmailVerificationLoading(true)
               await axiosInstance.post('/users/sendEmailVerification', { email })
               getUserInfo()
               setemailVerificationSent(true)
          } catch (e) {
          } finally {
               setEmailVerificationLoading(false)
          }
     }
     const [phoneVerificationLoading, setPhoneVerificationLoading] =
          useState(false)
     const [phoneVerificationSent, setphoneVerificationSent] = useState(false)
     const sendPhoneVerification = async (phone) => {
          try {
               if (!phone) return
               setOtpExpiredPhone(false)
               setPhoneVerificationLoading(true)
               await axiosInstance.post('/users/sendPhoneVerification', { phone })
               getUserInfo()
               setphoneVerificationSent(true)
          } catch (e) {
          } finally {
               setPhoneVerificationLoading(false)
          }
     }
     const [phoneVerifyLoading, setphoneVerifyLoading] = useState(false)
     const verifyPhoneFunction = async () => {
          try {
               setphoneVerifyLoading(true)
               await axiosInstance.put('/users/verifyPhone', {
                    userOTP: PhoneVerificationDigits,
               })
               getUserInfo()
               setPhoneVerified(true)
          } catch (e) {
          } finally {
               setphoneVerifyLoading(false)
          }
     }
     const verifyEmailFunction = async () => {
          try {
               setEmailVerificationLoading(true)
               await axiosInstance.put('/users/verifyEmail', {
                    userOTP: emailVerificationDigits,
               })
               getUserInfo()
               setEmailVerified(true)
          } catch (e) {
          } finally {
               setEmailVerificationLoading(false)
          }
     }
     const expirOtp = (type) => {
          if (type === 'email') {
               setemailVerificationSent(false)
               setOtpExpiredEmail(true)
          }
          if (type === 'phone') {
               setphoneVerificationSent(false)
               setOtpExpiredPhone(true)
          }
     }


     const saveUsername = async () => {
          try {
               await axiosInstance.post(
                    '/users/updateUsername',
                    {
                         username: userName,
                    }
               )
               getUserInfo()
          } catch (e) { }
     }
     return (
          <div className={styles.container}>
               <div className={styles.card + " px-0 mx-0 mt-6 pb-8"}>
                    <div className='px-4' >
                         <div className={styles.cardHeader + " text-green-100 py-3"}>
                              Identity Information
                         </div>
                         <ProfileImage getUserInfo={getUserInfo} userProfile={userProfile} />
                         <div className={styles.form}>
                              <div>
                                   <span className={styles.label + " text-green-100"}>
                                        Username
                                   </span>
                                   <div className='flex relative w-full my-2'>
                                        <div className='flex justify-between w-full'>
                                             <input
                                                  type='text'
                                                  className={`${styles.inputBase} w-fill`}
                                                  autoComplete='off'
                                                  onChange={(e) =>
                                                       setUserName(
                                                            e.target.value
                                                       )
                                                  }
                                                  value={
                                                       userName
                                                  }
                                             />
                                             <span
                                                  className={styles.inputSuffix}
                                             >

                                                  <IconButton
                                                       onClick={
                                                            saveUsername
                                                       }
                                                       disabled={loading}
                                                       size='small'
                                                       sx={{
                                                            color: '#e2e8f0',
                                                       }}
                                                  >
                                                       {loading ? (
                                                            <CircularProgress
                                                                 size={20}
                                                                 color='inherit'
                                                            />
                                                       ) : (
                                                            <span className='text-xs flex items-center gap-1 text-green-300 bg-green-700 p-2 rounded-lg' >
                                                                 <DoneIcon
                                                                      sx={{
                                                                           fontSize: 14,
                                                                      }}
                                                                 />
                                                                 Save
                                                            </span>
                                                       )}
                                                  </IconButton>
                                             </span>
                                        </div>
                                   </div>
                              </div>
                         </div>
                         <Backdrop
                              open={loading}
                              className='z-50'
                         >
                              <CircularProgress
                                   size={24}
                                   className='text-lightGrey'
                              />
                         </Backdrop>
                         <Formik
                              enableReinitialize
                              initialValues={{
                                   email: userProfile.email,
                                   phone: userProfile.phone,
                                   isPhoneVerified: userProfile.isPhoneVerified,
                                   isEmailVerified: userProfile.isEmailVerified,
                                   country: userProfile.country,
                              }}
                              validationSchema={validationSchemaEmailOrPhone}
                              onSubmit={(values, actions) => {
                                   updateUserProfileF(values)
                                   actions.setSubmitting(false)
                              }}
                         >
                              {(props) => (
                                   <form
                                        className={styles.form}
                                        onSubmit={props.handleSubmit}
                                   >
                                        <div className='flex flex-col items-start justify-center'>
                                             <span className={styles.label + " text-green-100"}>
                                                  Email
                                             </span>
                                             <div className='flex flex-col relative justify-start w-full my-2'>
                                                  <div className='flex flex-col justify-between items-end w-full'>
                                                       <input
                                                            type='text'
                                                            className={
                                                                 styles.inputBase
                                                            }
                                                            name='email'
                                                            id='email'
                                                            onChange={
                                                                 props.handleChange
                                                            }
                                                            onBlur={
                                                                 props.handleBlur
                                                            }
                                                            value={
                                                                 props.values
                                                                      .email
                                                            }

                                                       />

                                                       {props.initialValues
                                                            .isEmailVerified && (
                                                                 <span
                                                                      className={
                                                                           styles.inputSuffix +
                                                                           ' absolute top-5 mx-2'
                                                                      }
                                                                 >
                                                                      <Tooltip
                                                                           title='Verified'
                                                                           arrow
                                                                           placement='top'
                                                                      >
                                                                           <Chip
                                                                                icon={
                                                                                     <DoneIcon />
                                                                                }
                                                                                label='Verified'
                                                                                size='small'
                                                                                className={
                                                                                     styles.verifiedChip
                                                                                }
                                                                           />
                                                                      </Tooltip>
                                                                 </span>
                                                            )}
                                                       <div className='flex  items-center justify-center my-2'>
                                                            {!otpExpiredEmail &&
                                                                 emailVerificationSent &&
                                                                 !emailVerified &&
                                                                 (
                                                                      <Counter
                                                                           expirOtp={
                                                                                expirOtp
                                                                           }
                                                                           type='email'
                                                                      />
                                                                 )}
                                                            {!otpExpiredEmail &&
                                                                 emailVerificationSent &&
                                                                 !emailVerified &&
                                                                 (!emailVerificationLoading ? (
                                                                      <div>
                                                                           <input
                                                                                type='text'
                                                                                placeholder='6-digits'
                                                                                className={
                                                                                     styles.inputBase +
                                                                                     '  px-1 rounded-l-sm text-xs focus:outline-none h-[28px] w-[70px]'
                                                                                }
                                                                                onChange={(
                                                                                     e
                                                                                ) => {
                                                                                     setEmailVerificationDigits(
                                                                                          e
                                                                                               .target
                                                                                               .value
                                                                                     )
                                                                                }}
                                                                           />
                                                                           <DoneIcon
                                                                                onClick={
                                                                                     verifyEmailFunction
                                                                                }
                                                                                className='bg-LightNavy rounded-r-lg w-[32px] h-[28px] p-1 cursor-pointer'
                                                                           />
                                                                      </div>
                                                                 ) : (
                                                                      <span className='mx-auto'>
                                                                           <LoadingDots />
                                                                      </span>
                                                                 ))}
                                                       </div>
                                                       {
                                                            !emailVerificationSent && (
                                                                 <Button
                                                                      loading={
                                                                           emailVerificationLoading
                                                                      }
                                                                      onClick={() => sendEmailVerification(props.values.email)}
                                                                      className='w-[80px] h-[22px] text-menuTxt text-xs mt-2'
                                                                      variant='text'
                                                                 >
                                                                      {emailVerificationLoading ? (
                                                                           <LoadingDots label={"Loading"} />
                                                                      ) : (
                                                                           <span className='flex  items-center text-menuTxt hover:text-bgWhite'>
                                                                                <VerifyEmailIcon fontSize='small' />
                                                                                Verify
                                                                           </span>
                                                                      )}
                                                                 </Button>
                                                            )}
                                                  </div>
                                                  <p
                                                       className={
                                                            styles.errorMessage
                                                       }
                                                  >
                                                       {props.touched.email &&
                                                            props.errors
                                                                 .email && (
                                                                 <span
                                                                      className='text-xs text-googleRed mx-auto absolute top-[28px] left-5'
                                                                      id='feedbackemail'
                                                                 >
                                                                      {
                                                                           props
                                                                                .errors
                                                                                .email
                                                                      }
                                                                 </span>
                                                            )}
                                                  </p>
                                             </div>
                                        </div>
                                        <div className='flex flex-col items-start justify-center'>
                                             <span className={styles.label + " text-green-100"}>
                                                  Phone
                                             </span>
                                             <div className='flex flex-col relative w-full my-2'>
                                                  <div className='flex flex-col justify-between items-end relative w-full'>
                                                       <div className='w-full flex justify-center items-center relative'>
                                                            <PhoneInput
                                                                 inputStyle={
                                                                      styles.inputBase
                                                                 }
                                                                 value={
                                                                      props
                                                                           .values
                                                                           .phone
                                                                 }
                                                                 country={
                                                                      props
                                                                           .values
                                                                           .country
                                                                 }
                                                                 setFieldValue={
                                                                      props.setFieldValue
                                                                 }
                                                                 setFieldTouched={
                                                                      props.setFieldTouched
                                                                 }

                                                            />
                                                       </div>
                                                       <div className='my-2 flex  items-center justify-center'>
                                                            {!otpExpiredPhone &&
                                                                 phoneVerificationSent &&
                                                                 !props
                                                                      .initialValues
                                                                      .isPhoneVerified && !phoneVerified && (
                                                                      <Counter
                                                                           expirOtp={
                                                                                expirOtp
                                                                           }
                                                                           type={
                                                                                'phone'
                                                                           }
                                                                      />
                                                                 )}
                                                            {!otpExpiredPhone &&
                                                                 phoneVerificationSent &&
                                                                 !phoneVerified &&
                                                                 (!phoneVerifyLoading ? (
                                                                      <div className='flex justify-center'>
                                                                           <input
                                                                                type='text'
                                                                                placeholder='6-digits'
                                                                                className={
                                                                                     styles.inputBase +
                                                                                     '  px-1 rounded-l-sm text-xs focus:outline-none h-[28px] w-[70px]'
                                                                                }
                                                                                onChange={(
                                                                                     e
                                                                                ) => {
                                                                                     setPhoneVerificationDigits(
                                                                                          e
                                                                                               .target
                                                                                               .value
                                                                                     )
                                                                                }}
                                                                           />
                                                                           <IconButton
                                                                                className='text-menuTxt p-1 w-[20px] h-[20px] rounded-lg z-10 mx-1  '
                                                                                onClick={
                                                                                     verifyPhoneFunction
                                                                                }
                                                                           >
                                                                                <Tooltip
                                                                                     title='verifiy phone'
                                                                                     arrow
                                                                                     placement='top'
                                                                                >
                                                                                     <DoneIcon />
                                                                                </Tooltip>
                                                                           </IconButton>
                                                                      </div>
                                                                 ) : (
                                                                      <span className='mx-auto'>
                                                                           <LoadingDots />
                                                                      </span>
                                                                 ))}
                                                       </div>
                                                       {props.initialValues
                                                            .isPhoneVerified && (
                                                                 <span
                                                                      className={
                                                                           styles.inputSuffix +
                                                                           ' absolute top-5 mx-2'
                                                                      }
                                                                 >
                                                                      <Tooltip
                                                                           title='Verified'
                                                                           arrow
                                                                           placement='top'
                                                                      >
                                                                           <Chip
                                                                                icon={
                                                                                     <DoneIcon />
                                                                                }
                                                                                label='Verified'
                                                                                size='small'
                                                                                className={
                                                                                     styles.verifiedChip
                                                                                }
                                                                           />
                                                                      </Tooltip>
                                                                 </span>
                                                            )}
                                                       {
                                                            !phoneVerificationSent && (
                                                                 <Button
                                                                      onClick={() =>
                                                                           sendPhoneVerification(props.values.phone)
                                                                      }
                                                                      className='w-[80px] text-bgWhite text-xs h-[22px] '
                                                                      variant='text'
                                                                 >
                                                                      {phoneVerificationLoading ? (
                                                                           <span className='text-menuTxt normal-case'>
                                                                                <LoadingDots />
                                                                           </span>
                                                                      ) : (
                                                                           <span className='flex  items-center text-menuTxt hover:text-bgWhite'>
                                                                                <VerifyMobileIcon fontSize='small' />{' '}
                                                                                Verify
                                                                           </span>
                                                                      )}
                                                                 </Button>
                                                            )}
                                                  </div>
                                                  <p
                                                       className={
                                                            styles.errorMessage
                                                       }
                                                  >
                                                       {props.touched.phone &&
                                                            props.errors
                                                                 .phone && (
                                                                 <span
                                                                      className='text-xs text-googleRed mx-auto absolute top-[27px] left-6 '
                                                                      id='feedbackphone'
                                                                 >
                                                                      {
                                                                           props
                                                                                .errors
                                                                                .phone
                                                                      }
                                                                 </span>
                                                            )}
                                                  </p>
                                             </div>
                                        </div>
                                   </form>
                              )}
                         </Formik>
                         <Formik
                              enableReinitialize
                              initialValues={{
                                   isIDVerified: userProfile.isIDVerified,
                                   firstName: userProfile.firstName,
                                   lastName: userProfile.lastName,
                                   country: userProfile.country,
                                   yearOfBirth: userProfile.dateOfBirth?.slice(
                                        0,
                                        4
                                   ),
                                   monthOfBirth: userProfile.dateOfBirth?.slice(
                                        5,
                                        7
                                   ),
                                   dayOfBirth: userProfile.dateOfBirth?.slice(
                                        8,
                                        10
                                   ),
                              }}
                              validationSchema={validationSchemaProfile}
                              onSubmit={(values, actions) => {
                                   const {
                                        yearOfBirth,
                                        monthOfBirth,
                                        dayOfBirth,
                                        ...rest
                                   } = values

                                   let dateOfBirth = ''
                                   if (
                                        yearOfBirth &&
                                        monthOfBirth &&
                                        dayOfBirth
                                   ) {
                                        const pad = (val) =>
                                             val.toString().padStart(2, '0')
                                        dateOfBirth = `${yearOfBirth}/${pad(
                                             monthOfBirth
                                        )}/${pad(dayOfBirth)}`
                                   }

                                   const finalValues = {
                                        ...rest,
                                        dateOfBirth,
                                   }
                                   updateUserProfileF(finalValues)
                                   actions.setSubmitting(false)
                              }}
                         >
                              {(props) => (
                                   <form
                                        className={styles.form}
                                        onSubmit={props.handleSubmit}
                                   >
                                        <fieldset
                                             disabled={
                                                  props.isSubmitting ||
                                                  userProfile.isIDVerified
                                             }
                                             className={styles.formFieldset}
                                        >
                                             {props.values.isIDVerified && (
                                                  <span className='flex flex-col items-center p-5 text-lg text-lightYellow '>
                                                       Your ID is verified
                                                       <span className='text-xs text-lightYellow'>
                                                            In order to change
                                                            Identity information
                                                            contact your support
                                                            manager
                                                       </span>
                                                  </span>
                                             )}
                                             <div
                                                  className={
                                                       styles.fieldGroupGrid
                                                  }
                                             >
                                                  <div className='flex flex-col items-start justify-center'>
                                                       <span
                                                            className={
                                                                 styles.label + " text-green-100"
                                                            }
                                                       >
                                                            First name
                                                       </span>
                                                       <div className='flex relative my-2'>
                                                            <div className='flex justify-between'>
                                                                 <input
                                                                      disabled={
                                                                           props
                                                                                .values
                                                                                .isIDVerified
                                                                      }
                                                                      type='text'
                                                                      className={
                                                                           styles.inputBase
                                                                      }
                                                                      autoComplete='off'
                                                                      name='firstName'
                                                                      id='firstName'
                                                                      onChange={
                                                                           props.handleChange
                                                                      }
                                                                      onBlur={
                                                                           props.handleBlur
                                                                      }
                                                                      value={
                                                                           props
                                                                                .values
                                                                                .firstName
                                                                      }
                                                                 />
                                                            </div>
                                                            <p
                                                                 className={
                                                                      styles.errorMessage
                                                                 }
                                                            >
                                                                 {props.touched
                                                                      .firstName &&
                                                                      props
                                                                           .errors
                                                                           .firstName && (
                                                                           <span
                                                                                className='text-xs text-googleRed mx-auto absolute top-[27px] left-6 my-1'
                                                                                id='feedbackfirstName'
                                                                           >
                                                                                {
                                                                                     props
                                                                                          .errors
                                                                                          .firstName
                                                                                }
                                                                           </span>
                                                                      )}
                                                            </p>
                                                       </div>
                                                  </div>
                                                  <div className='flex flex-col items-start justify-center'>
                                                       <span
                                                            className={
                                                                 styles.label + " text-green-100"
                                                            }
                                                       >
                                                            Last name
                                                       </span>
                                                       <div className='flex relative my-2'>
                                                            <div className='flex justify-between'>
                                                                 <input
                                                                      disabled={
                                                                           props
                                                                                .values
                                                                                .isIDVerified
                                                                      }
                                                                      type='text'
                                                                      className={
                                                                           styles.inputBase
                                                                      }
                                                                      autoComplete='off'
                                                                      name='lastName'
                                                                      id='lastName'
                                                                      onChange={
                                                                           props.handleChange
                                                                      }
                                                                      onBlur={
                                                                           props.handleBlur
                                                                      }
                                                                      value={
                                                                           props
                                                                                .values
                                                                                .lastName
                                                                      }
                                                                 />
                                                            </div>
                                                            <p
                                                                 className={
                                                                      styles.errorMessage
                                                                 }
                                                            >
                                                                 {props.touched
                                                                      .lastName &&
                                                                      props
                                                                           .errors
                                                                           .lastName && (
                                                                           <span
                                                                                className='text-xs text-googleRed mx-auto absolute top-[27px] left-6 my-1'
                                                                                id='feedbacklastName'
                                                                           >
                                                                                {
                                                                                     props
                                                                                          .errors
                                                                                          .lastName
                                                                                }
                                                                           </span>
                                                                      )}
                                                            </p>
                                                       </div>
                                                  </div>
                                             </div>
                                             <div className='flex-col items-start justify-center'>
                                                  <span
                                                       className={styles.label + " text-green-100"}
                                                  >
                                                       Date of birth
                                                  </span>
                                                  <div className='flex relative my-2'>
                                                       <div className='flex justify-start items-center'>
                                                            <div className='flex w-[270px] items-center justify-start'>
                                                                 <input
                                                                      disabled={
                                                                           props
                                                                                .values
                                                                                .isIDVerified
                                                                      }
                                                                      type='number'
                                                                      maxLength='4'
                                                                      placeholder='YYYY'
                                                                      name='yearOfBirth'
                                                                      id='yearOfBirth'
                                                                      onChange={
                                                                           props.handleChange
                                                                      }
                                                                      onBlur={
                                                                           props.handleBlur
                                                                      }
                                                                      value={
                                                                           props
                                                                                .values
                                                                                .yearOfBirth
                                                                      }
                                                                      className={`${styles.inputBase}    px-2 rounded-xs  
                         focus:outline-none  w-[50px] text-xs rounded-lg`}
                                                                 />
                                                                 <span className='text-lightGrey mx-1'>
                                                                      {' '}
                                                                      /{' '}
                                                                 </span>
                                                                 <input
                                                                      disabled={
                                                                           props
                                                                                .values
                                                                                .isIDVerified
                                                                      }
                                                                      type='number'
                                                                      maxLength='2'
                                                                      placeholder='MM'
                                                                      name='monthOfBirth'
                                                                      id='monthOfBirth'
                                                                      onChange={
                                                                           props.handleChange
                                                                      }
                                                                      onBlur={
                                                                           props.handleBlur
                                                                      }
                                                                      value={
                                                                           props
                                                                                .values
                                                                                .monthOfBirth
                                                                      }
                                                                      className={`${styles.inputBase}    px-2 rounded-xs  
                         focus:outline-none  w-[38px] text-xs rounded-lg`}
                                                                 />
                                                                 <span className='text-lightGrey mx-1'>
                                                                      {' '}
                                                                      /{' '}
                                                                 </span>
                                                                 <input
                                                                      disabled={
                                                                           props
                                                                                .values
                                                                                .isIDVerified
                                                                      }
                                                                      type='number'
                                                                      maxLength='2'
                                                                      placeholder='DD'
                                                                      name='dayOfBirth'
                                                                      id='dayOfBirth'
                                                                      onChange={
                                                                           props.handleChange
                                                                      }
                                                                      onBlur={
                                                                           props.handleBlur
                                                                      }
                                                                      value={
                                                                           props
                                                                                .values
                                                                                .dayOfBirth
                                                                      }
                                                                      className={`${styles.inputBase}    px-2 rounded-xs  
                         focus:outline-none  w-[38px] text-xs rounded-lg`}
                                                                 />
                                                                 {!userProfile.isIDVerified && (
                                                                      <span
                                                                           className={
                                                                                styles.inputSuffix
                                                                           }
                                                                      >
                                                                           <Button
                                                                                className='text-green-300 p-1 rounded-lg z-10 bg-green-700 normal-case'
                                                                                onClick={
                                                                                     props.submitForm
                                                                                }
                                                                                variant='contained'
                                                                           >
                                                                                <DoneIcon
                                                                                     sx={{
                                                                                          fontSize: 14,
                                                                                     }}
                                                                                />
                                                                                Save
                                                                           </Button>
                                                                      </span>
                                                                 )}
                                                            </div>
                                                       </div>
                                                       <p
                                                            className={
                                                                 styles.errorMessage
                                                            }
                                                       >
                                                            {props.touched
                                                                 .yearOfBirth &&
                                                                 props.errors
                                                                      .yearOfBirth && (
                                                                      <span
                                                                           className='text-xs text-googleRed mx-auto absolute top-[27px] left-6 mt-3'
                                                                           id='feedbackyearOfBirth'
                                                                      >
                                                                           {
                                                                                props
                                                                                     .errors
                                                                                     .yearOfBirth
                                                                           }
                                                                      </span>
                                                                 )}
                                                            {props.touched
                                                                 .yearOfBirth &&
                                                                 !props.errors
                                                                      .yearOfBirth &&
                                                                 props.touched
                                                                      .monthOfBirth &&
                                                                 props.errors
                                                                      .monthOfBirth && (
                                                                      <span
                                                                           className='text-xs text-googleRed mx-auto absolute top-[27px] left-6 mt-3'
                                                                           id='feedbackmonthOfBirth'
                                                                      >
                                                                           {
                                                                                props
                                                                                     .errors
                                                                                     .monthOfBirth
                                                                           }
                                                                      </span>
                                                                 )}
                                                            {props.touched
                                                                 .yearOfBirth &&
                                                                 !props.errors
                                                                      .yearOfBirth &&
                                                                 props.touched
                                                                      .monthOfBirth &&
                                                                 !props.errors
                                                                      .monthOfBirth &&
                                                                 props.touched
                                                                      .dayOfBirth &&
                                                                 props.errors
                                                                      .dayOfBirth && (
                                                                      <span
                                                                           className='text-xs text-googleRed mx-auto absolute top-[27px] left-6 mt-3'
                                                                           id='feedbackdayOfBirth'
                                                                      >
                                                                           {
                                                                                props
                                                                                     .errors
                                                                                     .dayOfBirth
                                                                           }
                                                                      </span>
                                                                 )}
                                                       </p>
                                                  </div>
                                             </div>
                                        </fieldset>
                                   </form>
                              )}
                         </Formik>
                    </div>
               </div>
          </div>
     )
}
export default IdentityInformation
