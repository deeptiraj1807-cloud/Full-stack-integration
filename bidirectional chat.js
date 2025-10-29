// index.js (Node.js + Express + Socket.io server)
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('send message', (data) => {
    io.emit('receive message', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(5000, () => {
  console.log('listening on *:5000');
});
// public/index.html (React not required for very simple demo, can embed client code here)
<!DOCTYPE html>
<html>
<head><title>Socket.io Chat</title></head>
<body>
  <input id="username" placeholder="Enter your name" />
  <input id="message" placeholder="Enter message" />
  <button id="sendBtn">Send</button>
  <ul id="messages"></ul>

  <script src="/socket.io/socket.io.js"></script>
  <script>
    const socket = io();
    const sendBtn = document.getElementById('sendBtn');
    const messages = document.getElementById('messages');

    sendBtn.onclick = () => {
      const username = document.getElementById('username').value;
      const message = document.getElementById('message').value;
      if (!username || !message) return alert('Enter name and message');
      socket.emit('send message', { username, message });
      document.getElementById('message').value = '';
    };

    socket.on('receive message', (data) => {
      const li = document.createElement('li');
      li.textContent = `${data.username}: ${data.message}`;
      messages.appendChild(li);
    });
  </script>
</body>
</html>

