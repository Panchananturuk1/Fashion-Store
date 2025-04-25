#!/bin/bash

# Install dependencies
npm install

# Build for production
npm run build

# Create a simple web server to serve the static files if needed
# This is only used if you need to test the build locally before deploying
# npm install -g serve

echo "Build completed successfully!"
echo "Your static site has been built to ./dist/fashion-store" 