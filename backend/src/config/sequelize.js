const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('Initializing Sequelize connection...');

// Check if DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set!');
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
  console.warn('Running in development mode, will attempt to use default configuration');
}

// Create Sequelize instance using DATABASE_URL if available
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  : new Sequelize(
      process.env.DB_NAME || 'ecommerce',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        dialect: process.env.DB_TYPE === 'postgres' ? 'postgres' : 'mysql',
        port: process.env.DB_TYPE === 'postgres' ? 5432 : 3306,
        logging: false
      }
    );

console.log(`Using ${process.env.DATABASE_URL ? 'DATABASE_URL' : 'default configuration'} for Sequelize connection`);

// Test connection function
const connectDB = async () => {
  try {
    console.log('Attempting to connect to database...');
    await sequelize.authenticate();
    console.log(`Connected to database successfully!`);
    
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