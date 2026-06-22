const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const seedDB = require('./config/seed');

const app = express();

// Connect to Database & Seed
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    seedDB();
  });
}

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'MP Heritage Backend API Server Online' });
});

// Port configuration
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

