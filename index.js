var map;
var service;
var infowindow;


function initMap() {
  //SC coords
  var sc = new google.maps.LatLng(36.9723111, -122.0383785, 14);

  // shwo popup when click on marker
  infowindow = new google.maps.InfoWindow();

  //create the map
  map = new google.maps.Map(document.getElementById("map"), {
<<<<<<< HEAD
    center: { lat: 36.988407, lng: -122.058281 },
    zoom: 12,
    // disableDefaultUI: true,
=======
    center: sc,
    zoom: 14,
>>>>>>> c3f2208090a46095f7a8628e11e5ba49eefac5af
  });

  //text request search
  var request = {
    location: sc,
    radius: "5",
    query: "Taqueria",
  };

  //hit the gmaps places API and do a text search
  var service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);


  //parse returned info from places
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        createMarker(results[i]);
      }
    }
  }

  //create marker with icon and attributes
  function createMarker(place) {
    console.log(place)
    const image = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25),
    };

    const marker = new google.maps.Marker({
      map,
      icon: image,
      title: place.name,
      position: place.geometry.location,
    });

    google.maps.event.addListener(marker, "click", () => {
      infowindow.setContent(place.name);
      infowindow.open(map);
    });
  }



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

  infoWindow = new google.maps.InfoWindow();
  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}
<<<<<<< HEAD
=======


>>>>>>> c3f2208090a46095f7a8628e11e5ba49eefac5af
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed. Please enable your location."
      : "Error: Your browser doesn't support geolocation."
  );

  infoWindow.open(map);
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