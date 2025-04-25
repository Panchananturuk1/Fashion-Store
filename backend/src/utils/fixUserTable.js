const { Pool } = require('pg');

// PostgreSQL connection config
const pgConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'fashion_store',
  password: 'monu',
  port: 5432,
};

async function fixUserTable() {
  const pool = new Pool(pgConfig);
  
  try {
    console.log('Connecting to PostgreSQL...');
    console.log(`Database: ${pgConfig.database}`);
    
    // Check table structure
    const tableStructure = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    
    console.log('Current Users Table Structure:');
    console.table(tableStructure.rows);
    
    // Check if phone column exists
    const hasPhoneColumn = tableStructure.rows.some(col => col.column_name === 'phone');
    if (!hasPhoneColumn) {
      console.log('Adding phone column...');
      await pool.query(`ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL`);
    }
    
    // Check if address columns exist
    const hasStreetColumn = tableStructure.rows.some(col => col.column_name === 'street');
    if (!hasStreetColumn) {
      console.log('Adding address columns...');
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN street VARCHAR(255) NULL,
        ADD COLUMN city VARCHAR(100) NULL,
        ADD COLUMN state VARCHAR(100) NULL,
        ADD COLUMN zip_code VARCHAR(20) NULL
      `);
    }
    
    // Verify changes
    const updatedStructure = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    
    console.log('\nUpdated Users Table Structure:');
    console.table(updatedStructure.rows);
    
    console.log('User table structure has been fixed!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
    console.log('Connection closed');
  }
}

// Run the function
fixUserTable(); 