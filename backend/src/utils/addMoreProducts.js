const { Pool } = require('pg');

// PostgreSQL connection config
const pgConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'fashion_store',
  password: 'monu',
  port: 5432,
};

async function addMoreProducts() {
  const pool = new Pool(pgConfig);
  
  try {
    console.log('Connecting to PostgreSQL...');
    console.log(`Database: ${pgConfig.database}`);
    
    // Check current products
    const countResult = await pool.query('SELECT COUNT(*) FROM products');
    const productCount = parseInt(countResult.rows[0].count);
    
    console.log(`Current number of products: ${productCount}`);
    
    // Additional products
    const additionalProducts = [
      {
        name: 'Leather Jacket',
        description: 'Classic leather jacket with zip details.',
        price: 199.99,
        category: 'men',
        subcategory: 'jackets',
        imageUrl: 'https://images.unsplash.com/photo-1520975954732-35dd22299614',
        size: JSON.stringify(['S', 'M', 'L', 'XL']),
        color: JSON.stringify(['Black', 'Brown']),
        inStock: true,
        featured: true,
        rating: 4.7,
        numReviews: 32
      },
      {
        name: 'Cotton V-Neck T-Shirt',
        description: 'Comfortable cotton t-shirt for everyday wear.',
        price: 19.99,
        category: 'men',
        subcategory: 't-shirts',
        imageUrl: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d',
        size: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
        color: JSON.stringify(['White', 'Black', 'Navy', 'Gray']),
        inStock: true,
        featured: false,
        rating: 4.3,
        numReviews: 45
      },
      {
        name: 'Summer Floral Dress',
        description: 'Light and breezy floral dress, perfect for summer days.',
        price: 59.99,
        category: 'women',
        subcategory: 'dresses',
        imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446',
        size: JSON.stringify(['XS', 'S', 'M', 'L']),
        color: JSON.stringify(['Floral Pink', 'Floral Blue']),
        inStock: true,
        featured: true,
        rating: 4.8,
        numReviews: 28
      },
      {
        name: 'Classic Denim Jacket',
        description: 'Timeless denim jacket that goes with everything.',
        price: 69.99,
        category: 'women',
        subcategory: 'jackets',
        imageUrl: 'https://images.unsplash.com/photo-1527628217451-b2414a1ee733',
        size: JSON.stringify(['XS', 'S', 'M', 'L']),
        color: JSON.stringify(['Blue', 'Light Blue']),
        inStock: true,
        featured: false,
        rating: 4.5,
        numReviews: 37
      }
    ];
    
    console.log(`Adding ${additionalProducts.length} more products...`);
    
    // Insert products
    for (const product of additionalProducts) {
      await pool.query(`
        INSERT INTO products 
        (name, description, price, category, subcategory, image_url, 
         size, color, in_stock, featured, rating, num_reviews)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `, [
        product.name,
        product.description,
        product.price,
        product.category,
        product.subcategory,
        product.imageUrl,
        product.size,
        product.color,
        product.inStock,
        product.featured,
        product.rating,
        product.numReviews
      ]);
      
      console.log(`Added: ${product.name}`);
    }
    
    // Verify current product count
    const newCountResult = await pool.query('SELECT COUNT(*) FROM products');
    const newProductCount = parseInt(newCountResult.rows[0].count);
    
    console.log(`New total products: ${newProductCount}`);
    
    // Get some sample products
    const products = await pool.query('SELECT id, name, category, price FROM products LIMIT 10');
    console.log('\nSample of products:');
    console.table(products.rows);
    
    console.log('Additional products added successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
    console.log('Connection closed');
  }
}

// Run the function
addMoreProducts(); 