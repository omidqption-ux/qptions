import axios from 'axios'
const axiosPolygon = axios.create({
     baseURL: 'https://api.massive.com', // <- important
     timeout: 10000,
})

axiosPolygon.interceptors.request.use(
     (config) => {
          return config
     },
     (error) => {
          return Promise.reject(error)
     }
)

axiosPolygon.interceptors.response.use(
     (response) => {
          return response.data
     },
     async (error) => {
          return Promise.reject(error)
     }
)

export default axiosPolygon

