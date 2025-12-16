import axios from 'axios'
const axiosBinance = axios.create({
     baseURL: 'https://api.binance.com',
     timeout: 8000,
})

axiosBinance.interceptors.request.use(
     (config) => {
          return config
     },
     (error) => {
          return Promise.reject(error)
     }
)

axiosBinance.interceptors.response.use(
     (response) => {
          return response.data
     },
     async (error) => {
          return Promise.reject(error)
     }
)

export default axiosBinance