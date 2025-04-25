// This script sets environment variables for Render deployment
// and then runs the application

// Set environment variables before anything else
process.env.DB_TYPE = 'postgres';
process.env.PG_SSL = 'true';
process.env.NODE_ENV = 'production';

// Log startup
console.log('Starting application with Render PostgreSQL database...');
console.log(`Node.js version: ${process.version}`);
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Database type: ${process.env.DB_TYPE}`);
console.log(`SSL enabled: ${process.env.PG_SSL}`);

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  console.error('⚠️  Warning: No DATABASE_URL or POSTGRES_URL found in environment');
  console.error('Make sure you have the correct connection string in your environment variables');
  console.error('The application may not be able to connect to the database');
} else {
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  console.log('Using database URL:', dbUrl.replace(/:[^:]*@/, ':****@'));
}

// Import the application
require('./src/index'); 