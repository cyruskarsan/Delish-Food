require('dotenv').config();
const places_api_key = process.env.API_KEY;
// Create the script tag, set the appropriate attributes

console.log(process.env);

var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBliB0DVBbxnXcA-RBoYjpJxSaXYegoM9c&callback=initMap';
script.defer = true;

// Attach your callback function to the `window` object
window.initMap = function() {
  // JS API is loaded and available
};

// Append the 'script' element to 'head'
document.head.appendChild(script);
