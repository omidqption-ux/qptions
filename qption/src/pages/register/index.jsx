import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Checkbox, Divider, Tab, Tabs, Tooltip, ToggleButton, ToggleButtonGroup } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import { Formik } from 'formik'
import * as Yup from 'yup'
import PhoneInput from '@/components/phoneInput/phoneInput'
import PhoneIcon from '@mui/icons-material/PhoneIphone'
import EmailIcon from '@mui/icons-material/AlternateEmail'
import axios from '@/network/axios'
import Counter from '@/components/Counter/Counter'
import { useTranslation } from 'next-i18next'
import i18nConfig from '../../../next-i18next.config.cjs'
import LoadingDots from "@/components//LoadingDots"
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'

function CustomTabPanel({ children, value, index, ...other }) {
     return (
          <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other} className="bg-DarkGreen">
               {value === index && <Box sx={{ py: 3, px: 2 }}>{children}</Box>}
          </div>
     )
}
const a11yProps = (index) => ({ id: `simple-tab-${index}`, 'aria-controls': `simple-tabpanel-${index}` })

export default function Registeration() {
     const router = useRouter()
     const { ref } = router.query
     const chckIsLogin = async () => {
          const res = await axios.post('/api/auth/isLogin')
          if (res.isLogin) {
               window.location.replace(process.env.NODE_ENV !== 'development' ? 'https://panel.qption.com/TradingRoom' : 'http://localhost:3001/TradingRoom')
               return
          }
     }

     const { t, i18n } = useTranslation('auth')
     const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.resolvedLanguage || i18n.language)

     const makeRegisterSchema = () =>
          Yup.object().shape({
               termsAccepted: Yup.boolean().oneOf([true], t('errors.termsRequired')).required(t('errors.termsRequired')),
               password: Yup.string().matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, t('errors.passwordPattern')).required(t('errors.passwordRequired')),
               email: Yup.string()
                    .email(t('errors.emailInvalid'))
                    .when('isPhone', { is: 'email', then: (s) => s.required(t('errors.emailRequired')), otherwise: (s) => s.notRequired() }),
               phone: Yup.string()
                    .matches(/^$|\+[1-9]\d{7,14}$/, t('errors.phoneInvalid'))
                    .when('isPhone', {
                         is: 'phone',
                         then: (s) => s.matches(/^$|\+[1-9]\d{7,14}$/, t('errors.phoneInvalid')).required(t('errors.phoneRequired')),
                         otherwise: (s) => s.notRequired()
                    })
          })
     const makeLoginSchema = () =>
          Yup.object().shape({
               password: Yup.string().matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, t('errors.passwordPattern')).required(t('errors.passwordRequired')),
               email: Yup.string()
                    .email(t('errors.emailInvalid'))
                    .when('isPhone', { is: 'email', then: (s) => s.required(t('errors.emailRequired')), otherwise: (s) => s.notRequired() }),
               phone: Yup.string()
                    .matches(/^$|\+[1-9]\d{7,14}$/, t('errors.phoneInvalid'))
                    .when('isPhone', {
                         is: 'phone',
                         then: (s) => s.matches(/^$|\+[1-9]\d{7,14}$/, t('errors.phoneInvalid')).required(t('errors.phoneRequired')),
                         otherwise: (s) => s.notRequired()
                    })
          })
     const makeForgetSchema = () =>
          Yup.object().shape({
               email: Yup.string()
                    .email(t('errors.emailInvalid'))
                    .when('isPhone', { is: 'email', then: (s) => s.required(t('errors.emailRequired')), otherwise: (s) => s.notRequired() }),
               phone: Yup.string()
                    .matches(/^$|^\(\d{1,4}\)\d{5,10}$/, t('errors.phoneInvalid'))
                    .when('isPhone', {
                         is: 'phone',
                         then: (s) => s.matches(/^\(\d{1,4}\)\d{5,10}$/, t('errors.phoneInvalid')).required(t('errors.phoneRequired')),
                         otherwise: (s) => s.notRequired()
                    })
          })

     const [tabValue, setTabValue] = React.useState(0)
     const [loading, setLoading] = React.useState(false)
     const [enteredPhone, setEnteredPhone] = React.useState('')
     const [enteredEmail, setEnteredEmail] = React.useState('')
     const [serverError, setServerError] = React.useState('')
     const [otpWasSent, setOtpWasSent] = React.useState(false)
     const [otpExpired, setOtpExpired] = React.useState(false)
     const [msg, setMsg] = React.useState(false)

     const handleTabChange = (_event, newValue) => {
          setServerError('')
          setOtpWasSent(false)
          setTabValue(newValue)
     }
     React.useEffect(() => {
          chckIsLogin()
     }, [])

     const registerUser = async (values) => {
          try {
               setLoading(true)
               setServerError('')
               const res = await axios.post('/api/auth/register', {
                    phone: values.phone,
                    email: values.email,
                    password: values.password,
                    country: values.country,
                    ref
               })
               if (res.ok) {
                    window.location.replace(process.env.NODE_ENV !== 'development' ? 'https://panel.qption.com/TradingRoom' : 'http://localhost:3001/TradingRoom')
                    return
               }

               setMsg(res.message || t('errors.registerFailed'))
          } catch (e) {
               setMsg(e?.message || t('errors.registerFailed'))
          } finally {
               setLoading(false)
          }
     }
     const loginUser = async (values) => {
          try {
               setServerError('')
               const res = await axios.post('/api/auth/login', {
                    phone: values.phone,
                    email: values.email,
                    password: values.password,
               })
               if (res.ok) {
                    window.location.replace(process.env.NODE_ENV !== 'development' ? 'https://panel.qption.com/TradingRoom' : 'http://localhost:3001/TradingRoom')
                    return
               }

               setMsg(res?.message || t('errors.loginFailed'))
          } catch {
               setMsg(t('errors.loginFailed'))
          } finally {
               setLoading(false)
          }
     }
     const sendOtpLogin = async (values) => {
          try {
               setServerError('')
               if (values.isPhone === 'phone') {
                    await axios.post('/api/auth/sendOtpSMS', { phone: values.phone, ref })
                    setEnteredPhone(values.phone)
               } else {
                    await axios.post('/api/auth/sendOtpEmail', { email: values.email, ref })
                    setEnteredEmail(values.email)
               }
               setOtpWasSent(true)
               setOtpExpired(false)
          } catch (e) {
               setServerError(e?.response?.data?.message || '')
          }
     }
     const loginOtp = async (value) => {
          if (!/^\d{6}$/.test(value.otpInput)) return
          try {
               await axios.post('/api/auth/otpLogin', { otp: value.otpInput, phone: enteredPhone, email: enteredEmail })
               setServerError('')
               setOtpExpired(false)
               window.location.replace(process.env.NODE_ENV !== 'development' ? 'https://panel.qption.com/TradingRoom' : 'http://localhost:3001/TradingRoom')
          } catch { }
     }
     const expireCode = () => {
          setOtpWasSent(false)
          setOtpExpired(true)
     }
     const handleGoogleLogin = () => {
          window.location.href = process.env.NODE_ENV !== 'development' ? 'https://api.qption.com/auth/google' : 'http://localhost:5000/auth/google'
     }

     return (

          <main
               dir={isRTL ? 'rtl' : 'ltr'}
               className="font-normal px-4 min-h-[calc(100vh-380px)]  bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-center py-12"
          >
               <Box className="relative my-5 flex flex-col justify-center items-center bg-linear-to-br from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-3 md:p-4 border border-green-500/20">
                    <Box className="w-full text-gray-300">
                         <Box>
                              <Tabs
                                   value={tabValue}
                                   onChange={handleTabChange}
                                   sx={{
                                        '& .MuiTab-root': {
                                             color: 'white',
                                             textTransform: 'none',
                                             fontSize: '1rem',
                                             minWidth: 'auto',
                                             padding: '12px 24px',
                                             '&.Mui-selected': { fontWeight: 'bold', color: '#00743f' }
                                        },
                                        '& .MuiTabs-indicator': { backgroundColor: '#00743f', height: '2px' }
                                   }}
                              >
                                   <Tab label={t('tabs.register')} {...a11yProps(0)} />
                                   <Tab label={t('tabs.login')} {...a11yProps(1)} />
                                   <Tab label={t('tabs.otp')} {...a11yProps(2)} />
                              </Tabs>
                         </Box>
                         {/* Register */}
                         <CustomTabPanel value={tabValue} index={0}>
                              <Formik
                                   enableReinitialize
                                   initialValues={{ phone: '', email: '', password: '', termsAccepted: false, isPhone: 'phone', country: '' }}
                                   validationSchema={makeRegisterSchema()}
                                   onSubmit={(values, actions) => { registerUser(values); actions.setSubmitting(false) }}
                              >
                                   {(props) => (
                                        <form autoComplete="off" className="flex h-[200px] w-full flex-col gap-2" onSubmit={props.handleSubmit}>
                                             <div className="flex flex-col justify-start w-full">
                                                  <div className="relative my-5 flex w-full items-center justify-between">
                                                       <div className={`w-full ${props.values.isPhone === 'phone' ? 'flex' : 'hidden'} absolute`}>
                                                            <PhoneInput formikprops={props} />
                                                       </div>
                                                       <div className={`w-full ${props.values.isPhone === 'email' ? 'flex' : 'hidden'} absolute`}>
                                                            <input
                                                                 dir='ltr'
                                                                 autoComplete="off"
                                                                 type="text"
                                                                 id="email"
                                                                 name="email"
                                                                 onChange={props.handleChange}
                                                                 onBlur={props.handleBlur}
                                                                 value={props.values.email}
                                                                 className="placeholder-gray-400 text-white h-[38px] w-full rounded-md bg-[#20293E] p-3 placeholder:text-xs focus:outline-none"
                                                                 placeholder={t('placeholders.email')}
                                                            />
                                                       </div>

                                                       <ToggleButtonGroup
                                                            size="small"
                                                            exclusive
                                                            value={props.values.isPhone}
                                                            onChange={(_e, v) => {
                                                                 if (!v) return
                                                                 props.setFieldValue('isPhone', v)
                                                                 props.setFieldValue('email', '')
                                                                 props.setFieldValue('phone', '')
                                                            }}
                                                            className="absolute right-5.5 flex w-1/12 items-center justify-center"
                                                       >
                                                            <ToggleButton value="phone" name="isPhone" id="isPhone" className="h-[38px] w-[38px] rounded-none hover:bg-[#7b8499] z-10 transition-all duration-300">
                                                                 <Tooltip title={t('toggles.phone')} placement="top" arrow>
                                                                      <PhoneIcon className={`cursor-pointer p-0.5 text-bgWhite ${props.values.isPhone === 'phone' ? 'text-gray-400' : 'text-gray-700'}`} fontSize="small" />
                                                                 </Tooltip>
                                                            </ToggleButton>
                                                            <ToggleButton value="email" name="isEmail" id="isEmail" className="h-[38px] w-[38px] rounded-none rounded-r-sm hover:bg-[#7b8499] z-10 transition-all duration-300">
                                                                 <Tooltip title={t('toggles.email')} placement="top" arrow>
                                                                      <EmailIcon className={`cursor-pointer p-0.5 text-bgWhite ${props.values.isPhone === 'email' ? 'text-gray-400' : 'text-gray-700'}`} fontSize="small" />
                                                                 </Tooltip>
                                                            </ToggleButton>
                                                       </ToggleButtonGroup>
                                                  </div>
                                                  {props.touched.phone && props.errors.phone && <span className="mx-auto text-xs text-red-500">{props.errors.phone}</span>}
                                                  {props.touched.email && props.errors.email && <span className="mx-auto text-xs text-red-500">{props.errors.email}</span>}
                                             </div>

                                             <div className="flex flex-col justify-start">
                                                  <input
                                                       dir='ltr'
                                                       autoComplete="new-password"
                                                       type="password"
                                                       id="password"
                                                       name="password"
                                                       onChange={props.handleChange}
                                                       onBlur={props.handleBlur}
                                                       value={props.values.password}
                                                       className="placeholder-gray-400 text-white h-[38px] rounded-md bg-[#20293E] p-3 placeholder:text-xs focus:outline-none"
                                                       placeholder={t('placeholders.password')}
                                                  />
                                                  {props.touched.password && props.errors.password && <div className="mx-auto text-xs text-red-500">{props.errors.password}</div>}
                                             </div>

                                             <div className="flex flex-col justify-start">
                                                  <div className="group flex cursor-pointer items-center [&>.css-imrjgg-MuiButtonBase-root-MuiCheckbox-root]:p-0">
                                                       <Checkbox
                                                            onChange={props.handleChange}
                                                            checked={props.values.termsAccepted}
                                                            id="termsAccepted"
                                                            name="termsAccepted"
                                                            className="text-gray-300 group-hover:text-blue-600"
                                                       />
                                                       <span
                                                            onClick={() => props.setFieldValue('termsAccepted', !props.values.termsAccepted)}
                                                            className="mx-0 select-none text-xs text-gray-300 group-hover:text-blue-600"
                                                       >
                                                            {t('terms.label')}
                                                       </span>
                                                  </div>
                                                  {props.submitCount > 0 && props.errors.termsAccepted && <span className="mx-auto text-xs text-red-500">{props.errors.termsAccepted}</span>}
                                             </div>
                                             <Button
                                                  disabled={props.isSubmitting}
                                                  type="submit"
                                                  className="bg-green-500 hover:bg-green-600 flex h-9 items-center justify-center normal-case text-white"
                                                  variant="contained"
                                                  aria-busy={loading || undefined}
                                             >
                                                  {loading ? <LoadingDots label={t('buttons.loading')} /> : t('buttons.register')}
                                             </Button>
                                             {(serverError || msg) && <span className="mx-auto text-xs text-red-500">{serverError || msg}</span>}
                                        </form>
                                   )}
                              </Formik>
                         </CustomTabPanel>
                         {/* Login */}
                         <CustomTabPanel value={tabValue} index={1}>
                              <Formik
                                   enableReinitialize
                                   initialValues={{ phone: '', email: '', password: '', isPhone: 'phone' }}
                                   validationSchema={makeLoginSchema()}
                                   onSubmit={(values, actions) => { loginUser(values); actions.setSubmitting(false) }}
                              >
                                   {(props) => (
                                        <form autoComplete="off" className="flex h-[200px] w-full flex-col gap-2" onSubmit={props.handleSubmit}>
                                             <div className="w- flex h-[200px] flex-col gap-4 w-full">
                                                  <div className="flex flex-col justify-start w-full">
                                                       <div className="relative my-5 flex w-full items-center justify-between">
                                                            <div className={`w-full ${props.values.isPhone === 'phone' ? 'flex' : 'hidden'} absolute`}>
                                                                 <PhoneInput formikprops={props} />
                                                            </div>
                                                            <div className={`w-full ${props.values.isPhone === 'email' ? 'flex' : 'hidden'} absolute`}>
                                                                 <input
                                                                      dir='ltr'
                                                                      autoComplete="off"
                                                                      type="text"
                                                                      id="email"
                                                                      name="email"
                                                                      onChange={props.handleChange}
                                                                      onBlur={props.handleBlur}
                                                                      value={props.values.email}
                                                                      className="placeholder-gray-400 text-white h-[38px] w-full rounded-md bg-[#20293E] p-3 placeholder:text-xs focus:outline-none"
                                                                      placeholder={t('placeholders.email')}
                                                                 />
                                                            </div>
                                                            <ToggleButtonGroup
                                                                 size="small"
                                                                 exclusive
                                                                 value={props.values.isPhone}
                                                                 onChange={(_e, v) => {
                                                                      if (!v) return
                                                                      props.setFieldValue('isPhone', v)
                                                                      props.setFieldValue('email', '')
                                                                      props.setFieldValue('phone', '')
                                                                 }}
                                                                 className="absolute right-5.5 flex w-1/12 items-center justify-center"
                                                            >
                                                                 <ToggleButton value="phone" className="h-[38px] w-[38px] rounded-none hover:bg-[#7b8499] z-10 transition-all duration-300">
                                                                      <Tooltip title={t('toggles.phone')} placement="top" arrow>
                                                                           <PhoneIcon className={`cursor-pointer p-0.5 text-bgWhite ${props.values.isPhone === 'phone' ? 'text-gray-400' : 'text-gray-700'}`} fontSize="small" />
                                                                      </Tooltip>
                                                                 </ToggleButton>
                                                                 <ToggleButton value="email" className="h-[38px] w-[38px] rounded-none rounded-r-sm hover:bg-[#7b8499] z-10 transition-all duration-300">
                                                                      <Tooltip title={t('toggles.email')} placement="top" arrow>
                                                                           <EmailIcon className={`cursor-pointer p-0.5 text-bgWhite ${props.values.isPhone === 'email' ? 'text-gray-400' : 'text-gray-700'}`} fontSize="small" />
                                                                      </Tooltip>
                                                                 </ToggleButton>
                                                            </ToggleButtonGroup>
                                                       </div>
                                                       {props.touched.phone && props.errors.phone && <span className="mx-auto text-xs text-red-500">{props.errors.phone}</span>}
                                                       {props.touched.email && props.errors.email && <span className="mx-auto text-xs text-red-500">{props.errors.email}</span>}
                                                  </div>

                                                  <div className="flex flex-col justify-start">
                                                       <input
                                                            dir='ltr'
                                                            autoComplete="new-password"
                                                            type="password"
                                                            id="password"
                                                            name="password"
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                            value={props.values.password}
                                                            className="placeholder-gray-400 text-white h-[38px] rounded-md bg-[#20293E] p-3 placeholder:text-xs focus:outline-none"
                                                            placeholder={t('placeholders.password')}
                                                       />
                                                       {props.touched.password && props.errors.password && <div className="mx-auto text-xs text-red-500">{props.errors.password}</div>}
                                                  </div>

                                                  <div className="flex w-full flex-col items-center justify-between">
                                                       <Button
                                                            disabled={props.isSubmitting}
                                                            type="submit"
                                                            className="bg-green-500 hover:bg-green-600 flex h-9 items-center justify-center normal-case text-white w-full"
                                                            variant="contained"
                                                            aria-busy={loading || undefined}
                                                       >
                                                            {loading ? <LoadingDots label={t('buttons.loading')} /> : t('buttons.login')}
                                                       </Button>

                                                       {(serverError || msg) && <span className="mx-auto text-xs text-red-500">{serverError || msg}</span>}
                                                  </div>

                                                  <span onClick={(e) => handleTabChange(e, 2)} className="cursor-pointer text-xs text-gray-300 hover:text-blue-500">
                                                       {t('buttons.getOtp')}
                                                  </span>
                                             </div>
                                        </form>
                                   )}
                              </Formik>
                         </CustomTabPanel>
                         {/* OTP */}
                         <CustomTabPanel value={tabValue} index={2}>
                              {otpWasSent && !otpExpired ? (
                                   <div className="flex h-[200px] w-full flex-col justify-center gap-4">
                                        <div className="flex w-full flex-col justify-start">
                                             <div className="relative my-5 flex w-full items-center justify-center">
                                                  <Formik initialValues={{ otpInput: '' }} onSubmit={(values, actions) => { loginOtp(values); actions.resetForm() }}>
                                                       {(props) => (
                                                            <form autoComplete="off" onSubmit={props.handleSubmit} className="flex items-center justify-center h-[34px] w-full gap-2">
                                                                 <input
                                                                      dir='ltr'
                                                                      name="otpInput"
                                                                      id="otpInput"
                                                                      type="text"
                                                                      className="placeholder-gray-400 text-white mx-2 h-[38px] w-full rounded-md bg-[#20293E] p-3 placeholder:text-xs focus:outline-none"
                                                                      placeholder={t('placeholders.otp6')}
                                                                      onChange={props.handleChange}
                                                                      value={props.values.otpInput}
                                                                 />
                                                                 <Button type="submit" className="bg-green-500 hover:bg-green-600 text-gray-300 w-[34px] ">{t('buttons.login')}</Button>
                                                                 <Counter expirOtp={expireCode} />
                                                            </form>
                                                       )}
                                                  </Formik>
                                             </div>
                                             <div className="text-center">
                                                  <span className="text-sm text-gray-300 text-center">
                                                       {t('messages.otpSentTo', { target: enteredPhone ? t('messages.targetPhone') : t('messages.targetEmail') })}
                                                  </span>
                                             </div>
                                        </div>
                                   </div>
                              ) : (
                                   <div className="flex h-[200px] w-full flex-col justify-center gap-4">
                                        <Formik
                                             enableReinitialize
                                             initialValues={{ phone: '', email: '', isPhone: 'phone' }}
                                             validationSchema={makeForgetSchema()}
                                             onSubmit={(values, actions) => { sendOtpLogin(values); actions.setSubmitting(false) }}
                                        >
                                             {(props) => (
                                                  <form autoComplete="off" className="flex h-[200px] flex-col gap-2 w-full" onSubmit={props.handleSubmit}>
                                                       <div className="flex h-[200px] flex-col justify-start gap-4 w-full">
                                                            <div className="flex flex-col justify-start items-start">
                                                                 <div className="relative my-5 flex w-full items-center justify-between">
                                                                      <div className={`w-full  ${props.values.isPhone === 'phone' ? 'flex' : 'hidden'} absolute`}>
                                                                           <PhoneInput formikprops={props} />
                                                                      </div>
                                                                      <div className={`w-full ${props.values.isPhone === 'email' ? 'flex' : 'hidden'} absolute`}>
                                                                           <input
                                                                                dir='ltr'
                                                                                autoComplete="off"
                                                                                type="text"
                                                                                id="email"
                                                                                name="email"
                                                                                onChange={props.handleChange}
                                                                                onBlur={props.handleBlur}
                                                                                value={props.values.email}
                                                                                className="placeholder-gray-400 text-white h-[38px] w-full rounded-md bg-[#20293E] p-3 placeholder:text-xs focus:outline-none"
                                                                                placeholder={t('placeholders.email')}
                                                                           />
                                                                      </div>
                                                                      <ToggleButtonGroup
                                                                           size="small"
                                                                           exclusive
                                                                           value={props.values.isPhone}
                                                                           onChange={(_e, v) => {
                                                                                if (!v) return
                                                                                props.setFieldValue('isPhone', v)
                                                                                props.setFieldValue('email', '')
                                                                                props.setFieldValue('phone', '')
                                                                           }}
                                                                           className="absolute right-5.5 flex w-1/12 items-center justify-center"
                                                                      >
                                                                           <ToggleButton value="phone" className="h-[38px] w-[38px] rounded-none hover:bg-[#7b8499] z-10 transition-all duration-300">
                                                                                <Tooltip title={t('toggles.phone')} placement="top" arrow>
                                                                                     <PhoneIcon className={`cursor-pointer p-0.5 text-bgWhite ${props.values.isPhone === 'phone' ? 'text-gray-400' : 'text-gray-700'}`} fontSize="small" />
                                                                                </Tooltip>
                                                                           </ToggleButton>
                                                                           <ToggleButton value="email" className="h-[38px] w-[38px] rounded-none rounded-r-sm hover:bg-[#7b8499] z-10 transition-all duration-300">
                                                                                <Tooltip title={t('toggles.email')} placement="top" arrow>
                                                                                     <EmailIcon className={`cursor-pointer p-0.5 text-bgWhite ${props.values.isPhone === 'email' ? 'text-gray-400' : 'text-gray-700'}`} fontSize="small" />
                                                                                </Tooltip>
                                                                           </ToggleButton>
                                                                      </ToggleButtonGroup>
                                                                 </div>
                                                                 {props.touched.phone && props.errors.phone && <span className="mx-auto text-xs text-red-500">{props.errors.phone}</span>}
                                                                 {props.touched.email && props.errors.email && <span className="mx-auto text-xs text-red-500">{props.errors.email}</span>}
                                                            </div>

                                                            <div className="flex w-full flex-col items-center justify-between">
                                                                 <Button disabled={props.isSubmitting} type="submit" className="flex h-9 w-full items-center justify-center normal-case text-white bg-green-500 hover:bg-green-600" variant="contained">
                                                                      {loading
                                                                           ? t('buttons.loading')
                                                                           : props.values.isPhone === 'phone'
                                                                                ? (<span className="flex items-center"><PhoneIcon fontSize="small" />&nbsp;{t('buttons.sendCodeSms')}</span>)
                                                                                : (<span className="flex items-center"><EmailIcon fontSize="small" />&nbsp;{t('buttons.sendCodeEmail')}</span>)
                                                                      }
                                                                 </Button>
                                                                 {serverError && <span className="mx-auto text-xs text-red-500">{serverError}</span>}
                                                            </div>
                                                       </div>
                                                  </form>
                                             )}
                                        </Formik>
                                   </div>
                              )}
                         </CustomTabPanel>
                         {!ref && (
                              <>
                                   <Divider className="bg-gray-500-silver shadow-gray-500 shadow" />
                                   <div className="flex justify-around gap-4 py-4">
                                        <Button variant="contained" className="bg-green-500 text-white hover:bg-green-600" onClick={handleGoogleLogin}>
                                             <span className="font-bold">
                                                  {t('buttons.loginWithGoogle')}
                                                  &nbsp;<GoogleIcon fontSize="small" className="text-md w-4 normal-case" />
                                             </span>
                                        </Button>
                                   </div>
                              </>
                         )}
                    </Box>
               </Box>
          </main>
     )
}
export async function getServerSideProps({ locale }) {
     return {
          props: {
               ...(await serverSideTranslations(
                    locale,
                    ['common', 'nav', 'footer', 'auth'],
                    i18nConfig
               )),
          },
     }
}
