const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const pgConfig = require('./pgConfig');

// Load environment variables
dotenv.config();

// Database configuration
let sequelize;

// Choose database based on environment variable
const dbType = process.env.DB_TYPE || 'mysql';

if (dbType === 'postgres') {
  // Use PostgreSQL configuration
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
    await sequelize.authenticate();
    console.log(`Database connection established successfully (${dbType})`);
    
    // Sync all defined models to the DB without dropping tables
    await sequelize.sync({ force: false });
    console.log('Database & tables synced');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB }; 