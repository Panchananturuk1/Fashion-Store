const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// PostgreSQL connection config
const pgConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'fashion_store',
  password: 'monu',
  port: 5432,
};

async function addUserToPostgres() {
  const pool = new Pool(pgConfig);
  
  try {
    console.log('Connecting to PostgreSQL...');
    console.log(`Database: ${pgConfig.database}`);
    console.log(`User: ${pgConfig.user}`);
    
    // Create a password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    // Check if user exists
    const checkResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      ['test@example.com']
    );
    
    if (checkResult.rows.length > 0) {
      console.log('Test user already exists!');
      console.log('Email: test@example.com');
      console.log('Password: password123');
      return;
    }
    
    // Add user
    const result = await pool.query(
      `INSERT INTO users 
      (name, email, password, role, "createdAt", "updatedAt") 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      ['Test User', 'test@example.com', hashedPassword, 'user', new Date(), new Date()]
    );
    
    console.log(`Test user created with ID: ${result.rows[0].id}`);
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
    // List all users
    const allUsers = await pool.query('SELECT id, name, email, role FROM users');
    console.log('\nAll users in database:');
    console.table(allUsers.rows);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close pool
    await pool.end();
    console.log('Connection closed');
  }
}

// Run the function
addUserToPostgres(); 