# Simple script to test the API with Supabase

# =======================================
# IMPORTANT: REPLACE YOUR PASSWORD BELOW
# =======================================
$password = "Monumartinez@123" # <-- Replace this with your actual Supabase password

# Set environment variables for testing
$env:DB_TYPE = "supabase"
$env:PG_SSL = "true"
$env:NODE_ENV = "production" 
$env:PORT = "5003"  # Changed to 5003 to avoid conflicts

# Supabase connection string with your password
$env:SUPABASE_POSTGRES_URL = "postgresql://postgres.sxnqargkpoojafyshwrc:$password@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

# Safety check
if ($password -eq "YOUR_PASSWORD_HERE") {
    Write-Host "ERROR: You need to edit this script and replace 'YOUR_PASSWORD_HERE' with your actual Supabase password" -ForegroundColor Red
    Write-Host "Edit the file run-simple-test.ps1 and change line 6" -ForegroundColor Red
    exit
}

Write-Host "Starting API server on port 5003 with Supabase connection..." -ForegroundColor Green
Write-Host "Database Type: $env:DB_TYPE" -ForegroundColor Cyan
Write-Host "SSL Enabled: $env:PG_SSL" -ForegroundColor Cyan
Write-Host "Connection String: " -NoNewline -ForegroundColor Cyan
Write-Host ($env:SUPABASE_POSTGRES_URL -replace ":[^:]*@", ":****@") -ForegroundColor Cyan
Write-Host "Using Port: $env:PORT" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press CTRL+C to stop the server" -ForegroundColor Yellow

# Run the server
node src/index.js 