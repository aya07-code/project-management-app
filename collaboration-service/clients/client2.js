const io = require('socket.io-client');

const socket = io('http://localhost:4005');

socket.on('connect', () => {
    console.log('User2 connecté au chat');
    socket.emit('message', { sender: 'User2', content: 'Bonjour !' });

    socket.on('message', (data) => {
        console.log('Message reçu par User2 :', data);
    });
});


// const io = require('socket.io-client');

// const socket2 = io("http://localhost:4005");

// socket2.on("connect", () => {
//   console.log("User 2 connected");

//   // Envoyer un message
//   socket2.emit("sendMessage", {
//     projectId: "67ec9aee492a7db0974f4785", 
//     userId: "67ec9a70492a7db0974f4782",  
//     content: "Hello from User 2!"
//   });

//   // Écouter les nouveaux messages
//   socket2.on("receiveMessage", (message) => {
//     console.log("User 2 received:", message);
//   });
// });
