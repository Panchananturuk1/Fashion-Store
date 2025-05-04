# PowerShell script to restart the server by closing any process using port 5001
Write-Host "Finding processes using port 5001..."

# Find the process using port 5001
$processInfo = netstat -ano | findstr :5001

if ($processInfo) {
    # Extract the PID (using a different variable name to avoid the reserved $pid)
    $processPID = ($processInfo -split '\s+')[-1]
    
    Write-Host "Process using port 5001 found with PID: $processPID"
    Write-Host "Terminating process..."
    
    # Kill the process
    taskkill /PID $processPID /F
    
    Write-Host "Process terminated."
} else {
    Write-Host "No process found using port 5001."
}

# Start the server
Write-Host "Starting server with Supabase configuration..."
node start-supabase.js 