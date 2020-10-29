var map;
var service;
var infowindow;


function initMap() {
    var sc = new google.maps.LatLng(36.9723111,-122.0383785,14);
    
    infowindow = new google.maps.InfoWindow();


     map = new google.maps.Map(document.getElementById("map"), {
      center: sc,
      zoom: 14,
      });
  
      var request = {
          location: sc,
          radius: "5",
          query: "Taqueria",
      };
  
      var service = new google.maps.places.PlacesService(map);
      service.textSearch(request, callback);
  
      // service.findPlaceFromQuery(request, function(results, status) {
      // if (status === google.maps.places.PlacesServiceStatus.OK) {
      //   for (var i = 0; i < results.length; i++) {
      //     createMarker(results[i]);
      //   }
      //   map.setCenter(results[0].geometry.location);
      // }
      // });
      function callback(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
              for (var i = 0; i < results.length; i++) {
                  var place = results[i];
                  createMarker(results[i]);
              }
          }
      }
  
      function createMarker(place) {
      const marker = new google.maps.Marker({
          map,
          position: place.geometry.location,
      });
      console.log(place.name);
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