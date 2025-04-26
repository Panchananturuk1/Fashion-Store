# Script to create tables in Supabase database using direct SQL

# =======================================
# IMPORTANT: REPLACE YOUR PASSWORD BELOW
# =======================================
$password = "Monumartinez@123" # <-- Replace this with your actual Supabase password

# Set environment variables for connecting to the database
$env:PGPASSWORD = $password
$pgHost = "aws-0-ap-south-1.pooler.supabase.com"
$pgPort = "5432"
$pgUser = "postgres.sxnqargkpoojafyshwrc"
$pgDatabase = "postgres"

# Safety check
if ($password -eq "YOUR_PASSWORD_HERE") {
    Write-Host "ERROR: You need to edit this script and replace 'YOUR_PASSWORD_HERE' with your actual Supabase password" -ForegroundColor Red
    Write-Host "Edit the file create-supabase-tables.ps1 and change line 6" -ForegroundColor Red
    exit
}

Write-Host "Creating tables in Supabase database..." -ForegroundColor Green
Write-Host "Host: $pgHost" -ForegroundColor Cyan
Write-Host "Database: $pgDatabase" -ForegroundColor Cyan
Write-Host "User: $pgUser" -ForegroundColor Cyan
Write-Host ""

# Download psql if needed
$psqlPath = ".\psql.exe"
if (-not (Test-Path $psqlPath)) {
    Write-Host "psql not found. Downloading PostgreSQL client..." -ForegroundColor Yellow
    $zipPath = ".\pgsql.zip"
    Invoke-WebRequest -Uri "https://sbp.enterprisedb.com/getfile.jsp?fileid=1258245" -OutFile $zipPath
    Expand-Archive -Path $zipPath -DestinationPath ".\pgsql" -Force
    $psqlPath = ".\pgsql\bin\psql.exe"
    Remove-Item $zipPath
}

# Create products table SQL
$createProductsTable = @"
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    "subCategory" VARCHAR(100) NOT NULL,
    "imageUrl" VARCHAR(255) NOT NULL,
    size JSONB NOT NULL,
    color JSONB NOT NULL,
    "inStock" BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    rating FLOAT DEFAULT 0,
    "numReviews" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
"@

# Insert sample products SQL
$insertProducts = @"
INSERT INTO products (name, description, price, category, "subCategory", "imageUrl", size, color, "inStock", featured, rating, "numReviews")
VALUES 
    ('Classic Blue Jeans', 'A comfortable pair of classic blue jeans for everyday wear.', 59.99, 'men', 'pants', 'https://example.com/images/classic-jeans.jpg', 
     '["28", "30", "32", "34", "36"]', '["Blue", "Dark Blue"]', TRUE, TRUE, 4.5, 120),
    
    ('Summer Floral Dress', 'A light and elegant floral dress perfect for summer.', 49.99, 'women', 'dresses', 'https://example.com/images/floral-dress.jpg', 
     '["XS", "S", "M", "L", "XL"]', '["White", "Blue", "Pink"]', TRUE, TRUE, 4.8, 95),
    
    ('Cotton T-Shirt Pack', 'Pack of 3 essential cotton t-shirts in different colors.', 29.99, 'men', 'shirts', 'https://example.com/images/tshirt-pack.jpg', 
     '["S", "M", "L", "XL", "XXL"]', '["Black", "White", "Gray"]', TRUE, FALSE, 4.2, 210),
    
    ('Leather Jacket', 'Premium quality leather jacket with a modern fit.', 199.99, 'men', 'jackets', 'https://example.com/images/leather-jacket.jpg', 
     '["S", "M", "L", "XL"]', '["Black", "Brown"]', TRUE, TRUE, 4.7, 68),
    
    ('High Waist Skirt', 'Elegant high waist skirt suitable for office and casual wear.', 39.99, 'women', 'skirts', 'https://example.com/images/highwaist-skirt.jpg', 
     '["XS", "S", "M", "L"]', '["Black", "Navy", "Beige"]', TRUE, FALSE, 4.4, 52),
    
    ('Slim Fit Chinos', 'Smart casual slim fit chinos for a versatile wardrobe.', 44.99, 'men', 'pants', 'https://example.com/images/slim-chinos.jpg', 
     '["28", "30", "32", "34", "36"]', '["Khaki", "Navy", "Olive"]', TRUE, FALSE, 4.3, 88)
ON CONFLICT (id) DO NOTHING;
"@

# Create temp SQL file
$sqlFile = "create-tables.sql"
$createProductsTable | Out-File -FilePath $sqlFile -Encoding utf8
$insertProducts | Out-File -FilePath $sqlFile -Encoding utf8 -Append

# Execute SQL using psql (if psql is installed)
if (Get-Command "psql" -ErrorAction SilentlyContinue) {
    Write-Host "Executing SQL commands using installed psql..." -ForegroundColor Green
    $command = "psql -h $pgHost -p $pgPort -U $pgUser -d $pgDatabase -f $sqlFile"
    Invoke-Expression $command
} else {
    Write-Host "psql command not found. Please install PostgreSQL client or run the following SQL commands manually:" -ForegroundColor Yellow
    Get-Content -Path $sqlFile
}

# Clean up
Remove-Item $sqlFile -Force

Write-Host "Database setup complete!" -ForegroundColor Green
Write-Host "Run .\run-simple-test.ps1 to start the API server and test it with the new tables." -ForegroundColor Cyan 