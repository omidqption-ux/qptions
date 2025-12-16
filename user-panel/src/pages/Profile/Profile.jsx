import React from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { Box, Typography } from '@mui/material'
import IDVerification from './IDVerification'
import IdentityInformation from './IdentityInformation'
import { Fade } from '@mui/material'
import styles from './IdentityInformation.module.css'

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

const Dashboard = () => {
     const [tabValue, setValue] = React.useState(0)
     const handleChange = (event, newValue) => {
          setValue(newValue)
     }

     return (
          <Box className='w-full p-3' >
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
                         Account Verification
                    </Typography>
                    <Typography variant={"subtitle1"} className='text-green-600' >
                         Follow the steps and get your account verified in no time.
                    </Typography>
               </Box>

               <Fade in={true} timeout={500}>
                    <Box className="w-full p-0">
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
                                        label='Information'
                                        {...a11yProps(0)}
                                   />
                                   <Tab
                                        className={`text-xs xl:text-lg ${styles.tab} ${tabValue === 1 ? styles.activeTab : ''}`}
                                        label='Verification'
                                        {...a11yProps(1)}
                                   />
                              </Tabs>
                         </Box>
                         <CustomTabPanel value={tabValue} index={0}>
                              <IdentityInformation />
                         </CustomTabPanel>
                         <CustomTabPanel value={tabValue} index={1}>
                              <IDVerification />
                         </CustomTabPanel>
                    </Box>
               </Fade>
          </Box>
     )
}

export default Dashboard
