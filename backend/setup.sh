#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Create the database
echo "Creating database..."
node src/database/initDb.js

echo "Setup completed successfully!"
echo "Don't forget to update your .env file with your MySQL credentials."
echo "To start the server, run: npm start" 