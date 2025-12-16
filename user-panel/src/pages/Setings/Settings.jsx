import React, { useEffect, useState, useCallback, useMemo } from 'react'
import UTCSelect from '../../components/UTCSelect/UTCSelect'
import Switch from '../../components/Switch/Switch'
import { toast } from 'react-toastify'
import { setUserProfile, setUserSettings } from '../../redux/slices/userSlice'
import axiosInstance from '../../network/axios'
import { useSelector, useDispatch } from 'react-redux'
import {
     Button,
     Tooltip,
     Tabs,
     Tab,
     Box,
     Pagination,
     LinearProgress,
     Fade,
     CircularProgress,
} from '@mui/material'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import AnnouncementIcon from '@mui/icons-material/Announcement'
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency'
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart'
import AssessmentIcon from '@mui/icons-material/Assessment'
import CastForEducationIcon from '@mui/icons-material/CastForEducation'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import SpatialAudioIcon from '@mui/icons-material/SpatialAudio'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import StoreIcon from '@mui/icons-material/Store'
import MotionPhotosAutoIcon from '@mui/icons-material/MotionPhotosAuto'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
import DeleteIcon from '@mui/icons-material/Delete'
import CancelIcon from '@mui/icons-material/Close'
import DoneIcon from '@mui/icons-material/Done'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { Formik } from 'formik'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import PhoneIcon from '@mui/icons-material/PhoneIphone'
import EmailIcon from '@mui/icons-material/Email'
import Counter from '../../components/Counter/Counter'
import {
     setLoginHistory,
     setActiveSessions,
     setSessionIp,
} from '../../redux/slices/loginHistory'
import ExitIcon from '@mui/icons-material/ExitToAppRounded'
import { formatDateTime } from '../../utils/timeAgo'
import styles from './Settings.module.css'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'


function CustomTabPanel(props) {
     const { children, value, index, ...other } = props

     return (
          <div
               role='tabpanel'
               hidden={value !== index}
               id={`simple-tabpanel-${index}`}
               aria-labelledby={`simple-tab-${index}`}
               className={styles.tabPanel}
               {...other}
          >
               {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
          </div>
     )
}

CustomTabPanel.propTypes = {
     children: PropTypes.node,
     index: PropTypes.number.isRequired,
     value: PropTypes.number.isRequired,
}

function a11yProps(index) {
     return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
     }
}
const SettingsCard = ({
     title,
     icon,
     children,
     cardClassName,
     headerClassName,
     contentClassName,
}) => (
     <div className="bg-gradient-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl w-full ">
          <div
               className="text-lg font-medium  w-full p-6 rounded-t-sm"
          >
               {icon} <span>{title}</span>
          </div>
          <div
               className={`${styles.settingsCardContent} ${contentClassName || ''
                    }`}
          >
               {children}
          </div>
     </div>
)
SettingsCard.propTypes = {
     title: PropTypes.string.isRequired,
     icon: PropTypes.element.isRequired,
     children: PropTypes.node.isRequired,
     cardClassName: PropTypes.string,
     headerClassName: PropTypes.string,
     contentClassName: PropTypes.string,
}

const SettingRow = ({ label, icon, control, description }) => (
     <div className={styles.settingRow}>
          <div className={styles.settingLabelGroup}>
               {icon}
               <span className={styles.settingLabel}>{label}</span>
               {description && (
                    <Tooltip
                         title={description}
                         arrow
                         placement='top'
                    >
                         <InfoOutlinedIcon
                              className={styles.settingDescriptionIcon}
                         />
                    </Tooltip>
               )}
          </div>
          <div className={styles.settingControl}>{control}</div>
     </div>
)
SettingRow.propTypes = {
     label: PropTypes.string.isRequired,
     icon: PropTypes.element.isRequired,
     control: PropTypes.element.isRequired,
     description: PropTypes.string,
}

const validationSchemaPassword = Yup.object().shape({
     password: Yup.string()
          .matches(
               /^(?=.*[A-Z])(?=.*\d).{8,}$/,
               'Password must contain at least 8 characters, one uppercase letter, and one number'
          )
          .required('Password is required'),
     newPassword: Yup.string()
          .matches(
               /^(?=.*[A-Z])(?=.*\d).{8,}$/,
               'Password must contain at least 8 characters, one uppercase letter, and one number'
          )
          .required('New password is required'),
     confirmPassword: Yup.string()
          .test('passwords do not match', function (value) {
               const { newPassword } = this.parent
               if (value !== newPassword) {
                    return false // If both email and phone are empty, return false
               }
               return true // Either email or phone is provided
          })
          .required('Confirm password is required'),
})
const validationSchemaSetPassword = Yup.object().shape({
     code: Yup.string()
          .matches(/^\d{6}$/, 'Code must be exactly 6 digits')
          .required('Get a code via email or phone'),
     newPassword: Yup.string()
          .matches(
               /^(?=.*[A-Z])(?=.*\d).{8,}$/,
               'Password must contain at least 8 characters, one uppercase letter, and one number'
          )
          .required('New password is required'),
     confirmPassword: Yup.string()
          .test('passwords do not match', function (value) {
               const { newPassword } = this.parent
               if (value !== newPassword) {
                    return false // If both email and phone are empty, return false
               }
               return true // Either email or phone is provided
          })
          .required('Confirm password is required'),
})

