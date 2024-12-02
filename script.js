// Initialize the map

var map = L.map('map').setView([51.505, -0.09], 13); // Default location (London)

// Adding OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to get geocode (convert address to coordinates)
function geocodeAddress(address, callback) {
  var url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        var lat = parseFloat(data[0].lat);
        var lon = parseFloat(data[0].lon);
        callback(lat, lon);
      } else {
        alert('Location not found!');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Function to find the route
function findRoute() {
  var start = document.getElementById('startInput').value;
  var end = document.getElementById('endInput').value;

  // Get coordinates for both start and end locations
  geocodeAddress(start, function(startLat, startLon) {
    geocodeAddress(end, function(endLat, endLon) {
      // Once we have both start and end coordinates, plot the route
      plotRoute(startLat, startLon, endLat, endLon);
    });
  });
}

// Function to plot the route using OpenRouteService API
function plotRoute(startLat, startLon, endLat, endLon) {
  var apiKey = 'YOUR_OPENROUTESERVICE_API_KEY'; // Replace with your OpenRouteService API key

  // Request route data from OpenRouteService API
  var url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startLon},${startLat}&end=${endLon},${endLat}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.routes && data.routes[0]) {
        // Route coordinates
        var routeCoordinates = data.routes[0].segments[0].steps.map(step => [step.latlon[1], step.latlon[0]]);

        // Create a polyline for the route
        L.polyline(routeCoordinates, { color: 'blue', weight: 5 }).addTo(map);

        // Add markers for start and end
        L.marker([startLat, startLon]).addTo(map).bindPopup("Start Location").openPopup();
        L.marker([endLat, endLon]).addTo(map).bindPopup("Destination").openPopup();

        // Adjust map view to show the entire route
        map.fitBounds(L.latLngBounds(routeCoordinates));
      } else {
        alert("Route not found!");
      }
    })
    .catch(error => {
      console.error('Error fetching route:', error);
    });
}






