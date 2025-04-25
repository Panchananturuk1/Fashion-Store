const fs = require('fs');
const path = require('path');

// Path to the authController file
const authControllerPath = path.join(__dirname, '..', 'controllers', 'authController.js');

// Read the original file
console.log(`Reading file: ${authControllerPath}`);
fs.readFile(authControllerPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  
  console.log('File read successfully');
  
  // Create a new, fixed version of the updateProfile function
  const newUpdateProfile = `const updateProfile = async (req, res) => {
  try {
    console.log('Update profile request received for user ID:', req.user.id);
    console.log('Request body:', req.body);

    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      console.log('User not found with ID:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic info with a simpler approach
    const { name, email } = req.body;
    
    // Build the update object with only core fields
    const updates = {};
    
    if (name) updates.name = name;
    
    // Check if optional fields exist in the database schema
    try {
      const { QueryTypes } = require('sequelize');
      const { sequelize } = require('../config/db');
      
      // Get user table columns
      const columns = await sequelize.query(
        "SELECT column_name FROM information_schema.columns WHERE table_name = 'users'",
        { type: QueryTypes.SELECT }
      );
      
      const columnNames = columns.map(col => col.column_name);
      console.log('Available columns:', columnNames);
      
      // Only add fields that exist in the schema
      const { phone, street, city, state, zip_code } = req.body;
      
      if (columnNames.includes('phone') && phone !== undefined) updates.phone = phone;
      if (columnNames.includes('street') && street !== undefined) updates.street = street;
      if (columnNames.includes('city') && city !== undefined) updates.city = city;
      if (columnNames.includes('state') && state !== undefined) updates.state = state;
      if (columnNames.includes('zip_code') && zip_code !== undefined) updates.zip_code = zip_code;
    } catch (schemaError) {
      console.error('Error checking schema:', schemaError);
      // Continue with basic fields only
    }
    
    // Only check email uniqueness if it's changing
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists && emailExists.id !== user.id) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      updates.email = email;
    }

    console.log('Updating user with:', updates);
    
    // Update user with the collected changes
    await user.update(updates);

    console.log('User updated successfully');

    // Return the updated user data
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};`;

  // Find start and end positions of the original updateProfile function
  const regex = /const updateProfile = async \(req, res\) => {[\s\S]+?};/;
  const match = data.match(regex);

  if (!match) {
    console.error('Could not find updateProfile function in the file');
    return;
  }

  // Replace the updateProfile function
  const updatedContent = data.replace(regex, newUpdateProfile);
  
  // Create a backup first
  const backupPath = `${authControllerPath}.backup`;
  fs.writeFile(backupPath, data, 'utf8', (err) => {
    if (err) {
      console.error('Error creating backup:', err);
      return;
    }
    
    console.log(`Backup created at: ${backupPath}`);
    
    // Write the updated file
    fs.writeFile(authControllerPath, updatedContent, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      
      console.log('authController.js has been updated successfully');
    });
  });
}); 