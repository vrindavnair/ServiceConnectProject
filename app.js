const express = require('express');
const app = express();
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const logger = require('morgan');

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
}));

// Use Helmet for security
app.use(helmet());

// Routes

app.use('/', userRoutes);

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection


// Start the server
app.listen(PORT, () => console.log(`server started on ${PORT}`));
