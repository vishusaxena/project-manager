const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const projectRoutes=require('./routes/projectRoutes')
// Initialize dotenv to use environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api', projectRoutes);

// Define a simple route for testing
app.get('/', (req, res) => {
    res.send('Project Management Tool Backend is Running');
});

// Connect to MongoDB
connectDB();


// Set the server to listen on a specific port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
