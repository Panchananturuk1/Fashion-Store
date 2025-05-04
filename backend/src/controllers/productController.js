// Import Product model
const Product = require('../models/productModel');
const { Op } = require('sequelize');
const { sequelize } = require('../config/sequelize');

// Get database type
const dbType = process.env.DB_TYPE || 'mysql';
const isPostgres = dbType === 'postgres' || dbType === 'supabase'; // Add supabase as postgres type

console.log(`ProductController initialized with database type: ${dbType}, isPostgres: ${isPostgres}`);

// Helper to map database fields to model fields (for PostgreSQL compatibility)
const mapProductFields = (product) => {
  if (!product || !isPostgres) return product;

  const mappedProduct = { ...product };
  
  // For PostgreSQL, product fields are already in camelCase
  // Normally we would map snake_case to camelCase, but the DB is using camelCase column names
  // No need to map snake_case fields like image_url to camelCase
  
  // Parse JSON strings to arrays if needed
  if (typeof product.size === 'string') {
    try { 
      mappedProduct.size = JSON.parse(product.size); 
    } catch (e) {
      console.warn('Error parsing size JSON:', e);
      mappedProduct.size = product.size;
    }
  }
  
  if (typeof product.color === 'string') {
    try { 
      mappedProduct.color = JSON.parse(product.color); 
    } catch (e) {
      console.warn('Error parsing color JSON:', e);
      mappedProduct.color = product.color;
    }
  }
  
  return mappedProduct;
};

// Get all products
const getProducts = async (req, res) => {
  try {
    console.log('getProducts called with database type:', dbType);
    
    const { category } = req.query;
    
    let whereClause = {};
    if (category) {
      whereClause.category = category;
    }
    
    let products;
    
    if (isPostgres) {
      // Use raw query for PostgreSQL
      console.log('Using PostgreSQL raw query for products' + (category ? ` in category: ${category}` : ''));
      
      try {
        // First check if the products table exists
        const tableCheck = await sequelize.query(
          "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'products')",
          { type: sequelize.QueryTypes.SELECT }
        );
        
        console.log('Table check result:', tableCheck);
        
        // If table doesn't exist, return empty array
        if (!tableCheck[0].exists) {
          console.log('Products table does not exist in the database');
          return res.status(200).json([]);
        }
        
        // If it exists, query the products
        const query = category 
          ? 'SELECT * FROM products WHERE category = $1'
          : 'SELECT * FROM products';
        
        const values = category ? [category] : [];
        
        console.log('Executing query:', query, 'with values:', values);
        
        const result = await sequelize.query(query, {
          bind: values,
          type: sequelize.QueryTypes.SELECT
        });
        
        console.log(`Query returned ${result.length} products`);
        products = result.map(mapProductFields);
      } catch (queryError) {
        console.error('PostgreSQL query error:', queryError);
        throw queryError;
      }
    } else {
      // Use Sequelize for MySQL
      console.log('Using Sequelize ORM for MySQL products');
      products = await Product.findAll({
        where: whereClause
      });
      console.log(`Found ${products.length} products`);
    }
    
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    console.error('Error details:', error.stack);
    res.status(500).json({ message: 'Server Error', error: error.message, stack: error.stack });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    console.log(`getProductById called with id: ${req.params.id}, database type: ${dbType}`);
    
    const productId = req.params.id;
    let product;
    
    if (isPostgres) {
      // Use raw query for PostgreSQL
      console.log(`Getting product with ID: ${productId} using PostgreSQL raw query`);
      
      try {
        const result = await sequelize.query(
          'SELECT * FROM products WHERE id = $1',
          {
            bind: [productId],
            type: sequelize.QueryTypes.SELECT
          }
        );
        
        console.log(`Query returned ${result.length} results`);
        
        if (result.length === 0) {
          return res.status(404).json({ message: 'Product not found' });
        }
        
        product = mapProductFields(result[0]);
      } catch (queryError) {
        console.error('PostgreSQL query error:', queryError);
        throw queryError;
      }
    } else {
      // Use Sequelize for MySQL
      console.log(`Getting product with ID: ${productId} using Sequelize ORM`);
      product = await Product.findByPk(productId);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    console.error('Error details:', error.stack);
    res.status(500).json({ message: 'Server Error', error: error.message, stack: error.stack });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  try {
    console.log('createProduct called with payload:', JSON.stringify(req.body));
    
    const { 
      name, description, price, category, subcategory, subCategory, 
      imageUrl, size, color, inStock, featured, rating, numReviews 
    } = req.body;
    
    // Handle both subcategory and subCategory field names
    const finalSubcategory = subcategory || subCategory || '';
    
    // Prepare data for arrays
    let sizeData = size;
    let colorData = color;
    
    // Ensure size and color are properly formatted
    if (Array.isArray(size)) {
      sizeData = isPostgres ? JSON.stringify(size) : size;
    } else if (typeof size === 'string' && size.trim().startsWith('[')) {
      // If it's already a JSON string, keep it as is for Postgres
      sizeData = isPostgres ? size : JSON.parse(size);
    }
    
    if (Array.isArray(color)) {
      colorData = isPostgres ? JSON.stringify(color) : color;
    } else if (typeof color === 'string' && color.trim().startsWith('[')) {
      // If it's already a JSON string, keep it as is for Postgres
      colorData = isPostgres ? color : JSON.parse(color);
    }
    
    // Get current timestamp for created/updated fields
    const now = new Date();
    
    console.log('Processed data:', {
      name, description, price, category,
      subCategory: finalSubcategory,
      size: sizeData,
      color: colorData
    });
    
    let product;
    
    if (isPostgres) {
      // Use raw query for PostgreSQL
      console.log('Using PostgreSQL insertion with data:', {
        name, description, price, category, subCategory: finalSubcategory,
        imageUrl, size: sizeData, color: colorData
      });
      
      try {
        const result = await sequelize.query(
          `INSERT INTO products 
           (name, description, price, category, "subCategory", "imageUrl", 
            size, color, "inStock", featured, rating, "numReviews", "createdAt", "updatedAt") 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
           RETURNING *`,
          {
            bind: [
              name, description, price, category, finalSubcategory, imageUrl,
              sizeData, colorData, inStock !== undefined ? inStock : true, 
              featured || false, rating || 0, numReviews || 0,
              now, now
            ],
            type: sequelize.QueryTypes.INSERT
          }
        );
        
        if (result && result[0] && result[0][0]) {
          product = mapProductFields(result[0][0]);
        } else {
          throw new Error('Failed to retrieve inserted product data');
        }
      } catch (pgError) {
        console.error('PostgreSQL insertion error:', pgError);
        throw pgError;
      }
    } else {
      // Use Sequelize for MySQL
      const productData = {
        name,
        description,
        price,
        category,
        subCategory: finalSubcategory,  // Use camelCase for MySQL
        imageUrl,
        size: sizeData,
        color: colorData,
        inStock: inStock !== undefined ? inStock : true,
        featured: featured || false,
        rating: rating || 0,
        numReviews: numReviews || 0,
        createdAt: now,
        updatedAt: now
      };
      
      product = await Product.create(productData);
    }
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message,
      stack: error.stack
    });
  }
};

