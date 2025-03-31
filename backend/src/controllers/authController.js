const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

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

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
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
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
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
    const { name, email, phone, street, city, state, zip_code } = req.body;
    
    // Build the update object with only provided fields
    const updates = {};
    
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (street !== undefined) updates.street = street;
    if (city !== undefined) updates.city = city;
    if (state !== undefined) updates.state = state;
    if (zip_code !== undefined) updates.zip_code = zip_code;
    
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
};

module.exports = {
  register,
  login,
  getUserProfile,
  updateProfile
}; 