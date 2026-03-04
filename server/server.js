// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Mount the Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
      console.log(` Map Discovery: http://localhost:${PORT}/api/restaurants/nearby`);
    });
  })
  .catch((err) => {
    console.error(" Database Connection Error:", err);
  });