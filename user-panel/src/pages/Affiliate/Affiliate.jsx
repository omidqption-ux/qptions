import React from 'react'
import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import ReferralLink from './ReferralsLink'
import Referrals from './Referrals'
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

const Affiliate = () => {
     const [tabValue, setValue] = React.useState(0)
     const handleChange = (event, newValue) => {
          setValue(newValue)
     }

     return (
          <Box sx={{ width: '100%', p: 3 }}>
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
                         Earn More with Referrals
                    </Typography>
                    <Typography variant={"subtitle1"} className='text-green-600' >
                         Share your referral link with friends and others to earn extra money..
                    </Typography>
               </Box>
               <Box className={styles.tabsContainer}>
                    <Tabs
                         value={tabValue}
                         onChange={handleChange}
                         className={styles.tabs}

                    >
                         <Tab
                              className={`text-xs xl:text-lg ${styles.tab} ${tabValue === 0 ? styles.activeTab : ''}`}
                              label='Referral Link'
                              {...a11yProps(0)}
                         />
                         <Tab
                              className={`text-xs xl:text-lg ${styles.tab} ${tabValue === 1 ? styles.activeTab : ''}`}
                              label='Referrals'
                              {...a11yProps(1)}
                         />

                    </Tabs>
               </Box>
               <CustomTabPanel value={tabValue} index={0}>
                    <ReferralLink />
               </CustomTabPanel>
               <CustomTabPanel value={tabValue} index={1}>
                    <Referrals />
               </CustomTabPanel>
          </Box>
     )
}

export default Affiliate
