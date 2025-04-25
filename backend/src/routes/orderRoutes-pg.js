const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/sequelize');
const { protect } = require('../middleware/authMiddleware');
const { QueryTypes } = require('sequelize');

// Create a new order
router.post('/', protect, async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { 
      firstName, lastName, email, phone, 
      address, city, state, zipCode, 
      paymentMethod, paymentDetails, items, total 
    } = req.body;
    
    const userId = req.user.id;
    
    // Insert order using Sequelize
    const [orderResults] = await sequelize.query(
      `INSERT INTO orders 
      (user_id, total, status, payment_method, first_name, last_name, email, phone, address, city, state, zip_code) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
      {
        replacements: [userId, total, 'pending', paymentMethod, firstName, lastName, email, phone, address, city, state, zipCode],
        type: QueryTypes.INSERT,
        transaction
      }
    );
    
    // Get the order ID from the result
    const orderId = orderResults[0].id;
    
    // Insert order items
    for (const item of items) {
      await sequelize.query(
        `INSERT INTO order_items 
        (order_id, product_id, name, price, quantity, size, color, image_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: [orderId, item.product.id, item.product.name, item.product.price, item.quantity, item.size, item.color, item.product.imageUrl],
          type: QueryTypes.INSERT,
          transaction
        }
      );
    }
    
    // Store payment details if provided
    if (paymentDetails) {
      let paymentInfo = JSON.stringify(paymentDetails);
      
      await sequelize.query(
        `INSERT INTO payment_details 
        (order_id, payment_method, payment_info) 
        VALUES (?, ?, ?)`,
        {
          replacements: [orderId, paymentMethod, paymentInfo],
          type: QueryTypes.INSERT,
          transaction
        }
      );
    }
    
    // Commit transaction
    await transaction.commit();
    
    res.status(201).json({ 
      id: orderId,
      message: 'Order created successfully'
    });
  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

// Get all orders for a user
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const orders = await sequelize.query(
      `SELECT id, user_id, total, status, payment_method, created_at, 
      first_name, last_name, email, phone, address, city, state, zip_code 
      FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      {
        replacements: [userId],
        type: QueryTypes.SELECT
      }
    );
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Get specific order with items
router.get('/:id', protect, async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    
    // Get order details
    const orders = await sequelize.query(
      `SELECT id, user_id, total, status, payment_method, created_at, 
      first_name, last_name, email, phone, address, city, state, zip_code 
      FROM orders WHERE id = ? AND user_id = ?`,
      {
        replacements: [orderId, userId],
        type: QueryTypes.SELECT
      }
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = orders[0];
    
    // Get order items
    const items = await sequelize.query(
      `SELECT product_id, name, price, quantity, size, color, image_url 
      FROM order_items WHERE order_id = ?`,
      {
        replacements: [orderId],
        type: QueryTypes.SELECT
      }
    );
    
    // Get payment details
    const paymentDetails = await sequelize.query(
      `SELECT payment_method, payment_info 
      FROM payment_details WHERE order_id = ?`,
      {
        replacements: [orderId],
        type: QueryTypes.SELECT
      }
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
  }
});

module.exports = router; 