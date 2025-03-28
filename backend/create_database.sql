-- Create database
CREATE DATABASE IF NOT EXISTS ecommerce;

-- Use the database
USE ecommerce;

-- Create products table with default timestamps
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

-- Insert sample products only if the table is empty
INSERT INTO products (
  name, description, price, category, subCategory, imageUrl, 
  size, color, inStock, featured, rating, numReviews
)
SELECT * FROM (
  SELECT
    'Classic Fit Dress Shirt' as name,
    'A comfortable and stylish dress shirt for formal occasions.' as description,
    49.99 as price,
    'men' as category,
    'shirts' as subCategory,
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c' as imageUrl,
    '["S", "M", "L", "XL"]' as size,
    '["White", "Blue", "Black"]' as color,
    true as inStock,
    true as featured,
    4.5 as rating,
    28 as numReviews
  UNION ALL
  SELECT
    'Slim Fit Jeans',
    'Modern slim fit jeans with stretch comfort.',
    59.99,
    'men',
    'pants',
    'https://images.unsplash.com/photo-1542272604-787c3835535d',
    '["30", "32", "34", "36"]',
    '["Blue", "Black", "Gray"]',
    true,
    true,
    4.2,
    42
  UNION ALL
  SELECT
    'Casual Hooded Sweatshirt',
    'Comfortable hooded sweatshirt for everyday wear.',
    39.99,
    'men',
    'hoodies',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
    '["S", "M", "L", "XL", "XXL"]',
    '["Gray", "Black", "Navy"]',
    true,
    false,
    4.0,
    35
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM products
);

-- Women's clothing
INSERT INTO products (
  name, description, price, category, subCategory, imageUrl, 
  size, color, inStock, featured, rating, numReviews
) VALUES 
(
  'High-Waisted Skinny Jeans',
  'Flattering high-waisted skinny jeans with stretch.',
  64.99,
  'women',
  'jeans',
  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246',
  '["24", "26", "28", "30", "32"]',
  '["Blue", "Black", "White"]',
  true,
  true,
  4.6,
  47
),
(
  'Floral Print Maxi Dress',
  'Elegant floral maxi dress for casual and semi-formal occasions.',
  79.99,
  'women',
  'dresses',
  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1',
  '["XS", "S", "M", "L"]',
  '["Floral Print", "Navy", "Red"]',
  true,
  true,
  4.8,
  32
),
(
  'Classic Blazer',
  'Tailored blazer to elevate any outfit.',
  99.99,
  'women',
  'blazers',
  'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f',
  '["XS", "S", "M", "L", "XL"]',
  '["Black", "Beige", "Navy"]',
  true,
  false,
  4.3,
  18
); 