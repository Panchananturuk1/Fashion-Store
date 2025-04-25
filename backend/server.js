// Simple server entry point for Render.com
const path = require('path');
const fs = require('fs');

console.log('Starting Fashion Store backend on Render...');
console.log(`Node Version: ${process.version}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Current working directory: ${process.cwd()}`);

// Log database configuration environment variables
console.log('Database configuration:');
console.log(`DB_TYPE: ${process.env.DB_TYPE || 'not set'}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '******' : 'not set'}`);

// Check if the routes directory exists
const routesDir = path.join(__dirname, 'src', 'routes');
console.log(`Routes directory path: ${routesDir}`);
console.log(`Routes directory exists: ${fs.existsSync(routesDir)}`);

// List files in the routes directory
if (fs.existsSync(routesDir)) {
  const files = fs.readdirSync(routesDir);
  console.log('Files in routes directory:', files);
}

// Set environment variables
if (process.env.NODE_ENV === 'production') {
  console.log('Production environment detected');
  
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is not set in production!');
    process.exit(1);
  } else {
    console.log('DATABASE_URL is set correctly');
  }
}

try {
  // Start the application
  require('./src/index.js');
} catch (error) {
  console.error('Error starting application:', error);
  process.exit(1);
} 