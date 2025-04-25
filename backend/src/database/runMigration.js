const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/db');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Function to run a migration file
const runMigration = async (filename) => {
  try {
    const filePath = path.join(__dirname, 'migrations', filename);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split the SQL file by semicolons to get individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim() !== '');
    
    console.log(`Running migration: ${filename}`);
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (const statement of statements) {
      await sequelize.query(statement + ';');
    }
    
    console.log(`Migration ${filename} completed successfully`);
    return true;
  } catch (error) {
    console.error(`Migration ${filename} failed:`, error);
    return false;
  }
};

// Run specific migration
const runSpecificMigration = async () => {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    
    // Run the update users table migration
    const success = await runMigration('update_users_table.sql');
    
    if (success) {
      console.log('All migrations completed successfully');
    } else {
      console.error('Migration failed, check logs for details');
    }
    
    // Close the connection
    await sequelize.close();
  } catch (error) {
    console.error('Error running migrations:', error);
  }
};

// If this script is run directly, execute the migration
if (require.main === module) {
  runSpecificMigration()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Unhandled error during migration:', error);
      process.exit(1);
    });
}

module.exports = { runMigration, runSpecificMigration }; 