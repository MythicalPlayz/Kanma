const express = require('express');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid'); // Import the v4 function from the uuid library

function createWebSocketServer(server) {
  const app = express();
  const wss = new WebSocket.Server({ server });
  const port = 3000;
  server.listen(port, () => {
    console.log(`WebSocket server is running on port ${port}`);
  });

  // I'm maintaining all active connections in this object
  const clients = {};

  // A new client connection request received
  wss.on('connection', function (connection) {
    // Generate a unique code for every user (you need to require 'uuid' library for this)
    const userId = uuidv4();
    console.log(`Received a new connection.`);

    // Store the new connection and handle messages
    clients[userId] = connection;
    console.log(`${userId} connected.`);

    // Handle incoming messages from the client
    connection.on('message', function (message) {
      message = JSON.parse(message)
      console.log(`Received message from client ${userId}: ${message}`);
      // You can process the received message here and send back responses if needed.
      sendNewSeats(message,clients)
    });

    // Handle client disconnection
    connection.on('close', function () {
      console.log(`${userId} disconnected.`);
      // Clean up resources associated with the disconnected client if needed.
      delete clients[userId];
    });

    // Sending data to clients (example)
    
  });

  return app;
}

module.exports = createWebSocketServer;

function sendNewSeats(seatData,clients){
    Object.values(clients).forEach((client) => {
        client.send(JSON.stringify(seatData));
      });
}