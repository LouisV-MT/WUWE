// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');

const app = express();
app.use(helmet()); 
app.use(morgan('dev'));

// Middleware
app.use(cors()); 
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

// Mount the Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);






// Connect to MongoDB
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(" Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
      console.log(` Map Discovery: http://localhost:${PORT}/api/restaurants/nearby`);
    });
  })
  .catch((err) => {
    console.error(" Database Connection Error:", err);
  });