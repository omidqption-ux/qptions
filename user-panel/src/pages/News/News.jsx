import NewsCard from './newsCard'
import CompanyNewsCard from './companyNewsCard'
import { useNews } from './useNews'
import { useSelector } from 'react-redux'
import { Skeleton } from '@mui/material'
import Pagination from '@mui/material/Pagination'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import PropTypes from 'prop-types'
import { Fade } from '@mui/material'
import styles from './News.module.css'

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

const News = () => {
     const { loading, fetchNews, handleTabChange, tabValue, fetchCompanyNews } =
          useNews()
     const { news, companyNews, companyNewsCount } = useSelector(
          (state) => state.news
     )
     return (
          <Fade
               in={true}
               timeout={1000}
          >
               <Box sx={{ width: '100%', p: 3 }}>
                    <Box className={styles.tabsContainer}>
                         <Tabs
                              value={tabValue}
                              onChange={handleTabChange}
                              className={styles.tabs}
                              TabIndicatorProps={{
                                   className: styles.tabIndicator,
                              }}
                         >
                              <Tab
                                   className={`${styles.tab} ${
                                        tabValue === 0 ? styles.activeTab : ''
                                   }`}
                                   label='Company News'
                                   {...a11yProps(0)}
                              />
                              <Tab
                                   className={`${styles.tab} ${
                                        tabValue === 1 ? styles.activeTab : ''
                                   }`}
                                   label='Market News'
                                   {...a11yProps(1)}
                              />
                         </Tabs>
                    </Box>
                    <CustomTabPanel
                         value={tabValue}
                         index={0}
                    >
                         <div className='flex flex-col items-center py-2 w-full'>
                              <Pagination
                                   loading={loading}
                                   onChange={(event, page) =>
                                        fetchCompanyNews(page)
                                   }
                                   count={companyNewsCount / 12}
                                   shape='rounded'
                                   className='mx-auto [&>ul>li>button.MuiPaginationItem-root]:text-menuTxt'
                              />
                              <div className='gap-4 grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 place-content-start place-items-center p-2 mx-auto w-full '>
                                   {!loading &&
                                        companyNews.length > 0 &&
                                        companyNews.map((item, index) => (
                                             <CompanyNewsCard
                                                  newsItem={item}
                                                  key={index}
                                             />
                                        ))}
                                   {loading && (
                                        <Skeleton className='col-span-1 lg:col-span-2 2xl:col-span-3 p-20'>
                                             fetching news ...
                                        </Skeleton>
                                   )}
                              </div>
                         </div>
                    </CustomTabPanel>
                    <CustomTabPanel
                         value={tabValue}
                         index={1}
                    >
                         <div className='flex flex-col items-center py-2 w-full'>
                              <Pagination
                                   loading={loading}
                                   onChange={(event, page) => fetchNews(page)}
                                   count={5}
                                   shape='rounded'
                                   className='mx-auto [&>ul>li>button.MuiPaginationItem-root]:text-menuTxt'
                              />
                              <div className='gap-4 grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3   place-content-start place-items-center p-2 mx-auto w-full '>
                                   {!loading &&
                                        news.length > 1 &&
                                        news
                                             .slice(
                                                  news.length - 12,
                                                  news.length
                                             )
                                             .map((item, index) => (
                                                  <NewsCard
                                                       newsItem={item}
                                                       key={index}
                                                  />
                                             ))}
                                   {loading && (
                                        <Skeleton className='col-span-1 lg:col-span-2 2xl:col-span-3 p-20'>
                                             fetching news ...
                                        </Skeleton>
                                   )}
                              </div>
                         </div>
                    </CustomTabPanel>
               </Box>
          </Fade>
     )
}
export default News
