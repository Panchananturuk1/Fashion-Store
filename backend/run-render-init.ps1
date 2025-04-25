# PowerShell script to run render-init.js with DATABASE_URL

# Your actual Render PostgreSQL URL
$env:DATABASE_URL = "postgresql://root:8sIEDzISyEu2abVDLuIo2kXb2KNwCGei@dpg-d05rqvidbo4c73906vm0-a.oregon-postgres.render.com/ecommerce_r8fr"

# Run the initialization script
node render-init.js

# Display completion message
Write-Host "Script execution complete" -ForegroundColor Green 