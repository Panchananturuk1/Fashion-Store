#!/bin/bash
# Simple build script for Render

# Install dependencies (using ci for more reliable builds)
npm ci 

# Build the Angular app
npx ng build --configuration production

# Verify the build output
echo "Build completed. Contents of dist directory:"
ls -la dist/

echo "Done!" 