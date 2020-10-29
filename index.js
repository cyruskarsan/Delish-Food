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
    disableDefaultUI: true,
  });

  var mapStyle = [ // sets up getting rid of equator and international date line
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [
        { visibility: "off" } 
      ]
    }
    ];
    var styledMap = new google.maps.StyledMapType(mapStyle);
    map.mapTypes.set('myCustomMap', styledMap);
    map.setMapTypeId('myCustomMap');
}

// DIV ELEMENT MOVEMENT SCRIPTS
/* Set the width of the side navigation to 250px and the left margin of the page content to 250px
  and add a black background color to body */
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
  document.getElementById("box").style.marginLeft = "250px";
  document.getElementById("map").style.marginLeft = "250px";
  document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  console.log("opened nav");
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the 
background color of body to white */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  document.getElementById("box").style.marginLeft = "0";
  document.getElementById("map").style.marginLeft = "0";
  document.body.style.backgroundColor = "white";
  console.log("closed nav");
}