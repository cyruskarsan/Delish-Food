var markerClusterer = null; // Marker Clusterer object

//Run requests from cuisine type clicks
function cuisineTypeSearch(request, cuisineType) {

    //hit the gmaps places API and do a text search
    var service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);

    //parse returned info from places
    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];

                // Create marker for given place
                createMarker(place, cuisineType);
            }
        }
    }

    // Create marker with icon and info attributes
    function createMarker(place, cuisineType) {

        function findIcon(icon_query) {
            $.ajax({
                type: "POST",
                url: 'http://127.0.0.1:5000/icon_scrape',
                data: { search_key: icon_query, save_name: place.place_id },
                success: function(response) {
                    console.log("Success on ajax post, this is response: ", response);
                    //if returnScrape val == 0
                },
                error: function(error) {
                    console.log("Failure on ajax post, this is response ", error);
                }
            });
        }

        let icon_query = place["name"].concat(" ", place["formatted_address"])
        // uncomment line below to run ajax requests to flask app
        findIcon(icon_query)
        
        const image = {
            url: `./MarkerIcons/${cuisineType.toLowerCase()}.png`,
            //url: `./MarkerIcons/roof.png`,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35),
        };
        arguments

        const marker = new google.maps.Marker({
            map,
            icon: image,
            title: place.name,
            position: place.geometry.location,
        });

        // Set place information when marker is clicked
        setPlaceDetails(place, marker);

        // add generated marker to dictionary and clusterer set
        cuisine_marker_dict[cuisineType].push(marker);
        markerClusterer.addMarker(marker);
    }
}

// Marker Clusterer object
var markerClusterer = null;

// Initialize markerClusterer Object
function clusters() {
    markerClusterer = new MarkerClusterer(map, cuisine_marker_dict, {
        imagePath: "https://unpkg.com/@googlemaps/markerclustererplus@1.0.3/images/m",
    });
    markerClusterer.setMinimumClusterSize(5);
}

// Clear specified set of markers from the map
function clearMarkerSets(cuisineType) {
    if (markerClusterer) {
        markerClusterer.removeMarkers(cuisine_marker_dict[cuisineType]);
    }
}

// Individual cuisine marker dict/hash table to store marker arrays
var cuisine_marker_dict = {};

// Initialize onclick event listener for cuisine type options
function cuisineTypeListener() {

    let mysidenav = document.getElementById("mySidenav");
    let cuisines = mysidenav.querySelectorAll('a.cuisine-type');

    //Initialize Clusterer
    clusters();

    for (let i = 0; i < cuisines.length; i++) {
        let cuisine = cuisines[i]; // Select individual cuisine type

        let cuisineType = cuisine.innerText.toLowerCase();
        cuisine_marker_dict[cuisineType] = [];

        cuisine.onclick = function() {
            cuisine_check = document.getElementById(`${cuisine.innerText}`); // CSN-TYPE CHECK BOX DIV

            // IF CUISINE TYPE CLICKED ALREADY SELECTED, CLEAR SELECTION, ELSE, RUN REQUEST/CREATE MARKERS
            if (cuisine_check.innerText == "✓") {
                cuisine_check.innerText = "";
                clearMarkerSets(cuisineType);
            } else {
                let request = {
                    location: new google.maps.LatLng(mapcenterpos["lat"], mapcenterpos["lng"], 14),
                    radius: "5",
                    type: "restaurant",
                    query: cuisine.innerText.toLowerCase(),
                };
                document.getElementById(cuisine.innerText).innerText = "✓";
                cuisineTypeSearch(request, cuisineType);
            }
        }
    }
}