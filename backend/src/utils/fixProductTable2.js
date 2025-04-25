const { Pool } = require('pg');

// PostgreSQL connection config
const pgConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'fashion_store',
  password: 'monu',
  port: 5432,
};

async function fixProductTable() {
  const pool = new Pool(pgConfig);
  
  try {
    console.log('Connecting to PostgreSQL...');
    console.log(`Database: ${pgConfig.database}`);
    
    // Get table structure
    const tableInfo = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products'
    `);
    
    console.log('Current products table structure:');
    console.table(tableInfo.rows);
    
    const columns = tableInfo.rows.map(row => row.column_name);
    console.log('Column names:', columns);
    
    // Add missing columns
    
    // Check featured column
    if (!columns.includes('featured')) {
      console.log('Adding featured column...');
      await pool.query(`ALTER TABLE products ADD COLUMN featured BOOLEAN DEFAULT FALSE`);
    }
    
    // Check rating column
    if (!columns.includes('rating')) {
      console.log('Adding rating column...');
      await pool.query(`ALTER TABLE products ADD COLUMN rating FLOAT DEFAULT 0`);
    }
    
    // Get updated structure
    const updatedInfo = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products'
    `);
    
    console.log('\nUpdated products table structure:');
    console.table(updatedInfo.rows);
    
    console.log('Products table has been fixed successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
    console.log('Connection closed');
  }
}

// Run the function
fixProductTable(); 