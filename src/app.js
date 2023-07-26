const __rootpath = __dirname.replace("\src","")
const express = require("express");
const app = express();
const createWebSocketServer = require('./update');
const http = require('http')

const server = http.createServer(app);

// Use the WebSocket module to handle WebSocket connections
createWebSocketServer(server);

app.use(express.static(__rootpath + '/public'));


app.get("/", (req, res) => {
  res.sendFile(__rootpath + "/views/index.html")
});

const routes = {
  'movies': require('./movies.js'),
  'screens': require('./screen.js'),
  'book': require('./book.js'),
  'admin': require('./admin.js')
}

app.use('/movies',routes.movies);
app.use('/screens',routes.screens);
app.use('/book',routes.book)
app.use('/admin',routes.admin)