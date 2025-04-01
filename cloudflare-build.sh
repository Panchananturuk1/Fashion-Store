#!/bin/bash

# Go to the repository root
cd "$(dirname "$0")"

# Create wrangler.toml if it doesn't exist
if [ ! -f wrangler.toml ]; then
  echo "Creating wrangler.toml..."
  cat > wrangler.toml << EOF
[build]
command = "bash ./cloudflare-build.sh"
publish = "frontend/dist/fashion-store"

[build.environment]
NODE_VERSION = "18.19.0"
EOF
fi

# Fix frontend package.json to use correct Angular version
echo "Updating frontend package.json..."
cd frontend
cat > package.json << EOF
{
  "name": "ecommerce-frontend",
  "version": "0.0.0",
  "engines": {
    "node": "18.19.0"
  },
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build --configuration=production",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "^17.1.0",
    "@angular/common": "^17.1.0",
    "@angular/compiler": "^17.1.0",
    "@angular/core": "^17.1.0",
    "@angular/forms": "^17.1.0",
    "@angular/platform-browser": "^17.1.0",
    "@angular/platform-browser-dynamic": "^17.1.0",
    "@angular/router": "^17.1.0",
    "bootstrap": "^5.3.1",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.13.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^17.1.0",
    "@angular/cli": "^17.1.0",
    "@angular/compiler-cli": "^17.1.0",
    "@types/jasmine": "~4.3.0",
    "jasmine-core": "~4.6.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.1.0",
    "typescript": "~5.2.2"
  }
}
EOF

# Install dependencies and build
echo "Installing dependencies..."
npm install

echo "Building Angular app..."
npm run build

echo "Build completed" 