// src/socket.js
import { Server } from 'socket.io';

let io;

export function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: [
                'https://adminpanel.qption.com',
                'http://localhost:3002',
            ],
            credentials: true,
        },
        path: '/socket.io',
    });

    const adminNamespace = io.of('/admin-notifications');

    adminNamespace.on('connection', (socket) => {
        console.log('Admin notifications socket connected:', socket.id);
        socket.join('admins');

        socket.on('disconnect', () => {
            console.log('Admin notifications socket disconnected:', socket.id);
        });
    });

    return io;
}

export function emitAdminNotification(type, payload) {
    if (!io) {
        console.warn('emitAdminNotification called before io is initialized', {
            type,
            payload,
        });
        return;
    }

    const adminNamespace = io.of('/admin-notifications');

    const notification = {
        id: payload.id,
        type, // 'deposit' | 'withdrawal' | 'verification'
        userId: payload.userId,
        amount: payload.amount ?? null,
        currency: payload.currency ?? null,
        status: payload.status ?? null,
        meta: payload.meta ?? {},
        link: payload.link ?? null,
        createdAt: payload.createdAt || new Date().toISOString(),
    };

    adminNamespace.to('admins').emit('admin-notification', notification);
}
