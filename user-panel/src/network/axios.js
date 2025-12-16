import axios from 'axios'
import { toast } from 'react-toastify'

const axiosInstance = axios.create({
     baseURL: process.env.REACT_APP_BASE_URL,
     timeout: 10000,
     headers: {
          'Content-Type': 'application/json',
     },
     withCredentials: true,
})

axiosInstance.interceptors.request.use(
     (config) => {
          return config
     },
     (error) => {
          return Promise.reject(error)
     }
)

axiosInstance.interceptors.response.use(
     (response) => {
          if (response.status >= 200 && response.status < 300) {
               if (response.data && response.data.message) {
                    toast.success(response.data.message)
               }
               return response.data
          } else {
               toast.error(response.data.message)
               return response.data
          }
     },
     async (error) => {
          const originalRequest = error.config
          if (error.response.status === 401 && !originalRequest._retry) {
               originalRequest._retry = true
               const res = await axiosInstance.post('/auth/refreshToken') ///// set new cookie access
               if (res.loginRetry) return axiosInstance(originalRequest)
               else
                    window.location.replace(
                         process.env.NODE_ENV !== 'development'
                              ? 'https://www.qption.com'
                              : 'http://localhost:3000'
                    )
               return
          }
          if (error.response.status === 423) {
               window.location.replace(
                    process.env.NODE_ENV !== 'development'
                         ? 'https://www.qption.com'
                         : 'http://localhost:3000'
               )
               return
          } else {
               toast.error(error.response.data.message)
          }
          return Promise.reject(error)
     }
)

export default axiosInstance
