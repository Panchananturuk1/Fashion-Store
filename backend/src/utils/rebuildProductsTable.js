const { Pool } = require('pg');

// PostgreSQL connection config
const pgConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'fashion_store',
  password: 'monu',
  port: 5432,
};

async function rebuildProductsTable() {
  const pool = new Pool(pgConfig);
  
  try {
    console.log('Connecting to PostgreSQL...');
    console.log(`Database: ${pgConfig.database}`);
    
    // Drop the existing products table if it exists
    console.log('Dropping existing products table...');
    await pool.query(`DROP TABLE IF EXISTS products CASCADE`);
    
    // Create new products table with correct structure
    console.log('Creating new products table with correct structure...');
    await pool.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        subcategory VARCHAR(50),
        image_url VARCHAR(255),
        size TEXT,
        color TEXT,
        in_stock BOOLEAN DEFAULT TRUE,
        featured BOOLEAN DEFAULT FALSE,
        rating FLOAT DEFAULT 0,
        num_reviews INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        brand VARCHAR(100)
      )
    `);
    
    console.log('Products table created successfully with correct structure!');
    
    // Add sample products
    console.log('Adding sample products...');
    
    // Sample product data
    const sampleProducts = [
      {
        name: 'Classic Fit Dress Shirt',
        description: 'A comfortable and stylish dress shirt for formal occasions.',
        price: 49.99,
        category: 'men',
        subcategory: 'shirts',
        image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
        size: JSON.stringify(['S', 'M', 'L', 'XL']),
        color: JSON.stringify(['White', 'Blue', 'Black']),
        featured: true,
        rating: 4.5,
        num_reviews: 28,
        brand: 'Fashion Brand'
      },
      {
        name: 'Slim Fit Jeans',
        description: 'Modern slim fit jeans with stretch comfort.',
        price: 59.99,
        category: 'men',
        subcategory: 'pants',
        image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
        size: JSON.stringify(['30', '32', '34', '36']),
        color: JSON.stringify(['Blue', 'Black', 'Gray']),
        featured: true,
        rating: 4.2,
        num_reviews: 42,
        brand: 'Denim Co'
      },
      {
        name: 'High-Waisted Skinny Jeans',
        description: 'Flattering high-waisted skinny jeans with stretch.',
        price: 64.99,
        category: 'women',
        subcategory: 'jeans',
        image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246',
        size: JSON.stringify(['24', '26', '28', '30', '32']),
        color: JSON.stringify(['Blue', 'Black', 'White']),
        featured: true,
        rating: 4.6,
        num_reviews: 47,
        brand: 'Fashion Brand'
      },
      {
        name: 'Floral Print Maxi Dress',
        description: 'Elegant floral maxi dress for casual and semi-formal occasions.',
        price: 79.99,
        category: 'women',
        subcategory: 'dresses',
        image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1',
        size: JSON.stringify(['XS', 'S', 'M', 'L']),
        color: JSON.stringify(['Floral Print', 'Navy', 'Red']),
        featured: true,
        rating: 4.8,
        num_reviews: 32,
        brand: 'Elegant Fashion'
      }
    ];
    
    // Insert products
    for (const product of sampleProducts) {
      await pool.query(`
        INSERT INTO products 
        (name, description, price, category, subcategory, image_url, 
         size, color, in_stock, featured, rating, num_reviews, brand)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, [
        product.name,
        product.description,
        product.price,
        product.category,
        product.subcategory,
        product.image_url,
        product.size,
        product.color,
        true, // in_stock
        product.featured,
        product.rating,
        product.num_reviews,
        product.brand
      ]);
      
      console.log(`Added product: ${product.name}`);
    }
    
    // Verify database setup
    const productCount = await pool.query('SELECT COUNT(*) FROM products');
    console.log(`Total products in database: ${productCount.rows[0].count}`);
    
    const products = await pool.query('SELECT id, name, category, subcategory, price FROM products');
    console.log('\nProducts in database:');
    console.table(products.rows);
    
    console.log('Database setup completed successfully!');
    
  } catch (error) {
    console.error('Error rebuilding products table:', error);
  } finally {
    await pool.end();
    console.log('Connection closed');
  }
}

// Run the function
rebuildProductsTable(); 