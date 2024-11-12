// const express = require('express');
// const app = express();
// const helmet = require('helmet');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv/config');
// const logger = require('morgan');
// const authRoutes = require('./routes/authRoutes');

// const PORT = process.env.PORT || 5000;

// app.use(bodyParser.json());
// // app.use(bodyParser.urlencoded({ extended: true }));

// app.use(cors({
//     origin: 'http://localhost:5173', 
//     credentials: true, 
// }));

// // Use Helmet for security
// app.use(helmet());

// // Routes

// // app.use('/', userRoutes);
// app.use('/api/auth', authRoutes);

// // Middleware
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Database Connection
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Connected to MongoDB'))
//     .catch((error) => console.error('Could not connect to MongoDB:', error));

// // Start the server
//  app.listen(PORT, () => console.log(`server started on ${PORT}`));
// //  console.log(`Server running on port ${PORT}`);

// server.js
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');


dotenv.config();

const app = express();
app.use(express.json());


// // Database Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Could not connect to MongoDB:', error));


// Set up routes
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
