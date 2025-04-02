const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

// Envoyer un message
router.post('/send', async (req, res) => {
    const { sender, content } = req.body;
    const message = new Message({ sender, content });
    await message.save();
    res.json(message);
});

// Récupérer tous les messages
router.get('/messages', async (req, res) => {
    const messages = await Message.find().sort({ timestamp: -1 });
    res.json(messages);
});

module.exports = router;
