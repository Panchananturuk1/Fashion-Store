const express = require('express');
const router = express.Router();
const { register, login, getUserProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Simple test endpoint that doesn't require authentication
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Auth API is accessible',
    timestamp: new Date().toISOString()
  });
});

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);

// Debug route to test token handling
router.get('/debug', protect, (req, res) => {
  // If we get here, the token was valid and the user is authenticated
  res.json({ 
    message: 'Authentication is working correctly', 
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    },
    headers: {
      authorization: req.headers.authorization ? 'Present' : 'Missing'
    }
  });
});

module.exports = router; 