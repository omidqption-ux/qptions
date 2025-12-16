import { useEffect, useState } from 'react'
import axios from '../../network/axios'
import { useDispatch } from 'react-redux'
import { setNews, setCompanyNews } from '../../redux/slices/newsSlice'

export const useNews = () => {
     const [tabValue, setValue] = useState(0)
     const handleTabChange = (event, newValue) => {
          setValue(newValue)
     }
     const dispatch = useDispatch()
     const [loading, setLoading] = useState(false)

     useEffect(() => {
          if (tabValue === 0) fetchCompanyNews()
          if (tabValue === 1) fetchNews()
     }, [tabValue])

     const fetchCompanyNews = async (page = 1) => {
          try {
               setLoading(true)
               const response = await axios.get('/news/companyNewsUser', {
                    params: { page, limit: 12 },
               })
               dispatch(
                    setCompanyNews({
                         news: response.news,
                         count: response.count,
                    })
               )
          } catch (error) {
               console.error('Error fetching news:', error)
          } finally {
               setLoading(false)
          }
     }

     const fetchNews = async (page = 1) => {
          if (loading) return
          try {
               setLoading(true)
               const response = await axios.get('/news', {
                    params: { page, limit: page * 12 },
                    timeout: 10000,
               })
               dispatch(setNews(response.results))
          } catch (error) {
               console.error('Error fetching news:', error)
          } finally {
               setLoading(false)
          }
     }

     return { loading, fetchNews, handleTabChange, tabValue, fetchCompanyNews }
}
