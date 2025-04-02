const express = require('express');
const dotenv = require('dotenv');
const reportRoutes = require('./routes/reportRoutes');
require('./db');

dotenv.config();
const app = express();

app.use(express.json());
app.use('/reports', reportRoutes);

const PORT = process.env.PORT || 4006;
app.listen(PORT, () => console.log(`Reporting Service running on port ${PORT}`));
