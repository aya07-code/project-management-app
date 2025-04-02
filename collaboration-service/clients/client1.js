const io = require('socket.io-client');

const socket = io('http://localhost:4005');

socket.on('connect', () => {
    console.log('User1 connecté au chat');
    socket.emit('message', { sender: 'User1', content: 'Salut !' });

    socket.on('message', (data) => {
        console.log('Message reçu par User1 :', data);
    });
});


// const io = require('socket.io-client');

// const socket1 = io("http://localhost:4005");

// socket1.on("connect", () => {
//   console.log("User 1 connected");

//   // Envoyer un message
//   socket1.emit("sendMessage", {
//     projectId: "67ec9aee492a7db0974f4785", 
//     userId: "67ec9a42492a7db0974f477f",  
//     content: "Hello from User 1!"
//   });

//   // Écouter les nouveaux messages
//   socket1.on("receiveMessage", (message) => {
//     console.log("User 1 received:", message);
//   });
// });
