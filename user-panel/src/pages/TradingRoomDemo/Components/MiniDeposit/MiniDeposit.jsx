import React from 'react'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { Box } from '@mui/material'
import DepositStepTwo from './DepositStepTwo'
import DepositStepThree from './DepositStepThree'
import DepositStepOne from './DepositStepOne'

const steps = ['Method', 'Details', 'Process']

const Desposit = ({ closeDepositPanel }) => {
     const [activeStep, setActiveStep] = React.useState(0)
     const handleNext = () => {
          setActiveStep((prevActiveStep) => prevActiveStep + 1)
     }
     const handleBack = (e, step) => {
          if (step < activeStep) setActiveStep(step)
          e.stopPropagation()
     }
     return (
          <Box sx={{ width: '100%', p: 1 }}>
               <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                         const stepProps = {}
                         const labelProps = {}
                         return (
                              <Step
                                   key={label}
                                   {...stepProps}
                                   onClick={(e) => handleBack(e, index)}
                              >
                                   <StepLabel
                                        {...labelProps}
                                        className={`${
                                             index < activeStep
                                                  ? 'cursor-pointer'
                                                  : 'cursor-auto'
                                        }`}
                                   ></StepLabel>
                              </Step>
                         )
                    })}
               </Stepper>
               {activeStep === 0 && <DepositStepOne handleNext={handleNext} />}
               {activeStep === 1 && (
                    <DepositStepTwo
                         handleNext={handleNext}
                         setActiveStep={setActiveStep}
                    />
               )}
               {activeStep === 2 && (
                    <DepositStepThree
                         closeDepositPanel={closeDepositPanel}
                         setActiveStep={setActiveStep}
                    />
               )}
          </Box>
     )
}
export default Desposit
