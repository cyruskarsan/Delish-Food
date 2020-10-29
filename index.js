var map;
var service;
var infowindow;


function initMap() {
    var sc = new google.maps.LatLng(36.9723111,-122.0383785,14)
    
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
}
      