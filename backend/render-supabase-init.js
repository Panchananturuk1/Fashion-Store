/**
 * Render Supabase Initialization Script
 * 
 * This script is designed to run during the Render deployment process.
 * It sets up the necessary environment and initializes the Supabase connection.
 * 
 * It will NOT drop tables by default - it only tests the connection and syncs the models.
 */

// Set environment variables for Render deployment
if (!process.env.DB_TYPE) {
  process.env.DB_TYPE = 'supabase';
}
process.env.PG_SSL = 'true';
process.env.NODE_ENV = 'production';

// Load modules
const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Try to load environment variables
dotenv.config();

// Check if required env vars are set
if (!process.env.SUPABASE_POSTGRES_URL) {
  console.error('Error: SUPABASE_POSTGRES_URL environment variable is required.');
  console.error('Please set this variable in your Render dashboard.');
  process.exit(1);
}

// Get the database URL
const databaseUrl = process.env.SUPABASE_POSTGRES_URL;
console.log('Using Supabase database URL:', databaseUrl.replace(/:[^:]*@/, ':****@'));

// Create Sequelize instance with Supabase connection URL
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

async function initializeRenderSupabase() {
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

    // Check for CREATE_TABLES environment variable to determine if we should force sync
    const shouldCreateTables = process.env.CREATE_TABLES === 'true';
    
    if (shouldCreateTables) {
      // Force sync all models (drop and recreate tables)
      console.log('Creating database tables (force sync)...');
      await sequelize.sync({ force: true });
      console.log('✅ Database tables created successfully');
    } else {
      // Just sync (without force) to ensure models are in sync with DB
      console.log('Syncing database models (safe sync)...');
      await sequelize.sync({ force: false });
      console.log('✅ Database models synced successfully');
    }

    // List all tables in the database
    try {
      const [results] = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
      console.log('\nTables in your Supabase database:');
      if (results.length === 0) {
        console.log('No tables found. You may need to run migrations or initialization scripts.');
      } else {
        results.forEach(row => console.log(`- ${row.table_name}`));
      }
    } catch (error) {
      console.error('Error querying tables:', error.message);
    }

    console.log('\nSupabase initialization complete!');
    
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run the initialization
initializeRenderSupabase(); 