/**
 * Supabase Setup Script for Render
 * 
 * This script can be used to initialize the database connection settings
 * for Render to use Supabase PostgreSQL.
 * 
 * To use in Render:
 * 1. Add this file to your repository
 * 2. Set the environment variables in Render dashboard:
 *    - DB_TYPE=supabase
 *    - PG_SSL=true
 *    - NODE_ENV=production
 *    - SUPABASE_POSTGRES_URL=postgresql://postgres.sxnqargkpoojafyshwrc:Monumartinez@123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
 *    - SUPABASE_URL=https://sxnqargkpoojafyshwrc.supabase.co
 *    - SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4bnFhcmdrcG9vamFmeXNod3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NDYxNzksImV4cCI6MjA2MTIyMjE3OX0.QW47Gjhc_oHmxGjlGw2nvF5GTkYhCoy93ZqeT2GmLHY
 *    - JWT_SECRET=HTZ2elD7PcYhXbNHUKdNqX8LZcSZlu0PHgzDiUAqdc21bNpINcEL23K2A7M2MKQKQpi539mJAm7AtAARVI3/4Q==
 */

const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Check if we're using Supabase
const dbType = process.env.DB_TYPE || '';
if (dbType !== 'supabase') {
  console.error('This script is designed to work with Supabase. Please set DB_TYPE=supabase');
  process.exit(1);
}

// Check for required environment variables
const requiredEnvVars = [
  'SUPABASE_POSTGRES_URL',
  'SUPABASE_URL',
  'SUPABASE_KEY',
  'JWT_SECRET'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars.join(', '));
  console.error('Please set these variables in your Render dashboard');
  process.exit(1);
}

// Test connection to Supabase PostgreSQL
console.log('Testing connection to Supabase PostgreSQL...');
const sequelize = new Sequelize(process.env.SUPABASE_POSTGRES_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: console.log
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Successfully connected to Supabase PostgreSQL!');
    console.log('Your Supabase database is properly configured in Render');
    
    // Try to query the database for tables
    try {
      const [results] = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
      console.log('\nExisting tables in your Supabase database:');
      if (results.length === 0) {
        console.log('No tables found. You may need to run migrations or initialization scripts.');
      } else {
        results.forEach(row => console.log(`- ${row.table_name}`));
      }
    } catch (error) {
      console.error('Error querying tables:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Unable to connect to Supabase PostgreSQL database:', error.message);
    console.error('\nPlease check:');
    console.error('1. Your SUPABASE_POSTGRES_URL is correct');
    console.error('2. SSL is enabled (PG_SSL=true)');
    console.error('3. Your Supabase database is up and running');
  } finally {
    await sequelize.close();
  }
}

// Run the test
testConnection(); 