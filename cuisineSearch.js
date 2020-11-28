var markerClusterer = null; // Marker Clusterer object

//Run requests from cuisine type clicks
function cuisineTypeSearch(request) {

  //hit the gmaps places API and do a text search
  var service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);

  // show popup when click on marker

  //parse returned info from places
  function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
              var place = results[i];
              createMarker(place,request);
          }
          console.log(place);
          clusters();
      }
  }

  //create marker with icon and attributes
  function createMarker(place,request) {
      console.log(place)
      const image = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
      };
      arguments

      const infowindow = new google.maps.InfoWindow();
      const service = new google.maps.places.PlacesService(map);

      const marker = new google.maps.Marker({
          map,
          icon: image,
          title: place.name,
          position: place.geometry.location,
      });

      var addr = place.formatted_address.split(",");
      google.maps.event.addListener(marker, "click", function () {
          infowindow.setContent(
            "<div><strong>" +
            place.name +
            "</strong><br>" +
            addr[0] + 
            "<br>" + 
            addr[1] + ", " + addr[2] + 
            "<br>" +
            // place.photos[0] +
            '<img src="data:image/jpeg;base64,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"        width="300" height="200" />'+
            "</div>"
          );
          infowindow.open(map, this);
      });
      markers.push(marker);
  }
}

// Cluster markers for given markers on map
function clusters(){ 
    console.log("in clusters func, markers: \n".concat(`${markers}`));
    markerClusterer = new MarkerClusterer( map, markers, {
        imagePath:
          "https://unpkg.com/@googlemaps/markerclustererplus@1.0.3/images/m",
      });
}

// Clear markers from previous search query
function clearMarkers() {
  for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
  }
}

function cuisineTypeListener() {
  /*onclick event listener for cuisine type options*/
  let mysidenav = document.getElementById("mySidenav");
  let cuisines = mysidenav.querySelectorAll('a.cuisine-type');

  for (let i = 0; i < cuisines.length; i++) {
      let cuisine = cuisines[i]; // select individual cuisine type
      cuisine.onclick = function() {
          clearMarkers();
          if(markerClusterer) {
            markerClusterer.clearMarkers();
          }
          markers = []
          let request = {
              fields: ["name", "place_id", "formatted_address","url","address_components[]", "geometry", "photos[]"],
              location: new google.maps.LatLng(mapcenterpos[0], mapcenterpos[1], 14),
              radius: "5",
              type: "restaurant",
              query: cuisine.innerText.toLowerCase(),
          };
          cuisineTypeSearch(request);
      }
  }
}