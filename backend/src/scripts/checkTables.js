const { sequelize } = require('../config/db');

async function checkTables() {
  try {
    // Get all tables
    const [results] = await sequelize.query('SHOW TABLES');
    console.log('Database Tables:');
    results.forEach(row => {
      console.log(Object.values(row)[0]);
    });
  } catch (error) {
    console.error('Error checking tables:', error);
  } finally {
    await sequelize.close();
  }
}

checkTables(); 