const Settings = () => {
     const [tabValue, setValue] = React.useState(0)
     const handleChange = (event, newValue) => {
          setValue(newValue)
     }
     const dispatch = useDispatch()
     const [loading, setLoading] = useState(false)
     const [totalPagesOfLoginHistory, settotalPagesOfLoginHsitory] = useState(0)
     const [otpWasSent, setOtpWasSent] = useState(false)
     const [otpExpired, setOtpExpired] = useState(false)
     const [currentSessionId, setSurrentSession] = useState(null)

     const { userSettings, profile: userProfile } = useSelector(
          (store) => store.user
     )
     const { loginHistory, activeSessions, currentIp } = useSelector(
          (store) => store.loginHistory
     )
     const setLoadingState = useCallback(
          (key, value) => setLoading((prev) => ({ ...prev, [key]: value })),
          []
     )

     const getUserInfo = async () => {
          try {
               setLoading(true)
               const response = await axiosInstance.get('/users/profile')
               const settingsRes = await axiosInstance.get('/users/settings')
               dispatch(setUserProfile(response))
               dispatch(setUserSettings(settingsRes ?? {}))
          } catch (e) {
          } finally {
               setLoading(false)
          }
     }

     useEffect(() => {
          getUserInfo()
          if (tabValue === 1) {
               getUserLoginHistory()
               getActiveSessions()
          }
          return () => {
               expirOtp()
          }
     }, [tabValue])
     const updateUserSettingsNotifications = async (notificationsValues) => {
          try {
               const response = await axiosInstance.put(
                    '/users/userNotificationSettings',
                    notificationsValues
               )
               dispatch(
                    setUserSettings({
                         ...userSettings,
                         notifications: response.notifications,
                    })
               )
          } catch (e) { }
     }
     const updateUserSettingsSound = async (soundValues) => {
          try {
               const response = await axiosInstance.put(
                    '/users/userSoundSettings',
                    soundValues
               )
               dispatch(
                    setUserSettings({
                         ...userSettings,
                         soundControl: response.soundControl,
                    })
               )
          } catch (e) { }
     }

     const updateUserSettingsIndicators = async (IndicatorsValues) => {
          try {
               const response = await axiosInstance.put(
                    '/users/userIndicatorsSettings',
                    IndicatorsValues
               )
               dispatch(
                    setUserSettings({
                         ...userSettings,
                         indicators: response.indicators,
                    })
               )
          } catch (e) { }
     }
     const updateUserSettingsTimeZone = async (TimeZoneValues) => {
          try {
               const response = await axiosInstance.put(
                    '/users/userTimeZoneSettings',
                    TimeZoneValues
               )
               dispatch(
                    setUserSettings({
                         ...userSettings,
                         timeZone: response.timeZone,
                    })
               )
          } catch (e) { }
     }
     const updateUserSettingsTimeZoneTimeZone = async (TimeZone) => {
          try {
               const response = await axiosInstance.put(
                    '/users/userTimeZoneSettings',
                    { ...userSettings.timeZone, timeZone: TimeZone }
               )
               dispatch(
                    setUserSettings({
                         ...userSettings,
                         timeZone: response.timeZone,
                    })
               )
          } catch (e) { }
     }

     const deleteAccount = async () => {
          try {
               await axiosInstance.delete('/users/deleteAccount')
               window.location.replace(
                    process.env.NODE_ENV !== 'development'
                         ? 'qption.com'
                         : 'http://localhost:3000'
               )
          } catch (e) { }
     }
     const changePassword = async (values) => {
          try {
               await axiosInstance.put('/users/changePassword', {
                    oldPassword: values.password,
                    password: values.newPassword,
               })
          } catch (e) { }
     }
     const getOtpSMS = async () => {
          try {
               setOtpExpired(false)
               await axiosInstance.post('/users/sendPhoneOtp')
               setOtpWasSent(true)
          } catch (e) { }
     }
     const getOtpEmail = async () => {
          try {
               setOtpExpired(false)
               await axiosInstance.post('/users/sendEmailOtp')
               setOtpWasSent(true)
          } catch (e) { }
     }
     const setpassword = async (values) => {
          try {
               await axiosInstance.put('/users/setPassword', {
                    password: values.newPassword,
                    otp: values.code,
               })
               setOtpWasSent(false)
          } catch (e) { }
     }
     const expirOtp = () => {
          setOtpExpired(true)
          setOtpWasSent(false)
     }
     const getActiveSessions = async () => {
          try {
               const response = await axiosInstance.get('/users/activeSessions')
               dispatch(setActiveSessions({ activeSessions: response }))

               const resIp = await fetch('https://api.ipify.org?format=json')
               const data = await resIp.json()
               dispatch(setSessionIp(data.ip))
               const currentSessionRes = await axiosInstance.post(
                    '/users/getCurrentSession',
                    {
                         clientIp: data.ip,
                    }
               )
               setSurrentSession(currentSessionRes.currentSession)
          } catch (e) { }
     }
     const terminateASession = async (sessionId) => {
          try {
               await axiosInstance.post('/users/terminateASession', {
                    sessionId,
               })
               getActiveSessions()
          } catch (e) { }
     }
     const getUserLoginHistory = async (page = 1) => {
          try {
               setLoading(true)
               const response = await axiosInstance.get(
                    '/users/userLoginHistory',
                    {
                         params: {
                              limit: 10,
                              page: page, // Pass the `page` variable dynamically
                         },
                    }
               )
               dispatch(setLoginHistory(response.loginHistories))
               settotalPagesOfLoginHsitory(response.totalPages)
          } catch {
          } finally {
               setTimeout(() => {
                    setLoading(false)
               }, 1000)
          }
     }
     const logout = async () => {
          try {
               await axiosInstance.post('/auth/logout')
               window.location.replace(
                    process.env.NODE_ENV !== 'development'
                         ? 'https://qption.com'
                         : 'http://localhost:3000'
               )
          } catch (e) {
               window.location.replace(
                    process.env.NODE_ENV !== 'development'
                         ? 'https://qption.com'
                         : 'http://localhost:3000'
               )
          }
     }
     const memoizedSettings = useMemo(() => userSettings, [userSettings])

     return (
          <Fade
               in={true}
               timeout={500}
          >
               <Box className="w-full px-2 py-3 min-h-screen" >
                    <Box className={styles.tabsContainer}>
                         <Tabs
                              value={tabValue}
                              onChange={handleChange}
                              className={styles.tabs}
                              TabIndicatorProps={{
                                   className: styles.tabIndicator
                              }}
                         >
                              <Tab
                                   className={`lg:text-lg text-xs  ${styles.tab} ${tabValue === 0 ? styles.activeTab : ''}`}
                                   label='Settings'
                                   {...a11yProps(0)}
                              />
                              <Tab
                                   className={`lg:text-lg text-xs ${styles.tab} ${tabValue === 1 ? styles.activeTab : ''}`}
                                   label='Security'
                                   {...a11yProps(1)}
                              />
                         </Tabs>
                    </Box>
                    <CustomTabPanel
                         value={tabValue}
                         index={0}
                    >
                         <div className={styles.settingsGrid + " lg:px-12 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 4xl:grid-cols-4 gap-4"}>
                              <SettingsCard
                                   title='Notifications'
                                   icon={<NotificationsActiveIcon />}
                              >
                                   <SettingRow
                                        label='Email notifications'
                                        icon={<MarkEmailUnreadIcon />}
                                        control={
                                             <Switch
                                                  size='small'
                                                  checked={
                                                       memoizedSettings
                                                            ?.notifications
                                                            ?.emailNotifications ??
                                                       false
                                                  }
                                                  onClick={() =>
                                                       updateUserSettingsNotifications(
                                                            {
                                                                 ...userSettings.notifications,
                                                                 emailNotifications:
                                                                      !userSettings
                                                                           .notifications
                                                                           .emailNotifications,
                                                            }
                                                       )
                                                  }
                                                  disabled={loading.update}
                                             />
                                        }
                                   />
                                   <hr className={styles.settingDivider} />
                                   <SettingRow
                                        label='Updates from Manager'
                                        icon={<ContactMailIcon />}
                                        control={
                                             <Switch
                                                  size='small'
                                                  checked={
                                                       memoizedSettings
                                                            ?.notifications
                                                            ?.updatesFromYourManager ??
                                                       false
                                                  }
                                                  onClick={() =>
                                                       updateUserSettingsNotifications(
                                                            {
                                                                 ...userSettings.notifications,
                                                                 updatesFromYourManager:
                                                                      !userSettings
                                                                           .notifications
                                                                           .updatesFromYourManager,
                                                            }
                                                       )
                                                  }
                                                  disabled={loading.update}
                                             />
                                        }
                                   />
                                   <hr className={styles.settingDivider} />
                                   <SettingRow
                                        label='Company News'
                                        icon={<AnnouncementIcon />}
                                        control={
                                             <Switch
                                                  size='small'
                                                  checked={
                                                       memoizedSettings
                                                            ?.notifications
                                                            ?.companysNews ??
                                                       false
                                                  }
                                                  onClick={() =>
                                                       updateUserSettingsNotifications(
                                                            {
                                                                 ...userSettings.notifications,
                                                                 companysNews:
                                                                      !userSettings
                                                                           .notifications
                                                                           .companysNews,
                                                            }
                                                       )
                                                  }
                                                  disabled={loading.update}
                                             />
                                        }
                                   />
                                   <hr className={styles.settingDivider} />
                                   <SettingRow
                                        label='Company Promotions'
                                        icon={<ContactEmergencyIcon />}
                                        control={
                                             <Switch
                                                  size='small'
                                                  checked={
                                                       memoizedSettings
                                                            ?.notifications
                                                            ?.companyPromotions ??
                                                       false
                                                  }
                                                  onClick={() =>
                                                       updateUserSettingsNotifications(
                                                            {
                                                                 ...userSettings.notifications,
                                                                 companyPromotions:
                                                                      !userSettings
                                                                           .notifications
                                                                           .companyPromotions,
                                                            }
                                                       )
                                                  }
                                                  disabled={loading.update}
                                             />
                                        }
                                   />
                                   <hr className={styles.settingDivider} />
                                   <SettingRow
                                        label='Trading Statements'
                                        icon={<CandlestickChartIcon />}
                                        control={
                                             <Switch
                                                  size='small'
                                                  checked={
                                                       memoizedSettings
                                                            ?.notifications
                                                            ?.tradingStatements ??
                                                       false
                                                  }
                                                  onClick={() =>
                                                       updateUserSettingsNotifications(
                                                            {
                                                                 ...userSettings.notifications,
                                                                 tradingStatements:
                                                                      !userSettings
                                                                           .notifications
                                                                           .tradingStatements,
                                                            }
                                                       )
                                                  }
                                                  disabled={loading.update}
                                             />
                                        }
                                   />
                                   <hr className={styles.settingDivider} />
                                   <SettingRow
                                        label='Trading Analytics'
                                        icon={<AssessmentIcon />}
                                        control={
                                             <Switch
                                                  size='small'
                                                  checked={
                                                       memoizedSettings
                                                            ?.notifications
                                                            ?.companysTradingAnalytics ??
                                                       false
                                                  }
                                                  onClick={() =>
                                                       updateUserSettingsNotifications(
                                                            {
                                                                 ...userSettings.notifications,
                                                                 companysTradingAnalytics:
                                                                      !userSettings
                                                                           .notifications
                                                                           .companysTradingAnalytics,
                                                            }
                                                       )
                                                  }
                                                  disabled={loading.update}
                                             />
                                        }
                                   />
                                   <hr className={styles.settingDivider} />
                                   <SettingRow
                                        label='Education Emails'
                                        icon={<CastForEducationIcon />}
                                        control={
                                             <Switch
                                                  size='small'
                                                  checked={
                                                       memoizedSettings
                                                            ?.notifications
                                                            ?.educationEmails ??
                                                       false
                                                  }
                                                  onClick={() =>
                                                       updateUserSettingsNotifications(
                                                            {
                                                                 ...userSettings.notifications,
                                                                 educationEmails:
                                                                      !userSettings
                                                                           .notifications
                                                                           .educationEmails,
                                                            }
                                                       )
                                                  }
                                                  disabled={loading.update}
                                             />
                                        }
                                   />
                              </SettingsCard>
                              <div
                                   style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '20px',
                                   }}
                              >
                                   <SettingsCard
                                        title='Indicators'
                                        icon={<ShowChartIcon />}
                                   >
                                        <SettingRow
                                             label='Signals'
                                             icon={<ShowChartIcon />}
                                             control={
                                                  <Switch
                                                       size='small'
                                                       checked={
                                                            memoizedSettings
                                                                 ?.indicators
                                                                 ?.signals ??
                                                            false
                                                       }
                                                       onClick={() =>
                                                            updateUserSettingsIndicators(
                                                                 {
                                                                      ...userSettings.indicators,
                                                                      signals: !userSettings
                                                                           .indicators
                                                                           .signals,
                                                                 }
                                                            )
                                                       }
                                                       disabled={loading.update}
                                                  />
                                             }
                                        />
                                        <hr className={styles.settingDivider} />
                                        <SettingRow
                                             label='Analytics'
                                             icon={<AnalyticsIcon />}
                                             control={
                                                  <Switch
                                                       size='small'
                                                       checked={
                                                            memoizedSettings
                                                                 ?.indicators
                                                                 ?.analytics ??
                                                            false
                                                       }
                                                       onClick={() =>
                                                            updateUserSettingsIndicators(
                                                                 {
                                                                      ...userSettings.indicators,
                                                                      analytics:
                                                                           !userSettings
                                                                                .indicators
                                                                                .analytics,
                                                                 }
                                                            )
                                                       }
                                                       disabled={loading.update}
                                                  />
                                             }
                                        />
                                        <hr className={styles.settingDivider} />
                                        <SettingRow
                                             label='Market Watch'
                                             icon={<StoreIcon />}
                                             control={
                                                  <Switch
                                                       size='small'
                                                       checked={
                                                            memoizedSettings
                                                                 ?.indicators
                                                                 ?.marketWatch ??
                                                            false
                                                       }
                                                       onClick={() =>
                                                            updateUserSettingsIndicators(
                                                                 {
                                                                      ...userSettings.indicators,
                                                                      marketWatch:
                                                                           !userSettings
                                                                                .indicators
                                                                                .marketWatch,
                                                                 }
                                                            )
                                                       }
                                                       disabled={loading.update}
                                                  />
                                             }
                                        />
                                   </SettingsCard>
                                   <SettingsCard
                                        title='Timezone'
                                        icon={<AccessTimeFilledIcon />}
                                   >
                                        <SettingRow
                                             label='Automatic Detection'
                                             icon={<MotionPhotosAutoIcon />}
                                             control={
                                                  <Switch
                                                       size='small'
                                                       checked={
                                                            memoizedSettings
                                                                 ?.timeZone
                                                                 ?.automaticDetection ??
                                                            false
                                                       }
                                                       onClick={() =>
                                                            updateUserSettingsTimeZone(
                                                                 {
                                                                      ...userSettings.timeZone,
                                                                      automaticDetection:
                                                                           !userSettings
                                                                                .timeZone
                                                                                .automaticDetection,
                                                                 }
                                                            )
                                                       }
                                                       disabled={loading.update}
                                                  />
                                             }
                                             description='Based on your IP'
                                        />
                                        <hr className={styles.settingDivider} />
                                        <SettingRow
                                             label='Time zone'
                                             icon={<AccessTimeFilledIcon />}
                                             control={
                                                  <UTCSelect
                                                       selected={
                                                            memoizedSettings
                                                                 ?.timeZone
                                                                 ?.timeZone ??
                                                            ''
                                                       }
                                                       onChange={
                                                            updateUserSettingsTimeZoneTimeZone
                                                       }
                                                       disabled={
                                                            memoizedSettings
                                                                 ?.timeZone
                                                                 ?.automaticDetection ||
                                                            loading.update
                                                       }
                                                  />
                                             }
                                        />
                                        <p className={styles.settingInfoText}>
                                             Set timezone for charts and
                                             platform. Daily statements use
                                             server time (CEST).
                                        </p>
                                   </SettingsCard>
                              </div>

                              <SettingsCard
                                   title='Sound Control'
                                   icon={<SpatialAudioIcon />}
                              >
                                   <SettingRow
                                        label='Balance Change Sound'
                                        icon={<VolumeUpIcon />}
                                        control={
                                             <Switch
                                                  size='small'
                                                  checked={
                                                       memoizedSettings
                                                            ?.soundControl
                                                            ?.balance ??
                                                       false
                                                  }
                                                  onClick={() =>
                                                       updateUserSettingsSound(
                                                            {
                                                                 ...userSettings.soundControl,
                                                                 balance: !userSettings
                                                                      .soundControl
                                                                      .balance,
                                                            }
                                                       )
                                                  }
                                                  disabled={loading.update}
                                             />
                                        }
                                   />
                                   <hr className={styles.settingDivider} />
                                   <SettingRow
                                        label='Notifications Sound'
                                        icon={<NotificationsActiveIcon />}
                                        control={
                                             <Switch
                                                  size='small'
                                                  checked={
                                                       memoizedSettings
                                                            ?.soundControl
                                                            ?.notification ??
                                                       false
                                                  }
                                                  onClick={() =>
                                                       updateUserSettingsSound(
                                                            {
                                                                 ...userSettings.soundControl,
                                                                 notification:
                                                                      !userSettings
                                                                           .soundControl
                                                                           .notification,
                                                            }
                                                       )
                                                  }
                                                  disabled={loading.update}
                                             />
                                        }
                                   />
                              </SettingsCard>
                         </div>
                    </CustomTabPanel>
                    <CustomTabPanel
                         value={tabValue}
                         index={1}
                    >
                         <div className={styles.securityGrid + " lg:px-12 grid grid-cols-1 2xl:grid-cols-2"} >

                              <SettingsCard
                                   title='Set Password'
                                   icon={<LockOpenIcon />}
                                   cardClassName={styles.formCard}
                                   contentClassName={
                                        styles.formCardContent
                                   }
                              >
                                   <Formik
                                        enableReinitialize
                                        validationSchema={
                                             validationSchemaSetPassword
                                        }
                                        onSubmit={(values, actions) => {
                                             setpassword(values)
                                             actions.setSubmitting(false)
                                             actions.resetForm()
                                        }}
                                        initialValues={{
                                             code: '',
                                             newPassword: '',
                                             confirmPassword: '',
                                        }}
                                   >
                                        {(props) => (
                                             <form
                                                  className='m-2 text-sm flex flex-col gap-4 p-2 lg:p-4'
                                                  onSubmit={
                                                       props.handleSubmit
                                                  }
                                             >
                                                  <div className='flex flex-col items-start justify-center'>
                                                       <span className='w-[140px] flex justify-start'>
                                                            New password
                                                       </span>
                                                       <div className='flex relative'>
                                                            <div className='flex justify-between'>
                                                                 <input
                                                                      type='password'
                                                                      className={
                                                                           styles.inputBase
                                                                      }
                                                                      autoComplete='off'
                                                                      name='newPassword'
                                                                      id='newPassword'
                                                                      onChange={
                                                                           props.handleChange
                                                                      }
                                                                      onBlur={
                                                                           props.handleBlur
                                                                      }
                                                                      value={
                                                                           props
                                                                                .values
                                                                                .newPassword
                                                                      }
                                                                 />
                                                            </div>
                                                       </div>
                                                  </div>
                                                  <div className='flex flex-col items-start justify-center'>
                                                       <span className='w-[140px] flex justify-center'>
                                                            Confirm
                                                            password
                                                       </span>
                                                       <div className='flex relative'>
                                                            <div className='flex justify-between'>
                                                                 <input
                                                                      type='password'
                                                                      className={
                                                                           styles.inputBase
                                                                      }
                                                                      autoComplete='off'
                                                                      name='confirmPassword'
                                                                      id='confirmPassword'
                                                                      onChange={
                                                                           props.handleChange
                                                                      }
                                                                      onBlur={
                                                                           props.handleBlur
                                                                      }
                                                                      value={
                                                                           props
                                                                                .values
                                                                                .confirmPassword
                                                                      }
                                                                 />
                                                            </div>
                                                       </div>
                                                  </div>
                                                  <div className='flex flex-col items-start justify-start'>
                                                       <span className='flex justify-start my-1'>
                                                            Recieved code
                                                       </span>
                                                       <div className='flex relative'>
                                                            <div className='flex justify-between'>
                                                                 <input
                                                                      type='text'
                                                                      className={` h-[28px] w-[70px] ${styles.inputBase}`}
                                                                      autoComplete='off'
                                                                      name='code'
                                                                      id='code'
                                                                      onChange={
                                                                           props.handleChange
                                                                      }
                                                                      onBlur={
                                                                           props.handleBlur
                                                                      }
                                                                      value={
                                                                           props
                                                                                .values
                                                                                .code
                                                                      }
                                                                      placeholder='6-digits'
                                                                 />
                                                            </div>
                                                            <div className='flex justify-start items-center '>
                                                                 {otpWasSent &&
                                                                      !otpExpired ? (
                                                                      <Counter
                                                                           expirOtp={
                                                                                expirOtp
                                                                           }
                                                                      />
                                                                 ) : (
                                                                      <>
                                                                           {userProfile.phone &&
                                                                                props
                                                                                     .values
                                                                                     .newPassword &&
                                                                                !props
                                                                                     .errors
                                                                                     .newPassword &&
                                                                                props
                                                                                     .values
                                                                                     .confirmPassword &&
                                                                                !props
                                                                                     .errors
                                                                                     .confirmPassword && (
                                                                                     <Button
                                                                                          onClick={
                                                                                               getOtpSMS
                                                                                          }
                                                                                          variant='contained'
                                                                                          className='bg-darkEnd text-xs mx-1 h-[26px] min-w-[26px] p-0'
                                                                                     >
                                                                                          <Tooltip title='Get code via SMS'>
                                                                                               <PhoneIcon fontSize='small' />
                                                                                          </Tooltip>
                                                                                     </Button>
                                                                                )}
                                                                           {userProfile.email &&
                                                                                props
                                                                                     .values
                                                                                     .newPassword &&
                                                                                !props
                                                                                     .errors
                                                                                     .newPassword &&
                                                                                props
                                                                                     .values
                                                                                     .confirmPassword &&
                                                                                !props
                                                                                     .errors
                                                                                     .confirmPassword && (
                                                                                     <Button
                                                                                          onClick={
                                                                                               getOtpEmail
                                                                                          }
                                                                                          variant='contained'
                                                                                          color='success'
                                                                                          className='bg-darkEnd text-xs mx-1 h-[26px] min-w-[26px] p-0'
                                                                                     >
                                                                                          <Tooltip title='Get code via Email'>
                                                                                               <EmailIcon
                                                                                                    fontSize='small'
                                                                                                    className='mx-1'
                                                                                               />
                                                                                          </Tooltip>
                                                                                     </Button>
                                                                                )}
                                                                      </>
                                                                 )}
                                                            </div>
                                                       </div>
                                                  </div>
                                                  <div className='flex my-4 gap-4 justify-start items-center  '>
                                                       <Button
                                                            onClick={() => {
                                                                 props.resetForm()
                                                                 expirOtp()
                                                            }}
                                                            variant='outlined'
                                                            className='bg-darkStart text-xs w-[126px]'
                                                       >
                                                            <CancelIcon fontSize='small' />
                                                            Cancel
                                                       </Button>
                                                       <Button
                                                            type='submit'
                                                            variant='contained'
                                                            className='bg-darkEnd text-xs w-[126px]'
                                                       >
                                                            <DoneIcon fontSize='small' />
                                                            confirm
                                                       </Button>
                                                  </div>
                                                  <div className='flex flex-col w-[322px] text-center gap-3'>
                                                       {props.touched
                                                            .code &&
                                                            props.errors
                                                                 .code && (
                                                                 <span
                                                                      className='text-xs text-googleRed mx-auto'
                                                                      id='feedbackcode'
                                                                 >
                                                                      {
                                                                           props
                                                                                .errors
                                                                                .code
                                                                      }
                                                                 </span>
                                                            )}
                                                       {props.touched
                                                            .newPassword &&
                                                            props.errors
                                                                 .newPassword && (
                                                                 <span
                                                                      className='text-xs text-googleRed mx-auto'
                                                                      id='feedbacknewPassword'
                                                                 >
                                                                      {
                                                                           props
                                                                                .errors
                                                                                .newPassword
                                                                      }
                                                                 </span>
                                                            )}
                                                       {props.touched
                                                            .confirmPassword &&
                                                            props.errors
                                                                 .confirmPassword && (
                                                                 <span
                                                                      className='text-xs text-googleRed mx-auto'
                                                                      id='feedbackconfirmPassword'
                                                                 >
                                                                      {
                                                                           props
                                                                                .errors
                                                                                .confirmPassword
                                                                      }
                                                                 </span>
                                                            )}
                                                  </div>
                                             </form>
                                        )}
                                   </Formik>
                              </SettingsCard>
                              <SettingsCard
                                   title='Change Password'
                                   icon={<LockOpenIcon />}
                                   cardClassName={styles.formCard + " mt-6 lg:mt-0"}
                                   contentClassName={
                                        styles.formCardContent
                                   }
                              >
                                   <Formik
                                        enableReinitialize
                                        validationSchema={
                                             validationSchemaPassword
                                        }
                                        onSubmit={(values, actions) => {
                                             changePassword(values)
                                             actions.setSubmitting(false)
                                        }}
                                        initialValues={{
                                             password: '',
                                             newPassword: '',
                                             confirmPassword: '',
                                        }}
                                   >
                                        {(props) => (
                                             <form
                                                  className='m-2 text-sm flex flex-col gap-4 p-4'
                                                  onSubmit={
                                                       props.handleSubmit
                                                  }
                                             >
                                                  <div className='flex flex-col items-start justify-center'>
                                                       <span className='w-[140px] flex justify-center'>
                                                            Current
                                                            password
                                                       </span>
                                                       <div className='flex relative'>
                                                            <div className='flex justify-between'>
                                                                 <input
                                                                      type='password'
                                                                      className={
                                                                           styles.inputBase
                                                                      }
                                                                      autoComplete='off'
                                                                      name='password'
                                                                      id='password'
                                                                      onChange={
                                                                           props.handleChange
                                                                      }
                                                                      onBlur={
                                                                           props.handleBlur
                                                                      }
                                                                      value={
                                                                           props
                                                                                .values
                                                                                .password
                                                                      }
                                                                 />
                                                            </div>
                                                       </div>
                                                  </div>
                                                  <div className='flex flex-col items-start justify-center'>
                                                       <span className='w-[140px] flex justify-start'>
                                                            New password
                                                       </span>
                                                       <div className='flex relative'>
                                                            <div className='flex justify-between'>
                                                                 <input
                                                                      type='password'
                                                                      className={
                                                                           styles.inputBase
                                                                      }
                                                                      autoComplete='off'
                                                                      name='newPassword'
                                                                      id='newPassword'
                                                                      onChange={
                                                                           props.handleChange
                                                                      }
                                                                      onBlur={
                                                                           props.handleBlur
                                                                      }
                                                                      value={
                                                                           props
                                                                                .values
                                                                                .newPassword
                                                                      }
                                                                 />
                                                            </div>
                                                       </div>
                                                  </div>
                                                  <div className='flex flex-col items-start justify-center'>
                                                       <span className='w-[140px] flex justify-center'>
                                                            Confirm
                                                            password
                                                       </span>
                                                       <div className='flex relative'>
                                                            <div className='flex justify-between'>
                                                                 <input
                                                                      type='password'
                                                                      className={
                                                                           styles.inputBase
                                                                      }
                                                                      autoComplete='off'
                                                                      name='confirmPassword'
                                                                      id='confirmPassword'
                                                                      onChange={
                                                                           props.handleChange
                                                                      }
                                                                      onBlur={
                                                                           props.handleBlur
                                                                      }
                                                                      value={
                                                                           props
                                                                                .values
                                                                                .confirmPassword
                                                                      }
                                                                 />
                                                            </div>
                                                       </div>
                                                  </div>
                                                  <div className='flex my-4 gap-4 justify-start items-center'>
                                                       <Button
                                                            onClick={
                                                                 props.resetForm
                                                            }
                                                            variant='outlined'
                                                            className='bg-darkStart text-xs w-[126px]'
                                                       >
                                                            <CancelIcon fontSize='small' />
                                                            Cancel
                                                       </Button>
                                                       <Button
                                                            type='submit'
                                                            variant='contained'
                                                            className='bg-darkEnd text-xs w-[126px]'
                                                       >
                                                            <DoneIcon fontSize='small' />
                                                            Confirm
                                                       </Button>
                                                  </div>
                                                  <div className='flex flex-col w-[322px] text-center gap-3'>
                                                       {props.touched
                                                            .password &&
                                                            props.errors
                                                                 .password && (
                                                                 <span
                                                                      className='text-xs text-googleRed mx-auto'
                                                                      id='feedbackpassword'
                                                                 >
                                                                      {
                                                                           props
                                                                                .errors
                                                                                .password
                                                                      }
                                                                 </span>
                                                            )}
                                                       {props.touched
                                                            .newPassword &&
                                                            props.errors
                                                                 .newPassword && (
                                                                 <span
                                                                      className='text-xs text-googleRed mx-auto'
                                                                      id='feedbacknewPassword'
                                                                 >
                                                                      {
                                                                           props
                                                                                .errors
                                                                                .newPassword
                                                                      }
                                                                 </span>
                                                            )}
                                                       {props.touched
                                                            .confirmPassword &&
                                                            props.errors
                                                                 .confirmPassword && (
                                                                 <span
                                                                      className='text-xs text-googleRed mx-auto'
                                                                      id='feedbackconfirmPassword'
                                                                 >
                                                                      {
                                                                           props
                                                                                .errors
                                                                                .confirmPassword
                                                                      }
                                                                 </span>
                                                            )}
                                                  </div>
                                             </form>
                                        )}
                                   </Formik>
                              </SettingsCard>
                              {/* <SettingsCard
                                   title='Active Sessions'
                                   icon={<AnalyticsIcon />}
                                   cardClassName={styles.tableCard}
                                   headerClassName={styles.tableCardHeader}
                                   contentClassName={styles.tableCardContent}
                              >
                                   <div className={styles.tableLoading}>
                                        {loading.sessions && <LinearProgress />}
                                   </div>
                                   <div className={styles.tableHeader + " grid grid-cols-3 lg:grid-cols-6 "}>
                                        <span>Last Active</span>
                                        <span>IP</span>
                                        <span>OS</span>
                                        <span>Browser</span>
                                        <span>Country</span>
                                        <span className=" hidden lg:flex" >Action</span>{' '}
                                   </div>
                                   {!loading.sessions &&
                                        activeSessions.length === 0 && (
                                             <p
                                                  className={
                                                       styles.tableEmptyState
                                                  }
                                             >
                                                  No active sessions.
                                             </p>
                                        )}
                                   {!loading.sessions &&
                                        activeSessions.map((session) => {
                                             const isCurrent =
                                                  session._id ===
                                                  currentSessionId
                                             return (
                                                  <div
                                                       key={session._id}
                                                       className={
                                                            styles.tableRow + " grid grid-cols-3 lg:grid-cols-6 "
                                                       }
                                                  >
                                                       <span>
                                                            {isCurrent && (
                                                                 <i
                                                                      className={
                                                                           styles.currentSessionIndicator
                                                                      }
                                                                 ></i>
                                                            )}
                                                            {formatDateTime(
                                                                 session.lastActive
                                                            )}
                                                       </span>
                                                       <span>
                                                            {session.ipAddress}
                                                       </span>
                                                       <span>
                                                            {session.deviceOs?.split(
                                                                 '/'
                                                            )[1] || 'N/A'}
                                                       </span>
                                                       <span>
                                                            {session.browser?.split(
                                                                 ' '
                                                            )[0] || 'N/A'}
                                                       </span>
                                                       <span>
                                                            {session.country ||
                                                                 'N/A'}
                                                       </span>
                                                       <span>
                                                            {!isCurrent && (
                                                                 <button
                                                                      onClick={() =>
                                                                           terminateASession(
                                                                                session._id
                                                                           )
                                                                      }
                                                                      disabled={
                                                                           loading.terminate
                                                                      }
                                                                      className={
                                                                           styles.terminateButton + " hidden lg:flex"
                                                                      }
                                                                 >
                                                                      {loading.terminate ? (
                                                                           <CircularProgress
                                                                                size={
                                                                                     12
                                                                                }
                                                                                color='inherit'
                                                                           />
                                                                      ) : (
                                                                           <ExitIcon fontSize='inherit' />
                                                                      )}{' '}
                                                                      Terminate
                                                                 </button>
                                                            )}
                                                       </span>
                                                  </div>
                                             )
                                        })}
                              </SettingsCard> */}
                              <SettingsCard
                                   title='Login History'
                                   icon={<AnalyticsIcon />}
                                   cardClassName={styles.tableCard}
                                   headerClassName={styles.tableCardHeader}
                                   contentClassName={styles.tableCardContent}
                              >
                                   <div className={styles.tableLoading}>
                                        {loading.history && <LinearProgress />}
                                   </div>
                                   <div className={styles.tableHeader + " grid grid-cols-3 lg:grid-cols-5 "}>
                                        <span>Date</span>
                                        <span>OS</span>
                                        <span>Browser</span>
                                        <span>Country</span>
                                        <span></span>{' '}
                                   </div>
                                   {!loading.history &&
                                        loginHistory.length === 0 && (
                                             <p
                                                  className={
                                                       styles.tableEmptyState
                                                  }
                                             >
                                                  No login history.
                                             </p>
                                        )}
                                   {!loading.history &&
                                        loginHistory.map((history) => (
                                             <div
                                                  key={
                                                       history._id ||
                                                       history.createdAt
                                                  }
                                                  className={styles.tableRow + " grid grid-cols-3 lg:grid-cols-5 "}
                                             >
                                                  <span>
                                                       {formatDateTime(
                                                            history.createdAt
                                                       )}
                                                  </span>
                                                  <span>
                                                       {history.deviceOs?.split(
                                                            '/'
                                                       )[1] || 'N/A'}
                                                  </span>
                                                  <span>
                                                       {history.browser?.split(
                                                            ' '
                                                       )[0] || 'N/A'}
                                                  </span>
                                                  <span>
                                                       {history.country ||
                                                            'N/A'}
                                                  </span>
                                                  <span></span>
                                             </div>
                                        ))}
                                   {totalPagesOfLoginHistory > 1 && (
                                        <div className={styles.tablePagination}>
                                             <Pagination
                                                  count={
                                                       totalPagesOfLoginHistory
                                                  }
                                                  onChange={(e, page) =>
                                                       getUserLoginHistory(page)
                                                  }
                                                  color='primary'
                                                  size='small'
                                                  disabled={loading.history}
                                             />{' '}
                                        </div>
                                   )}
                              </SettingsCard>
                              <div className='flex items-center justify-center'>
                                   <Button
                                        variant='outlined'
                                        color='warning'
                                        className='normal-case'
                                        onClick={logout}
                                   >
                                        <ExitIcon
                                             fontSize='small'
                                             className='rotate-180 mx-2'
                                        />
                                        Logout
                                   </Button>
                                   <Button
                                        onClick={() =>
                                             toast.warn(
                                                  ({ closeToast }) => (
                                                       <div className='flex flex-col gap-4'>
                                                            <span className='text-sm text-menuTxt '>
                                                                 Are you sure
                                                                 you want to
                                                                 delete your
                                                                 account
                                                                 permanently?
                                                            </span>
                                                            <Button
                                                                 onClick={() => {
                                                                      deleteAccount()
                                                                      closeToast()
                                                                 }}
                                                                 variant='contained'
                                                                 color='error'
                                                            >
                                                                 Yes
                                                            </Button>
                                                       </div>
                                                  ),
                                                  {
                                                       autoClose: false,
                                                       position:
                                                            'bottom-center',
                                                  }
                                             )
                                        }
                                        variant='outlined'
                                        color='error'
                                        className='normal-case mx-2'
                                   >
                                        <DeleteIcon fontSize='small' />
                                        Delete Account
                                   </Button>
                              </div>
                         </div>
                    </CustomTabPanel>
               </Box >
          </Fade >
     )
}
export default Settings
