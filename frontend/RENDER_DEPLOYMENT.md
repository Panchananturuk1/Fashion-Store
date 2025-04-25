# Deploying to Render

This document outlines the steps to deploy the frontend Angular application to Render.

## Prerequisites

- A Render account (https://render.com)
- Git repository with your code pushed
- Node.js 18.19.0 (as specified in package.json)

## Deployment Steps

### Option 1: Using Render Dashboard (Recommended for first deployment)

1. Log in to your Render account
2. Click "New" and select "Static Site"
3. Connect your Git repository
4. Fill in the following details:
   - **Name**: fashion-store-frontend
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist/fashion-store`
5. Under "Advanced" settings, add the following redirect/rewrite rule:
   - Source: `/*`
   - Destination: `/index.html`
   - Status: `200`
6. Add environment variables (if needed):
   - `RENDER_API_URL`: URL of your backend API (e.g., `https://fashion-store-backend.onrender.com/api`)
7. Click "Create Static Site"

### Option 2: Using render.yaml (For CI/CD and infrastructure as code)

1. Ensure the `render.yaml` file is in your repository root
2. Connect your Git repository to Render through the Render Dashboard
3. Render will automatically detect the yaml file and use its configuration
4. Your site will be deployed according to the configuration in the yaml file

## Checking for API Configuration

Before deploying, make sure your API URL is properly configured:

1. Check `frontend/src/environments/environment.prod.ts` to ensure it uses the correct backend URL
2. The file should use `process.env['RENDER_API_URL']` to get the URL from environment variables
3. If you've already deployed your backend to Render, update the fallback URL to match your backend's URL

## Deploying Both Frontend and Backend

If you want to deploy both your frontend and backend to Render:

1. Deploy your backend first (as a Web Service)
2. Note the URL of your deployed backend (e.g., `https://fashion-store-backend.onrender.com`)
3. When deploying your frontend, add the environment variable:
   - `RENDER_API_URL`: Set to `https://fashion-store-backend.onrender.com/api`

## Testing the Build Locally

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Run the build script:
   - On Windows: `deploy-to-render.bat` or `build-render.bat`
   - On Unix/Mac: `./build-render.sh` (make sure it's executable first)

3. The site will be built to the `dist/fashion-store` directory

## Environment Variables

Your frontend needs the backend API URL, which you should set in the Render Dashboard:

1. `RENDER_API_URL`: The URL of your backend API (e.g., `https://fashion-store-backend.onrender.com/api`)

## Troubleshooting

1. If you encounter routing issues:
   - Ensure the `_redirects` file is correctly included in the build
   - Check that the rewrite rule is properly set up in Render

2. If API calls fail:
   - Verify the `RENDER_API_URL` environment variable is correctly set
   - Check that CORS is properly configured on your backend
   - Ensure your backend is deployed and running

3. If the build fails:
   - Check the build logs in Render Dashboard for specific errors
   - Verify that the Node.js version matches the one specified in your package.json (18.19.0)
   - Ensure all dependencies are properly installed

## After Deployment

After successful deployment, you should:

1. Test your application thoroughly
2. Set up a custom domain if needed (through Render's dashboard)
3. Configure HTTPS (Render provides this automatically)
4. Consider setting up monitoring for your application 