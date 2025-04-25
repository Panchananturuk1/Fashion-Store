@echo off
echo ==============================================
echo Preparing Angular application for Render deployment
echo ==============================================

echo 1. Installing dependencies...
call npm install

echo 2. Building production version...
call npm run build

echo 3. Preparing artifacts...
if not exist "dist\render" mkdir "dist\render"
copy "dist\fashion-store\*" "dist\render\" /Y

echo ==============================================
echo Build completed! 
echo ==============================================
echo.
echo Your application is ready for deployment to Render.
echo To deploy:
echo 1. Log in to your Render account at https://render.com
echo 2. Create a new static site
echo 3. Connect your repository
echo 4. Set the following configuration:
echo    - Build Command: cd frontend ^&^& npm install ^&^& npm run build
echo    - Publish Directory: frontend/dist/fashion-store
echo 5. Set environment variables if needed (RENDER_API_URL)
echo 6. Click "Create Static Site"
echo.
echo Your site will be live in a few minutes after deployment completes! 