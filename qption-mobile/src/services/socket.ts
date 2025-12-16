import io, { Socket } from 'socket.io-client'
import { SOCKET_REAL } from '../config/env'

let socket: Socket | null = null
export const getSocket = () => {
    if (socket) return socket
    socket = io(SOCKET_REAL, { path: '/socket.io', transports: ['websocket'], withCredentials: true })
    return socket
}
export const closeSocket = () => { socket?.close(); socket = null }
