var map;
var service;
var infowindow;
var mapcenterpos;
var markers = [];

function initMap() {
  console.log("haha2");

  //center of earth coords
  var startCenter = new google.maps.LatLng(0, 0, 0);

  // show popup when click on marker
  infowindow = new google.maps.InfoWindow();

  console.log("beforeMapinit");
  //create the map
  map = new google.maps.Map(document.getElementById("map"), {
    center: startCenter,
    zoom: 3,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_RIGHT
    }
  });
  console.log("AfterMapinit");

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

  const closeDescriptionButton = document.querySelectorAll('[data-close-button]')
  const overlay = document.getElementById('overlay')

  closeDescriptionButton.forEach(button => {
    button.addEventListener('click', () => {
      const description = button.closest('.description')
      closeDescription(description)
    })
  })
  function closeDescription(description) {
    if (description == null) return
    description.classList.add('active')
    overlay.classList.add('active')
    overlay.parentNode.removeChild(overlay)
    geoLocation()


  }
  function geoLocation() {
    infoWindow = new google.maps.InfoWindow();
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setZoom(13);
          map.setCenter(pos);
          mapcenterpos = pos;
          cuisineTypeListener();
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed. Please enable your location."
        : "Error: Your browser doesn't support geolocation."
    );

    infoWindow.open(map);
  }

}


// DIV ELEMENT MOVEMENT SCRIPTS
/* Set the width of the side navigation to 250px and the left margin of the page content to 250px
  and add a black background color to body */
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("menu").style.display = "none";
  document.getElementById("box").style.marginLeft = "250px";
  document.getElementById("map").style.marginLeft = "250px";
  document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  console.log("opened nav");
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the 
background color of body to white */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("menu").style.display = "flex";

  document.getElementById("box").style.marginLeft = "0";
  document.getElementById("map").style.marginLeft = "0";
  document.body.style.backgroundColor = "white";
  console.log("closed nav");
}
