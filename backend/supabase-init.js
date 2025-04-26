// Script to initialize the Supabase PostgreSQL database
// Run this script on your local machine to create tables and insert data

// Set environment variables for Supabase deployment
process.env.DB_TYPE = 'supabase';
process.env.NODE_ENV = 'production';

// Load modules
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const supabase = require('./src/utils/supabase');
const sequelize = require('./src/utils/database');

console.log('Initializing Supabase database...');

// Define models
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
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
  countInStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
});

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentResult: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isDelivered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
});

// Set up relationships
User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin123', 10),
    isAdmin: true
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false
  }
];

const products = [
  {
    name: 'Men\'s Slim Fit T-Shirt',
    image: '/images/mens-tshirt.jpg',
    brand: 'FashionBrand',
    category: 'Men\'s Clothing',
    description: 'A comfortable and stylish slim fit t-shirt for men. Made with high-quality cotton for everyday wear.',
    price: 29.99,
    countInStock: 20
  },
  {
    name: 'Women\'s Summer Dress',
    image: '/images/womens-dress.jpg',
    brand: 'ElegantWear',
    category: 'Women\'s Clothing',
    description: 'A beautiful summer dress with floral pattern. Perfect for beach days and casual outings.',
    price: 49.99,
    countInStock: 15
  },
  {
    name: 'Men\'s Denim Jacket',
    image: '/images/mens-jacket.jpg',
    brand: 'DenimCo',
    category: 'Men\'s Clothing',
    description: 'Classic denim jacket for men. Versatile and durable for all seasons.',
    price: 89.99,
    countInStock: 10
  },
  {
    name: 'Women\'s High Waist Jeans',
    image: '/images/womens-jeans.jpg',
    brand: 'FashionFit',
    category: 'Women\'s Clothing',
    description: 'Stylish high waist jeans for women. Comfortable stretch denim that flatters your figure.',
    price: 59.99,
    countInStock: 12
  },
  {
    name: 'Men\'s Casual Shoes',
    image: '/images/mens-shoes.jpg',
    brand: 'ComfortStep',
    category: 'Footwear',
    description: 'Casual and comfortable shoes for men. Perfect for everyday wear.',
    price: 79.99,
    countInStock: 8
  },
  {
    name: 'Women\'s Handbag',
    image: '/images/womens-handbag.jpg',
    brand: 'LuxeStyle',
    category: 'Accessories',
    description: 'Elegant handbag for women. Spacious interior with multiple compartments.',
    price: 99.99,
    countInStock: 5
  }
];

// Function to initialize database
async function initDatabase() {
  try {
    // Sync all models with database
    await sequelize.sync({ force: true });
    console.log('Database tables created');

    // Add admin user
    await User.bulkCreate(users);
    console.log('Users added to database');

    // Add products
    await Product.bulkCreate(products);
    console.log('Products added to database');

    console.log('Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Run the initialization
initDatabase(); 