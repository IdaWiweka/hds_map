// Global variables
let map;
let markers = [];
let infoWindows = [];
let universities = [];
let filteredUniversities = [];
let markerClusterer;
let isClustered = true;

// Google Sheets configuration
const GOOGLE_SHEETS_CONFIG = {
    // Replace with your Google Sheets ID
    SHEET_ID: 'YOUR_GOOGLE_SHEETS_ID',
    // Replace with your Google Sheets API key
    API_KEY: 'YOUR_GOOGLE_SHEETS_API_KEY',
    // Sheet name (default is 'Sheet1')
    SHEET_NAME: 'Universities'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    setupEventListeners();
    loadUniversities();
});

// Initialize Google Maps
function initializeMap() {
    const mapOptions = {
        center: { lat: 20, lng: 0 },
        zoom: 2,
        styles: [
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
            },
            {
                featureType: 'landscape',
                elementType: 'geometry',
                stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.fill',
                stylers: [{ color: '#ffffff' }, { lightness: 17 }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#ffffff' }, { lightness: 29 }, { weight: 0.2 }]
            }
        ]
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    searchInput.addEventListener('input', debounce(handleSearch, 300));
    searchBtn.addEventListener('click', handleSearch);

    // Filters
    document.getElementById('countryFilter').addEventListener('change', handleFilters);
    document.getElementById('typeFilter').addEventListener('change', handleFilters);

    // Map controls
    document.getElementById('resetView').addEventListener('click', resetMapView);
    document.getElementById('toggleClusters').addEventListener('click', toggleClustering);

    // List controls
    document.getElementById('sortBtn').addEventListener('click', showSortOptions);
    document.getElementById('toggleList').addEventListener('click', toggleList);

    // Modal
    const modal = document.getElementById('universityModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Load universities from Google Sheets
async function loadUniversities() {
    showLoading(true);
    
    try {
        // For demo purposes, using sample data
        // In production, replace this with actual Google Sheets API call
        universities = await getSampleData();
        
        // Populate filters
        populateFilters();
        
        // Display universities
        filteredUniversities = [...universities];
        displayUniversities();
        updateStats();
        
        showLoading(false);
    } catch (error) {
        console.error('Error loading universities:', error);
        showLoading(false);
        showError('Failed to load universities. Please try again.');
    }
}

// Get sample data (replace with actual Google Sheets API call)
async function getSampleData() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
        {
            name: 'Harvard University',
            country: 'United States',
            city: 'Cambridge',
            latitude: 42.3744,
            longitude: -71.1169,
            type: 'Private',
            founded: 1636,
            website: 'https://www.harvard.edu',
            description: 'Harvard University is a private Ivy League research university in Cambridge, Massachusetts.'
        },
        {
            name: 'University of Oxford',
            country: 'United Kingdom',
            city: 'Oxford',
            latitude: 51.7520,
            longitude: -1.2577,
            type: 'Public',
            founded: 1096,
            website: 'https://www.ox.ac.uk',
            description: 'The University of Oxford is a collegiate research university in Oxford, England.'
        },
        {
            name: 'Stanford University',
            country: 'United States',
            city: 'Stanford',
            latitude: 37.4275,
            longitude: -122.1697,
            type: 'Private',
            founded: 1885,
            website: 'https://www.stanford.edu',
            description: 'Stanford University is a private research university in Stanford, California.'
        },
        {
            name: 'University of Cambridge',
            country: 'United Kingdom',
            city: 'Cambridge',
            latitude: 52.2053,
            longitude: 0.1218,
            type: 'Public',
            founded: 1209,
            website: 'https://www.cam.ac.uk',
            description: 'The University of Cambridge is a collegiate research university in Cambridge, United Kingdom.'
        },
        {
            name: 'MIT',
            country: 'United States',
            city: 'Cambridge',
            latitude: 42.3601,
            longitude: -71.0942,
            type: 'Private',
            founded: 1861,
            website: 'https://www.mit.edu',
            description: 'The Massachusetts Institute of Technology is a private research university in Cambridge, Massachusetts.'
        },
        {
            name: 'University of Tokyo',
            country: 'Japan',
            city: 'Tokyo',
            latitude: 35.7127,
            longitude: 139.7620,
            type: 'Public',
            founded: 1877,
            website: 'https://www.u-tokyo.ac.jp',
            description: 'The University of Tokyo is a public research university located in Tokyo, Japan.'
        },
        {
            name: 'ETH Zurich',
            country: 'Switzerland',
            city: 'Zurich',
            latitude: 47.3769,
            longitude: 8.5417,
            type: 'Public',
            founded: 1855,
            website: 'https://www.ethz.ch',
            description: 'ETH Zurich is a public research university in the city of Zürich, Switzerland.'
        },
        {
            name: 'University of Toronto',
            country: 'Canada',
            city: 'Toronto',
            latitude: 43.6629,
            longitude: -79.3957,
            type: 'Public',
            founded: 1827,
            website: 'https://www.utoronto.ca',
            description: 'The University of Toronto is a public research university in Toronto, Ontario, Canada.'
        }
    ];
}

// Google Sheets API function (for production use)
async function fetchFromGoogleSheets() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.SHEET_NAME}?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.values) {
        throw new Error('No data found in Google Sheets');
    }
    
    // Assuming first row contains headers
    const headers = data.values[0];
    const rows = data.values.slice(1);
    
    return rows.map(row => {
        const university = {};
        headers.forEach((header, index) => {
            university[header.toLowerCase().replace(/\s+/g, '_')] = row[index] || '';
        });
        return university;
    });
}

// Display universities on map and list
function displayUniversities() {
    clearMarkers();
    displayMapMarkers();
    displayUniversityList();
}

