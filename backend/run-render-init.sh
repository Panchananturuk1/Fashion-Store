#!/bin/bash

# Replace this with your actual Render PostgreSQL URL
export DATABASE_URL="postgresql://postgres:your_password@your-db-host.render.com:5432/fashion_store"

# Run the initialization script
node render-init.js

# Display completion message
echo -e "\e[32mScript execution complete\e[0m" 