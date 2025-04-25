const { Sequelize } = require('sequelize');
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

console.log('Connecting to PostgreSQL database...');
console.log('Host:', PG_HOST);
console.log('Database:', PG_DATABASE);
console.log('User:', PG_USER);
console.log('Port:', PG_PORT);

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

async function viewDatabaseData() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL successfully');
    
    // List all tables in the database
    console.log('\n📋 LISTING DATABASE TABLES:');
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    tables.forEach((table, index) => {
      console.log(`${index + 1}. ${table.table_name}`);
    });
    
    // Display table structures
    console.log('\n📋 TABLE STRUCTURES:');
    for (const table of tables) {
      const [columns] = await sequelize.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = '${table.table_name}'
        ORDER BY ordinal_position;
      `);
      console.log(`\nTable: ${table.table_name}`);
      console.table(columns);
    }
    
    // Display users with full details
    console.log('\n👤 USERS TABLE:');
    const [users] = await sequelize.query('SELECT * FROM users');
    console.table(users);
    
    // Display products with full details including imageUrl
    console.log('\n🛍️ PRODUCTS TABLE (FULL DETAILS):');
    const [products] = await sequelize.query('SELECT * FROM products');
    console.table(products);
    
    // Display orders (if any)
    console.log('\n📦 ORDERS TABLE:');
    const [orders] = await sequelize.query('SELECT * FROM orders LIMIT 5');
    if (orders.length > 0) {
      console.table(orders);
    } else {
      console.log('No orders found in the database.');
    }
    
    console.log('\n✅ Database check complete. The database is properly set up!');
    
  } catch (error) {
    console.error('❌ Error connecting to the database:', error.message);
  } finally {
    await sequelize.close();
    console.log('Connection closed.');
  }
}

// Run the function
viewDatabaseData(); 