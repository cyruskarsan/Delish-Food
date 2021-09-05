//GET request to find if a place exists in Mongo using placeid as identifier, returns rating
function findPlaceRating(place, cuisineType) {
    // for local
    //http://localhost:5001/delish-2/us-central1/getPlace
    
    fetch("https://us-central1-delish-2.cloudfunctions.net/getPlace?text=" + place.place_id)   
        .then((response) => {
            if(response.status != 200) { // If place not found, add it and create fresh marker
                addPlace(place.place_id)
                createMarker(place, cuisineType, 0)
                throw new Error("Place not found")
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

//add place with key being placeid value being a rating of 0 to the firestore
function addPlace(placeid) {
    //for local dev
    // http://localhost:5001/delish-2/us-central1
    const url = "https://us-central1-delish-2.cloudfunctions.net/addPlace?text=" + placeid;
    fetch(url);
}

//update rating in firestore by parsing value passed in
//will increment rating based on value passed by client
function updateRating(placeid, voteVal) {
    alert(`${voteVal} recorded!`);

    // Set value of voteVal to 1 or -1 from 'Upvote' or 'Downvote'
    voteValNum = '';
    if (voteVal[0] == 'U') {
        voteValNum = '1';
    } else {
        voteValNum = '-1';
    }
    //for local
    //http://localhost:5001/delish-2/us-central1/updateRating
    const url = "https://us-central1-delish-2.cloudfunctions.net/updateRating?text=" + placeid + ":" + voteValNum;
    fetch(url)
    .catch((error) => {
        console.error("Error:", error);
    });
}