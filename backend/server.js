// Simple server entry point for Render.com
console.log('Starting Fashion Store backend on Render...');
console.log(`Node Version: ${process.version}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

// Set environment variables
if (process.env.NODE_ENV === 'production') {
  process.env.PG_SSL = 'true';
  console.log('Production environment detected - enabling SSL for PostgreSQL');
}

// Start the application
require('./src/index.js'); 