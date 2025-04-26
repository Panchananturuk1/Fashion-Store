# Setting Up Render PostgreSQL Database

This guide will walk you through setting up your Render PostgreSQL database with tables and sample data.

## Prerequisites

1. You need to have a Render PostgreSQL database created in your Render account
2. You need the connection string (External Database URL) from Render

## Steps to Initialize the Database

1. **Get your Render PostgreSQL connection string**:
   - In the Render dashboard, go to your PostgreSQL database
   - Find the "Connection" tab and copy the "External Database URL"
   - It should look like: `postgresql://postgres:abcdefg123456@us-west-pg-12345.render.com:5432/your_database`

2. **Update the .env.render file**:
   - Open the `.env.render` file in the `backend` directory
   - Replace the sample DATABASE_URL with your actual Render connection string
   - Save the file

3. **Run the initialization script**:
   ```
   cd backend
   npm run render-init
   ```

4. **What the script does**:
   - Connects to your Render PostgreSQL database
   - Creates all necessary tables (users, products, orders, orderItems)
   - Adds sample data including:
     - Admin user (admin@example.com / admin123)
     - 6 sample products (men's and women's clothing items)

5. **Verify the setup**:
   - You can check if the data was loaded by using Render's database GUI
   - Or by starting your application with:
     ```
     npm run render-start
     ```

## Troubleshooting

If you encounter issues:

1. **Connection errors**:
   - Make sure your DATABASE_URL is correct
   - Ensure your IP is allowed in Render's IP allowlist

2. **SSL errors**:
   - The script should handle SSL automatically
   - If you get SSL errors, make sure `PG_SSL=true` is set correctly

3. **Permission errors**:
   - Make sure your database user has CREATE and ALTER privileges

## What to Do Next

After initializing your database:

1. Start your application connected to Render:
   ```
   npm run render-start
   ```

2. Test that you can:
   - Login with the admin user
   - Browse and view products
   - Create and manage orders 