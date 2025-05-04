const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/sequelize');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check if this is Panchanan Turuk and set admin privileges
    const isAdmin = name === 'Panchanan Turuk';
    const role = isAdmin ? 'admin' : 'user';
    
    console.log(`Creating user: ${name}, Admin status: ${isAdmin}, Role: ${role}`);

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      isAdmin: isAdmin,
      role: role
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
        token: generateToken(user.id),
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Request body:', req.body);
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    console.log(`Login attempt for email: ${email}`);

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log(`No user found with email: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log(`User found: ${user.name}, ID: ${user.id}, Role: ${user.role}`);
    console.log(`Stored password hash: ${user.password.substring(0, 15)}...`);

    try {
      // Direct password comparison
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(`Password comparison result: ${isMatch}`);

      if (isMatch) {
        console.log(`Login successful for user: ${user.email}`);
        
        // Check if user is Panchanan Turuk and update admin status if needed
        if (user.name === 'Panchanan Turuk' && (!user.isAdmin || user.role !== 'admin')) {
          console.log('Setting admin privileges for Panchanan Turuk');
          user.isAdmin = true;
          user.role = 'admin';
          await user.save();
        }
        
        // Generate token
        const token = generateToken(user.id);
        console.log(`Token generated: ${token.substring(0, 15)}...`);
        
        return res.json({
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          role: user.role,
          token: token
        });
      } else {
        console.log('Password does not match');
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (bcryptError) {
      console.error('Error during password comparison:', bcryptError);
      return res.status(500).json({ message: 'Error during authentication', error: bcryptError.message });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
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
    
    // Only check email uniqueness if it's changing
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists && emailExists.id !== user.id) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      updates.email = email;
    }

    // Add optional fields if they exist in the database
    try {
      // Get the field names from the user model
      const userAttributes = User.getAttributes();
      const fieldNames = Object.keys(userAttributes);
      console.log('Available fields:', fieldNames);
      
      // Check each optional field
      const { phone, street, city, state, zip_code } = req.body;
      
      if (fieldNames.includes('phone') && phone !== undefined) updates.phone = phone;
      if (fieldNames.includes('street') && street !== undefined) updates.street = street;
      if (fieldNames.includes('city') && city !== undefined) updates.city = city;
      if (fieldNames.includes('state') && state !== undefined) updates.state = state;
      if (fieldNames.includes('zip_code') && zip_code !== undefined) updates.zip_code = zip_code;
    } catch (schemaError) {
      console.error('Error checking schema:', schemaError);
      // Continue with basic fields only
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
};

// Make a user an admin (for manual use)
const makeAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isAdmin = true;
    user.role = 'admin';
    await user.save();
    
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role
    });
  } catch (error) {
    console.error('Make admin error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getUserProfile,
  updateProfile,
  makeAdmin
}; 