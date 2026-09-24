// // In-memory placeholder state
// let appState = {
//   title: "Real-Time Project",
//   counter: 0,
//   lastUpdated: new Date().toISOString()
// };

// // REST Endpoint to fetch initial state
// app.get('/api/state', (req, res) => {
//   res.json(appState);
// });

// // Mock endpoint: trigger an update across all clients
// app.post('/api/update', (req, res) => {
//   appState = {
//     ...appState,
//     counter: appState.counter + 1,
//     lastUpdated: new Date().toISOString()
//   };
  
//   // Broadcast change to all connected WebSocket clients
//   io.emit('stateUpdated', appState);
//   res.json({ success: true, current: appState });
// });

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose'; // 1. Import Mongoose

import moviesRouter from './api/movies.js';
import postersRouter from './api/posters.js';
import snacksRouter from './api/snacks.js';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173' } // Vite dev URL
});

// 2. Connect to MongoDB (using 127.0.0.1 to avoid IPv6 issues)
const MONGO_URI = 'mongodb://127.0.0.1:27017/kanmacinemas'; // Change cinemas_db if your DB has another name

mongoose.connect(MONGO_URI)
  .then(() => console.log(' Connected to MongoDB successfully!'))
  .catch((err) => console.error(' MongoDB connection error:', err.message));

// Routes
app.use('/api/movies', moviesRouter);
app.use('/api/posters', postersRouter);
app.use('/api/snacks', snacksRouter);
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.on('disconnect', () => console.log(`Client disconnected: ${socket.id}`));
});

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`Backend server ready at http://localhost:${PORT}`);
});