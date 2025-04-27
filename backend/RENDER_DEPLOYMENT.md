# Render Deployment with Supabase Integration

This guide provides step-by-step instructions for deploying the Fashion Store backend to Render with Supabase as the database.

## 1. Prerequisites

- A Supabase account and project (already set up)
- A Render account
- This repository set up with Git

## 2. Supabase Configuration

Ensure your Supabase project has the following settings:

1. Make sure PostgreSQL is properly configured in your Supabase project
2. Note your connection string: `postgresql://postgres.[ref-id]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres`
3. Note your Supabase URL and anon key from your project settings

## 3. Setting Up Render

### 3.1 Create a Web Service

1. Log in to your Render account and go to the Dashboard
2. Click on "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `fashion-store-backend` (or your preferred name)
   - **Root Directory**: `backend` (if your backend is in a subdirectory)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start`

### 3.2 Configure Environment Variables

Add the following environment variables in the Render dashboard:

```
DB_TYPE=supabase
PG_SSL=true
NODE_ENV=production
SUPABASE_POSTGRES_URL=postgresql://postgres.sxnqargkpoojafyshwrc:Monumartinez@123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
SUPABASE_URL=https://sxnqargkpoojafyshwrc.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4bnFhcmdrcG9vamFmeXNod3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NDYxNzksImV4cCI6MjA2MTIyMjE3OX0.QW47Gjhc_oHmxGjlGw2nvF5GTkYhCoy93ZqeT2GmLHY
JWT_SECRET=HTZ2elD7PcYhXbNHUKdNqX8LZcSZlu0PHgzDiUAqdc21bNpINcEL23K2A7M2MKQKQpi539mJAm7AtAARVI3/4Q==
```

> **Note**: For security, use Render's secret environment variables for sensitive information.

## 4. Database Initialization

You have two options to initialize your database:

### Option 1: One-time Setup Job

Create a one-time job in Render:

1. Go to your Render dashboard and click "New" > "Background Job"
2. Configure the job:
   - **Name**: `fashion-store-db-init`
   - **Root Directory**: `backend` (same as your web service)
   - **Build Command**: `npm install`
   - **Start Command**: `npm run supabase:init`
   - **Schedule**: One-time job
3. Set the same environment variables as your web service (see section 3.2)
4. Create and run the job

### Option 2: Initialize from Your Local Machine

If you prefer to initialize from your local environment:

1. Clone the repository to your local machine
2. Navigate to the backend directory
3. Create a `.env` file with the same environment variables listed above
4. Run the initialization command:
   ```bash
   npm run supabase:init
   ```

## 5. Verify Deployment

After deploying, check that everything is working correctly:

1. Open your web service URL in a browser
2. You should see the message "E-commerce API is running..."
3. Test an API endpoint, for example:
   ```
   GET https://your-render-service.onrender.com/api/products
   ```
4. Check the Render logs for any database connection issues

## 6. Changing Database Configuration

If you need to change the database configuration later:

1. Update the environment variables in the Render dashboard
2. Restart your web service

## 7. Troubleshooting

If you encounter issues:

1. **Database Connection Errors**:
   - Check that your Supabase connection string is correct
   - Ensure SSL is enabled with `PG_SSL=true`
   - Verify your Supabase project is active

2. **Missing Tables**:
   - Run the database initialization job again
   - Check the Supabase SQL editor to verify table creation

3. **Application Errors**:
   - Check the Render logs for detailed error messages
   - Verify all environment variables are set correctly

## 8. Auto-Deploy with Git

Render automatically deploys when you push changes to your repository. To ensure smooth deployments:

1. Always test changes locally before pushing
2. Use environment-specific configuration to avoid breaking the production environment
3. Check Render logs after each deployment 