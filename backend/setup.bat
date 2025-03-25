@echo off
echo Installing dependencies...
call npm install

echo Creating database...
node src/database/initDb.js

echo.
echo Setup completed successfully!
echo Don't forget to update your .env file with your MySQL credentials.
echo To start the server, run: npm start
pause 