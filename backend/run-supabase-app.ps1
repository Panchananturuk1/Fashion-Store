# PowerShell script to run the application with Supabase

# Set the DB_TYPE environment variable to use Supabase
$env:DB_TYPE = "supabase"

# Run the main application
node src/index.js

# Display completion message
Write-Host "Application stopped" -ForegroundColor Yellow 