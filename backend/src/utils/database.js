const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const { SUPABASE_POSTGRES_URL } = require('../../supabase-config');

// Load environment variables
dotenv.config();

// Determine which database connection to use
const dbType = process.env.DB_TYPE || 'mysql';
let sequelize;

if (dbType === 'supabase') {
  // Use Supabase PostgreSQL - prefer environment variable if available
  const connectionString = process.env.SUPABASE_POSTGRES_URL || SUPABASE_POSTGRES_URL;
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
  console.log('Connected to Supabase PostgreSQL database');
} else if (dbType === 'postgres') {
  // Use standard PostgreSQL (Render)
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: process.env.PG_SSL === 'true',
        rejectUnauthorized: false
      }
    },
    logging: false
  });
  console.log('Connected to PostgreSQL database');
} else {
  // Default to MySQL
  sequelize = new Sequelize(
    process.env.DB_NAME || 'fashion_store',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'mysql',
      logging: false
    }
  );
  console.log('Connected to MySQL database');
}

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Call the test function
testConnection();

module.exports = sequelize; 