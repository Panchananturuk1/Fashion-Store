// This file is a proxy to redirect imports to sequelize.js
// This is needed for backward compatibility with existing code
const { sequelize, connectDB } = require('./sequelize');

// Export the same interface
module.exports = { sequelize, connectDB }; 