# PostgreSQL Setup for Fashion Store

This guide will help you set up PostgreSQL for your Fashion Store application, including local setup and deployment on Render.com.

## Local PostgreSQL Setup

1. Install PostgreSQL on your local machine from [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

2. Create a new database:
   ```sql
   CREATE DATABASE fashion_store;
   ```

3. Configure your environment variables in the `.env` file:
   ```
   # Set DB_TYPE to postgres
   DB_TYPE=postgres

   # PostgreSQL Configuration
   PG_HOST=localhost
   PG_USER=postgres
   PG_PASSWORD=your_password
   PG_DATABASE=fashion_store
   PG_PORT=5432
   PG_SSL=false
   ```

## Deployment on Render.com

### Step 1: Create a PostgreSQL Database on Render

1. Log in to your Render.com account
2. Go to the Dashboard and click on "New PostgreSQL"
3. Enter a name for your database (e.g., "fashion-store-db")
4. Select the appropriate region and plan
5. Click "Create Database"
6. Once created, Render will provide you with connection details

### Step 2: Configure Environment Variables

When deploying your backend to Render, configure the following environment variables:

```
NODE_ENV=production
DB_TYPE=postgres
PG_HOST=your-postgres-host.render.com
PG_USER=your_user
PG_PASSWORD=your_password
PG_DATABASE=your_database
PG_PORT=5432
PG_SSL=true
JWT_SECRET=your_secure_jwt_secret
```

### Step 3: Deploying Your Backend on Render

1. Go to your Render dashboard and click "New Web Service"
2. Connect your GitHub repository
3. Configure the following settings:
   - Name: fashion-store-backend
   - Environment: Node
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
4. Add the environment variables from Step 2
5. Click "Create Web Service"

## Database Migration

When switching from MySQL to PostgreSQL, you may need to migrate your data. Here are some approaches:

1. **Use Sequelize Migrations**: 
   ```
   npx sequelize-cli migration:generate --name migrate-data
   ```

2. **Export/Import Data**:
   - Export MySQL data to CSV files
   - Import the CSV files into PostgreSQL

3. **Use a Data Migration Tool** like [pgloader](https://github.com/dimitri/pgloader)

## Troubleshooting

- **SSL Issues**: If you encounter SSL connection problems, make sure `PG_SSL=true` is set for Render deployment
- **Connection Timeouts**: Check your network settings and firewall configurations
- **Table Name Case Sensitivity**: PostgreSQL converts identifiers to lowercase unless quoted, which may cause issues if your MySQL schema used camelCase

For more assistance, check Render's documentation at [https://render.com/docs/databases](https://render.com/docs/databases) 