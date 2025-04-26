# PostgreSQL Setup Guide for Fashion Store

This guide will help you set up PostgreSQL correctly to run this application.

## 1. Install PostgreSQL

If you haven't installed PostgreSQL yet:
1. Download PostgreSQL from [the official website](https://www.postgresql.org/download/windows/)
2. During installation:
   - Remember the password you set for the `postgres` user
   - Keep the default port as 5432
   - Complete the installation

## 2. Update .env File

Create a `.env` file in the `backend` folder with these contents:

```
DB_TYPE=postgres
PG_USER=postgres
PG_PASSWORD=monu
PG_DATABASE=fashion_store
PG_HOST=localhost
PG_PORT=5432
PORT=5003
NODE_ENV=development
JWT_SECRET=fashionstore123
PG_SSL=false
```

**Important**: Update `PG_PASSWORD` to the password you set during PostgreSQL installation.

## 3. Create the Database

1. Open Command Prompt as Administrator
2. Connect to PostgreSQL:
   ```
   psql -U postgres
   ```
3. Enter your password when prompted
4. Create the database:
   ```
   CREATE DATABASE fashion_store;
   ```
5. Exit PostgreSQL:
   ```
   \q
   ```

## 4. Initialize the Database

In PowerShell, run:
```
cd backend
$env:PG_PASSWORD="your_password"; npm run init:pg
```

Replace "your_password" with your actual PostgreSQL password.

## 5. Start the Application

In PowerShell, run:
```
cd backend
$env:PG_PASSWORD="your_password"; npm run dev:pg
```

Replace "your_password" with your actual PostgreSQL password.

## Troubleshooting

1. **Password Authentication Failed**: Make sure you're using the correct PostgreSQL password in the command.

2. **PostgreSQL Service Not Running**: 
   - Open Services (Win+R, type `services.msc`, press Enter)
   - Find "PostgreSQL" service
   - Make sure it's running

3. **Port Conflict**: Ensure nothing else is using port 5432.

4. **Database Already Exists**: If you get an error that the database already exists, you can skip the database creation step.

5. **Can't Run Both Commands**: If you're having trouble with multiple commands in PowerShell, run them separately:
   ```
   cd backend
   $env:PG_PASSWORD="your_password"
   npm run init:pg
   npm run dev:pg
   ``` 