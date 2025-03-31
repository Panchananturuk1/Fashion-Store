const { sequelize } = require('./src/config/db');

async function checkDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Connected to database successfully!');
    
    // Check users table schema
    const [userColumns] = await sequelize.query('DESCRIBE users');
    console.log('Users table schema:');
    userColumns.forEach(col => {
      console.log(`- ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Disconnect
    await sequelize.close();
    console.log('Database connection closed');
  } catch (err) {
    console.error('Database Error:', err.message);
    process.exit(1);
  }
}

checkDatabase(); 