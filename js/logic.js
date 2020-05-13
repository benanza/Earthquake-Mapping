// url to query with our API key
// Isolate earthquakes in continental USA on April 12th, 2020
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-04-12&endtime=" +
"2020-04-13&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// perform GET request on queryURL above
d3.json(queryUrl, function(data) {
  createFeatures(data.features);
});

// Define a markerSize function to set radius of each marker to relate to the earthquake's magnitude
function markerSize(mag) {
  return mag * 10;
}

// Function to create features we'll add to map
function createFeatures(earthquakeData) {

  // Generate pop ups showing the place and time for each earthquake
  // when the marker is clicked on; and center the header texts
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3 style='text-align:center'>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });
  
  // Send earthquakes layer to the createMap function
  createMap(earthquakes);
}

L.geoJson(earthquakeData, {
  // We turn each feature into a circleMarker on the map.
  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng);
  },
  // We set the style for each circleMarker using our styleInfo function.
  style: styleInfo,
  // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
  onEachFeature: function(feature, layer) {
    layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
  }
}).addTo(map);

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

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create map with center/zoom on USA
  var myMap = L.map("map", {
    center: [
      39.29, -100.71
    ],
    zoom: 5,
    // Default load darkmap with earthquake markers
    layers: [streetmap, earthquakes]
  });

  // Create and add layer control to baseMaps and overlayMaps
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
