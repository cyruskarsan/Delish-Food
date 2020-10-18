// // Create the script tag, set the appropriate attributes
// var script = document.createElement('script');
// script.src = 'https://maps.googleapis.com/maps/api/js?key=YAIzaSyBliB0DVBbxnXcA-RBoYjpJxSaXYegoM9c&callback=initMap';
// script.defer = true;

// // Attach your callback function to the `window` object
// window.initMap = function() {
//   // JS API is loaded and available
// };

// // Append the 'script' element to 'head'
// document.head.appendChild(script);

let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 36.988407, lng: -122.058281 },
    zoom: 12,
  });
}
      