// Globals for map attributes and initial state
var map;
var service;
var infowindow;
var mapCenterPos = {lat: 0, lng:0};
var centerMarkerContainer = [];
var centerMarkerSize = {height: 28, width: 30};
var centerMakerImageSource = `./MarkerIcons/centerMarker.png`;

// Does not allow user to view out of bounds (grey regions) above map
const WORLD_BOUNDS = { 
  north: 85,
  south: -85,
  west: -180,
  east: 180,
}

/*Initialize all map attributes and related states
  Once the map is loaded, allow service of requests*/
function initMap() {

  // Start at center of earth coords
  var startCenter = new google.maps.LatLng(0, 0, 0);

  // Show popup when marker is clicked
  infowindow = new google.maps.InfoWindow();

  // Create the map, define desired attributes including bounds and controls
  map = new google.maps.Map(document.getElementById("map"), {
    center: startCenter,
    restriction: {
      latLngBounds: WORLD_BOUNDS,
      strictBounds: true,
    },
    zoom: 3,
    maxZoom: 18,
    minZoom: 3, 
    fullscreenControl: false,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.LEFT_BOTTOM
    }
  });

  // Once the map has been created, initialize the center marker (starting search location)
  initCenterMarker();

  // Alter style of map, remove equator and date lines
  var mapStyle = [ 
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];

  // Apply our map style
  var styledMap = new google.maps.StyledMapType(mapStyle);
  map.mapTypes.set('myCustomMap', styledMap);
  map.setMapTypeId('myCustomMap');
  
  

  // Create the button to close greeting and description
  const closeDescriptionButton = document.querySelectorAll('[data-close-button]') 
  const overlay = document.getElementById('overlay')

  closeDescriptionButton.forEach(button => {
    button.addEventListener('click', () => {
      const description = button.closest('.description')
      closeDescription(description)
    })
  })

  // Function to close out greeting and descrption and begin geolocation 
  function closeDescription(description) {
    if (description == null) return
    description.classList.add('active')
    overlay.classList.add('active')
    overlay.parentNode.removeChild(overlay)
    
    // Once description is closed out, prompt user for geolocation
    geoLocation()
  }

  //Geolocation to track user location, once allowed, begin servicing cuisine searches
  function geoLocation() {

    infowindow = new google.maps.InfoWindow();
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {

          // Initialize Marker Clusterer to group overlapping markers
          clusters();

          const pos = { // Retrieve user location 
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Set zoom, move to user location
          map.setZoom(15);
          map.setCenter(pos);
          mapCenterPos = pos;
          
          // Place center marker at user location
          placeMarkerAndPanTo(pos, map);

          // Open menu bar by default, set menu button to be transparent on start
          setMenuTransition(0); // Applies transparency to menu button
          openNav();

          // Call cuisineTypeListener to vitalize menu search options
          cuisineTypeListener();
        },
        () => { // Enable Location not allowed
          handleLocationError(true, infowindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infowindow, map.getCenter());
    }
  }

  // Error function on geolocation failure 
  function handleLocationError(browserHasGeolocation, infowindow, pos) {
    infowindow.setPosition(pos);
    infowindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed. Please enable your location."
        : "Error: Your browser doesn't support geolocation."
    );

    infowindow.open(map);
  }

  // When a new location on our map is clicked, set new center position
  map.addListener("click", (e) => {
    mapCenterPos.lat = e.latLng.lat();
    mapCenterPos.lng = e.latLng.lng();
    placeMarkerAndPanTo(mapCenterPos, map);
  });

  google.maps.event.trigger(map, 'resize');
}

// Initialize center marker container with null marker
function initCenterMarker() {
  const centerMarker = new google.maps.Marker({map: map});
  centerMarkerContainer.push(centerMarker);
}

// Set new center, place user marker, pan to marker
function placeMarkerAndPanTo(latLng, map) {

  // Get rid of old center marker
  var oldCenterMarker = centerMarkerContainer.pop();
  oldCenterMarker.setMap(null);
  oldCenterMarker = null;

  // Sets new center marker image and attributes
  const centerMarkerImage = {
    url: centerMakerImageSource,
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 0),
    scaledSize: new google.maps.Size(centerMarkerSize.width, centerMarkerSize.height),
  };

  const centerMarker = new google.maps.Marker({
    icon: centerMarkerImage,
    position: latLng,
    map: map,
  });

  // Add centerMarker to container, set new center position center for search queries
  centerMarkerContainer.push(centerMarker);
  map.panTo(latLng);
}

// CUISINE TYPE MENU TRANSITION HANDLING
/* Set the width of the side navigation to 250px and the left margin of the page content to 250px
  and add a black background color to body */
function openNav() { //Onclick, open the side navigator
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("menu").style.opacity = "0";
  document.getElementById("box").style.marginLeft = "250px";
  document.getElementById("map").style.marginLeft = "250px";
  document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the 
background color of body to white */
function closeNav() { //On close, close the side navigator
  setMenuTransition(1);
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("menu").style.opacity = "1";
  document.getElementById("box").style.marginLeft = "0";
  document.getElementById("map").style.marginLeft = "0";
  document.body.style.backgroundColor = "white";
}

// Set Menu button transition time
function setMenuTransition(transitionTime) {
  document.getElementById("menu").style.transition = `opacity ${transitionTime}s ease-out`;
}
