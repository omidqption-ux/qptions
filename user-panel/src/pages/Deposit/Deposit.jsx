import React from 'react'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { Box, Typography } from '@mui/material'
import DepositStepTwo from './DepositStepTwo'
import DepositStepThree from './DepositStepThree'
import DepositStepOne from './DepositStepOne'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import DepositHistory from './DepositHistory'
import styles from '../Setings/Settings.module.css'

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
const steps = ['Method', 'Details', 'Process']

const Desposit = () => {
     const [tabValue, setValue] = React.useState(0)
     const handleChange = (event, newValue) => {
          setValue(newValue)
     }
     const [activeStep, setActiveStep] = React.useState(0)
     const handleNext = () => {
          setActiveStep((prevActiveStep) => prevActiveStep + 1)
     }
     const handleBack = (step) => {
          if (step < activeStep) setActiveStep(step)
     }
     return (
          <Box className="min-h-screen" sx={{ width: '100%', p: 3 }}>
               <Box sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    backdropFilter: 'blur(10px)'
               }}
                    className="flex flex-col gap-2"
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
                         Deposits
                    </Typography>
                    <Typography variant={"subtitle1"} className='text-green-600' >
                         Follow the steps and easily deposit funds into your account.
                    </Typography>
               </Box>
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
                              className={`text-xs xl:text-lg ${styles.tab} ${tabValue === 0 ? styles.activeTab : ''}`}
                              label='Account Top-Up'
                              {...a11yProps(0)}
                         />
                         <Tab
                              className={`text-xs xl:text-lg ${styles.tab} ${tabValue === 1 ? styles.activeTab : ''}`}
                              label='Deposit History'
                              {...a11yProps(1)}
                         />

                    </Tabs>
               </Box>
               <CustomTabPanel
                    value={tabValue}
                    index={0}
               >
                    <Stepper
                         activeStep={activeStep}
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
                    >
                         {steps.map((label, index) => {
                              const stepProps = {}
                              const labelProps = {}
                              return (
                                   <Step
                                        key={label}
                                        {...stepProps}
                                        onClick={() => handleBack(index)}
                                   >
                                        <StepLabel
                                             {...labelProps}
                                             className={`${index < activeStep
                                                  ? 'cursor-pointer'
                                                  : 'cursor-auto'
                                                  }`}
                                        >
                                             <span className='text-menuTxt'>
                                                  {label}
                                             </span>
                                        </StepLabel>
                                   </Step>
                              )
                         })}
                    </Stepper>
                    {activeStep === 0 && (
                         <DepositStepOne handleNext={handleNext} />
                    )}
                    {activeStep === 1 && (
                         <DepositStepTwo
                              handleNext={handleNext}
                              setActiveStep={setActiveStep}
                         />
                    )}
                    {activeStep === 2 && (
                         <DepositStepThree setActiveStep={setActiveStep} />
                    )}
                    <div className='text-xs text-gray-500 p-5'>
                         All materials and services provided on this site are
                         subject to copyright and belong to "Qption". Any use of
                         materials of this website must be approved by an
                         official representative of "Qption", and contain a link
                         to the original resource. Any third-party companies of
                         "Online broker" or "Online trading" type, do not have
                         the right to use materials of this website as well as
                         any distorted writing of "Qption". In case of
                         violation, they will be prosecuted in accordance with
                         legislation of intellectual property protection. Qption
                         does not provide service to residents of the EEA
                         countries, USA, Israel, UK and Japan.
                    </div>
               </CustomTabPanel>
               <CustomTabPanel
                    value={tabValue}
                    index={1}
               >
                    <DepositHistory />
               </CustomTabPanel>
          </Box>
     )
}
export default Desposit
