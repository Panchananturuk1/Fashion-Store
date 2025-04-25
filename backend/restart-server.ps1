# Script to restart the server with PostgreSQL

Write-Host "Restarting Fashion Store backend with PostgreSQL..." -ForegroundColor Green

# Kill any existing process using port 5003
Write-Host "Killing existing processes on port 5003..." -ForegroundColor Yellow
$processes = Get-NetTCPConnection -LocalPort 5003 -ErrorAction SilentlyContinue | 
             Select-Object -ExpandProperty OwningProcess -ErrorAction SilentlyContinue

if ($processes) {
    foreach ($process in $processes) {
        Write-Host "Stopping process with PID: $process"
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
    }
    Write-Host "All processes on port 5003 have been terminated." -ForegroundColor Green
} else {
    Write-Host "No processes found using port 5003." -ForegroundColor Cyan
}

# Rebuild the products table
Write-Host "Rebuilding products table..." -ForegroundColor Yellow
node src/utils/rebuildProductsTable.js

# Set PostgreSQL environment variables
Write-Host "Setting environment variables for PostgreSQL..." -ForegroundColor Yellow
$env:DB_TYPE = "postgres"
$env:PORT = "5003"
$env:PG_HOST = "localhost"
$env:PG_USER = "postgres"
$env:PG_PASSWORD = "monu"
$env:PG_DATABASE = "fashion_store"
$env:PG_PORT = "5432"
$env:JWT_SECRET = "fashion-store-jwt-secret"

# Wait a bit to ensure ports are released
Start-Sleep -Seconds 2

# Start the server
Write-Host "Starting server with PostgreSQL configuration..." -ForegroundColor Green
node src/index.js

# Pause at the end
Read-Host -Prompt "Press Enter to exit" 