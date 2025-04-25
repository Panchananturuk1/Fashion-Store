const axios = require('axios');

async function testProductsApi() {
  const baseUrl = 'http://127.0.0.1:5003/api';
  
  console.log('Testing Products API with PostgreSQL...');
  console.log(`Using API endpoint: ${baseUrl}/products`);
  
  try {
    // Test getting all products
    console.log('\n1. Testing GET all products:');
    const productsResponse = await axios.get(`${baseUrl}/products`);
    
    const products = productsResponse.data;
    console.log(`Retrieved ${products.length} products`);
    
    if (products.length > 0) {
      console.log('Sample product:');
      console.log(`ID: ${products[0].id}`);
      console.log(`Name: ${products[0].name}`);
      console.log(`Price: $${products[0].price}`);
      console.log(`Category: ${products[0].category}`);
      
      // Test getting a single product
      console.log('\n2. Testing GET single product:');
      const productId = products[0].id;
      const singleProductResponse = await axios.get(`${baseUrl}/products/${productId}`);
      
      const product = singleProductResponse.data;
      console.log(`Retrieved product details for ID: ${productId}`);
      console.log(`Name: ${product.name}`);
      console.log(`Description: ${product.description}`);
      console.log(`Price: $${product.price}`);
      console.log(`Category: ${product.category}`);
      console.log(`SubCategory: ${product.subCategory}`);
      console.log(`ImageUrl: ${product.imageUrl}`);
      console.log(`Rating: ${product.rating} (${product.numReviews} reviews)`);
      
      // Convert size and color from JSON string to array if needed
      let sizeArray, colorArray;
      try {
        sizeArray = typeof product.size === 'string' ? JSON.parse(product.size) : product.size;
        colorArray = typeof product.color === 'string' ? JSON.parse(product.color) : product.color;
      } catch (e) {
        console.log('Error parsing size/color JSON:', e.message);
        sizeArray = product.size;
        colorArray = product.color;
      }
      
      console.log(`Available Sizes: ${Array.isArray(sizeArray) ? sizeArray.join(', ') : sizeArray}`);
      console.log(`Available Colors: ${Array.isArray(colorArray) ? colorArray.join(', ') : colorArray}`);
    } else {
      console.log('No products found in the database!');
    }
    
    // Test filtering by category
    if (products.length > 0) {
      const categories = [...new Set(products.map(p => p.category))];
      
      if (categories.length > 0) {
        const testCategory = categories[0];
        console.log(`\n3. Testing filtering by category: ${testCategory}`);
        
        const categoryResponse = await axios.get(`${baseUrl}/products?category=${testCategory}`);
        const categoryProducts = categoryResponse.data;
        
        console.log(`Retrieved ${categoryProducts.length} products in category "${testCategory}"`);
        if (categoryProducts.length > 0) {
          console.log('First product in category:');
          console.log(`Name: ${categoryProducts[0].name}`);
          console.log(`Price: $${categoryProducts[0].price}`);
        }
      }
    }
    
    console.log('\nProducts API testing completed successfully!');
    
  } catch (error) {
    console.error('Error during API test:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testProductsApi(); 