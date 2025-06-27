// Global variables
let map;
let markers = [];
let infoWindows = [];
let universities = [];
let filteredUniversities = [];
let markerClustererInstance;
let isClustered = true;

// Google Sheets configuration
const GOOGLE_SHEETS_CONFIG = {
    // Replace with your Google Sheets ID
    SHEET_ID: '1c4L79Iqlf8frj-8dxk2sBQT3bM0G-Uj3gE8HjR_rVOM',
    // Replace with your Google Sheets API key
    API_KEY: 'AIzaSyCtGCzaAoVnjTK6CrETdMEaSPeeAZ8i1DE',
    // Sheet name (default is 'Sheet1')
    SHEET_NAME: 'Universities'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting initialization...');
    
    // Check if Google Maps API is loaded
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        console.error('Google Maps API not loaded');
        showError('Google Maps API failed to load. Please refresh the page.');
        return;
    }
    
    console.log('Google Maps API loaded successfully');
    
    try {
        console.log('Initializing map...');
        initializeMap();
        console.log('Map initialized successfully');
        
        console.log('Setting up event listeners...');
        setupEventListeners();
        console.log('Event listeners set up successfully');
        
        console.log('Loading universities...');
        loadUniversities();
        console.log('Load universities called');
        
    } catch (error) {
        console.error('Error during initialization:', error);
        showError('Failed to initialize application: ' + error.message);
    }
});

// Initialize Google Maps
function initializeMap() {
    console.log('Creating map options...');
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

    console.log('Creating Google Maps instance...');
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    console.log('Google Maps instance created successfully');
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
    
    // Refresh button
    document.getElementById('refreshData').addEventListener('click', loadUniversities);

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
    
    // Add timeout to prevent infinite loading
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout - taking too long to load')), 30000); // 30 second timeout
    });
    
    try {
        console.log('Starting to fetch data from Google Sheets...');
        
        // Race between the fetch and timeout
        const fetchPromise = fetchFromGoogleSheets();
        universities = await Promise.race([fetchPromise, timeoutPromise]);
        
        console.log('Data fetched successfully, processing...');
        
        // Populate filters
        populateFilters();
        
        // Display universities
        filteredUniversities = [...universities];
        displayUniversities();
        updateStats();
        
        showLoading(false);
        console.log('Successfully loaded universities from Google Sheets');
        
    } catch (error) {
        console.error('Error loading universities from Google Sheets:', error);
        
        // Show error message to user
        showError(`Failed to load from Google Sheets: ${error.message}. Using sample data instead.`);
        
        // Fallback to sample data
        try {
            console.log('Loading sample data as fallback...');
            universities = await getSampleData();
            populateFilters();
            filteredUniversities = [...universities];
            displayUniversities();
            updateStats();
            console.log('Loaded sample data as fallback');
        } catch (fallbackError) {
            console.error('Error loading sample data:', fallbackError);
            showError('Failed to load any data. Please check your internet connection and try again.');
        }
        
        showLoading(false);
    }
}

// Google Sheets API function (for production use)
async function fetchFromGoogleSheets() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.SHEET_NAME}?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;
    
    console.log('Fetching data from Google Sheets:', url);
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Google Sheets API Error:', response.status, errorText);
            throw new Error(`Google Sheets API Error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Google Sheets response:', data);
        
        if (!data.values || data.values.length === 0) {
            throw new Error('No data found in Google Sheets. Please check if the sheet has data and the sheet name is correct.');
        }
        
        // Assuming first row contains headers
        const headers = data.values[0];
        const rows = data.values.slice(1);
        
        console.log('Headers:', headers);
        console.log('Number of rows:', rows.length);
        
        const universities = rows.map((row, index) => {
            const university = {};
            headers.forEach((header, headerIndex) => {
                const key = header.toLowerCase().replace(/\s+/g, '_');
                let value = row[headerIndex] || '';
                
                // Convert numeric values
                if (key === 'latitude' || key === 'longitude' || key === 'founded') {
                    value = parseFloat(value) || 0;
                }
                
                university[key] = value;
            });
            
            console.log(`University ${index + 1}:`, university);
            return university;
        });
        
        console.log('Total universities loaded:', universities.length);
        return universities;
        
    } catch (error) {
        console.error('Error fetching from Google Sheets:', error);
        throw error;
    }
}

// Get sample data (fallback function)
async function getSampleData() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
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
        }
    ];
}

// Display universities on map and list
function displayUniversities() {
    console.log('Displaying universities...');
    console.log('Filtered universities count:', filteredUniversities.length);
    
    clearMarkers();
    console.log('Markers cleared');
    
    displayMapMarkers();
    console.log('Map markers displayed');
    
    displayUniversityList();
    console.log('University list displayed');
}

// Display markers on map
function displayMapMarkers() {
    console.log('Starting to display map markers...');
    console.log('Number of universities to display:', filteredUniversities.length);
    
    filteredUniversities.forEach((university, index) => {
        console.log(`Creating marker ${index + 1} for:`, university.name);
        
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

    console.log('All markers created, adding clustering...');

    // Add clustering
    if (isClustered && typeof markerClusterer !== 'undefined') {
        try {
            console.log('Creating MarkerClusterer...');
            markerClustererInstance = new markerClusterer.MarkerClusterer({
                map,
                markers,
                algorithm: new markerClusterer.SuperClusterAlgorithm({
                    radius: 100,
                    maxZoom: 15
                })
            });
            console.log('MarkerClusterer created successfully');
        } catch (error) {
            console.warn('MarkerClusterer not available, clustering disabled:', error);
            isClustered = false;
        }
    } else {
        console.log('Clustering disabled or MarkerClusterer not available');
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
    
    if (isClustered && typeof markerClusterer !== 'undefined') {
        try {
            markerClustererInstance = new markerClusterer.MarkerClusterer({
                map,
                markers,
                algorithm: new markerClusterer.SuperClusterAlgorithm({
                    radius: 100,
                    maxZoom: 15
                })
            });
        } catch (error) {
            console.warn('MarkerClusterer not available, clustering disabled:', error);
            isClustered = false;
        }
    } else {
        if (markerClustererInstance) {
            markerClustererInstance.clearMarkers();
            markerClustererInstance = null;
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
    
    if (markerClustererInstance) {
        markerClustererInstance.clearMarkers();
        markerClustererInstance = null;
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