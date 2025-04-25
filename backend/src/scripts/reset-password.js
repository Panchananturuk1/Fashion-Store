const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');
const User = require('../models/userModel');
require('dotenv').config({ path: '../../.env' });

// Function to reset password
async function resetPassword(email, newPassword) {
  try {
    // Initialize database connection
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Find user by email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.error('User not found with email:', email);
      return false;
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update user's password
    await user.update({ password: hashedPassword });
    
    console.log('Password reset successful for user:', email);
    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    return false;
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Get email and new password from command line arguments
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log('Usage: node reset-password.js <email> <new-password>');
  process.exit(1);
}

const [email, newPassword] = args;

// Reset the password
resetPassword(email, newPassword)
  .then(success => {
    if (success) {
      console.log('Password reset completed successfully.');
    } else {
      console.log('Password reset failed.');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  }); 