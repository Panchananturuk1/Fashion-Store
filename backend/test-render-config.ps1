# Test Render Configuration Locally
# This script sets up the environment variables similar to Render deployment
# and runs the server to test it

Write-Host "Testing Fashion Store backend with Render configuration..." -ForegroundColor Green

# Kill any existing process using port 10000
Write-Host "Checking for processes on port 10000..." -ForegroundColor Yellow
$processes = Get-NetTCPConnection -LocalPort 10000 -ErrorAction SilentlyContinue | 
             Select-Object -ExpandProperty OwningProcess -ErrorAction SilentlyContinue

if ($processes) {
    foreach ($process in $processes) {
        Write-Host "Stopping process with PID: $process"
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
    }
    Write-Host "All processes on port 10000 have been terminated." -ForegroundColor Green
} else {
    Write-Host "No processes found using port 10000." -ForegroundColor Cyan
}

# Set environment variables for PostgreSQL (same as would be on Render)
Write-Host "Setting environment variables for Render configuration..." -ForegroundColor Yellow
$env:DB_TYPE = "postgres"
$env:PORT = "10000"
$env:PG_HOST = "localhost"
$env:PG_USER = "postgres"
$env:PG_PASSWORD = "monu"
$env:PG_DATABASE = "fashion_store"
$env:PG_PORT = "5432"
$env:JWT_SECRET = "fashion-store-jwt-secret"

# Check if the database exists and setup if needed
Write-Host "Checking database setup..." -ForegroundColor Yellow
try {
    # You might want to run the database setup script here
    # For example:
    # node src/utils/rebuildProductsTable.js
    
    Write-Host "Database check complete." -ForegroundColor Green
}
catch {
    Write-Host "Database check failed: $_" -ForegroundColor Red
    Write-Host "You may need to manually set up the database before continuing." -ForegroundColor Red
    
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

# Start the server
Write-Host "Starting server with Render configuration..." -ForegroundColor Green
Write-Host "The server will be available at: http://localhost:10000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Cyan

# Run the server
node src/index.js 