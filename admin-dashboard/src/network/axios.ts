import axios from 'axios'
import { toast } from 'react-toastify'

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 3000,
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
            return response
        } else {
            toast.error(response.data.message)
            return response
        }
    },
    async (error) => {
        const originalRequest = error.config
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            const res = await axiosInstance.post('/auth/refreshTokenAdmin')
            if (res.data.loginRetry) return axiosInstance(originalRequest)
            else
                window.location.replace(
                    !import.meta.env.DEV
                        ? 'https://adminpanel.qption.com/signin'
                        : 'http://localhost:3002/signin'
                )
            return
        }
        if (error.response.status === 423) {
            window.location.replace(
                !import.meta.env.DEV
                    ? 'https://adminpanel.qption.com/signin'
                    : 'http://localhost:3002/signin'
            )
            return
        } else {
            toast.error(error.response.data.message)
        }
        return Promise.reject(error)
    }
)

export default axiosInstance
