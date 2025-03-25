const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

// Load environment variables
dotenv.config();

// Database connection parameters
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
} = process.env;

// Create a connection for creating the database
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
});

// Script to create database if it doesn't exist
const initializeDatabase = async () => {
  try {
    // Try connecting to MySQL server
    await sequelize.authenticate();
    console.log('Connected to MySQL server successfully');
    
    // Create database if it doesn't exist
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log(`Database "${process.env.DB_NAME}" created or already exists`);
    
    // Close the connection
    await sequelize.close();
    console.log('Connection closed');
    
    return true;
  } catch (error) {
    console.error('Unable to initialize database:', error);
    return false;
  }
};

// Run if script is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(result => {
      if (result) {
        console.log('Database initialization completed successfully');
        process.exit(0);
      } else {
        console.error('Database initialization failed');
        process.exit(1);
      }
    });
}

module.exports = initializeDatabase; 