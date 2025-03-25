const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct,
  createDummyProducts 
} = require('../controllers/productController');

// GET all products
router.get('/', getProducts);

// GET single product
router.get('/:id', getProductById);

// POST create new product
router.post('/', createProduct);

// POST create dummy products
router.post('/create-dummy', createDummyProducts);

module.exports = router; 