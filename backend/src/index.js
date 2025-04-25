const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

// Load environment variables
dotenv.config();

// Import models
require('./models/userModel');

// Connect to database
connectDB();

// Import routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

// Use the appropriate order routes based on database type
let orderRoutes;
const dbType = process.env.DB_TYPE || 'mysql';

try {
  if (dbType === 'postgres') {
    orderRoutes = require('./routes/orderRoutes-pg');
    console.log('Using PostgreSQL order routes');
  } else {
    orderRoutes = require('./routes/orderRoutes');
    console.log('Using MySQL order routes');
  }
} catch (error) {
  console.error(`Error loading order routes for ${dbType}:`, error.message);
  console.log('Falling back to standard order routes');
  // Fallback to standard routes
  orderRoutes = require('./routes/orderRoutes');
}

// Create express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('E-commerce API is running...');
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} - Using Node ${process.version}`);
})
.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please close the other application or use a different port.`);
    console.log('Try running the restart-server.ps1 script to automatically handle this.');
    process.exit(1);
  } else {
    console.error('Server failed to start:', error.message);
    process.exit(1);
  }
}); 