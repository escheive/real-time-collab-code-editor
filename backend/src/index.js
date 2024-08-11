const express = require('express');
const http = require('http');
const socketConfig = require('../config/socketConfig');

const app = express();
const server = http.createServer(app);

const io = socketConfig(server);

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
