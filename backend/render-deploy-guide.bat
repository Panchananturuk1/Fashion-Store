@echo off
REM ======================================================================
REM FASHION STORE BACKEND - RENDER DEPLOYMENT GUIDE
REM ======================================================================
REM This file contains all the information needed to deploy the backend
REM to Render.com successfully.
REM
REM Note: This is meant as a reference guide, not to be executed directly.
REM ======================================================================

echo.
echo ====== RENDER DEPLOYMENT CONFIGURATION GUIDE ======
echo.
echo GENERAL SETTINGS:
echo -----------------
echo Service Type:     Web Service
echo Name:             fashion-store-api
echo Root Directory:   ./backend
echo Runtime:          Node
echo Plan:             Free (or paid for production)
echo.
echo BUILD SETTINGS:
echo --------------
echo Build Command:    npm install
echo Start Command:    node src/index.js
echo.
echo ENVIRONMENT VARIABLES:
echo ---------------------
echo DB_TYPE=postgres
echo PORT=10000
echo PG_HOST=[Your Render PostgreSQL Host or External DB Host]
echo PG_USER=[Your PostgreSQL Username]
echo PG_PASSWORD=[Your PostgreSQL Password]
echo PG_DATABASE=fashion_store
echo PG_PORT=5432
echo PG_SSL=true
echo JWT_SECRET=[Your Secret Key for JWT]
echo.
echo DATABASE SETUP:
echo -------------
echo 1. Create a PostgreSQL database in Render or use external
echo 2. Use the connection information in your ENV variables
echo 3. Run initial database setup (products table creation)
echo.
echo DEPLOYMENT NOTES:
echo ---------------
echo 1. Free tier services spin down after inactivity
echo 2. Initial requests may be slow due to cold starts
echo 3. Your app will be available at: https://fashion-store-api.onrender.com
echo    (URL depends on the service name you choose)
echo.
echo TESTING LOCALLY WITH RENDER CONFIGURATION:
echo ----------------------------------------
echo You can test your app with the same config locally with:
echo.
echo set DB_TYPE=postgres
echo set PORT=10000
echo set PG_HOST=localhost
echo set PG_USER=postgres
echo set PG_PASSWORD=monu
echo set PG_DATABASE=fashion_store
echo set PG_PORT=5432
echo set JWT_SECRET=fashion-store-jwt-secret
echo.
echo node src/index.js
echo.
echo ======================================================
echo.
echo This is a guide file. Do not execute directly.
echo To use these settings locally, copy the commands manually.
echo.
pause 