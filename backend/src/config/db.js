const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const pgConfig = require('./pgConfig');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Database configuration
let sequelize;

// Choose database based on environment variable
const dbType = process.env.DB_TYPE || 'mysql';

if (dbType === 'postgres') {
  // Use PostgreSQL configuration
  if (process.env.POSTGRES_URL || process.env.DATABASE_URL) {
    console.log('Using PostgreSQL with connection string');
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    // Log connection string (with masked password)
    console.log('Connection string format:', connectionString.replace(/:[^:]*@/, ':****@'));
    
    // Create Sequelize instance with connection URI
    sequelize = new Sequelize(connectionString, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: console.log
    });
  } else if (pgConfig.url) {
    console.log('Using PostgreSQL with pgConfig URL');
    
    // Create Sequelize instance with connection URI from pgConfig
    sequelize = new Sequelize(pgConfig.url, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: console.log
    });
  } else {
    // Use PostgreSQL configuration with individual parameters
    console.log('Using PostgreSQL with individual parameters');
    sequelize = new Sequelize(
      pgConfig.database,
      pgConfig.user,
      pgConfig.password,
      {
        host: pgConfig.host,
        dialect: 'postgres',
        port: pgConfig.port,
        logging: pgConfig.logging,
        dialectOptions: pgConfig.dialectOptions,
        pool: pgConfig.pool
      }
    );
  }
  console.log('Using PostgreSQL configuration');
} else {
  // Use MySQL configuration (default)
  sequelize = new Sequelize(
    process.env.DB_NAME || 'ecommerce',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'mysql',
      port: process.env.DB_PORT || 3306,
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
  console.log('Using MySQL configuration');
}

// Test connection function
const connectDB = async () => {
  try {
    console.log('Attempting to connect to database...');
    await sequelize.authenticate();
    console.log(`Database connection established successfully (${dbType})`);
    
    // Sync all defined models to the DB without dropping tables
    await sequelize.sync({ force: false });
    console.log('Database & tables synced');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    
    if (dbType === 'postgres') {
      // Log more debug information for PostgreSQL
      console.log('PostgreSQL connection error details:');
      if (process.env.POSTGRES_URL) {
        console.log('Using POSTGRES_URL environment variable');
      } else if (process.env.DATABASE_URL) {
        console.log('Using DATABASE_URL environment variable');
      }
      
      // Try to check if we can resolve the host
      try {
        const { execSync } = require('child_process');
        const host = pgConfig.host || process.env.POSTGRES_URL?.split('@')[1]?.split('/')[0]?.split(':')[0];
        
        if (host) {
          console.log(`Attempting to ping database host: ${host}`);
          const pingResult = execSync(`ping -c 1 ${host}`).toString();
          console.log('Ping result:', pingResult);
        }
      } catch (e) {
        console.log('Failed to ping database host:', e.message);
      }
    }
    
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB }; 