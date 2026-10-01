// Leaflet's JavaScript API displays the map on the Contact page only.
document.addEventListener('DOMContentLoaded', function () {
  var mapElement = document.getElementById('businessMap');
  var mapStatus = document.getElementById('mapStatus');
  if (!mapElement) return;

  function showMapError() {
    mapStatus.textContent = 'The map could not load. You can still use the directions or larger map links below.';
  }

  function initializeMap() {
    if (!window.L) {
      showMapError();
      mapElement.textContent = 'Map unavailable. Please use the links below.';
      return;
    }

    var latitude = Number(mapElement.dataset.lat);
    var longitude = Number(mapElement.dataset.lng);
    var coordinates = [latitude, longitude];
    mapStatus.textContent = 'Loading the map...';

    var map = L.map(mapElement, { scrollWheelZoom: false }).setView(coordinates, 18);
    var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    });

    // Keep useful feedback visible if some map images fail to arrive.
    var tileFailed = false;
    tiles.on('loading', function () { tileFailed = false; });
    tiles.on('tileerror', function () {
      tileFailed = true;
      showMapError();
    });
    tiles.on('load', function () {
      if (!tileFailed) mapStatus.textContent = 'Hulma is marked on the map. Use the + and − buttons to zoom.';
    });
    tiles.addTo(map);

    L.marker(coordinates, { title: 'Hulma Coffee & Craft Studio', alt: 'Hulma location pin' })
      .addTo(map)
      .bindPopup('<strong>Hulma Coffee &amp; Craft Studio</strong><br>127 Clamonte St, Cabanatuan City, Nueva Ecija')
      .openPopup();
  }

  initializeMap();
});
