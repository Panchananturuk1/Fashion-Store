# Integrating Supabase with Render

This guide explains how to integrate your Supabase PostgreSQL database with Render deployment.

## Overview

Instead of using Render's internal PostgreSQL database (ecommerce_r8fr), this setup uses Supabase as the database backend. This allows you to:

1. Manage your database through Supabase's dashboard
2. Use Supabase's additional features (auth, storage, etc.)
3. Have your database running independently from your Render deployment

## Setup Steps

### 1. Update Render Environment Variables

In your Render dashboard, go to your service and update the environment variables:

```
DB_TYPE=supabase
PG_SSL=true
NODE_ENV=production
SUPABASE_POSTGRES_URL=postgresql://postgres.sxnqargkpoojafyshwrc:Monumartinez@123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
SUPABASE_URL=https://sxnqargkpoojafyshwrc.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4bnFhcmdrcG9vamFmeXNod3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NDYxNzksImV4cCI6MjA2MTIyMjE3OX0.QW47Gjhc_oHmxGjlGw2nvF5GTkYhCoy93ZqeT2GmLHY
JWT_SECRET=HTZ2elD7PcYhXbNHUKdNqX8LZcSZlu0PHgzDiUAqdc21bNpINcEL23K2A7M2MKQKQpi539mJAm7AtAARVI3/4Q==
```

### 2. Initialize the Database

You have two options to initialize your Supabase database:

#### Option 1: Run the setup script locally

Run the setup script from your local machine:

```bash
# Set environment variables first
export DB_TYPE=supabase
export PG_SSL=true
export SUPABASE_POSTGRES_URL=postgresql://postgres.sxnqargkpoojafyshwrc:Monumartinez@123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres

# Run the script
node setup-supabase-tables.js
```

#### Option 2: Use the Render dashboard

Add a one-time job in Render to initialize your database:

1. Create a new "Background Job" in Render
2. Set the build command: `npm install`
3. Set the start command: `node setup-supabase-tables.js`
4. Add the same environment variables as your main service
5. Run the job

### 3. Verify the Setup

After setting up, you can verify that everything is working by:

1. Running the test script:
   ```bash
   node setup-supabase-render.js
   ```

2. Checking your Supabase dashboard to see the created tables

## Troubleshooting

If you encounter any issues:

1. Verify your Supabase connection string is correct
2. Make sure SSL is enabled (`PG_SSL=true`)
3. Check that your Supabase project is on the correct plan with available connections
4. Check Render logs for any database connection errors

## Notes

- The password in the connection string should be URL-encoded if it contains special characters
- For security, consider using Render's environment variable secrets for storing sensitive values
- If you need to reset your database, you can run the `setup-supabase-tables.js` script again

## Additional Configuration

For more advanced configurations:

1. You can modify the `database.js` file to change SSL settings or connection parameters
2. Edit the models in the setup script if you need different table structures
3. Create custom migrations if you need to update the schema without recreating all tables 