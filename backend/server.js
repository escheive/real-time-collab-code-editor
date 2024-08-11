// backend/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`Client joined room: ${room}`);
  });

  socket.on('codeChange', (data) => {
    socket.to(data.room).emit('codeUpdate', data.code);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
