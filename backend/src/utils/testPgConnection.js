const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// You can override these by setting environment variables
const PG_USER = process.env.PG_USER || 'postgres';
const PG_PASSWORD = process.env.PG_PASSWORD || 'monu'; // Updated password
const PG_HOST = process.env.PG_HOST || 'localhost';
const PG_PORT = process.env.PG_PORT || '5432';
const PG_DATABASE = process.env.PG_DATABASE || 'fashion_store';
const PG_SSL = process.env.PG_SSL === 'true';

console.log('Testing PostgreSQL connection with the following config:');
console.log('Host:', PG_HOST);
console.log('Database:', PG_DATABASE);
console.log('User:', PG_USER);
console.log('Port:', PG_PORT);
console.log('SSL:', PG_SSL ? 'Enabled' : 'Disabled');

// First, connect to 'postgres' database to be able to create our database if it doesn't exist
const rootSequelize = new Sequelize('postgres', PG_USER, PG_PASSWORD, {
  host: PG_HOST,
  dialect: 'postgres',
  port: PG_PORT,
  logging: false,
  dialectOptions: {
    ssl: PG_SSL ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

// Create the database if it doesn't exist
async function createDatabaseIfNotExists() {
  try {
    await rootSequelize.authenticate();
    console.log('✅ Connected to PostgreSQL server');
    
    // Check if database exists
    const [results] = await rootSequelize.query(
      `SELECT 1 FROM pg_database WHERE datname = '${PG_DATABASE}'`
    );
    
    if (results.length === 0) {
      console.log(`Database '${PG_DATABASE}' not found, creating it...`);
      await rootSequelize.query(`CREATE DATABASE ${PG_DATABASE}`);
      console.log(`✅ Database '${PG_DATABASE}' created successfully`);
    } else {
      console.log(`Database '${PG_DATABASE}' already exists`);
    }
    
    await rootSequelize.close();
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL server:', error.message);
    if (rootSequelize) await rootSequelize.close();
    return false;
  }
}

// Connect to our database and test
async function testConnection() {
  // Create Sequelize instance for our specific database
  const sequelize = new Sequelize(PG_DATABASE, PG_USER, PG_PASSWORD, {
    host: PG_HOST,
    dialect: 'postgres',
    port: PG_PORT,
    logging: false,
    dialectOptions: {
      ssl: PG_SSL ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
  
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection has been established successfully.');
    
    // Check if we can create a test table
    try {
      await sequelize.query('CREATE TABLE IF NOT EXISTS connection_test (id SERIAL PRIMARY KEY, test_date TIMESTAMP DEFAULT NOW())');
      await sequelize.query('INSERT INTO connection_test(test_date) VALUES(NOW())');
      const [results] = await sequelize.query('SELECT * FROM connection_test ORDER BY id DESC LIMIT 5');
      
      console.log('✅ Successfully created test data:');
      console.log(results);
      
      console.log('\n✅ PostgreSQL is correctly configured!');
      console.log('You can now run the app with PostgreSQL using:');
      console.log('npm run dev:pg');
    } catch (tableError) {
      console.error('❌ Could not create test table:', tableError.message);
    }
    
  } catch (error) {
    console.error('❌ Unable to connect to the PostgreSQL database:', error.message);
  } finally {
    if (sequelize) await sequelize.close();
    console.log('Connection closed.');
  }
}

// Run the tests
async function run() {
  const dbCreated = await createDatabaseIfNotExists();
  if (dbCreated) {
    await testConnection();
  }
}

run(); 