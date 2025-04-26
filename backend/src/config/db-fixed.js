const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Database configuration
let sequelize;

// Choose database based on environment variable
const dbType = process.env.DB_TYPE || 'mysql';

// Log SSL configuration
console.log('Initializing Sequelize connection...');
console.log(`SSL for PostgreSQL: ${process.env.PG_SSL === 'true' ? 'Enabled' : 'Disabled'}`);

if (dbType === 'supabase') {
  // Use Supabase PostgreSQL configuration
  if (process.env.SUPABASE_POSTGRES_URL) {
    console.log('Using SUPABASE_POSTGRES_URL for Sequelize connection');
    const connectionString = process.env.SUPABASE_POSTGRES_URL;
    
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
      logging: false
    });
    console.log('Using Supabase PostgreSQL configuration');
  } else {
    // Try to load from supabase-config
    try {
      const supabaseConfig = require('../../supabase-config');
      console.log('Using Supabase config from supabase-config.js');
      
      sequelize = new Sequelize(supabaseConfig.SUPABASE_POSTGRES_URL, {
        dialect: 'postgres',
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        },
        logging: false
      });
      console.log('Using Supabase PostgreSQL configuration from config file');
    } catch (error) {
      console.error('Error loading Supabase configuration:', error.message);
      throw new Error('Supabase configuration not found or invalid');
    }
  }
} else if (dbType === 'postgres') {
  // Use PostgreSQL configuration
  if (process.env.POSTGRES_URL || process.env.DATABASE_URL) {
    console.log('Using DATABASE_URL for Sequelize connection');
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    // Log connection string (with masked password)
    console.log('Connection string format:', connectionString.replace(/:[^:]*@/, ':****@'));
    
    // Create Sequelize instance with connection URI - NO SSL for local development
    sequelize = new Sequelize(connectionString, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: process.env.PG_SSL === 'true' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      },
      logging: console.log
    });
  } else if (process.env.PGDATABASE && process.env.PGHOST && process.env.PGUSER) {
    // Use PG* environment variables (Render standard)
    console.log('Using PostgreSQL with PG* environment variables');
    console.log(`PostgreSQL Host: ${process.env.PGHOST}`);
    console.log(`PostgreSQL Database: ${process.env.PGDATABASE}`);
    console.log(`PostgreSQL User: ${process.env.PGUSER}`);
    console.log(`PostgreSQL Port: ${process.env.PGPORT || 5432}`);
    
    sequelize = new Sequelize(
      process.env.PGDATABASE,
      process.env.PGUSER,
      process.env.PGPASSWORD,
      {
        host: process.env.PGHOST,
        port: process.env.PGPORT || 5432,
        dialect: 'postgres',
        dialectOptions: {
          ssl: process.env.PG_SSL === 'true' ? {
            require: true,
            rejectUnauthorized: false
          } : false
        },
        logging: console.log
      }
    );
  } else {
    // Use PostgreSQL configuration from pgConfig
    console.log('Using PostgreSQL with default configuration');
    
    // Import pgConfig only when needed
    const pgConfig = require('./pgConfig-fixed');
    
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
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    
    if (dbType === 'postgres' || dbType === 'supabase') {
      // Log more debug information for PostgreSQL
      console.log('PostgreSQL connection error details:');
      if (process.env.POSTGRES_URL) {
        console.log('Using POSTGRES_URL environment variable');
      } else if (process.env.DATABASE_URL) {
        console.log('Using DATABASE_URL environment variable');
      } else if (process.env.SUPABASE_POSTGRES_URL) {
        console.log('Using SUPABASE_POSTGRES_URL environment variable');
      } else if (process.env.PGHOST) {
        console.log('Using PGHOST environment variable');
      }
      
      // Try to check if we can resolve the host
      try {
        const { execSync } = require('child_process');
        let host;
        
        if (dbType === 'supabase' && process.env.SUPABASE_POSTGRES_URL) {
          host = process.env.SUPABASE_POSTGRES_URL.split('@')[1]?.split('/')[0]?.split(':')[0];
        } else {
          host = process.env.PGHOST || 
                process.env.POSTGRES_URL?.split('@')[1]?.split('/')[0]?.split(':')[0] || 
                'localhost';
        }
        
        if (host) {
          console.log(`Attempting to ping database host: ${host}`);
          try {
            const pingResult = execSync(`ping -c 1 ${host}`).toString();
            console.log('Ping result:', pingResult);
          } catch (pingErr) {
            console.log(`Cannot ping ${host}: ${pingErr.message}`);
          }
        }
      } catch (e) {
        console.log('Failed to ping database host:', e.message);
      }
    }
    
    return false;
  }
};

module.exports = { sequelize, connectDB }; 