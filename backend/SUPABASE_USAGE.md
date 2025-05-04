# Using Fashion Store with Supabase

This document provides instructions for running the Fashion Store application with Supabase as the database.

## Starting the Backend Server

The backend server has been configured to use Supabase as the database. To start the backend:

```
cd backend
node start-supabase.js
```

Alternatively, you can use the PowerShell script to automatically kill any process using port 5001 and then start the server:

```
cd backend
powershell -ExecutionPolicy Bypass -File .\restart-supabase-server.ps1
```

## Starting the Frontend

The frontend is configured to connect to the local backend server. To start the frontend:

```
cd frontend
npm start
```

The frontend will be available at http://localhost:4200.

## Configuration Files

- `env.template`: Contains the Supabase configuration settings
- `start-supabase.js`: Script to start the server with Supabase settings
- `restart-supabase-server.ps1`: PowerShell script to restart the server

## Troubleshooting

If you encounter issues with adding products:

1. Make sure the frontend is configured to connect to the correct backend URL in `frontend/src/environments/environment.ts`
2. Ensure the backend is using the Supabase configuration by starting it with `start-supabase.js`
3. Check the browser console and backend server logs for any error messages 