# Start Fashion Store backend with PostgreSQL
Write-Host "Starting Fashion Store backend with PostgreSQL..."

# Kill any running node processes on port 5003 (if any)
$processes = Get-NetTCPConnection -LocalPort 5003 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
foreach ($process in $processes) {
    Write-Host "Stopping process with PID: $process"
    Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
}

# Set environment variables
$env:DB_TYPE = "postgres"
$env:PORT = "5003"
$env:PG_HOST = "localhost"
$env:PG_USER = "postgres"
$env:PG_PASSWORD = "monu"
$env:PG_DATABASE = "fashion_store"
$env:PG_PORT = "5432"
$env:JWT_SECRET = "fashion-store-jwt-secret"

# Start the server
Write-Host "Starting server..."
node src/index.js

# Pause before exiting
Read-Host -Prompt "Press Enter to exit" 