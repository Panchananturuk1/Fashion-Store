// This script sets the DB_TYPE environment variable to 'postgres'
// and then runs the application

// Set environment variables before anything else
process.env.DB_TYPE = 'postgres';
// Use a different port to avoid conflicts with other servers
process.env.PORT = process.env.PORT || '5003';

// Set PostgreSQL credentials explicitly for local development
process.env.PG_USER = process.env.PG_USER || 'postgres';
process.env.PG_PASSWORD = process.env.PG_PASSWORD || 'postgres';
process.env.PG_DATABASE = process.env.PG_DATABASE || 'fashion_store';
process.env.PG_HOST = process.env.PG_HOST || 'localhost';
process.env.PG_PORT = process.env.PG_PORT || '5432';

// Create a local DATABASE_URL for sequelize.js
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;
  console.log(`Created local DATABASE_URL with PostgreSQL credentials`);
}

// Log configuration
console.log('Starting application with PostgreSQL database...');
console.log(`Node.js version: ${process.version}`);
console.log(`Database type: ${process.env.DB_TYPE}`);
console.log(`PostgreSQL host: ${process.env.PG_HOST}`);
console.log(`PostgreSQL user: ${process.env.PG_USER}`);
console.log(`PostgreSQL database: ${process.env.PG_DATABASE}`);
console.log(`PostgreSQL port: ${process.env.PG_PORT}`);
console.log(`Server port: ${process.env.PORT}`);

// Import the application
require('./src/index'); 