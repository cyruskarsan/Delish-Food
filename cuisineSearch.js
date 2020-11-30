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
  function createMarker(place) {
      
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
      const request ={
        placeId: place.place_id,
        fields: ["photo", "icon", "website", "opening_hours", "utc_offset_minutes"],
      };
      var website = "";
      try {
        var placePhotoTag = (place.photos[0].getUrl()) ?  `<img src='${place.photos[0].getUrl()}' height="100">`:"";

      }
      catch(e){
        console.log("fail no photos")
      }
      service.getDetails(request, (detailsRequest, status) =>{
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          console.log(detailsRequest.website);
          detailsRequest= detailsRequest;
          website = (detailsRequest.website) ?  (`<a href = "${detailsRequest.website}" target= "_blank">` + detailsRequest.website + "</a>" ): "";
      
        }
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
            website +
            "<br>" +
            placePhotoTag +
            "</div>"
          );
          infowindow.open(map, this);
      });
      markers.push(marker);
  }
}

// Cluster markers for given markers on map
function clusters(){ 
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
              fields: ["name", "place_id", "formatted_address","url","address_components[]", "geometry"],
              location: new google.maps.LatLng(mapcenterpos[0], mapcenterpos[1], 14),
              radius: "5",
              type: "restaurant",
              query: cuisine.innerText.toLowerCase(),
          };
          cuisineTypeSearch(request);
      }
  }
}