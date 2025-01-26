import { Server } from 'socket.io';

export default function handler(req, res) {
    if (!res.socket.server.io) {
        console.log('Initializing WebSocket server...');
        const io = new Server(res.socket.server, {
            path: '/api/socket',
        });

        io.on('connection', (socket) => {
            console.log(`User connected: ${socket.id}`);

            socket.on('joinRoom', (roomId) => {
                socket.join(roomId);
                console.log(`User ${socket.id} joined room: ${roomId}`);
            });

            socket.on('leaveRoom', (roomId) => {
                socket.leave(roomId);
                console.log(`User ${socket.id} left room: ${roomId}`);
            });

            socket.on('newMessage', (message) => {
                console.log(`New message in room ${message.conversationId}:`, message);
                io.to(message.conversationId).emit('newMessage', message);
            });

            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.id}`);
            });
        });

        res.socket.server.io = io;
    }

    res.end();
}
