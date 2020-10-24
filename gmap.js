require('dotenv').config(); //makes dotenv an action (load anything in file called .env into a environment variable)
const places_api_key = process.env.API_KEY; //sets the places_api_key to the API key

//console.log(process.env); just a check to see if env variable was added

// Create the script tag, set the appropriate attributes

var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBliB0DVBbxnXcA-RBoYjpJxSaXYegoM9c&callback=initMap';
script.defer = true;

// Attach your callback function to the `window` object
window.initMap = function() {
  // JS API is loaded and available
};

// Append the 'script' element to 'head'
document.head.appendChild(script);
