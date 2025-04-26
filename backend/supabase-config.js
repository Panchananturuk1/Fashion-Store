// Supabase configuration for Fashion Store

// Supabase project credentials
const SUPABASE_URL = 'https://sxnqargkpoojafyshwrc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4bnFhcmdrcG9vamFmeXNod3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NDYxNzksImV4cCI6MjA2MTIyMjE3OX0.QW47Gjhc_oHmxGjlGw2nvF5GTkYhCoy93ZqeT2GmLHY';

// Connection string (replace YOUR_PASSWORD with your actual Supabase database password)
// Using the session pooler connection string
const SUPABASE_POSTGRES_URL = 'postgresql://postgres.sxnqargkpoojafyshwrc:YOUR_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:5432/postgres';

// Export the configuration
module.exports = {
  SUPABASE_URL,
  SUPABASE_KEY,
  SUPABASE_POSTGRES_URL
}; 