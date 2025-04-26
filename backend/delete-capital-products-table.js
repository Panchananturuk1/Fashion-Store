// Script to delete the Products table with capital P from Supabase

// Set environment variables
process.env.DB_TYPE = 'supabase';
process.env.PG_SSL = 'true';
process.env.NODE_ENV = 'production';
process.env.SUPABASE_POSTGRES_URL = 'postgresql://postgres.sxnqargkpoojafyshwrc:Monumartinez@123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres';

// Import required modules
const { Sequelize } = require('sequelize');

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

async function deleteCapitalProductsTable() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Connected to Supabase database!');

    // Execute raw SQL to drop the "Products" table with capital P
    console.log('Dropping "Products" table with capital P...');
    await sequelize.query('DROP TABLE IF EXISTS "Products" CASCADE;');
    console.log('"Products" table dropped successfully!');

    // Verify tables in the database
    const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('\nCurrent tables in the database:');
    results.forEach(table => {
      console.log(`- ${table.table_name}`);
    });

    console.log('\nOperation completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error executing operation:', error);
    console.error('Error details:', error.message);
    if (error.original) {
      console.error('Original error:', error.original);
    }
    process.exit(1);
  }
}

// Run the operation
deleteCapitalProductsTable(); 