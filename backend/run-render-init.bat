@echo off
REM Windows batch file to run render-init.js with DATABASE_URL

REM Replace this with your actual Render PostgreSQL URL
set DATABASE_URL=postgresql://postgres:your_password@your-db-host.render.com:5432/fashion_store

REM Run the initialization script
node render-init.js

REM Display completion message
echo Script execution complete
pause 