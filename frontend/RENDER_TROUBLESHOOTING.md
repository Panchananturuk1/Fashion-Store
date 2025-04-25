# Render Deployment Troubleshooting

If you're encountering issues deploying your Angular application to Render, follow this troubleshooting guide.

## Common Issues and Solutions

### Build Failures

**Issue: Angular CLI Build Errors**
```
Error with the Angular CLI during build process
```

**Solutions:**
1. **Simplify your build process**:
   - Use a direct build command: `npx ng build --configuration production`
   - Avoid complex webpack configurations initially

2. **Check Node.js version compatibility**:
   - Ensure your Node.js version on Render matches what's in your package.json
   - Angular 16 works best with Node.js 16.x, 18.x

3. **Clear dependency caches**:
   - Use `npm ci` instead of `npm install` for more reliable builds
   - Add a "clean install" step before building

### Static Site Configuration

**Issue: Files not found / 404 errors after deployment**

**Solutions:**
1. **Check your publish directory**:
   - Ensure `staticPublishPath` is correctly set to `dist/fashion-store`
   - Verify the output path in angular.json matches this

2. **Set up routing properly**:
   - Add a `_redirects` file with `/* /index.html 200`
   - Configure rewrite rules in render.yaml

### API Connection Issues

**Issue: Frontend can't connect to backend API**

**Solutions:**
1. **Update environment.prod.ts**:
   - Hardcode your backend API URL in the production environment
   - Example: `apiUrl: 'https://your-specific-backend.onrender.com/api'`

2. **Check CORS settings** on your backend:
   - Ensure your backend allows requests from your frontend's domain
   - Add your frontend URL to the allowed origins

## Debugging Tips

1. **Check build logs** in the Render dashboard
2. **Test locally** before deploying:
   ```
   npm run build --configuration production
   ```
3. **Look for specific error messages** in the build output
4. **Temporarily simplify** your application to isolate issues

## Trying a Manual Deployment

If the automated build continues to fail, try these steps:

1. Build locally:
   ```
   npm run build --configuration production
   ```

2. Deploy using Render's manual deploy option:
   - Build locally
   - Zip the dist/fashion-store directory
   - Upload manually through Render dashboard

## Getting Help

If you continue experiencing issues:
1. Check Render's documentation: [https://render.com/docs](https://render.com/docs)
2. Search the Render community forums
3. Contact Render support with your specific error logs 