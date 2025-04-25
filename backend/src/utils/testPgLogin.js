const axios = require('axios');

async function testLogin() {
  const baseUrl = 'http://127.0.0.1:5003/api';
  
  console.log('Testing login with PostgreSQL database...');
  console.log(`Using API endpoint: ${baseUrl}`);
  
  try {
    // Test admin login
    console.log('\n1. Testing admin login:');
    const adminResponse = await axios.post(`${baseUrl}/auth/login`, {
      email: 'admin@example.com',
      password: 'password123'
    });
    
    console.log('Admin login successful!');
    console.log('User data:');
    console.log(`ID: ${adminResponse.data.id}`);
    console.log(`Name: ${adminResponse.data.name}`);
    console.log(`Email: ${adminResponse.data.email}`);
    console.log(`Role: ${adminResponse.data.role}`);
    console.log(`Token: ${adminResponse.data.token.substring(0, 20)}...`);
    
    // Test regular user login
    console.log('\n2. Testing regular user login:');
    const userResponse = await axios.post(`${baseUrl}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('User login successful!');
    console.log('User data:');
    console.log(`ID: ${userResponse.data.id}`);
    console.log(`Name: ${userResponse.data.name}`);
    console.log(`Email: ${userResponse.data.email}`);
    console.log(`Role: ${userResponse.data.role}`);
    console.log(`Token: ${userResponse.data.token.substring(0, 20)}...`);
    
    // Test invalid login
    console.log('\n3. Testing invalid login:');
    try {
      await axios.post(`${baseUrl}/auth/login`, {
        email: 'wrong@example.com',
        password: 'wrongpassword'
      });
      console.log('Error: Login succeeded when it should fail!');
    } catch (error) {
      console.log('Invalid login correctly rejected!');
      console.log(`Status: ${error.response.status}`);
      console.log(`Message: ${error.response.data.message}`);
    }
    
    console.log('\nLogin testing completed successfully!');
    
  } catch (error) {
    console.error('Error during login test:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testLogin(); 