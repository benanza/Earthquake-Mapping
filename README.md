# Earthquake Mapping

*To view the site, you must first obtain an API key by setting up a free account at mapbox.com and creating an Access Token*

*Apply this API key anywhere the code in the logic.js file says "API_KEY"*

#### Project Premise: "The USGS is interested in building a new set of tools that will allow them visualize their earthquake data. They collect a massive amount of data from all over the world each day, but they lack a meaningful way of displaying it. Their hope is that being able to visualize their data will allow them to better educate the public and other government organizations (and hopefully secure more funding..) on issues facing our planet."

1. Used the USGS GeoJSON feed to obtain the necessary data

2. Imported and visualized the data using Leaflet.js:
  
  - Data markers reflect the magnitude of the earthquake in their size and color. Earthquakes with higher magnitudes appear larger and darker in color.

  - Popups provide additional information about the earthquake when a marker is clicked.

  - Legend provides context for map data.

3. Second data set obtained from https://github.com/fraxen/tectonicplates:

  - Overlaid second data set on existing map

  - Added alternate base maps to choose from

  - Added layer controls to our map
  
  Example Site Screenshots:
  
  ![Sat Screenshot](https://github.com/benanza/Earthquake-Mapping/blob/master/Sat_Screenshot.png?raw=true)
  
  ![Light Screenshot](https://github.com/benanza/Earthquake-Mapping/blob/master/Light_Screenshot.png?raw=true)
  
  ![Dark Screenshot](https://github.com/benanza/Earthquake-Mapping/blob/master/Dark_Screenshot.png?raw=true)
  
  ![Street Screenshot](https://github.com/benanza/Earthquake-Mapping/blob/master/Street_Screenshot.png?raw=true)
