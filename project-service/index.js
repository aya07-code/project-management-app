const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db/db');
const projectRoutes = require('./routes/projectRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/projects', projectRoutes);


const PORT = process.env.PORT;
app.listen(PORT, () => { 
    console.log(`Serveur démarré sur le port ${PORT}`)
} );
