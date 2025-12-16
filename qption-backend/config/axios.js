import axios from 'axios'
const axiosInstance = axios.create()

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
          return response.data
     },
     async (error) => {
          return Promise.reject(error)
     }
)

export default axiosInstance