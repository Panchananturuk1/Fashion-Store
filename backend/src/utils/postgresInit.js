const { Sequelize } = require('sequelize');
const { DataTypes } = require('sequelize');
const dotenv = require('dotenv');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Database connection info - customize these with your own values
const PG_USER = process.env.PG_USER || 'postgres';
const PG_PASSWORD = process.env.PG_PASSWORD || 'postgres'; // Changed from 'monu' to 'postgres'
const PG_HOST = process.env.PG_HOST || 'localhost';
const PG_PORT = process.env.PG_PORT || '5432';
const PG_DATABASE = process.env.PG_DATABASE || 'fashion_store';
const PG_SSL = process.env.PG_SSL === 'true';

console.log('Initializing PostgreSQL database with the following config:');
console.log('Host:', PG_HOST);
console.log('Database:', PG_DATABASE);
console.log('User:', PG_USER);
console.log('Port:', PG_PORT);

// First, connect to 'postgres' database to be able to create our database if it doesn't exist
const rootSequelize = new Sequelize('postgres', PG_USER, PG_PASSWORD, {
  host: PG_HOST,
  dialect: 'postgres',
  port: PG_PORT,
  logging: false,
  dialectOptions: {
    ssl: PG_SSL ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

// Create the database if it doesn't exist
async function createDatabaseIfNotExists() {
  try {
    await rootSequelize.authenticate();
    console.log('✅ Connected to PostgreSQL server');
    
    // Check if database exists
    const [results] = await rootSequelize.query(
      `SELECT 1 FROM pg_database WHERE datname = '${PG_DATABASE}'`
    );
    
    if (results.length === 0) {
      console.log(`Database '${PG_DATABASE}' not found, creating it...`);
      await rootSequelize.query(`CREATE DATABASE ${PG_DATABASE}`);
      console.log(`✅ Database '${PG_DATABASE}' created successfully`);
    } else {
      console.log(`Database '${PG_DATABASE}' already exists`);
    }
    
    await rootSequelize.close();
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL server:', error.message);
    if (rootSequelize) await rootSequelize.close();
    return false;
  }
}

// Initialize the database with tables
async function initializeDatabase() {
  // Create Sequelize instance for our specific database
  const sequelize = new Sequelize(PG_DATABASE, PG_USER, PG_PASSWORD, {
    host: PG_HOST,
    dialect: 'postgres',
    port: PG_PORT,
    logging: false,
    dialectOptions: {
      ssl: PG_SSL ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  });
  
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database successfully');
    
    // Define models
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
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      brand: {
        type: DataTypes.STRING
      },
      category: {
        type: DataTypes.STRING
      },
      imageUrl: {
        type: DataTypes.STRING
      },
      size: {
        type: DataTypes.STRING
      },
      color: {
        type: DataTypes.STRING
      },
      countInStock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, {
      tableName: 'products',
      timestamps: true
    });
    
    // 3. Order model
    const Order = sequelize.define('Order', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
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
      payment_method: {
        type: DataTypes.STRING
      },
      first_name: {
        type: DataTypes.STRING
      },
      last_name: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      phone: {
        type: DataTypes.STRING
      },
      address: {
        type: DataTypes.STRING
      },
      city: {
        type: DataTypes.STRING
      },
      state: {
        type: DataTypes.STRING
      },
      zip_code: {
        type: DataTypes.STRING
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, {
      tableName: 'orders',
      timestamps: false
    });
    
    // 4. Order Item model
    const OrderItem = sequelize.define('OrderItem', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      product_id: {
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
      image_url: {
        type: DataTypes.STRING
      }
    }, {
      tableName: 'order_items',
      timestamps: false
    });
    
    // 5. Payment Details model
    const PaymentDetail = sequelize.define('PaymentDetail', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false
      },
      payment_info: {
        type: DataTypes.TEXT
      }
    }, {
      tableName: 'payment_details',
      timestamps: false
    });
    
    // Create all tables
    console.log('Creating tables...');
    await sequelize.sync({ force: true });
    
    // Create a sample admin user
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
        brand: 'Fashion Brand',
        category: 'men',
        imageUrl: 'https://via.placeholder.com/300x400?text=Blue+TShirt',
        size: 'M',
        color: 'Blue',
        countInStock: 15
      },
      {
        name: 'Women\'s Black Dress',
        description: 'Elegant black dress for special occasions',
        price: 49.99,
        brand: 'Elegant Fashion',
        category: 'women',
        imageUrl: 'https://via.placeholder.com/300x400?text=Black+Dress',
        size: 'S',
        color: 'Black',
        countInStock: 10
      },
      {
        name: 'Kids Colorful Shorts',
        description: 'Comfortable shorts for active kids',
        price: 19.99,
        brand: 'Kids Fashion',
        category: 'kids',
        imageUrl: 'https://via.placeholder.com/300x400?text=Kids+Shorts',
        size: 'M',
        color: 'Multi',
        countInStock: 20
      }
    ];
    
    await Product.bulkCreate(sampleProducts);
    
    console.log('✅ Database initialized successfully with sample data');
    console.log('\nYou can now run the application with PostgreSQL:');
    console.log('npm run dev:pg');
    console.log('\nSample admin user:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the initialization
async function run() {
  const dbCreated = await createDatabaseIfNotExists();
  if (dbCreated) {
    await initializeDatabase();
  }
}

run(); 