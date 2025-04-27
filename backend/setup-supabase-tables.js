/**
 * Supabase Database Initialization Script
 * 
 * This script creates the required tables in your Supabase PostgreSQL database.
 * Run this script to set up your database schema.
 */

const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

console.log('Initializing Supabase database tables...');

// Check for Supabase connection string
if (!process.env.SUPABASE_POSTGRES_URL) {
  console.error('Error: SUPABASE_POSTGRES_URL environment variable is required');
  console.error('Please set this environment variable before running this script');
  process.exit(1);
}

// Create Sequelize instance with Supabase connection
const sequelize = new Sequelize(process.env.SUPABASE_POSTGRES_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: console.log
});

async function initializeSupabaseDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Connected to Supabase PostgreSQL database successfully');

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

    // Ask for confirmation before dropping tables
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question('This script will drop and recreate all tables in your Supabase database. Continue? (yes/no) ', async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        try {
          // Force sync all models (drop and recreate tables)
          console.log('Creating database tables...');
          await sequelize.sync({ force: true });
          console.log('✅ Database tables created successfully');

          // Create admin user
          console.log('Creating admin user...');
          const hashedPassword = await bcrypt.hash('admin123', 10);
          await User.create({
            name: 'Admin User',
            email: 'admin@fashionstore.com',
            password: hashedPassword,
            role: 'admin'
          });
          console.log('✅ Admin user created');

          console.log('\nDatabase setup complete! You can now use Supabase with Render.');
        } catch (error) {
          console.error('Error setting up database:', error);
        }
      } else {
        console.log('Operation cancelled');
      }
      
      readline.close();
      await sequelize.close();
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeSupabaseDatabase(); 