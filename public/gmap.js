// Create the script tag, set the appropriate attributes
var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCMJkHfV7ReYVFYDpJvutTqS2E1ObQP6Jw&libraries=places&callback=initMap';
script.defer = true;

// Append the 'script' element to 'head'
document.head.appendChild(script);