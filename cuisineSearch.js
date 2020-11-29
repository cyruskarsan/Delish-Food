var markerClusterer = null; // Marker Clusterer object

//Run requests from cuisine type clicks
function cuisineTypeSearch(request, cusineType) {

    //hit the gmaps places API and do a text search
    var service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);

    // show popup when click on marker
    infowindow = new google.maps.InfoWindow();

    //parse returned info from places
    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];
                createMarker(place, cusineType);

            }
            console.log(place);
            clusters();
        }
    }

    //create marker with icon and attributes
    function createMarker(place, cuisineType) {

        function findIcon(icon_query) {
            //icon_query.preventDefault();
            $.ajax({
              type: "POST",
              url: './app.py',
              data: {search_key:icon_query, save_name:icon_query},
              success: function (response) {
                  console.log("success, this is response: ", response);
              },
              error: function (error) {
                  console.log("failure, this is response ", error);
              }
            }).done(setIcon);
          }
          
          function setIcon(data) {
            console.log("This is data return from python POST func, setIcon: ", data);
          }

        console.log(place)
        
        let icon_query = place["name"].concat(" ", place["formatted_address"])
        console.log("this is icon_query at: ", icon_query)
        findIcon(icon_query)
        /*$.ajax({
            url: "ajax.aspx?ajaxid=4",
            data: {
                "search_key": VarA,
                "save_name": VarB,
            },
            cache: false,
            type: "POST",
            success: function(response) {
                //continue on to next function
            },
            error: function(xhr) {

            }
        });*/

        const image = {
            url: `./MarkerIcons/${cuisineType}.png`,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(40, 40),
        };
        arguments
        const marker = new google.maps.Marker({
            map,
            icon: image, //./MarkerIcons/`${}`-32x32.png, instead of image
            title: place.name,
            position: place.geometry.location,
        });

        console.log("cuisinetype: ", cuisineType);

        markers.push(marker);

        google.maps.event.addListener(marker, "click", () => {
            infowindow.setContent(place.name);
            infowindow.open(map);
        });
    }
}

// Cluster markers for given markers on map
function clusters() {
    console.log("in clusters func, markers: \n".concat(`${markers}`));
    markerClusterer = new MarkerClusterer(map, markers, {
        imagePath: "https://unpkg.com/@googlemaps/markerclustererplus@1.0.3/images/m",
    });
}

/*Add onclick event listener for cuisine type options*/
function cuisineTypeListener() {
    let mysidenav = document.getElementById("mySidenav");
    let cuisines = mysidenav.querySelectorAll('a.cuisine-type');
    console.log(cuisines);

    for (let i = 0; i < cuisines.length; i++) {
        let cuisine = cuisines[i]; // select individual cuisine type
        cuisine.onclick = function() {
            //clear markers in clusters and markers array
            if (markerClusterer) {
                markerClusterer.clearMarkers();
            }
            markers = []

            document.getElementById("demo").innerText = "CUISINE TYPE: ".concat(`${cuisine.innerHTML}`);
            let request = {
                location: new google.maps.LatLng(mapcenterpos[0], mapcenterpos[1], 14),
                radius: "5",
                type: "restaurant",
                query: cuisine.innerText.toLowerCase(),
            };
            cuisineTypeSearch(request, cuisine.innerText.toLowerCase());
        }
    }
}