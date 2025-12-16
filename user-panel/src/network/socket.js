// sockets.js
import { Manager } from 'socket.io-client'

const BASE_URL =
     process.env.NODE_ENV === 'development'
          ? 'http://localhost:5000'
          : 'https://api.qption.com'

const manager = new Manager(BASE_URL, {
     path: '/socket.io',
     withCredentials: true,
     transports: ['websocket', 'polling'],
     reconnectionAttempts: 5,
})

export const socketBonus = manager.socket('/bonus')
export const socketReal = manager.socket('/real')
export const socketDemo = manager.socket('/demo')
export const socketNotifications = manager.socket('/notifications')
