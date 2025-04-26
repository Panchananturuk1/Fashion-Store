# Script to test the API endpoints

$apiBase = "http://localhost:5003"

Write-Host "Testing Fashion Store API with Supabase PostgreSQL" -ForegroundColor Cyan
Write-Host "--------------------------------------------------" -ForegroundColor Cyan
Write-Host ""

# Function to test an endpoint
function Test-Endpoint {
    param (
        [string]$endpoint,
        [string]$description
    )
    
    Write-Host "Testing: $description..." -NoNewline
    
    try {
        $result = Invoke-RestMethod -Uri "$apiBase$endpoint" -Method Get -ErrorAction Stop
        Write-Host " SUCCESS!" -ForegroundColor Green
        return $result
    }
    catch {
        Write-Host " FAILED!" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Test Endpoints
Write-Host "1. Testing base API endpoint" -ForegroundColor Yellow
$baseResult = Test-Endpoint -endpoint "/" -description "Base API endpoint"
if ($baseResult) {
    Write-Host "   Response: $baseResult" -ForegroundColor Gray
}

Write-Host ""
Write-Host "2. Testing products endpoint" -ForegroundColor Yellow
$productsResult = Test-Endpoint -endpoint "/api/products" -description "Products endpoint"
if ($productsResult) {
    Write-Host "   Found $(($productsResult | Measure-Object).Count) products" -ForegroundColor Gray
    foreach ($product in $productsResult) {
        Write-Host "   - $($product.name) - $$($product.price)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "3. Testing specific product" -ForegroundColor Yellow
$productResult = Test-Endpoint -endpoint "/api/products/1" -description "Single product endpoint"
if ($productResult) {
    Write-Host "   Product: $($productResult.name)" -ForegroundColor Gray
    Write-Host "   Description: $($productResult.description)" -ForegroundColor Gray
    Write-Host "   Price: $$($productResult.price)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "API Testing Complete" -ForegroundColor Cyan
Write-Host "--------------------------------------------------" -ForegroundColor Cyan 