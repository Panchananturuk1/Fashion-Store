// Simple server entry point for Render.com
const path = require('path');
const fs = require('fs');

console.log('Starting Fashion Store backend on Render...');
console.log(`Node Version: ${process.version}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Current working directory: ${process.cwd()}`);

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
  process.env.PG_SSL = 'true';
  console.log('Production environment detected - enabling SSL for PostgreSQL');
}

try {
  // Start the application
  require('./src/index.js');
} catch (error) {
  console.error('Error starting application:', error);
  process.exit(1);
} 