const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');
const { QueryTypes } = require('sequelize');

// Set DB_TYPE to postgres
process.env.DB_TYPE = 'postgres';

async function addTestUser() {
  try {
    console.log('Connecting to PostgreSQL...');
    await sequelize.authenticate();
    console.log('Connected successfully!');
    
    // Check if test user exists
    const existingUsers = await sequelize.query(
      `SELECT * FROM users WHERE email = ?`,
      {
        replacements: ['test@example.com'],
        type: QueryTypes.SELECT
      }
    );
    
    if (existingUsers.length > 0) {
      console.log('Test user already exists!');
      return;
    }
    
    // Create a password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    // Current timestamp
    const now = new Date();
    
    // Insert test user with timestamps
    await sequelize.query(
      `INSERT INTO users 
      (name, email, password, role, "createdAt", "updatedAt") 
      VALUES (?, ?, ?, ?, ?, ?)`,
      {
        replacements: ['Test User', 'test@example.com', hashedPassword, 'user', now, now],
        type: QueryTypes.INSERT
      }
    );
    
    console.log('Test user added successfully!');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
    // Verify user was added
    const users = await sequelize.query(
      `SELECT id, name, email, role FROM users`,
      {
        type: QueryTypes.SELECT
      }
    );
    
    console.log('\nUsers in database:');
    console.table(users);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
    console.log('Connection closed');
  }
}

// Run the function
addTestUser(); 