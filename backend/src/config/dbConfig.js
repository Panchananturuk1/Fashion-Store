require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'monu',
  database: process.env.DB_NAME || 'fashion_store',
  port: parseInt(process.env.DB_PORT || '3306'),
  connectionLimit: 10
};

module.exports = dbConfig; 