// Display markers on map
function displayMapMarkers() {
    filteredUniversities.forEach((university, index) => {
        const marker = new google.maps.Marker({
            position: { lat: parseFloat(university.latitude), lng: parseFloat(university.longitude) },
            map: map,
            title: university.name,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#667eea" stroke="white" stroke-width="2"/>
                        <path d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z" fill="white"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(24, 24),
                anchor: new google.maps.Point(12, 12)
            }
        });

        const infoWindow = new google.maps.InfoWindow({
            content: createInfoWindowContent(university)
        });

        marker.addListener('click', () => {
            infoWindows.forEach(iw => iw.close());
            infoWindow.open(map, marker);
        });

        markers.push(marker);
        infoWindows.push(infoWindow);
    });

    // Add clustering
    if (isClustered) {
        markerClusterer = new MarkerClusterer(map, markers, {
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        });
    }
}

// Create info window content
function createInfoWindowContent(university) {
    return `
        <div style="padding: 10px; max-width: 250px;">
            <h3 style="margin: 0 0 10px 0; color: #333;">${university.name}</h3>
            <p style="margin: 5px 0; color: #666;">
                <strong>Location:</strong> ${university.city}, ${university.country}
            </p>
            <p style="margin: 5px 0; color: #666;">
                <strong>Type:</strong> ${university.type}
            </p>
            <p style="margin: 5px 0; color: #666;">
                <strong>Founded:</strong> ${university.founded}
            </p>
            <button onclick="showUniversityDetails('${university.name}')" 
                    style="background: #667eea; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                View Details
            </button>
        </div>
    `;
}

// Display university list
function displayUniversityList() {
    const listContainer = document.getElementById('universityList');
    listContainer.innerHTML = '';

    filteredUniversities.forEach(university => {
        const item = document.createElement('div');
        item.className = 'university-item';
        item.innerHTML = `
            <div class="university-name">${university.name}</div>
            <div class="university-location">${university.city}, ${university.country}</div>
            <div class="university-type">${university.type}</div>
        `;
        
        item.addEventListener('click', () => {
            showUniversityDetails(university.name);
            // Center map on university
            map.setCenter({ lat: parseFloat(university.latitude), lng: parseFloat(university.longitude) });
            map.setZoom(12);
        });
        
        listContainer.appendChild(item);
    });
}

// Show university details in modal
function showUniversityDetails(universityName) {
    const university = universities.find(u => u.name === universityName);
    if (!university) return;

    const modal = document.getElementById('universityModal');
    const modalContent = document.getElementById('modalContent');

    modalContent.innerHTML = `
        <div class="university-details">
            <h2>${university.name}</h2>
            <div class="detail-item">
                <div class="detail-label">Location</div>
                <div class="detail-value">${university.city}, ${university.country}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Type</div>
                <div class="detail-value">${university.type}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Founded</div>
                <div class="detail-value">${university.founded}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Website</div>
                <div class="detail-value">
                    <a href="${university.website}" target="_blank">${university.website}</a>
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Description</div>
                <div class="detail-value">${university.description}</div>
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

// Handle search
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredUniversities = universities.filter(university => 
        university.name.toLowerCase().includes(searchTerm) ||
        university.city.toLowerCase().includes(searchTerm) ||
        university.country.toLowerCase().includes(searchTerm)
    );
    
    displayUniversities();
    updateStats();
}

// Handle filters
function handleFilters() {
    const countryFilter = document.getElementById('countryFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    
    filteredUniversities = universities.filter(university => {
        const countryMatch = !countryFilter || university.country === countryFilter;
        const typeMatch = !typeFilter || university.type === typeFilter;
        return countryMatch && typeMatch;
    });
    
    displayUniversities();
    updateStats();
}

// Populate filters
function populateFilters() {
    const countries = [...new Set(universities.map(u => u.country))].sort();
    const countryFilter = document.getElementById('countryFilter');
    
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryFilter.appendChild(option);
    });
}

// Update statistics
function updateStats() {
    document.getElementById('totalUniversities').textContent = filteredUniversities.length;
    
    const countries = new Set(filteredUniversities.map(u => u.country));
    document.getElementById('totalCountries').textContent = countries.size;
    
    const regions = new Set(filteredUniversities.map(u => u.city));
    document.getElementById('totalRegions').textContent = regions.size;
}

// Map controls
function resetMapView() {
    map.setCenter({ lat: 20, lng: 0 });
    map.setZoom(2);
}

function toggleClustering() {
    isClustered = !isClustered;
    
    if (isClustered) {
        markerClusterer = new MarkerClusterer(map, markers, {
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        });
    } else {
        if (markerClusterer) {
            markerClusterer.clearMarkers();
        }
    }
}

// List controls
function showSortOptions() {
    const sortOptions = ['Name', 'Country', 'City', 'Type', 'Founded'];
    const sortBy = prompt(`Sort by: ${sortOptions.join(', ')}`);
    
    if (sortBy && sortOptions.includes(sortBy)) {
        const sortKey = sortBy.toLowerCase().replace(/\s+/g, '_');
        filteredUniversities.sort((a, b) => {
            if (sortKey === 'founded') {
                return a[sortKey] - b[sortKey];
            }
            return a[sortKey].localeCompare(b[sortKey]);
        });
        displayUniversities();
    }
}

function toggleList() {
    const list = document.querySelector('.university-list');
    list.style.display = list.style.display === 'none' ? 'flex' : 'none';
}

// Utility functions
function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    infoWindows = [];
    
    if (markerClusterer) {
        markerClusterer.clearMarkers();
    }
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = show ? 'flex' : 'none';
}

function showError(message) {
    alert(message); // In production, use a better error display
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Make functions globally available for HTML onclick handlers
window.showUniversityDetails = showUniversityDetails; 