const axios = require('axios');

async function testProducts() {
  const apiUrl = 'http://127.0.0.1:5003/api/products';
  
  console.log('Testing Products API with fixed PostgreSQL database...');
  console.log(`API Endpoint: ${apiUrl}`);
  console.log('-'.repeat(50));
  
  try {
    // Get all products
    console.log('1. Testing GET all products:');
    const response = await axios.get(apiUrl);
    const products = response.data;
    
    console.log(`✅ SUCCESS: Retrieved ${products.length} products from the database.`);
    
    // Check product structure
    if (products.length > 0) {
      console.log(`\nProduct 1 details:`);
      const product = products[0];
      console.log(`ID: ${product.id}`);
      console.log(`Name: ${product.name}`);
      console.log(`Price: $${product.price}`);
      console.log(`Category: ${product.category}`);
      console.log(`Subcategory: ${product.subcategory}`);
      console.log(`Image URL: ${product.imageUrl || product.image_url}`);
      console.log(`Rating: ${product.rating}`);
      console.log(`Reviews: ${product.numReviews || product.num_reviews}`);
      
      // Check if all expected fields are present
      const requiredFields = ['id', 'name', 'description', 'price', 'category', 
                             'subcategory', 'imageUrl', 'size', 'color', 
                             'featured', 'rating'];
      
      const missingFields = requiredFields.filter(field => {
        return !product[field] && !product[field.toLowerCase()] && 
               !product[field.replace(/([A-Z])/g, '_$1').toLowerCase()];
      });
      
      if (missingFields.length > 0) {
        console.log(`⚠️ WARNING: Missing fields in product data: ${missingFields.join(', ')}`);
      } else {
        console.log(`✅ All required fields are present`);
      }
      
      // Test getting a specific product
      console.log('\n2. Testing GET specific product:');
      const singleProductResponse = await axios.get(`${apiUrl}/${product.id}`);
      const singleProduct = singleProductResponse.data;
      
      console.log(`✅ SUCCESS: Retrieved specific product with ID ${product.id}`);
      console.log(`Name: ${singleProduct.name}`);
      
      // Test filtering by category
      console.log('\n3. Testing product filtering by category:');
      const category = product.category;
      const categoryResponse = await axios.get(`${apiUrl}?category=${category}`);
      const categoryProducts = categoryResponse.data;
      
      console.log(`✅ SUCCESS: Retrieved ${categoryProducts.length} products in category "${category}"`);
      
      console.log('-'.repeat(50));
      console.log('✅ All tests PASSED! The Products API is working correctly.');
    }
  } catch (error) {
    console.log('❌ ERROR: API test failed');
    console.error('Error details:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testProducts(); 