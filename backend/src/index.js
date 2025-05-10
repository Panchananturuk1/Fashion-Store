const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db-fixed');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Set SSL for production environment
if (process.env.NODE_ENV === 'production') {
  process.env.PG_SSL = 'true';
  console.log('Production environment detected - enabling SSL for PostgreSQL');
}

// Set DATABASE_URL from SUPABASE_POSTGRES_URL if available
if (process.env.SUPABASE_POSTGRES_URL && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.SUPABASE_POSTGRES_URL;
  console.log('Setting DATABASE_URL from SUPABASE_POSTGRES_URL');
}

// Debug route files
const routesDir = path.join(__dirname, 'routes');
console.log(`Routes directory absolute path: ${routesDir}`);
console.log(`Routes directory exists: ${fs.existsSync(routesDir)}`);

if (fs.existsSync(routesDir)) {
  console.log('Files in routes directory:', fs.readdirSync(routesDir));
}

// Import models
try {
require('./models/userModel');
  console.log('User model loaded successfully');
} catch (error) {
  console.error('Error loading user model:', error.message);
}

// Connect to database
try {
  connectDB().then(connected => {
    if (!connected && process.env.NODE_ENV === 'production') {
      console.error('Failed to connect to database in production - exiting');
      process.exit(1);
    }
  });
} catch (error) {
  console.error('Error connecting to database:', error.message);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

// Import routes
let productRoutes, authRoutes, orderRoutes;

try {
  productRoutes = require('./routes/productRoutes');
  console.log('Product routes loaded successfully');
} catch (error) {
  console.error('Error loading product routes:', error.message);
  // Fallback to empty router
  productRoutes = express.Router();
}

try {
  authRoutes = require('./routes/authRoutes');
  console.log('Auth routes loaded successfully');
} catch (error) {
  console.error('Error loading auth routes:', error.message);
  // Fallback to empty router
  authRoutes = express.Router();
}

// Use the appropriate order routes based on database type
const dbType = process.env.DB_TYPE || 'mysql';
console.log(`Using database type: ${dbType}`);

try {
  // For both Postgres and Supabase, use the PostgreSQL routes
  if (dbType === 'postgres' || dbType === 'supabase') {
    // Check if the file exists first
    const pgRoutesPath = path.join(__dirname, 'routes', 'orderRoutes-pg.js');
    console.log(`PostgreSQL routes path: ${pgRoutesPath}`);
    console.log(`PostgreSQL routes file exists: ${fs.existsSync(pgRoutesPath)}`);
    
    if (fs.existsSync(pgRoutesPath)) {
    orderRoutes = require('./routes/orderRoutes-pg');
      console.log(`Using PostgreSQL order routes for ${dbType}`);
    } else {
      // Fall back to regular routes if PG version doesn't exist
      const mysqlRoutesPath = path.join(__dirname, 'routes', 'orderRoutes.js');
      if (fs.existsSync(mysqlRoutesPath)) {
        orderRoutes = require('./routes/orderRoutes');
        console.log(`PostgreSQL routes not found, using standard routes for ${dbType}`);
      } else {
        throw new Error('No suitable order routes file found');
      }
    }
  } else {
    // Default to MySQL routes
    const mysqlRoutesPath = path.join(__dirname, 'routes', 'orderRoutes.js');
    console.log(`MySQL routes path: ${mysqlRoutesPath}`);
    console.log(`MySQL routes file exists: ${fs.existsSync(mysqlRoutesPath)}`);
    
    if (fs.existsSync(mysqlRoutesPath)) {
    orderRoutes = require('./routes/orderRoutes');
    console.log('Using MySQL order routes');
    } else {
      throw new Error('MySQL routes file does not exist');
    }
  }
} catch (error) {
  console.error(`Error loading order routes for ${dbType}:`, error.message);
  // Fallback to empty router
  orderRoutes = express.Router();
  console.log('Using empty order routes as fallback');
}

// Create express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:4200', 'https://fashion-store-qh0x.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
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