// Special startup script for Render.com deployment
require('dotenv').config();

// Log environment for debugging
console.log('Starting Fashion Store backend on Render...');
console.log(`Node Version: ${process.version}`);
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Database Type: ${process.env.DB_TYPE}`);
console.log(`Port: ${process.env.PORT}`);

if (process.env.DB_TYPE === 'postgres') {
  console.log('Using PostgreSQL database');
  console.log(`PostgreSQL Host: ${process.env.PG_HOST}`);
  console.log(`PostgreSQL Database: ${process.env.PG_DATABASE}`);
  console.log(`PostgreSQL User: ${process.env.PG_USER}`);
  console.log(`PostgreSQL Port: ${process.env.PG_PORT}`);
}

// Force SSL for production
if (process.env.NODE_ENV === 'production') {
  process.env.PG_SSL = 'true';
}

// Start the application
require('./src/index.js'); 