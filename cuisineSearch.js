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
      

      const marker = new google.maps.Marker({
          map,
          icon: image,
          title: place.name,
          position: place.geometry.location,
      }).addListener('click', function() {     
          infowindow.setContent(
          "<div><strong>" +
            place.name +
            "</strong><br>" +
            "Place ID: " +
            place.place_id +
            "<br>" +
            place.formatted_address +
            "</div>"
        );
        infowindow.open(map, this);
      });
      };
      markers.push(marker);
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
          document.getElementById("demo").innerText = "Cuisine Type: ".concat(`${cuisine.innerHTML}`);
          let request = {
              fields: ["name", "place_id", "formatted_address","url","address_components", "geometry"],
              location: new google.maps.LatLng(mapcenterpos[0], mapcenterpos[1], 14),
              radius: "5",
              type: "restaurant",
              query: cuisine.innerText.toLowerCase(),
          };
          cuisineTypeSearch(request);
      }
  }
}
