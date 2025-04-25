const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');
const { protect } = require('../middleware/authMiddleware');

// Create a new order
router.post('/', protect, async (req, res) => {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const { 
      firstName, lastName, email, phone, 
      address, city, state, zipCode, 
      paymentMethod, paymentDetails, items, total 
    } = req.body;
    
    const userId = req.user.id;
    
    // Start transaction
    await connection.beginTransaction();
    
    // Insert order
    const [orderResult] = await connection.execute(
      'INSERT INTO orders (user_id, total, status, payment_method, first_name, last_name, email, phone, address, city, state, zip_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, total, 'pending', paymentMethod, firstName, lastName, email, phone, address, city, state, zipCode]
    );
    
    const orderId = orderResult.insertId;
    
    // Insert order items
    for (const item of items) {
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, name, price, quantity, size, color, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [orderId, item.product.id, item.product.name, item.product.price, item.quantity, item.size, item.color, item.product.imageUrl]
      );
    }
    
    // Store payment details if provided
    if (paymentDetails) {
      let paymentInfo = JSON.stringify(paymentDetails);
      
      await connection.execute(
        'INSERT INTO payment_details (order_id, payment_method, payment_info) VALUES (?, ?, ?)',
        [orderId, paymentMethod, paymentInfo]
      );
    }
    
    // Commit transaction
    await connection.commit();
    
    res.status(201).json({ 
      id: orderId,
      message: 'Order created successfully'
    });
  } catch (error) {
    // Rollback transaction on error
    if (connection) await connection.rollback();
    
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  } finally {
    if (connection) connection.end();
  }
});

// Get all orders for a user
router.get('/', protect, async (req, res) => {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    const userId = req.user.id;
    
    const [orders] = await connection.execute(
      'SELECT id, user_id, total, status, payment_method, created_at, first_name, last_name, email, phone, address, city, state, zip_code FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  } finally {
    if (connection) connection.end();
  }
});

// Get specific order with items
router.get('/:id', protect, async (req, res) => {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    const orderId = req.params.id;
    const userId = req.user.id;
    
    // Get order details
    const [orders] = await connection.execute(
      'SELECT id, user_id, total, status, payment_method, created_at, first_name, last_name, email, phone, address, city, state, zip_code FROM orders WHERE id = ? AND user_id = ?',
      [orderId, userId]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = orders[0];
    
    // Get order items
    const [items] = await connection.execute(
      'SELECT product_id, name, price, quantity, size, color, image_url FROM order_items WHERE order_id = ?',
      [orderId]
    );
    
    // Get payment details
    const [paymentDetails] = await connection.execute(
      'SELECT payment_method, payment_info FROM payment_details WHERE order_id = ?',
      [orderId]
    );
    
    order.items = items;
    
    if (paymentDetails.length > 0) {
      order.payment = {
        method: paymentDetails[0].payment_method,
        details: JSON.parse(paymentDetails[0].payment_info)
      };
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  } finally {
    if (connection) connection.end();
  }
});

module.exports = router; 