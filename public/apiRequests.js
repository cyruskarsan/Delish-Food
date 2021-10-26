// Get request to find if a place exists in Firestore using placeid as identifier, returns rating
function findPlaceRating(place, cuisineType) {
    // for local dev
    // "http://localhost:5001/delish-2/us-central1/getPlace?text=" + place.place_id
    // for cloud dev
    // "https://us-central1-delish-2.cloudfunctions.net/getPlace?text=" + place.place_id
    const getPlaceURL = "http://localhost:5001/delish-2/us-central1/getPlace?text=" + place.place_id;
    //console.log("This is findPlaceRating running with URL:", getPlaceURL);
    fetch(getPlaceURL)   
        .then((response) => {
            if(response.status != 200) { // If place not found, add it and create fresh marker
                addPlace(place.place_id);
                createMarker(place, cuisineType, 0);
                throw new Error("Place not found");
            } else { // Else create marker with found rating
                return response.json(); 
            }
        })    
        .then(
            data => {
                console.log("Place found")
                createMarker(place, cuisineType, data.rating)
            })
        .catch((error) => {
            console.log(error)
        })
}

// Add place with key being placeid value being a rating of 0 to the firestore, no return.
function addPlace(placeid) {
    // for local dev
    // "http://localhost:5001/delish-2/us-central1/addPlace?text=" + placeid;
    // for cloud dev
    // "https://us-central1-delish-2.cloudfunctions.net/addPlace?text=" + placeid;
    const addPlaceURL = "http://localhost:5001/delish-2/us-central1/addPlace?text=" + placeid;
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
    // for local dev
    // "http://localhost:5001/delish-2/us-central1/updateRating?text"  + placeid + ":" + voteValNum;
    // for cloud dev
    // "https://us-central1-delish-2.cloudfunctions.net/updateRating?text=" + placeid + ":" + voteValNum;
    let placeIDVote = placeid+":"+voteValNum;
    const updateRatingURL = `http://localhost:5001/delish-2/us-central1/updateRating?text=${placeIDVote}&userID=${currentUserID}`;
    console.log("This is updateRating running with URL:", updateRatingURL);
    fetch(updateRatingURL)
    .catch((error) => {
        console.error("Error:", error);
    });
}