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
    
    // Check if subcategory column exists with the correct name
    if (!columns.includes('subcategory') && !columns.includes('subCategory')) {
      console.log('Adding subcategory column...');
      await pool.query(`ALTER TABLE products ADD COLUMN subcategory VARCHAR(50)`);
    } else if (columns.includes('subCategory')) {
      console.log('Renaming "subCategory" to "subcategory"...');
      await pool.query(`ALTER TABLE products RENAME COLUMN "subCategory" TO subcategory`);
    }
    
    // Check image_url column naming
    if (!columns.includes('image_url') && !columns.includes('imageUrl')) {
      console.log('Adding image_url column...');
      await pool.query(`ALTER TABLE products ADD COLUMN image_url VARCHAR(255)`);
    } else if (columns.includes('imageUrl')) {
      console.log('Renaming "imageUrl" to "image_url"...');
      await pool.query(`ALTER TABLE products RENAME COLUMN "imageUrl" TO image_url`);
    }
    
    // Check in_stock column
    if (!columns.includes('in_stock') && !columns.includes('inStock')) {
      console.log('Adding in_stock column...');
      await pool.query(`ALTER TABLE products ADD COLUMN in_stock BOOLEAN DEFAULT TRUE`);
    } else if (columns.includes('inStock')) {
      console.log('Renaming "inStock" to "in_stock"...');
      await pool.query(`ALTER TABLE products RENAME COLUMN "inStock" TO in_stock`);
    }
    
    // Check num_reviews column
    if (!columns.includes('num_reviews') && !columns.includes('numReviews')) {
      console.log('Adding num_reviews column...');
      await pool.query(`ALTER TABLE products ADD COLUMN num_reviews INTEGER DEFAULT 0`);
    } else if (columns.includes('numReviews')) {
      console.log('Renaming "numReviews" to "num_reviews"...');
      await pool.query(`ALTER TABLE products RENAME COLUMN "numReviews" TO num_reviews`);
    }
    
    // Check created_at column
    if (!columns.includes('created_at') && !columns.includes('createdAt')) {
      console.log('Adding created_at column...');
      await pool.query(`ALTER TABLE products ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`);
    } else if (columns.includes('createdAt')) {
      console.log('Renaming "createdAt" to "created_at"...');
      await pool.query(`ALTER TABLE products RENAME COLUMN "createdAt" TO created_at`);
    }
    
    // Check updated_at column
    if (!columns.includes('updated_at') && !columns.includes('updatedAt')) {
      console.log('Adding updated_at column...');
      await pool.query(`ALTER TABLE products ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`);
    } else if (columns.includes('updatedAt')) {
      console.log('Renaming "updatedAt" to "updated_at"...');
      await pool.query(`ALTER TABLE products RENAME COLUMN "updatedAt" TO updated_at`);
    }
    
    // Get updated structure
    const updatedInfo = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products'
    `);
    
    console.log('\nUpdated products table structure:');
    console.table(updatedInfo.rows);
    
    // Verify some products
    const products = await pool.query('SELECT id, name, price, category, subcategory FROM products LIMIT 3');
    console.log('\nSample products:');
    console.table(products.rows);
    
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