// sockets.ts
import { io, Socket, ManagerOptions, SocketOptions } from 'socket.io-client';


export const API_BASE = process.env.EXPO_PUBLIC_API_BASE;

export const SOCKET_REAL = `${API_BASE}/real`;
export const SOCKET_DEMO = `${API_BASE}/demo`;
export const SOCKET_BONUS = `${API_BASE}/bonus`;

// ✅ Don't use `as const` here – it makes the array readonly
const commonOptions: Partial<ManagerOptions & SocketOptions> = {
    transports: ['websocket'],        // <– now it's string[]
    withCredentials: true,
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
};

export type QptionSocket = Socket;

// Singletons per namespace
export const realSocket: QptionSocket = io(SOCKET_REAL, commonOptions);
export const demoSocket: QptionSocket = io(SOCKET_DEMO, commonOptions);
export const bonusSocket: QptionSocket = io(SOCKET_BONUS, commonOptions);

// Optional helper by mode
export type Mode = 'real' | 'demo' | 'bonus';

export function getSocketByMode(mode: Mode): QptionSocket {
    switch (mode) {
        case 'real':
            return realSocket;
        case 'demo':
            return demoSocket;
        case 'bonus':
            return bonusSocket;
    }
}
