import axios from 'axios'
export const axiosPaymentIo = axios.create({
     timeout: 5000,
     headers: {
          'Content-Type': 'application/json',
     },
})

axiosPaymentIo.interceptors.request.use(
     (config) => {
          config.headers = {
               'x-api-key': 'Q7REKHE-VGV437T-JQGXGBT-0EX2X0R',
               "Content-Type": "application/json"
          }
          return config
     },
     (error) => {
          return Promise.reject(error)
     }
)

axiosPaymentIo.interceptors.response.use(
     (response) => {
          return response.data
     },
     async (error) => {
          return Promise.reject(error)
     }
)