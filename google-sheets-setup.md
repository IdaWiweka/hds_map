# Google Sheets Setup Guide

This guide will help you set up Google Sheets as the database for your University Map web app.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "University Database" or similar
4. Rename the first sheet to "Universities"

## Step 2: Set Up the Data Structure

In the first row (Row 1), add these headers:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Name | Country | City | Latitude | Longitude | Type | Founded | Website | Description |

## Step 3: Add Sample Data

Add some sample universities in the rows below:

| Name | Country | City | Latitude | Longitude | Type | Founded | Website | Description |
|------|---------|------|----------|-----------|------|---------|---------|-------------|
| Harvard University | United States | Cambridge | 42.3744 | -71.1169 | Private | 1636 | https://www.harvard.edu | Harvard University is a private Ivy League research university in Cambridge, Massachusetts. |
| University of Oxford | United Kingdom | Oxford | 51.7520 | -1.2577 | Public | 1096 | https://www.ox.ac.uk | The University of Oxford is a collegiate research university in Oxford, England. |
| Stanford University | United States | Stanford | 37.4275 | -122.1697 | Private | 1885 | https://www.stanford.edu | Stanford University is a private research university in Stanford, California. |
| University of Cambridge | United Kingdom | Cambridge | 52.2053 | 0.1218 | Public | 1209 | https://www.cam.ac.uk | The University of Cambridge is a collegiate research university in Cambridge, United Kingdom. |
| MIT | United States | Cambridge | 42.3601 | -71.0942 | Private | 1861 | https://www.mit.edu | The Massachusetts Institute of Technology is a private research university in Cambridge, Massachusetts. |

## Step 4: Get Your Google Sheets ID

1. Look at the URL of your Google Sheet
2. The ID is the long string between `/d/` and `/edit`
3. Example: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
4. The ID would be: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## Step 5: Enable Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

## Step 6: Create API Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key
4. (Optional) Restrict the API key to Google Sheets API only for security

## Step 7: Make Your Sheet Public

1. In your Google Sheet, click "Share" (top right)
2. Click "Change to anyone with the link"
3. Set permission to "Viewer"
4. Click "Done"

## Step 8: Update Your Web App

1. Open `script.js` in your web app
2. Find the `GOOGLE_SHEETS_CONFIG` object
3. Replace the placeholder values:

```javascript
const GOOGLE_SHEETS_CONFIG = {
    SHEET_ID: 'YOUR_ACTUAL_SHEET_ID_HERE',
    API_KEY: 'YOUR_ACTUAL_API_KEY_HERE',
    SHEET_NAME: 'Universities'
};
```

## Step 9: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Maps JavaScript API
3. Create an API key for Maps
4. Update the script tag in `index.html`:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_MAPS_API_KEY&libraries=places"></script>
```

## Step 10: Test Your Setup

1. Open your web app
2. Check the browser console for any errors
3. The universities should load from your Google Sheet

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your Google Sheet is public
2. **API Key Errors**: Verify your API key is correct and has proper permissions
3. **No Data**: Check that your sheet name matches exactly (case-sensitive)
4. **Wrong Coordinates**: Ensure latitude and longitude are valid numbers

### Data Format Requirements:

- **Latitude**: Must be between -90 and 90
- **Longitude**: Must be between -180 and 180
- **Founded**: Should be a year (number)
- **All other fields**: Can be text

### Adding More Universities:

Simply add new rows to your Google Sheet with the same format. The web app will automatically load all rows (except the header).

## Security Notes

- Keep your API keys secure
- Consider restricting API keys to specific domains
- Regularly monitor your API usage
- The Google Sheet should be public for the web app to work

## Cost Considerations

- Google Sheets API: Free for reasonable usage
- Google Maps API: Free tier available, then pay-per-use
- Monitor your usage in Google Cloud Console 