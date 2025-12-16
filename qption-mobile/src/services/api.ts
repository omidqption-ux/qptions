import axios from 'axios'
import { API_BASE } from '../config/env'

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    timeout: 3000,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default api
