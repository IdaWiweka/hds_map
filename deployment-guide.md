# GitHub Pages Deployment Guide

This guide will walk you through deploying your University Map web app to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your computer
- Your web app files ready

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., `university-map`)
5. Make it public (required for free GitHub Pages)
6. Don't initialize with README (we already have one)
7. Click "Create repository"

## Step 2: Upload Your Files

### Option A: Using Git (Recommended)

1. Open terminal/command prompt
2. Navigate to your project folder:
   ```bash
   cd path/to/your/hds_map
   ```

3. Initialize Git repository:
   ```bash
   git init
   ```

4. Add all files:
   ```bash
   git add .
   ```

5. Commit the files:
   ```bash
   git commit -m "Initial commit: University Map web app"
   ```

6. Add your GitHub repository as remote:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```

7. Push to GitHub:
   ```bash
   git branch -M main
   git push -u origin main
   ```

### Option B: Using GitHub Web Interface

1. Go to your repository on GitHub
2. Click "uploading an existing file"
3. Drag and drop all your files:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`
   - `google-sheets-setup.md`
   - `deployment-guide.md`
4. Add a commit message
5. Click "Commit changes"

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section (in the left sidebar)
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch
6. Select "/ (root)" folder
7. Click "Save"

## Step 4: Wait for Deployment

- GitHub Pages will automatically build and deploy your site
- This usually takes 1-5 minutes
- You'll see a green checkmark when it's ready
- Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

## Step 5: Configure API Keys (If Using Google Sheets)

If you're using Google Sheets as your database:

1. Get your Google Maps API key (see [Google Sheets Setup Guide](google-sheets-setup.md))
2. Edit `index.html` and replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual key
3. Edit `script.js` and update the `GOOGLE_SHEETS_CONFIG` object
4. Commit and push the changes:
   ```bash
   git add .
   git commit -m "Add API keys"
   git push
   ```

## Step 6: Test Your Deployment

1. Visit your GitHub Pages URL
2. Test all features:
   - Map loading
   - Search functionality
   - Filters
   - University details
   - Responsive design

## Custom Domain (Optional)

If you want to use a custom domain:

1. In your repository Settings > Pages
2. Enter your domain in the "Custom domain" field
3. Click "Save"
4. Add a CNAME file to your repository with your domain
5. Configure DNS with your domain provider

## Troubleshooting

### Common Issues

1. **Page not found (404)**
   - Make sure `index.html` is in the root directory
   - Check that GitHub Pages is enabled
   - Wait a few minutes for deployment

2. **Map not loading**
   - Verify Google Maps API key is correct
   - Check browser console for errors
   - Ensure API key has proper permissions

3. **Data not loading**
   - Verify Google Sheets configuration
   - Check that Google Sheet is public
   - Review browser console for CORS errors

4. **Styling issues**
   - Clear browser cache
   - Check that all CSS files are uploaded
   - Verify file paths are correct

### Debug Steps

1. Open browser developer tools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Verify all files are accessible

## Updating Your Site

To update your site:

1. Make changes to your local files
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update description"
   git push
   ```
3. GitHub Pages will automatically redeploy

## Performance Tips

1. **Optimize images**: Use compressed images
2. **Minimize API calls**: Cache data when possible
3. **Use CDN**: External libraries are already using CDNs
4. **Enable compression**: GitHub Pages handles this automatically

## Security Best Practices

1. **API Key Restrictions**: Restrict API keys to your domain
2. **HTTPS**: GitHub Pages provides SSL automatically
3. **Regular Updates**: Keep dependencies updated
4. **Monitor Usage**: Check API usage regularly

## Alternative Hosting Options

If GitHub Pages doesn't meet your needs:

### Netlify
1. Go to [Netlify](https://netlify.com)
2. Drag and drop your project folder
3. Get instant deployment

### Vercel
1. Go to [Vercel](https://vercel.com)
2. Connect your GitHub repository
3. Automatic deployments on push

### Firebase Hosting
1. Use Firebase CLI
2. Deploy with `firebase deploy`

## Support

If you encounter issues:

1. Check GitHub Pages documentation
2. Review the troubleshooting section
3. Check GitHub status page
4. Ask for help in GitHub discussions

---

**Your University Map is now live on the web! 🌍** 