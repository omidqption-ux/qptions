import axios from 'axios'
import { toast } from 'react-toastify'

const MAX_RETRIES = 3

const axiosInstance = axios.create({
     baseURL:
          process.env.NODE_ENV !== 'development'
               ? 'https://api.qption.com/'
               : 'http://localhost:5000',
     timeout: 30_000,
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
               toast.error(response.statusText)
               return response.statusText
          }
     },
     async (error) => {
          const config = error.config
          if (!config || config.retryCount === undefined) {
               config.retryCount = 0
          }
          const shouldRetry = !error.response || error.response.status >= 500
          if (shouldRetry && config.retryCount < MAX_RETRIES) {
               config.retryCount += 1

               // Optional delay between retries
               await new Promise((resolve) =>
                    setTimeout(resolve, config.retryCount * 1000)
               )

               // Retry the request
               return axiosInstance(config)
          }
          if (
               error.response &&
               error.response.data &&
               error.response.data.message &&
               error.status < 500
          ) {
               toast.error('An error occurred. Please try again later.')
          }
          return Promise.reject(error)
     }
)

export default axiosInstance
