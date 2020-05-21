// Url to query for earthquake data from the current week
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Query the queryURL above
d3.json(queryUrl, function(data) {
  createMarkers(data.features);
});

function createMap(earthquakes) {

  // Define different types of map layers (street, light, dark, satellite)
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Light Map": lightmap,
    "Dark Map": darkmap,
    "Satellite Map": satellitemap
  };

  // Create layer group for fault lines
  var faults = new L.LayerGroup();

  // Assign url for fault line query
  var faultUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
  
  // Query the fault lines url
  d3.json(faultUrl, function (faultData) {
    L.geoJSON(faultData,
      {
        color: '#FF6600',
        weight: 1.5
      })
      .addTo(faults);
  });    

  // Create overlay object to hold our overlay layers
  var overlayMaps = {
    "Earthquakes": earthquakes,
    "Fault Lines": faults
  };

  // Create map with center/zoom on USA
  var map = L.map("map", {
    center: [
      39.29, -100.71
    ],
    zoom: 3,
    // Default load darkmap with earthquake markers and fault lines
    layers: [satellitemap, earthquakes, faults]
  });

  // Create and add layer control to baseMaps and overlayMaps
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

  // Create Legend
  // ------------
  // Source for creating legends: https://gis.stackexchange.com/questions/193161/add-legend-to-leaflet-map
  // ------------
  var legendLayer = L.control({position: 'bottomright'});

  legendLayer.onAdd = function() {

    // Add legend as a new div
    var legend = L.DomUtil.create('div', 'legend');

    // Create an array for holding legend magnitudes/labels
    var labels = [0,1,2,3,4,5];

    // Label each level of magnitude in the legend
    for (var i = 0; i < 6; i++) {

      // Edit each inner element "i" of legend
      // See line 152 for '?' and ':' operator breakdown
      legend.innerHTML += '<i style="background:'
      + markerColor(labels[i] + 1) + '"></i> ' + labels[i] + (labels[i+1]
      ? '–' + labels[i+1] + '<br>' : '+');

      }

      return legend;

  };

  legendLayer.addTo(map);

}

// Function to create features we'll add to map
function createMarkers(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {
    
    // Generate pop ups showing the place and time for each earthquake
    // when the marker is clicked on; center the header texts
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h2 style='text-align:center'> Magnitude: " + feature.properties.mag + 
        "<h3 style='text-align:center'>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    },

    // Generate circle markers instead of default markers
    pointToLayer: function(feature, latlng){
      return new L.circle(latlng,
      
      // Set marker properties to correspond with markerSize and markerColor functions
      { radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.properties.mag),
        fillOpacity: .85,
        weight: 0
      })
    }    
  });

  // Send earthquakes layer to the createMap function
  createMap(earthquakes);

}

// Set color of circle markers to correlate with magnitude
function markerColor(mag) {

  // Operational 'if' statement where '?' operates as 'then' and ':' operates as 'else'
  // Color palette source: https://www.w3schools.com/colors/colors_shades.asp
  return  mag > 5 ? '#FF0033': mag > 4 ? '#FF3366': mag > 3 ? '#FF6666':
          mag > 2 ? '#FF9966': mag > 1 ? '#FFCC66': '#FFFF66';
};

// Scale the size of the markers with magnitude
// This makes global view more relevant
function markerSize(mag) {
  return mag * 40000;
};
