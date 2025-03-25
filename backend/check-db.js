const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function checkDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Connected to MySQL database successfully.');

    // Use the ecommerce database
    await sequelize.query('USE ecommerce');
    console.log('Using ecommerce database.');

    // Query all products
    const [products] = await sequelize.query('SELECT * FROM products');
    
    if (products.length === 0) {
      console.log('No products found in the database.');
    } else {
      console.log(`Found ${products.length} products in the database:`);
      products.forEach(product => {
        console.log(`\n${product.name}:`);
        console.log(`  Category: ${product.category}`);
        console.log(`  Price: $${product.price}`);
        console.log(`  Rating: ${product.rating} (${product.numReviews} reviews)`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

// Run the check
checkDatabase(); 