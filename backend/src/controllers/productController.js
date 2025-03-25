// Import Product model
const Product = require('../models/productModel');
const { Op } = require('sequelize');

// Get all products
const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    
    let whereClause = {};
    if (category) {
      whereClause.category = category;
    }
    
    const products = await Product.findAll({
      where: whereClause
    });
    
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      size: JSON.stringify(req.body.size),
      color: JSON.stringify(req.body.color)
    };

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Create dummy products for initial data
const createDummyProducts = async (req, res) => {
  try {
    // Check if products already exist
    const existingProducts = await Product.count();
    
    if (existingProducts > 0) {
      return res.status(400).json({ 
        message: 'Products already exist. Please use the regular product creation endpoint to add new products.' 
      });
    }
    
    // Men's clothing dummy data
    const menProducts = [
      {
        name: 'Classic Fit Dress Shirt',
        description: 'A comfortable and stylish dress shirt for formal occasions.',
        price: 49.99,
        category: 'men',
        subCategory: 'shirts',
        imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
        size: JSON.stringify(['S', 'M', 'L', 'XL']),
        color: JSON.stringify(['White', 'Blue', 'Black']),
        featured: true,
        rating: 4.5,
        numReviews: 28
      },
      {
        name: 'Slim Fit Jeans',
        description: 'Modern slim fit jeans with stretch comfort.',
        price: 59.99,
        category: 'men',
        subCategory: 'pants',
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
        size: JSON.stringify(['30', '32', '34', '36']),
        color: JSON.stringify(['Blue', 'Black', 'Gray']),
        featured: true,
        rating: 4.2,
        numReviews: 42
      },
      {
        name: 'Casual Hooded Sweatshirt',
        description: 'Comfortable hooded sweatshirt for everyday wear.',
        price: 39.99,
        category: 'men',
        subCategory: 'hoodies',
        imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
        size: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
        color: JSON.stringify(['Gray', 'Black', 'Navy']),
        featured: false,
        rating: 4.0,
        numReviews: 35
      },
      {
        name: 'Lightweight Bomber Jacket',
        description: 'Stylish lightweight jacket for layering in any season.',
        price: 89.99,
        category: 'men',
        subCategory: 'jackets',
        imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
        size: JSON.stringify(['S', 'M', 'L', 'XL']),
        color: JSON.stringify(['Black', 'Olive', 'Navy']),
        featured: true,
        rating: 4.7,
        numReviews: 19
      },
      {
        name: 'Graphic Print T-Shirt',
        description: 'Cotton t-shirt with modern graphic print.',
        price: 24.99,
        category: 'men',
        subCategory: 't-shirts',
        imageUrl: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1',
        size: JSON.stringify(['S', 'M', 'L', 'XL']),
        color: JSON.stringify(['White', 'Black', 'Gray']),
        featured: false,
        rating: 3.9,
        numReviews: 23
      }
    ];
    
    // Women's clothing dummy data
    const womenProducts = [
      {
        name: 'High-Waisted Skinny Jeans',
        description: 'Flattering high-waisted skinny jeans with stretch.',
        price: 64.99,
        category: 'women',
        subCategory: 'jeans',
        imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246',
        size: JSON.stringify(['24', '26', '28', '30', '32']),
        color: JSON.stringify(['Blue', 'Black', 'White']),
        featured: true,
        rating: 4.6,
        numReviews: 47
      },
      {
        name: 'Floral Print Maxi Dress',
        description: 'Elegant floral maxi dress for casual and semi-formal occasions.',
        price: 79.99,
        category: 'women',
        subCategory: 'dresses',
        imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1',
        size: JSON.stringify(['XS', 'S', 'M', 'L']),
        color: JSON.stringify(['Floral Print', 'Navy', 'Red']),
        featured: true,
        rating: 4.8,
        numReviews: 32
      },
      {
        name: 'Classic Blazer',
        description: 'Tailored blazer to elevate any outfit.',
        price: 99.99,
        category: 'women',
        subCategory: 'blazers',
        imageUrl: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f',
        size: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
        color: JSON.stringify(['Black', 'Beige', 'Navy']),
        featured: false,
        rating: 4.3,
        numReviews: 18
      },
      {
        name: 'Knit Sweater',
        description: 'Soft knit sweater perfect for layering.',
        price: 54.99,
        category: 'women',
        subCategory: 'sweaters',
        imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27',
        size: JSON.stringify(['S', 'M', 'L']),
        color: JSON.stringify(['Cream', 'Gray', 'Burgundy']),
        featured: true,
        rating: 4.5,
        numReviews: 29
      },
      {
        name: 'V-Neck Blouse',
        description: 'Elegant v-neck blouse for work or casual wear.',
        price: 44.99,
        category: 'women',
        subCategory: 'blouses',
        imageUrl: 'https://images.unsplash.com/photo-1551489186-cf8726f514f8',
        size: JSON.stringify(['XS', 'S', 'M', 'L']),
        color: JSON.stringify(['White', 'Black', 'Pastel Pink']),
        featured: false,
        rating: 4.2,
        numReviews: 24
      }
    ];
    
    const dummyProducts = [...menProducts, ...womenProducts];
    
    // Insert dummy data using bulkCreate
    await Product.bulkCreate(dummyProducts);
    
    res.status(201).json({ 
      message: 'Dummy products created successfully', 
      count: dummyProducts.length 
    });
  } catch (error) {
    console.error('Error creating dummy products:', error);
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  createDummyProducts
}; 