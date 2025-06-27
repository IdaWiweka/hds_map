# Troubleshooting Google Sheets Integration

## Common Issues and Solutions

### 1. CORS Issues
**Problem**: Browser blocks API calls due to CORS policy
**Solution**: 
- Use the provided `server.py` to run a local server
- Run: `python server.py`
- Access your app at: `http://localhost:8000`

### 2. Google Sheets API Key Issues
**Problem**: API key is invalid or restricted
**Solution**:
- Check if your API key is correct in `script.js`
- Ensure Google Sheets API is enabled in Google Cloud Console
- Verify API key has proper permissions

### 3. Sheet ID Issues
**Problem**: Wrong sheet ID or sheet name
**Solution**:
- Verify the sheet ID in your Google Sheets URL
- Check if the sheet name matches exactly (case-sensitive)
- Ensure the sheet is publicly accessible or shared properly

### 4. Data Format Issues
**Problem**: Data not displaying correctly
**Solution**:
- Ensure your Google Sheet has headers in the first row
- Required columns: Name, Country, City, Latitude, Longitude, Type, Founded, Website, Description
- Check browser console for detailed error messages

## Debugging Steps

1. **Open Browser Console** (F12)
2. **Check for Errors**: Look for red error messages
3. **Check Network Tab**: See if API calls are being made
4. **Verify Configuration**: Check your sheet ID and API key
5. **Test API Directly**: Try the API URL in your browser

## Testing Your Setup

1. **Test API URL**: 
   ```
   https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/Universities?key=YOUR_API_KEY
   ```

2. **Expected Response**: Should return JSON with your data

3. **Check Console Logs**: The app now logs detailed information about the API calls

## Quick Fixes

- **Refresh Button**: Use the new refresh button to reload data
- **Fallback Data**: If Google Sheets fails, the app will use sample data
- **Error Messages**: Check the browser console for specific error details

## Still Having Issues?

1. Check the browser console for specific error messages
2. Verify your Google Sheets setup matches the guide in `google-sheets-setup.md`
3. Ensure your API key has the correct permissions
4. Try the local server to avoid CORS issues 