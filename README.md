# Global University Map

A modern, responsive web application that displays universities around the world on an interactive map. The app uses Google Sheets as a database and is designed to be hosted on GitHub Pages.

## 🌟 Features

- **Interactive World Map**: View university locations on Google Maps
- **Search & Filter**: Search by university name, city, or country
- **Real-time Statistics**: See total universities, countries, and regions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Google Sheets Integration**: Easy to update data without coding
- **Modern UI**: Beautiful, intuitive interface with smooth animations

## 🚀 Quick Start

### Option 1: Use Sample Data (No Setup Required)

1. Clone this repository
2. Open `index.html` in your browser
3. The app will work with sample data immediately

### Option 2: Connect to Google Sheets

1. Follow the [Google Sheets Setup Guide](google-sheets-setup.md)
2. Update the configuration in `script.js`
3. Deploy to GitHub Pages

## 📁 Project Structure

```
hds_map/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
├── google-sheets-setup.md  # Setup guide for Google Sheets
└── README.md           # This file
```

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Maps**: Google Maps JavaScript API
- **Database**: Google Sheets API
- **Styling**: Custom CSS with modern design principles
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)

## 🎨 Features in Detail

### Interactive Map
- Custom map markers for each university
- Click markers to see university details
- Reset view and toggle clustering options
- Smooth zoom and pan interactions

### Search & Filter
- Real-time search across university names, cities, and countries
- Filter by country and university type (Public/Private)
- Instant results with debounced search

### University List
- Sidebar list of all universities
- Click to center map on selected university
- Sort by various criteria
- Responsive design that adapts to screen size

### Statistics Dashboard
- Real-time counts of universities, countries, and regions
- Updates automatically when filters are applied
- Beautiful animated cards

### Modal Details
- Detailed view of each university
- Complete information including website links
- Responsive modal design

## 🔧 Configuration

### Google Sheets Setup

The app can use Google Sheets as a database. The required columns are:

| Column | Description | Example |
|--------|-------------|---------|
| Name | University name | Harvard University |
| Country | Country name | United States |
| City | City name | Cambridge |
| Latitude | Geographic latitude | 42.3744 |
| Longitude | Geographic longitude | -71.1169 |
| Type | University type | Private |
| Founded | Year founded | 1636 |
| Website | University website | https://www.harvard.edu |
| Description | Brief description | Harvard University is a private Ivy League... |

### API Keys Required

1. **Google Maps API Key**: For map functionality
2. **Google Sheets API Key**: For database access (optional)

## 🚀 Deployment

### GitHub Pages

1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Select source branch (usually `main`)
4. Your app will be available at `https://username.github.io/repository-name`

### Other Hosting Options

- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your GitHub repository
- **Any static hosting service**

## 📱 Responsive Design

The app is fully responsive and works on:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (320px - 767px)

## 🎯 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔒 Security Considerations

- API keys should be restricted to specific domains
- Google Sheets should be public for the app to work
- Monitor API usage to avoid unexpected costs

## �� Customization

### Adding More Universities

Simply add new rows to your Google Sheet with the same format. The app will automatically load all data.

### Styling Changes

Modify `styles.css` to customize:
- Colors and themes
- Layout and spacing
- Animations and transitions
- Responsive breakpoints

### Functionality Extensions

The modular JavaScript code makes it easy to add:
- Additional filters
- New map features
- Export functionality
- User accounts

## 🐛 Troubleshooting

### Common Issues

1. **Map not loading**: Check Google Maps API key
2. **No data showing**: Verify Google Sheets configuration
3. **CORS errors**: Ensure Google Sheet is public
4. **Mobile issues**: Check responsive design breakpoints

### Debug Mode

Open browser developer tools (F12) to see:
- Console errors and warnings
- Network requests
- JavaScript debugging information

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section
2. Review the Google Sheets setup guide
3. Open an issue on GitHub

---

**Built with ❤️ for the global education community**