const { Pool } = require('pg');

// PostgreSQL connection config
const pgConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'fashion_store',
  password: 'monu',
  port: 5432,
};

async function addSampleProducts() {
  const pool = new Pool(pgConfig);
  
  try {
    console.log('Connecting to PostgreSQL...');
    console.log(`Database: ${pgConfig.database}`);
    
    // Check if products already exist
    const countResult = await pool.query('SELECT COUNT(*) FROM products');
    const productCount = parseInt(countResult.rows[0].count);
    
    if (productCount > 0) {
      console.log(`${productCount} products already exist in the database.`);
      console.log('Skipping sample product creation...');
      return;
    }
    
    console.log('Adding sample products...');
    
    // Men's clothing sample data
    const menProducts = [
      {
        name: 'Classic Fit Dress Shirt',
        description: 'A comfortable and stylish dress shirt for formal occasions.',
        price: 49.99,
        category: 'men',
        subCategory: 'shirts',
        imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
        size: JSON.stringify(['S', 'M', 'L', 'XL']),
        color: JSON.stringify(['White', 'Blue', 'Black']),
        featured: true,
        rating: 4.5,
        numReviews: 28
      },
      {
        name: 'Slim Fit Jeans',
        description: 'Modern slim fit jeans with stretch comfort.',
        price: 59.99,
        category: 'men',
        subCategory: 'pants',
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
        size: JSON.stringify(['30', '32', '34', '36']),
        color: JSON.stringify(['Blue', 'Black', 'Gray']),
        featured: true,
        rating: 4.2,
        numReviews: 42
      },
      {
        name: 'Casual Hooded Sweatshirt',
        description: 'Comfortable hooded sweatshirt for everyday wear.',
        price: 39.99,
        category: 'men',
        subCategory: 'hoodies',
        imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
        size: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
        color: JSON.stringify(['Gray', 'Black', 'Navy']),
        featured: false,
        rating: 4.0,
        numReviews: 35
      }
    ];
    
    // Women's clothing sample data
    const womenProducts = [
      {
        name: 'High-Waisted Skinny Jeans',
        description: 'Flattering high-waisted skinny jeans with stretch.',
        price: 64.99,
        category: 'women',
        subCategory: 'jeans',
        imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246',
        size: JSON.stringify(['24', '26', '28', '30', '32']),
        color: JSON.stringify(['Blue', 'Black', 'White']),
        featured: true,
        rating: 4.6,
        numReviews: 47
      },
      {
        name: 'Floral Print Maxi Dress',
        description: 'Elegant floral maxi dress for casual and semi-formal occasions.',
        price: 79.99,
        category: 'women',
        subCategory: 'dresses',
        imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1',
        size: JSON.stringify(['XS', 'S', 'M', 'L']),
        color: JSON.stringify(['Floral Print', 'Navy', 'Red']),
        featured: true,
        rating: 4.8,
        numReviews: 32
      },
      {
        name: 'Knit Sweater',
        description: 'Soft knit sweater perfect for layering.',
        price: 54.99,
        category: 'women',
        subCategory: 'sweaters',
        imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27',
        size: JSON.stringify(['S', 'M', 'L']),
        color: JSON.stringify(['Cream', 'Gray', 'Burgundy']),
        featured: true,
        rating: 4.5,
        numReviews: 29
      }
    ];
    
    const allProducts = [...menProducts, ...womenProducts];
    
    // Insert products one by one for better error handling
    for (const product of allProducts) {
      await pool.query(`
        INSERT INTO products 
        (name, description, price, category, "subCategory", "imageUrl", size, color, "inStock", featured, rating, "numReviews")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `, [
        product.name,
        product.description,
        product.price,
        product.category,
        product.subCategory,
        product.imageUrl,
        product.size,
        product.color,
        true, // inStock
        product.featured,
        product.rating,
        product.numReviews
      ]);
      
      console.log(`Added product: ${product.name}`);
    }
    
    console.log(`Successfully added ${allProducts.length} sample products!`);
    
    // Verify by retrieving a few products
    const productsResult = await pool.query('SELECT id, name, price, category FROM products LIMIT 5');
    console.log('Sample of products in database:');
    console.table(productsResult.rows);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
    console.log('Connection closed');
  }
}

// Run the function
addSampleProducts(); 