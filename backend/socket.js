import {Server} from 'socket.io';

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: '*', // Allow all origins for development; adjust in production
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on("join_showtime_room", (showtimeId) => {
            socket.join(`showtime_${showtimeId}`);
            console.log(`Client ${socket.id} joined room showtime_${showtimeId}`);
        });

        socket.on("leave_showtime_room", (showtimeId) => {
            socket.leave(`showtime_${showtimeId}`);
            console.log(`Client ${socket.id} left room showtime_${showtimeId}`);
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized. Call initSocket first.");
    }
    return io;
}