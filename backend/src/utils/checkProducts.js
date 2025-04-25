const { Pool } = require('pg');

// PostgreSQL connection config
const pgConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'fashion_store',
  password: 'monu',
  port: 5432,
};

async function checkProducts() {
  const pool = new Pool(pgConfig);
  
  try {
    console.log('Connecting to PostgreSQL...');
    console.log(`Database: ${pgConfig.database}`);
    
    // Check if the products table exists
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    console.log('Available tables:', tables);
    
    if (!tables.includes('products')) {
      console.log('Products table does not exist. Creating it now...');
      
      // Create the products table
      await pool.query(`
        CREATE TABLE products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          category VARCHAR(50) NOT NULL,
          "subCategory" VARCHAR(50) NOT NULL,
          "imageUrl" VARCHAR(255) NOT NULL,
          size JSONB NOT NULL,
          color JSONB NOT NULL,
          "inStock" BOOLEAN DEFAULT TRUE,
          featured BOOLEAN DEFAULT FALSE,
          rating FLOAT DEFAULT 0,
          "numReviews" INTEGER DEFAULT 0,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
      
      console.log('Products table created successfully!');
    }
    
    // Count products
    const countResult = await pool.query('SELECT COUNT(*) FROM products');
    const productCount = parseInt(countResult.rows[0].count);
    
    console.log(`Number of products in database: ${productCount}`);
    
    if (productCount === 0) {
      console.log('No products found. Use the createDummyProducts API endpoint to add sample products.');
    } else {
      // Show some sample products
      const productsResult = await pool.query('SELECT id, name, price, category FROM products LIMIT 5');
      console.log('Sample products:');
      console.table(productsResult.rows);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
    console.log('Connection closed');
  }
}

// Run the function
checkProducts(); 