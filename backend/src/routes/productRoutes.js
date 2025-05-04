const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct,
  createDummyProducts 
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// GET all products
router.get('/', getProducts);

// GET single product
router.get('/:id', getProductById);

// POST create new product - only admin can access
router.post('/', protect, admin, createProduct);

// POST create dummy products - only admin can access
router.post('/create-dummy', protect, admin, createDummyProducts);

module.exports = router; 