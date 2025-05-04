// Script to start the server with Supabase connection
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Set environment variables from template
const envTemplatePath = path.join(__dirname, 'env.template');
const envContent = fs.readFileSync(envTemplatePath, 'utf8');

// Parse environment variables
const envVars = {};
envContent.split('\n').forEach(line => {
  // Skip comments and empty lines
  if (line.startsWith('#') || !line.trim()) {
    return;
  }
  
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

console.log('Setting up environment for Supabase connection');
console.log(`DB_TYPE: ${envVars.DB_TYPE}`);

// Set environment variables
Object.assign(process.env, envVars);

// Path to the index.js file
const indexPath = path.join(__dirname, 'src', 'index.js');

console.log('Starting server with Supabase configuration...');

// Start the server with the environment variables
const server = spawn('node', [indexPath], {
  env: process.env,
  stdio: 'inherit'
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});

// Handle server exit
server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
}); 