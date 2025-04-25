@echo off
echo Building Angular application for Render deployment...

:: Install dependencies
call npm install

:: Build for production
call npm run build

echo.
echo Build completed successfully!
echo Your static site has been built to ./dist/fashion-store 