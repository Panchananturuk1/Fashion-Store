# Supabase Integration with Render

This document explains how to configure your Fashion Store application to use Supabase as the database when deployed on Render.

## Required Environment Variables

Add the following environment variables to your Render service:

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_TYPE` | Database type | `supabase` |
| `PG_SSL` | Enable SSL for PostgreSQL | `true` |
| `NODE_ENV` | Node environment | `production` |
| `SUPABASE_POSTGRES_URL` | Supabase PostgreSQL connection string | `postgresql://postgres.sxnqargkpoojafyshwrc:YOUR_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:5432/postgres` |
| `SUPABASE_URL` | Supabase project URL | `https://sxnqargkpoojafyshwrc.supabase.co` |
| `SUPABASE_KEY` | Supabase API key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `JWT_SECRET` | Secret for JWT token signing | `your-secret-key` |

## Setting Up on Render

1. **Create a Web Service on Render**
   - Connect your GitHub repository
   - Set your build command: `npm install && node render-setup.js`
   - Set your start command: `npm start` or `node src/index.js`

2. **Add Environment Variables**
   - Go to the "Environment" tab in your Render service
   - Add all the required variables listed above
   - Use the "Secret Files" feature for sensitive credentials if needed

3. **IP Whitelisting (if required)**
   - If you've restricted access to your Supabase database, add Render's IP addresses to the allowlist
   - Render IP addresses can be found in their documentation

## Local Development

For local development, you can use the `.env` file with the same variables:

```
DB_TYPE=supabase
PG_SSL=true
NODE_ENV=development
SUPABASE_POSTGRES_URL=postgresql://postgres.sxnqargkpoojafyshwrc:YOUR_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
SUPABASE_URL=https://sxnqargkpoojafyshwrc.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your-local-secret-key
```

## Troubleshooting

If you encounter issues with the Supabase connection on Render:

1. Verify all environment variables are set correctly
2. Run the verification script manually: `node render-setup.js`
3. Check Render logs for error messages
4. Ensure the Supabase project is active and the database is online
5. Verify your IP whitelist settings in Supabase (if applicable)
6. Check if your password contains special characters that need URL encoding

## Security Notes

- Never commit your Supabase password or API keys to your repository
- Use environment variables for all sensitive information
- Consider using Render's Secret Files feature for additional security
- Rotate your JWT_SECRET periodically for enhanced security 