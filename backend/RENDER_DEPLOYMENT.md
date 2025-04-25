# Deploying to Render

This guide will walk you through deploying the Fashion Store backend to Render.com.

## Prerequisites

- A [Render](https://render.com) account
- Your code pushed to a Git repository (GitHub, GitLab, etc.)

## Manual Deployment

### Step 1: Create a Web Service

1. Log in to your Render dashboard
2. Click **New** → **Web Service**
3. Connect your Git repository
4. Configure the service:
   - **Name**: `fashion-store-api` (or your preferred name)
   - **Root Directory**: `./backend` (if your backend is in a subdirectory)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`
   - **Plan**: Free (or choose a paid plan for production)

### Step 2: Set Environment Variables

Add the following environment variables in the Render dashboard:

```
DB_TYPE=postgres
PORT=10000
PG_HOST=[Your PostgreSQL Host]
PG_USER=[Your PostgreSQL Username]
PG_PASSWORD=[Your PostgreSQL Password]
PG_DATABASE=fashion_store
PG_PORT=5432
PG_SSL=true
JWT_SECRET=[Your Secret Key for JWT]
NODE_ENV=production
```

### Step 3: Create a Database

1. Click **New** → **PostgreSQL**
2. Configure your database:
   - **Name**: `fashion-store-db` (or your preferred name)
   - **Database**: `fashion_store`
   - **User**: Render will create one for you
   - **Plan**: Free (or choose a paid plan for production)
3. Once created, get the connection details from the dashboard
4. Update your environment variables with these connection details

### Step 4: Initialize the Database

After deployment, you'll need to set up your database tables. You can do this in several ways:

1. **One-time script**: Connect to your Render service via SSH and run `node src/utils/rebuildProductsTable.js`
2. **Scheduled job**: Create a one-time job in Render to run this script
3. **Manual setup**: Use a PostgreSQL client to connect to your database and run the SQL commands

## Blueprint Deployment (One-Click)

For easier deployment, we've included a `render.yaml` file in the repository root. This allows for one-click deployment:

1. Fork this repository
2. In your Render dashboard, go to **Blueprints**
3. Click **New Blueprint Instance**
4. Connect to your forked repository
5. Render will automatically set up the web service, database, and initialization job

## Testing Locally with Render Configuration

To test your application with the same configuration as Render:

1. Run the included PowerShell script:
   ```
   ./test-render-config.ps1
   ```

2. This script will:
   - Set up the environment variables
   - Check for database connectivity
   - Start the server on port 10000

## Troubleshooting

- **Connection Issues**: Make sure your database connection strings are correct
- **Cold Starts**: Free tier services spin down after inactivity, so the first request may be slow
- **Logs**: Check the Render logs for any error messages
- **Database Setup**: Ensure your database tables are properly created

## Additional Resources

- [Render Node.js Documentation](https://render.com/docs/deploy-node-express-app)
- [Render PostgreSQL Documentation](https://render.com/docs/databases) 