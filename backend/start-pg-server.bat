@echo off
echo Starting Fashion Store backend with PostgreSQL...

:: Kill any running node processes on port 5003 (if any)
FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr :5003') DO (
  echo Stopping process with PID: %%P
  taskkill /PID %%P /F
)

:: Set environment variables
set DB_TYPE=postgres
set PORT=5003
set PG_HOST=localhost
set PG_USER=postgres
set PG_PASSWORD=monu
set PG_DATABASE=fashion_store
set PG_PORT=5432
set JWT_SECRET=fashion-store-jwt-secret

:: Start the server
echo Starting server...
node src/index.js

pause 