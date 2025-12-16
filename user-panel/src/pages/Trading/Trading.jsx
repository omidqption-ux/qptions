import React from 'react'
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import SocialTrading from './SocailTrading'
import TradingHistory from './TradingHistory'
import FollowersFollowings from './FollowersFollowings'
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
               {value === index && (
                    <Box
                         sx={{
                              p: { xs: 1, sm: 2, md: 3 },
                              animation: 'fadeIn 0.3s ease-in-out',
                              '@keyframes fadeIn': {
                                   from: { opacity: 0, transform: 'translateY(10px)' },
                                   to: { opacity: 1, transform: 'translateY(0)' }
                              }
                         }}
                    >
                         {children}
                    </Box>
               )}
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

const Trading = () => {
     const theme = useTheme()
     const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
     const [tabValue, setValue] = React.useState(0)

     const handleChange = (event, newValue) => {
          setValue(newValue)
     }

     return (
          <Box sx={{
               width: '100%',
               minHeight: '100vh',
               background: 'linear-gradient(180deg, #1a1f2e 0%, #0f121b 100%)',
               padding: '15px'
          }}>
               <Box sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    backdropFilter: 'blur(10px)'
               }}>
                    <Typography
                         variant={isMobile ? "h5" : "h4"}
                         sx={{
                              fontWeight: 600,
                              mb: 1,
                              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent'
                         }}
                    >
                         Trading Dashboard
                    </Typography>
                    <Typography variant={isMobile ? "body2" : "subtitle1"} className='text-green-600' >
                         Manage your trading activities and social connections
                    </Typography>
               </Box>

               <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
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
                                   label='Socail'
                                   {...a11yProps(0)}
                              />
                              <Tab
                                   className={`text-xs lg:text-lg ${styles.tab} ${tabValue === 1 ? styles.activeTab : ''}`}
                                   label='Network'
                                   {...a11yProps(1)}
                              />
                              <Tab
                                   className={`text-xs lg:text-lg ${styles.tab} ${tabValue === 2 ? styles.activeTab : ''}`}
                                   label='History'
                                   {...a11yProps(1)}
                              />
                         </Tabs>
                    </Box>

                    <CustomTabPanel value={tabValue} index={0}>
                         <SocialTrading />
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={1}>
                         <FollowersFollowings />
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={2}>
                         <TradingHistory />
                    </CustomTabPanel>
               </Box>
          </Box>
     )
}

export default Trading
