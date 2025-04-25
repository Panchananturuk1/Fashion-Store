const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Database connection info
const PG_USER = process.env.PG_USER || 'postgres';
const PG_PASSWORD = process.env.PG_PASSWORD || 'monu';
const PG_HOST = process.env.PG_HOST || 'localhost';
const PG_PORT = process.env.PG_PORT || '5432';
const PG_DATABASE = process.env.PG_DATABASE || 'fashion_store';
const PG_SSL = process.env.PG_SSL === 'true';

console.log('Connecting to PostgreSQL database to add more sample data...');
console.log('Host:', PG_HOST);
console.log('Database:', PG_DATABASE);
console.log('User:', PG_USER);

// Create Sequelize instance
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

// Define models
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

async function addMoreSampleData() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL successfully');
    
    // Add more users
    console.log('Adding more sample users...');
    const salt = await bcrypt.genSalt(10);
    
    const sampleUsers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', salt),
        role: 'user'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', salt),
        role: 'user'
      },
      {
        name: 'Test User',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', salt),
        role: 'user'
      }
    ];
    
    for (const user of sampleUsers) {
      try {
        await User.create(user);
        console.log(`User ${user.name} (${user.email}) created successfully`);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          console.log(`User ${user.email} already exists, skipping...`);
        } else {
          console.error(`Error creating user ${user.email}:`, error.message);
        }
      }
    }
    
    // Add more products
    console.log('\nAdding more sample products...');
    const moreProducts = [
      {
        name: 'Women\'s Summer Dress',
        description: 'Light and comfortable summer dress',
        price: 39.99,
        brand: 'Summer Collection',
        category: 'women',
        imageUrl: 'https://via.placeholder.com/300x400?text=Summer+Dress',
        size: 'M',
        color: 'Yellow',
        countInStock: 12
      },
      {
        name: 'Men\'s Formal Shirt',
        description: 'Elegant formal shirt for business occasions',
        price: 34.99,
        brand: 'Business Style',
        category: 'men',
        imageUrl: 'https://via.placeholder.com/300x400?text=Formal+Shirt',
        size: 'L',
        color: 'White',
        countInStock: 8
      },
      {
        name: 'Kids Winter Jacket',
        description: 'Warm winter jacket for kids',
        price: 45.99,
        brand: 'Kids Comfort',
        category: 'kids',
        imageUrl: 'https://via.placeholder.com/300x400?text=Kids+Jacket',
        size: 'S',
        color: 'Red',
        countInStock: 15
      },
      {
        name: 'Men\'s Jeans',
        description: 'Classic blue jeans for men',
        price: 49.99,
        brand: 'Denim Style',
        category: 'men',
        imageUrl: 'https://via.placeholder.com/300x400?text=Mens+Jeans',
        size: 'M',
        color: 'Blue',
        countInStock: 20
      },
      {
        name: 'Women\'s Handbag',
        description: 'Elegant leather handbag',
        price: 59.99,
        brand: 'Fashion Accessories',
        category: 'women',
        imageUrl: 'https://via.placeholder.com/300x400?text=Handbag',
        size: 'One Size',
        color: 'Brown',
        countInStock: 7
      }
    ];
    
    await Product.bulkCreate(moreProducts);
    console.log(`✅ Added ${moreProducts.length} more products successfully`);
    
    // Display summary
    const [userCount] = await sequelize.query('SELECT COUNT(*) FROM users');
    const [productCount] = await sequelize.query('SELECT COUNT(*) FROM products');
    
    console.log('\n📊 Database Summary:');
    console.log(`Total Users: ${userCount[0].count}`);
    console.log(`Total Products: ${productCount[0].count}`);
    console.log('\n✅ Additional sample data added successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
    console.log('Connection closed.');
  }
}

// Run the function
addMoreSampleData(); 