# PowerShell script to run Supabase initialization securely

# Prompt for the Supabase database password
$password = Read-Host "Enter your Supabase database password" -AsSecureString
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)

# Create connection string with the password
$connectionString = "postgresql://postgres.sxnqargkpoojafyshwrc:$plainPassword@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

# Set environment variables
$env:DB_TYPE = "supabase"
$env:SUPABASE_POSTGRES_URL = $connectionString
$env:PG_SSL = "true"
$env:NODE_ENV = "production"

# Display connection details (masked)
Write-Host "Database Type: $env:DB_TYPE"
Write-Host "Connection String: " -NoNewline
Write-Host ($connectionString -replace ":[^:]*@", ":****@")
Write-Host "SSL Enabled: $env:PG_SSL"

# Install required package if not already installed
npm install @supabase/supabase-js

# Run the initialization script
node supabase-init.js

# Clear the sensitive environment variables
$env:SUPABASE_POSTGRES_URL = $null

# Display completion message
Write-Host "Script execution complete" -ForegroundColor Green 