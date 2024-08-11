const socketIo = require('socket.io');

module.exports = (server) => {
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

  return io;
};
