// Script to create user tables in Supabase database and add sample users

// Set environment variables for testing 
process.env.DB_TYPE = 'supabase';
process.env.PG_SSL = 'true';
process.env.NODE_ENV = 'production';
process.env.SUPABASE_POSTGRES_URL = 'postgresql://postgres.sxnqargkpoojafyshwrc:Monumartinez@123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres';

// Import required modules
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

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

// Define User model
const User = sequelize.define('User', {
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user'
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  street: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  zip_code: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
      
      // Set role based on isAdmin
      if (user.isAdmin) {
        user.role = 'admin';
      }
    }
  }
});

// Define the sample users
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    isAdmin: true,
    phone: '555-123-4567',
    street: '123 Admin St',
    city: 'Admin City',
    state: 'Admin State',
    zip_code: '12345'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    isAdmin: false,
    phone: '555-987-6543',
    street: '456 User St',
    city: 'User City',
    state: 'User State',
    zip_code: '54321'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    isAdmin: false,
    phone: '555-567-8901',
    street: '789 Customer Rd',
    city: 'Customer City',
    state: 'Customer State',
    zip_code: '67890'
  }
];

// Create tables and insert data
async function initDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Connected to Supabase database!');

    // Create users table (force: true will drop the table if it exists)
    console.log('Creating users table...');
    await User.sync({ force: true });
    console.log('Users table created successfully!');

    // Insert sample users
    console.log('Inserting sample users...');
    await Promise.all(sampleUsers.map(user => User.create(user)));
    console.log('Sample users inserted successfully!');

    // Check if users were inserted
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // Don't show passwords in the console
    });
    console.log(`Found ${users.length} users in the database`);
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Admin: ${user.isAdmin}`);
    });

    console.log('Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    console.error('Error details:', error.message);
    if (error.original) {
      console.error('Original error:', error.original);
    }
    process.exit(1);
  }
}

// Run the initialization
initDatabase(); 