const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('Initializing Sequelize connection...');

// Determine database type
const dbType = process.env.DB_TYPE || 'mysql';
console.log(`Database type: ${dbType}`);

// Set DATABASE_URL from SUPABASE_POSTGRES_URL if available
if (process.env.SUPABASE_POSTGRES_URL && !process.env.DATABASE_URL && dbType === 'supabase') {
  process.env.DATABASE_URL = process.env.SUPABASE_POSTGRES_URL;
  console.log('Setting DATABASE_URL from SUPABASE_POSTGRES_URL');
}

// Check for database connection string
if (!process.env.DATABASE_URL && (dbType === 'postgres' || dbType === 'supabase')) {
  console.error('ERROR: DATABASE_URL environment variable is not set!');
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
  console.warn('Running in development mode, will attempt to use default configuration');
}

// Determine if we need SSL (only in production or explicitly set)
const useSSL = process.env.PG_SSL === 'true' || process.env.NODE_ENV === 'production';
console.log(`SSL for PostgreSQL: ${useSSL ? 'Enabled' : 'Disabled'}`);

// Create Sequelize instance
let sequelize;

if (dbType === 'supabase') {
  // Use Supabase PostgreSQL
  if (!process.env.SUPABASE_POSTGRES_URL && !process.env.DATABASE_URL) {
    throw new Error('Supabase PostgreSQL URL not found! Set SUPABASE_POSTGRES_URL environment variable.');
  }
  
  const connectionString = process.env.SUPABASE_POSTGRES_URL || process.env.DATABASE_URL;
  console.log('Connection string format:', connectionString.replace(/:[^:]*@/, ':****@'));
  
  sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
  console.log('Using Supabase PostgreSQL configuration');
} else if (dbType === 'postgres' || process.env.DATABASE_URL) {
  // Use PostgreSQL with DATABASE_URL
  const connectionString = process.env.DATABASE_URL;
  console.log('Connection string format:', connectionString?.replace(/:[^:]*@/, ':****@'));
  
  sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: useSSL ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  });
  console.log('Using PostgreSQL configuration');
} else {
  // Default to MySQL
  sequelize = new Sequelize(
    process.env.DB_NAME || 'ecommerce',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'mysql',
      port: 3306,
      logging: false
    }
  );
  console.log('Using MySQL configuration');
}

// Test connection function
const connectDB = async () => {
  try {
    console.log('Attempting to connect to database...');
    await sequelize.authenticate();
    console.log(`Connected to database successfully! (${dbType})`);
    
    // Sync all defined models to the DB without dropping tables
    await sequelize.sync({ force: false });
    console.log('Database & tables synced');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

module.exports = { sequelize, connectDB }; 