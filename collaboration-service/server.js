const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const chatRoutes = require('./routes/chatRoutes');
require('./db');

dotenv.config();

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('Nouvel utilisateur connecté');

    socket.on('message', (data) => {
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log('Utilisateur déconnecté');
    });
});

app.use('/chat', chatRoutes);

server.listen(4005, () => console.log('Collaboration Service running on port 4005'));
