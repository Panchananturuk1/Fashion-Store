// Simple server entry point for Render.com
const path = require('path');
const fs = require('fs');

console.log('Starting Fashion Store backend on Render...');
console.log(`Node Version: ${process.version}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Current working directory: ${process.cwd()}`);

// Log all environment variables for debugging (mask sensitive values)
console.log('Environment variables:');
Object.keys(process.env).forEach(key => {
  if (key.includes('PASSWORD') || key.includes('SECRET') || key.includes('URL')) {
    console.log(`${key}: ******`);
  } else {
    console.log(`${key}: ${process.env[key]}`);
  }
});

// Check if the routes directory exists
const routesDir = path.join(__dirname, 'src', 'routes');
console.log(`Routes directory path: ${routesDir}`);
console.log(`Routes directory exists: ${fs.existsSync(routesDir)}`);

// List files in the routes directory
if (fs.existsSync(routesDir)) {
  const files = fs.readdirSync(routesDir);
  console.log('Files in routes directory:', files);
}

// Check if PostgreSQL libraries are available
try {
  const pg = require('pg');
  console.log('PostgreSQL module version:', pg.version);
  
  const { Sequelize } = require('sequelize');
  console.log('Sequelize module available');
} catch (error) {
  console.error('Error loading PostgreSQL libraries:', error.message);
}

// Test database connection directly
if (process.env.POSTGRES_URL) {
  console.log('Testing PostgreSQL connection...');
  try {
    const { Client } = require('pg');
    const client = new Client({
      connectionString: process.env.POSTGRES_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    // Connect to the database
    console.log('Connecting to PostgreSQL...');
    client.connect()
      .then(() => {
        console.log('PostgreSQL connection successful!');
        client.query('SELECT NOW()')
          .then(result => {
            console.log('PostgreSQL query result:', result.rows[0]);
            client.end();
          })
          .catch(err => {
            console.error('PostgreSQL query error:', err);
            client.end();
          });
      })
      .catch(err => {
        console.error('PostgreSQL connection error:', err);
      });
  } catch (error) {
    console.error('Error in PostgreSQL connection test:', error);
  }
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