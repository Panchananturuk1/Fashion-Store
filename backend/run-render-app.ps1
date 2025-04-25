# PowerShell script to run the application with Render database

# Your actual Render PostgreSQL URL
$env:DATABASE_URL = "postgresql://root:8sIEDzISyEu2abVDLuIo2kXb2KNwCGei@dpg-d05rqvidbo4c73906vm0-a.oregon-postgres.render.com/ecommerce_r8fr"

# Run the application with Render settings
node render-start.js

# Display completion message
Write-Host "Application stopped" -ForegroundColor Yellow 