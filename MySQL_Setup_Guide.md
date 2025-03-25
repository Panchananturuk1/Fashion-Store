# Manual MySQL Database Setup Guide

If you prefer to set up the database manually using MySQL Workbench or MySQL command line, follow these instructions.

## Prerequisites
- MySQL Server installed
- MySQL Workbench (optional, but recommended for easier setup)

## Step 1: Create Database

First, create a database named `ecommerce`:

```sql
CREATE DATABASE IF NOT EXISTS ecommerce;
```

## Step 2: Create Product Table

Connect to the `ecommerce` database and execute the following SQL to create the `products` table:

```sql
USE ecommerce;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  subCategory VARCHAR(50),
  imageUrl VARCHAR(255),
  size JSON,
  color JSON,
  inStock BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3, 1) DEFAULT 0,
  numReviews INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Step 3: Insert Sample Products (Optional)

You can manually insert sample products or use the API endpoint `/api/products/create-dummy` after starting the backend.

Here's an example of how to insert a product manually:

```sql
INSERT INTO products (
  name, 
  description, 
  price, 
  category, 
  subCategory, 
  imageUrl, 
  size, 
  color, 
  inStock, 
  featured, 
  rating, 
  numReviews
) VALUES (
  'Classic Fit Dress Shirt',
  'A comfortable and stylish dress shirt for formal occasions.',
  49.99,
  'men',
  'shirts',
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
  '["S", "M", "L", "XL"]',
  '["White", "Blue", "Black"]',
  true,
  true,
  4.5,
  28
);
```

## Step 4: Configure Environment Variables

Make sure your `.env` file in the backend directory contains the correct MySQL connection information:

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ecommerce
DB_USER=root
DB_PASSWORD=your_password
```

Replace `your_password` with your actual MySQL password.

## Step 5: Start the Backend

After setting up the database, you can start the backend server:

```
cd backend
npm start
```

The server will connect to your MySQL database and start serving the API endpoints. 