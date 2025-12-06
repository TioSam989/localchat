require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;
const CHAT_PASSWORD = process.env.CHAT_PASSWORD || 'minichat';

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users in memory (cleared when server restarts)
const connectedUsers = new Set();

io.on('connection', (socket) => {
  console.log('New client attempting to connect:', socket.id);

  let isAuthenticated = false;
  let username = null;

  // Handle password verification
  socket.on('authenticate', (data) => {
    if (data.password === CHAT_PASSWORD) {
      isAuthenticated = true;
      username = data.username || `User${Math.floor(Math.random() * 1000)}`;
      connectedUsers.add(username);

      socket.emit('authenticated', { success: true, username });

      // Notify all users about new user
      io.emit('user-joined', { username, userCount: connectedUsers.size });

      console.log(`User authenticated: ${username}`);
    } else {
      socket.emit('authenticated', { success: false, message: 'Incorrect password' });
    }
  });

  // Handle chat messages
  socket.on('chat-message', (data) => {
    if (!isAuthenticated) {
      socket.emit('error', { message: 'Not authenticated' });
      return;
    }

    const message = {
      username: username,
      text: data.text,
      timestamp: new Date().toISOString()
    };

    // Broadcast message to all connected clients
    io.emit('chat-message', message);
  });

  // Handle image messages
  socket.on('image-message', (data) => {
    if (!isAuthenticated) {
      socket.emit('error', { message: 'Not authenticated' });
      return;
    }

    const message = {
      username: username,
      image: data.image,
      timestamp: new Date().toISOString()
    };

    // Broadcast image to all connected clients
    io.emit('image-message', message);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (username) {
      connectedUsers.delete(username);
      io.emit('user-left', { username, userCount: connectedUsers.size });
      console.log(`User disconnected: ${username}`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n================================================`);
  console.log(`🚀 LocalChat Server Running`);
  console.log(`================================================`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🔑 Password: ${CHAT_PASSWORD}`);
  console.log(`================================================\n`);
});
