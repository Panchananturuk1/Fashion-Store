// Script to initialize the Render PostgreSQL database
// Run this script on your local machine to create tables and insert data on Render

// Set environment variables for Render deployment
process.env.DB_TYPE = 'postgres';
process.env.PG_SSL = 'true';
process.env.NODE_ENV = 'production';

// Load modules
const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Try to load environment variables from .env.render file if it exists
const envRenderPath = path.join(__dirname, '.env.render');
if (fs.existsSync(envRenderPath)) {
  console.log('Loading environment variables from .env.render file');
  dotenv.config({ path: envRenderPath });
} else {
  // Load from default .env file
  dotenv.config();
}

// Check if Render DATABASE_URL exists
if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  console.error('Error: DATABASE_URL or POSTGRES_URL environment variable is required.');
  console.error('Set this variable to your Render PostgreSQL connection string.');
  console.error('Example: DATABASE_URL=postgresql://username:password@host:port/database');
  console.error('\nYou can either:');
  console.error('1. Set it as an environment variable before running this script');
  console.error('2. Create a .env.render file with the DATABASE_URL');
  console.error('3. Use one of the helper scripts: run-render-init.bat, run-render-init.ps1, or run-render-init.sh');
  process.exit(1);
}

// Get the database URL
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
console.log('Using database URL:', databaseUrl.replace(/:[^:]*@/, ':****@'));

// Create Sequelize instance with Render connection URL
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: console.log
});

async function initializeRenderDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Connected to Render PostgreSQL database successfully');

    // Define models
    console.log('Defining database models...');
    
    // 1. User model
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
      role: {
        type: DataTypes.STRING,
        defaultValue: 'user'
      }
    }, {
      tableName: 'users',
      timestamps: true
    });
    
    // 2. Product model
    const Product = sequelize.define('Product', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0
        }
      },
      category: {
        type: DataTypes.ENUM('men', 'women'),
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
        type: DataTypes.JSON, // Store array as JSON
        allowNull: false
      },
      color: {
        type: DataTypes.JSON, // Store array as JSON
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
        defaultValue: 0,
        validate: {
          min: 0,
          max: 5
        }
      },
      numReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    }, {
      timestamps: true,
      tableName: 'products'
    });
    
    // 3. Order model
    const Order = sequelize.define('Order', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
      },
      paymentMethod: {
        type: DataTypes.STRING
      },
      shipping: {
        type: DataTypes.JSON
      },
      paymentDetails: {
        type: DataTypes.JSON
      }
    }, {
      timestamps: true,
      tableName: 'orders'
    });
    
    // 4. OrderItem model
    const OrderItem = sequelize.define('OrderItem', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      size: {
        type: DataTypes.STRING
      },
      color: {
        type: DataTypes.STRING
      },
      imageUrl: {
        type: DataTypes.STRING
      }
    }, {
      timestamps: true,
      tableName: 'orderItems'
    });
    
    // Set up associations
    User.hasMany(Order, { foreignKey: 'userId' });
    Order.belongsTo(User, { foreignKey: 'userId' });
    
    Order.hasMany(OrderItem, { foreignKey: 'orderId' });
    OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
    
    Product.hasMany(OrderItem, { foreignKey: 'productId' });
    OrderItem.belongsTo(Product, { foreignKey: 'productId' });

    // Force sync all models (drop and recreate tables)
    console.log('Creating database tables...');
    await sequelize.sync({ force: true });
    console.log('✅ Database tables created successfully');

    // Create sample admin user
    console.log('Creating sample admin user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    // Create sample products
    console.log('Creating sample products...');
    const sampleProducts = [
      {
        name: 'Men\'s Blue T-Shirt',
        description: 'Comfortable cotton t-shirt for everyday wear',
        price: 24.99,
        category: 'men',
        subCategory: 'tshirts',
        imageUrl: 'https://via.placeholder.com/600x800?text=Men+Blue+TShirt',
        size: JSON.stringify(['S', 'M', 'L', 'XL']),
        color: JSON.stringify(['Blue', 'Navy']),
        inStock: true,
        featured: true,
        rating: 4.5,
        numReviews: 12
      },
      {
        name: 'Women\'s Black Dress',
        description: 'Elegant black dress for special occasions',
        price: 49.99,
        category: 'women',
        subCategory: 'dresses',
        imageUrl: 'https://via.placeholder.com/600x800?text=Women+Black+Dress',
        size: JSON.stringify(['XS', 'S', 'M', 'L']),
        color: JSON.stringify(['Black']),
        inStock: true,
        featured: true,
        rating: 4.8,
        numReviews: 24
      },
      {
        name: 'Men\'s Jeans',
        description: 'Classic blue jeans for men',
        price: 39.99,
        category: 'men',
        subCategory: 'jeans',
        imageUrl: 'https://via.placeholder.com/600x800?text=Men+Jeans',
        size: JSON.stringify(['30', '32', '34', '36']),
        color: JSON.stringify(['Blue', 'Dark Blue']),
        inStock: true,
        featured: false,
        rating: 4.2,
        numReviews: 18
      },
      {
        name: 'Women\'s Running Shoes',
        description: 'Comfortable running shoes for women',
        price: 59.99,
        category: 'women',
        subCategory: 'shoes',
        imageUrl: 'https://via.placeholder.com/600x800?text=Women+Running+Shoes',
        size: JSON.stringify(['36', '37', '38', '39', '40']),
        color: JSON.stringify(['Pink', 'White', 'Black']),
        inStock: true,
        featured: true,
        rating: 4.7,
        numReviews: 35
      },
      {
        name: 'Men\'s Leather Jacket',
        description: 'Stylish leather jacket for men',
        price: 89.99,
        category: 'men',
        subCategory: 'jackets',
        imageUrl: 'https://via.placeholder.com/600x800?text=Men+Leather+Jacket',
        size: JSON.stringify(['M', 'L', 'XL', 'XXL']),
        color: JSON.stringify(['Brown', 'Black']),
        inStock: true,
        featured: true,
        rating: 4.9,
        numReviews: 42
      },
      {
        name: 'Women\'s Handbag',
        description: 'Elegant handbag for women',
        price: 45.99,
        category: 'women',
        subCategory: 'accessories',
        imageUrl: 'https://via.placeholder.com/600x800?text=Women+Handbag',
        size: JSON.stringify(['One Size']),
        color: JSON.stringify(['Red', 'Black', 'Beige']),
        inStock: true,
        featured: false,
        rating: 4.4,
        numReviews: 28
      }
    ];

    // Create products with correct JSON formatting
    for (const product of sampleProducts) {
      await Product.create({
        ...product,
        size: JSON.parse(product.size),
        color: JSON.parse(product.color)
      });
    }

    console.log('✅ Sample data created successfully');
    console.log('\nYou can now access the following data:');
    console.log('- Admin user: admin@example.com / admin123');
    console.log('- 6 sample products across different categories');

  } catch (error) {
    console.error('❌ Error initializing Render database:', error);
  } finally {
    await sequelize.close();
  }
}

// Run initialization
initializeRenderDatabase(); 