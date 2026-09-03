import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173' } // Vite dev URL
});

// In-memory placeholder state
let appState = {
  title: "Real-Time Project",
  counter: 0,
  lastUpdated: new Date().toISOString()
};

// REST Endpoint to fetch initial state
app.get('/api/state', (req, res) => {
  res.json(appState);
});

// Mock endpoint: trigger an update across all clients
app.post('/api/update', (req, res) => {
  appState = {
    ...appState,
    counter: appState.counter + 1,
    lastUpdated: new Date().toISOString()
  };
  
  // Broadcast change to all connected WebSocket clients
  io.emit('stateUpdated', appState);
  res.json({ success: true, current: appState });
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.on('disconnect', () => console.log(`Client disconnected: ${socket.id}`));
});

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`Backend server ready at http://localhost:${PORT}`);
});