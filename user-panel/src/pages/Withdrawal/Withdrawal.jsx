import React, { useRef } from 'react'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { Box, Button, Divider, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setUserBalance, setIsIDVerified } from '../../redux/slices/userSlice'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import axiosInstance from '../../network/axios'
import { setWithdrawAmount } from '../../redux/slices/withdrawSlice'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import WithdrawalHistory from './WithdrawalHistory'
import StepTwoWithdraw from './StepTwoWithdraw'
import StepThreeWithdraw from './StepThreeWithdraw'
import { Fade } from '@mui/material'
import styles from '../Profile/IdentityInformation.module.css'
import CurrencyDisplay from "../../components/NumberFormat/NumberFormat"

function CustomTabPanel(props) {
     const { children, value, index, ...other } = props

     return (
          <div
               role='tabpanel'
               hidden={value !== index}
               id={`simple-tabpanel-${index}`}
               aria-labelledby={`simple-tab-${index}`}
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
const steps = ['Amount', 'Details', 'Process']

const Withdraw = () => {
     const dispatch = useDispatch()
     const [tabValue, setValue] = React.useState(0)
     const handleChange = (event, newValue) => {
          setValue(newValue)
     }
     const inputRef = useRef(null)
     const [activeStep, setActiveStep] = React.useState(0)
     const [BalanceToShow, setBalanceToShow] = React.useState(0)
     const [status, setStatus] = React.useState('pending')
     const { amount: withdrawAmount } = useSelector((store) => store.withdraw)
     const { balance, isIDVerified } = useSelector((store) => store.user)

     React.useEffect(() => {
          if (balance) setBalanceToShow(Math.floor(balance))
     }, [balance])

     const handleNext = () => {
          setActiveStep((prevActiveStep) => prevActiveStep + 1)
     }

     const handleBack = (step) => {
          if (step < activeStep) setActiveStep(step)
     }

     React.useEffect(() => {
          if (inputRef.current) {
               inputRef.current.focus()
          }
          getUserIdVerificationStatus()
          getUserBalance()
     }, [])

     const getUserBalance = async () => {
          try {
               const res = await axiosInstance.get('/users/balance')
               dispatch(setUserBalance(res.balance))
          } catch (e) { }
     }
     const getUserIdVerificationStatus = async () => {
          try {
               const res = await axiosInstance.get(
                    '/users/getIdVerificationStatus'
               )
               const resVerifyStatus = await axiosInstance.get(
                    '/verification/getUserVerificationStatus'
               )
               dispatch(setIsIDVerified(res.isIDVerified))
               setStatus(resVerifyStatus.status)
          } catch (e) { }
     }
     const onChangeWithdraw = (value) => {
          if (value > balance) return
          dispatch(setWithdrawAmount(value))
          if (value) {
               setBalanceToShow(Math.floor(balance) - value)
          } else setBalanceToShow(Math.floor(balance))
     }

     return (
          <Box sx={{
               width: '100%', px: 2, py: 3
          }}>
               <Box sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    backdropFilter: 'blur(10px)'
               }}
                    className="flex flex-col gap-2 px-"
               >
                    <Typography
                         variant={"h5"}
                         sx={{
                              fontWeight: 600,
                              mb: 1,
                              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent'
                         }}
                    >
                         Withdrawal
                    </Typography>
                    <Typography variant={"subtitle1"} className='text-green-600' >
                         Simply follow the steps to withdraw your money securely.
                    </Typography>
               </Box>
               <Fade
                    in={true}
                    timeout={1000}
               >
                    <Box sx={{ width: '100%', p: 0 }}>
                         {isIDVerified ? (
                              <>
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
                                                  className={`text-xs lg:text-lg ${styles.tab} ${tabValue === 0 ? styles.activeTab : ''}`}
                                                  label='Withdraw'
                                                  {...a11yProps(0)}
                                             />
                                             <Tab
                                                  className={`text-xs lg:text-lg ${styles.tab} ${tabValue === 1 ? styles.activeTab : ''}`}
                                                  label='History'
                                                  {...a11yProps(1)}
                                             />
                                        </Tabs>
                                   </Box>
                                   <CustomTabPanel
                                        value={tabValue}
                                        index={0}
                                   >
                                        <Stepper
                                             sx={{
                                                  width: '100%',
                                                  m: 2,
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
                                             activeStep={activeStep}>
                                             {steps.map((label, index) => {
                                                  const stepProps = {}
                                                  const labelProps = {}
                                                  return (
                                                       <Step
                                                            key={label}
                                                            {...stepProps}
                                                            onClick={() =>
                                                                 handleBack(index)
                                                            }
                                                            className='cursor-pointer'
                                                       >
                                                            <StepLabel
                                                                 {...labelProps}
                                                            >
                                                                 <span className='text-menuTxt'>
                                                                      {label}
                                                                 </span>
                                                            </StepLabel>
                                                       </Step>
                                                  )
                                             })}
                                        </Stepper>
                                        {activeStep === steps.length && (
                                             <React.Fragment>
                                                  <Box
                                                       sx={{
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            pt: 2,
                                                       }}
                                                       className='w-full p-5 h-[250px]  flex justify-center items-center text-lg '
                                                  >
                                                       <span className='text-yellow text-center p-4 border border-dashed border-lightYellow rounded-md max-w-[320px]'>
                                                            Your withdrawal request
                                                            has been successfully
                                                            submitted, and the funds
                                                            will be deposited into
                                                            your account within a few
                                                            business days
                                                       </span>
                                                  </Box>
                                             </React.Fragment>
                                        )}
                                        {activeStep === 0 && (
                                             <div className='py-4 px-2 flex justify-center items-center  w-full gap-4 mt-10'>
                                                  <div className='bg-gradient-to-b from-green-500/10 to-green-500/5 backdrop-blur-3xl rounded-xl p-4  flex flex-col '>
                                                       <div className='flex items-center justify-around w-full p-2'>
                                                            <div className='flex flex-col'>
                                                                 <span className='text-lg text-green-700 font-semibold leading-5 flex items-center'>
                                                                      Available Cash
                                                                      Out&nbsp;:&nbsp;&nbsp;
                                                                      <span className='text-green-600 flex items-center'>
                                                                           <CurrencyDisplay
                                                                                className="text-green-500"
                                                                                loading={false}
                                                                                amount={BalanceToShow}
                                                                                currency='USD'
                                                                           />
                                                                      </span>
                                                                 </span>
                                                            </div>
                                                       </div>
                                                       <Divider className='bg-green-800 m-4' />
                                                       <div className='flex items-center justify-center w-full my-5'>
                                                            <span className='text-sm text-green-100 mx-2'>
                                                                 Amount :
                                                            </span>
                                                            <input
                                                                 ref={inputRef}
                                                                 required
                                                                 type='number'
                                                                 className={`${styles.inputBase} w-[105px] h-8 `}
                                                                 autoComplete='off'
                                                                 value={
                                                                      withdrawAmount
                                                                           ? withdrawAmount
                                                                           : ''
                                                                 }
                                                                 onChange={(e) => {
                                                                      const inputVal =
                                                                           parseInt(
                                                                                e
                                                                                     .target
                                                                                     .value,
                                                                                10
                                                                           )
                                                                      if (
                                                                           isNaN(
                                                                                inputVal
                                                                           ) ||
                                                                           inputVal <
                                                                           10
                                                                      ) {
                                                                           e.preventDefault()
                                                                      }
                                                                      onChangeWithdraw(
                                                                           inputVal
                                                                      )
                                                                 }}
                                                            />
                                                       </div>
                                                       <Divider className='bg-green-800 m-4' />
                                                       <div className='flex flex-col justify-end items-start w-full p-4'>
                                                            <span className='text-xs   text-green-400'>
                                                                 Minimum withdrawal
                                                                 amount : <span className='text-[#00d2ff]' >10$</span>
                                                            </span>
                                                            <span className='text-xs  text-green-400 my-2'>
                                                                 Commission : <span className='text-[#00d2ff]' >0$</span>
                                                            </span>
                                                       </div>
                                                       <div className='flex items-center justify-around w-full mb-5'>
                                                            <Button
                                                                 disabled={
                                                                      !withdrawAmount ||
                                                                      withdrawAmount <
                                                                      10
                                                                 }
                                                                 onClick={handleNext}
                                                                 variant='contained'
                                                                 className={` ${!withdrawAmount || withdrawAmount < 10 ? 'text-green-800 bg-green-900' : 'text-green-100 bg-green-700'} w-full hover:bg-green-500`}
                                                            >
                                                                 Next
                                                            </Button>
                                                       </div>
                                                  </div>
                                             </div>
                                        )}
                                        {activeStep === 1 && (
                                             <StepTwoWithdraw
                                                  handleNext={handleNext}
                                             />
                                        )}
                                        {activeStep === 2 && (
                                             <StepThreeWithdraw
                                                  handleNext={handleNext}
                                                  setActiveStep={setActiveStep}
                                             />
                                        )}
                                        <div className='text-xs text-green-700 gap-6 leading-5 py-6 flex justify-center w-full'>
                                             <span className='max-w-[250px] text-center '>
                                                  Typically, a withdrawal request is
                                                  processed automatically and takes a
                                                  few minutes, and in some cases up
                                                  to 3 business days.
                                             </span>
                                        </div>
                                   </CustomTabPanel>
                                   <CustomTabPanel
                                        value={tabValue}
                                        index={1}
                                   >
                                        <WithdrawalHistory />
                                   </CustomTabPanel>
                              </>
                         ) : (
                              <div className=' w-full  text-yellow  text-lg flex justify-center items-center'>
                                   <div className='p-5 my-4 rounded-lg text-center font-semibold max-w-[370px] border-dashed border border-lightYellow'>
                                        {status === 'notRequested' && (
                                             <>
                                                  &apos; Please verify your identity
                                                  to enable fund withdrawals. &apos;
                                             </>
                                        )}
                                        {status === 'pending' && (
                                             <>
                                                  &apos; Your request is currently
                                                  under review by our managers—please
                                                  await their approval. &apos;
                                             </>
                                        )}
                                        {status === 'rejected' && (
                                             <>
                                                  &apos; Your verification was
                                                  declined. Please restart the
                                                  verification process and complete
                                                  all the required steps. &apos;
                                             </>
                                        )}
                                   </div>
                              </div>
                         )}
                    </Box>
               </Fade>
          </Box >
     )
}
export default Withdraw