// Create dummy products for initial data
const createDummyProducts = async (req, res) => {
  try {
    // Check if products already exist
    let existingProductsCount;
    
    if (isPostgres) {
      const result = await sequelize.query('SELECT COUNT(*) FROM products', {
        type: sequelize.QueryTypes.SELECT
      });
      existingProductsCount = parseInt(result[0].count);
    } else {
      existingProductsCount = await Product.count();
    }
    
    if (existingProductsCount > 0) {
      return res.status(400).json({ 
        message: 'Products already exist. Please use the regular product creation endpoint to add new products.' 
      });
    }
    
    // Get current timestamp for created/updated fields
    const now = new Date();
    
    // Men's clothing dummy data
    const menProducts = [
      {
        name: 'Classic Fit Dress Shirt',
        description: 'A comfortable and stylish dress shirt for formal occasions.',
        price: 49.99,
        category: 'men',
        subcategory: 'shirts',
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
        subcategory: 'pants',
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
        subcategory: 'hoodies',
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
        subcategory: 'jackets',
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
        subcategory: 't-shirts',
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
        subcategory: 'jeans',
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
        subcategory: 'dresses',
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
        subcategory: 'blazers',
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
        subcategory: 'sweaters',
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
        subcategory: 'blouses',
        imageUrl: 'https://images.unsplash.com/photo-1551489186-cf8726f514f8',
        size: JSON.stringify(['XS', 'S', 'M', 'L']),
        color: JSON.stringify(['White', 'Black', 'Pastel Pink']),
        featured: false,
        rating: 4.2,
        numReviews: 24
      }
    ];
    
    const dummyProducts = [...menProducts, ...womenProducts];
    
    if (isPostgres) {
      // Use raw queries for PostgreSQL
      for (const product of dummyProducts) {
        await sequelize.query(
          `INSERT INTO products 
           (name, description, price, category, "subCategory", "imageUrl", 
            size, color, "inStock", featured, rating, "numReviews", "createdAt", "updatedAt") 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
          {
            bind: [
              product.name, product.description, product.price, 
              product.category, product.subcategory, product.imageUrl,
              product.size, product.color, true, product.featured, 
              product.rating, product.numReviews, now, now
            ],
            type: sequelize.QueryTypes.INSERT
          }
        );
      }
    } else {
      // Use Sequelize bulkCreate for MySQL
      // Add createdAt and updatedAt to all products
      const productsWithTimestamps = dummyProducts.map(product => ({
        ...product,
        createdAt: now,
        updatedAt: now
      }));
      await Product.bulkCreate(productsWithTimestamps);
    }
    
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