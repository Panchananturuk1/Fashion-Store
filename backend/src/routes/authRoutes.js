const express = require('express');
const router = express.Router();
const { register, login, getUserProfile, updateProfile, makeAdmin } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);

// Admin management route
router.put('/make-admin/:userId', protect, admin, makeAdmin);

// Debug route to test token handling
router.get('/debug', protect, (req, res) => {
  // If we get here, the token was valid and the user is authenticated
  res.json({ 
    message: 'Authentication is working correctly', 
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      role: req.user.role
    },
    headers: {
      authorization: req.headers.authorization ? 'Present' : 'Missing'
    }
  });
});

module.exports = router; 