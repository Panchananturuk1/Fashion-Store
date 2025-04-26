// Script to create tables in Supabase database using Node.js

// Set environment variables for testing - REPLACE YOUR_PASSWORD_HERE with your actual password
process.env.DB_TYPE = 'supabase';
process.env.PG_SSL = 'true';
process.env.NODE_ENV = 'production';
process.env.SUPABASE_POSTGRES_URL = 'postgresql://postgres.sxnqargkpoojafyshwrc:Monumartinez@123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres';

// Import required modules
const { Sequelize, DataTypes } = require('sequelize');

console.log('Connecting to Supabase database...');

// Create Sequelize instance
const sequelize = new Sequelize(process.env.SUPABASE_POSTGRES_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

// Define Product model
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subCategory: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  size: {
    type: DataTypes.JSON,
    allowNull: false
  },
  color: {
    type: DataTypes.JSON,
    allowNull: false
  },
  inStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  numReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  tableName: 'products'
});

// Sample products data with real, accessible image URLs
const sampleProducts = [
  {
    name: 'Classic Blue Jeans',
    description: 'A comfortable pair of classic blue jeans for everyday wear.',
    price: 59.99,
    category: 'men',
    subCategory: 'pants',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    size: ['28', '30', '32', '34', '36'],
    color: ['Blue', 'Dark Blue'],
    inStock: true,
    featured: true,
    rating: 4.5,
    numReviews: 120
  },
  {
    name: 'Summer Floral Dress',
    description: 'A light and elegant floral dress perfect for summer.',
    price: 49.99,
    category: 'women',
    subCategory: 'dresses',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    size: ['XS', 'S', 'M', 'L', 'XL'],
    color: ['White', 'Blue', 'Pink'],
    inStock: true,
    featured: true,
    rating: 4.8,
    numReviews: 95
  },
  {
    name: 'Cotton T-Shirt Pack',
    description: 'Pack of 3 essential cotton t-shirts in different colors.',
    price: 29.99,
    category: 'men',
    subCategory: 'shirts',
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    color: ['Black', 'White', 'Gray'],
    inStock: true,
    featured: false,
    rating: 4.2,
    numReviews: 210
  },
  {
    name: 'Leather Jacket',
    description: 'Premium quality leather jacket with a modern fit.',
    price: 199.99,
    category: 'men',
    subCategory: 'jackets',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    size: ['S', 'M', 'L', 'XL'],
    color: ['Black', 'Brown'],
    inStock: true,
    featured: true,
    rating: 4.7,
    numReviews: 68
  },
  {
    name: 'High Waist Skirt',
    description: 'Elegant high waist skirt suitable for office and casual wear.',
    price: 39.99,
    category: 'women',
    subCategory: 'skirts',
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    size: ['XS', 'S', 'M', 'L'],
    color: ['Black', 'Navy', 'Beige'],
    inStock: true,
    featured: false,
    rating: 4.4,
    numReviews: 52
  },
  {
    name: 'Slim Fit Chinos',
    description: 'Smart casual slim fit chinos for a versatile wardrobe.',
    price: 44.99,
    category: 'men',
    subCategory: 'pants',
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    size: ['28', '30', '32', '34', '36'],
    color: ['Khaki', 'Navy', 'Olive'],
    inStock: true,
    featured: false,
    rating: 4.3,
    numReviews: 88
  },
  {
    name: 'Casual Hoodie',
    description: 'Comfortable cotton blend hoodie for casual everyday wear.',
    price: 45.99,
    category: 'men',
    subCategory: 'hoodies',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    color: ['Gray', 'Black', 'Navy'],
    inStock: true,
    featured: true,
    rating: 4.6,
    numReviews: 156
  },
  {
    name: 'Women\'s Blazer',
    description: 'Professional women\'s blazer perfect for office attire.',
    price: 79.99,
    category: 'women',
    subCategory: 'jackets',
    imageUrl: 'https://images.unsplash.com/photo-1580331451062-99ff462db48a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    size: ['XS', 'S', 'M', 'L'],
    color: ['Black', 'Gray', 'Navy'],
    inStock: true,
    featured: false,
    rating: 4.7,
    numReviews: 98
  },
  {
    name: 'Athletic Sneakers',
    description: 'Lightweight athletic sneakers for running and training.',
    price: 89.99,
    category: 'men',
    subCategory: 'shoes',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    size: ['7', '8', '9', '10', '11', '12'],
    color: ['White', 'Black', 'Red'],
    inStock: true,
    featured: true,
    rating: 4.8,
    numReviews: 215
  },
  {
    name: 'Women\'s Handbag',
    description: 'Stylish medium-sized handbag with multiple compartments.',
    price: 65.99,
    category: 'women',
    subCategory: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    size: ['One Size'],
    color: ['Brown', 'Black', 'Tan'],
    inStock: true,
    featured: true,
    rating: 4.6,
    numReviews: 87
  }
];

// Create tables and insert data
async function initDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Connected to Supabase database!');

    // Create products table (drop if exists)
    console.log('Creating products table...');
    await Product.sync({ force: true });
    console.log('Products table created successfully!');

    // Insert sample products
    console.log('Inserting sample products...');
    await Product.bulkCreate(sampleProducts);
    console.log('Sample products inserted successfully!');

    // Check if products were inserted
    const products = await Product.findAll();
    console.log(`Found ${products.length} products in the database`);
    products.forEach(product => {
      console.log(`- ${product.name} - $${product.price}`);
    });

    console.log('Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

// Run the initialization
initDatabase(); 