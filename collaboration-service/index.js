const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/collaboration-service';

mongoose.connect(mongoUrl, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});


// Modèle de message de chat
const MessageSchema = new mongoose.Schema({
  projectId: mongoose.Schema.Types.ObjectId, 
  userId: mongoose.Schema.Types.ObjectId,                       
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', MessageSchema);

// Stocker et diffuser un message via WebSocket
io.on('connection', (socket) => {
  console.log('A user connected');

  // Événement pour recevoir un message et le sauvegarder
  socket.on('sendMessage', async (data) => {
    const { projectId, userId, content } = data;
    const message = new Message({ projectId, userId, content });
    await message.save();
    io.emit('receiveMessage', message);  // Diffuser le message à tous les utilisateurs
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// API pour récupérer les messages d'un projet spécifique
app.get('/messages/:projectId', async (req, res) => {
  const { projectId } = req.params;
  const messages = await Message.find({ projectId }).sort('timestamp');
  res.json(messages);
});

server.listen(8000, () => {
  console.log('Collaboration service running on port 8000');
});