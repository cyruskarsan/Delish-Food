// Set constant value for server address
const serverDomain = 'http://localhost:5001/delish-2/us-central1';

// Get request to retrieve restaurants from the server (either cached or from Places API)
function retrieveRestaurants(cuisine, lat, lng, radius, createRestaurantMarkerCallback) {
    const retrieveRestaurantsURL = `${serverDomain}/retrieveRestaurants?cuisine=${cuisine}&lat=${lat}&lng=${lng}&radius=${radius}`;
    console.log('Inside retrieveRestaurants:', retrieveRestaurantsURL, cuisine, lat, lng, radius)
    fetch(retrieveRestaurantsURL)
        .then((response) => {
            if(response.status != 200) { // Restaurants not found, server error
                console.log(`Restaurants not retrieved, status: ${response.status}, message: ${response.message}`);
                throw new Error("Restaurants not retrieved.");
            } else { // Else convert response to JSON and begin processing restaurants below
                return response.json(); 
            }
        })    
        .then(
            data => {
                // Restaurants have been found, process restaurants and begin generating markers
                // console.log(`Restaurants have been found, status: ${data.message} localRating: ${data.restaurants.results[0].localRating}\nResults:\n${JSON.stringify(data.restaurants.results)}, data:\n${data}\n\n`);
                if (typeof(createRestaurantMarkerCallback) === typeof(Function)) {
                    createRestaurantMarkerCallback(data.restaurants.results, 200);
                }
                return data.restaurants.results;
            })
        .catch((error) => { // Error response status, log error
            console.log(error)
            return [];
        })
}

// Get request to find if a place exists in Firestore using placeid as identifier, returns rating
function findPlaceRating(place, cuisineType) {
    const getPlaceURL = `${serverDomain}/getPlace?text=${place.place_id}`;
    fetch(getPlaceURL)
        .then((response) => {
            if(response.status != 200) { // If place not found, add it and create fresh marker
                addPlace(place.place_id);
                createMarker(place, cuisineType, 0);
                throw new Error("Place not found");
            } else { // Else convert response to retrieve rating data below
                return response.json(); 
            }
        })
        .then(
            data => {
                // Place has been seen, create marker with associated rating
                createMarker(place, cuisineType, data.rating)
            })
        .catch((error) => {
            console.log(error)
        })
}

// Add place with key being placeid value being a rating of 0 to the firestore, no return.
function addPlace(placeid) {
    const addPlaceURL = `${serverDomain}/addPlace?text=${placeid}`;
    console.log("This is addPlace running with URL:", addPlaceURL);
    fetch(addPlaceURL);
}

// Update rating in firestore by parsing value passed in.
// Will increment rating based on value passed by client. User must be signed in.
function updateRating(placeid, voteVal) {
    if (!signedIn) { // If the user is not signed in, notify them to sign in.
        alert(`Only signed in users can vote on places. Sign in with Google in order to vote.`);
        return;
    }

    alert(`${voteVal} recorded!`);

    // Set value of voteVal to 1 or -1 from 'Upvote' or 'Downvote' respectively
    voteValNum = '';
    if (voteVal[0] == 'U') {
        voteValNum = '1';
    } else {
        voteValNum = '-1';
    }

    const updateRatingURL = `${serverDomain}/updateRating?place=${placeid}&voteVal=${voteValNum}&userID=${currentUserID}`;
    console.log("This is updateRating running with URL:", updateRatingURL);
    fetch(updateRatingURL)
    .catch((error) => {
        console.error("Error:", error);
    });
}