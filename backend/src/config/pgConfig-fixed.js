// PostgreSQL configuration file with SSL disabled for local development
// This file contains the configuration for connecting to PostgreSQL

const dotenv = require('dotenv');
const { parse } = require('pg-connection-string');

// Load environment variables
dotenv.config();

// Check if POSTGRES_URL is provided (Render format)
let pgConfig;

// Log SSL configuration
const useSSL = process.env.PG_SSL === 'true';
console.log(`PostgreSQL SSL: ${useSSL ? 'Enabled' : 'Disabled'}`);

if (process.env.POSTGRES_URL || process.env.DATABASE_URL) {
  // Parse the connection string
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  console.log(`Using PostgreSQL connection string from environment`);
  
  try {
    const config = parse(connectionString);
    
    pgConfig = {
      database: config.database,
      user: config.user,
      password: config.password,
      host: config.host,
      port: parseInt(config.port) || 5432,
      logging: process.env.PG_LOGGING === 'true',
      dialectOptions: {
        ssl: useSSL ? {
          require: true,
          rejectUnauthorized: false
        } : false
      },
      pool: {
        max: parseInt(process.env.PG_POOL_MAX || 5),
        min: parseInt(process.env.PG_POOL_MIN || 0),
        acquire: parseInt(process.env.PG_POOL_ACQUIRE || 30000),
        idle: parseInt(process.env.PG_POOL_IDLE || 10000)
      }
    };
    
    console.log(`PostgreSQL Configuration: ${pgConfig.host}:${pgConfig.port}/${pgConfig.database}`);
  } catch (error) {
    console.error('Error parsing connection string:', error);
    console.log('Connection string format:', connectionString.replace(/:[^:]*@/, ':****@'));
    
    // Just use the raw URL
    console.log('Falling back to raw connection string');
    pgConfig = { url: connectionString };
  }
} else {
  // Use individual environment variables
  pgConfig = {
    database: process.env.PG_DATABASE || 'fashion_store',
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || 'monu',
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT) || 5432,
    logging: process.env.PG_LOGGING === 'true',
    dialectOptions: {
      ssl: useSSL ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    pool: {
      max: parseInt(process.env.PG_POOL_MAX || 5),
      min: parseInt(process.env.PG_POOL_MIN || 0),
      acquire: parseInt(process.env.PG_POOL_ACQUIRE || 30000),
      idle: parseInt(process.env.PG_POOL_IDLE || 10000)
    }
  };
  
  console.log(`PostgreSQL Configuration: ${pgConfig.host}:${pgConfig.port}/${pgConfig.database}`);
}

module.exports = pgConfig; 