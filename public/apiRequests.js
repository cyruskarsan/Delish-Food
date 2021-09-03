//GET request to find if a place exists in Mongo using placeid as identifier, returns rating
function findPlaceRating(place, cuisineType) {
    fetch("http://localhost:5001/delish-2/us-central1/getPlace?text=" + place.place_id)
        .then(response => response.json())
        //place found, creating marker with rating
        .then(
            data => {
                if (!response.ok) {
                    throw new Error("could not find place, add it")
                }
                else {
                    console.log('data from getPlace', data)
                    createMarker(place, cuisineType, data.rating)
                }
            }
        )
        //place not found, add place to mongo and create marker for new place
        .catch((error) => {
            console.log('error in FPR', error)
            addPlace(place.place_id)
            createMarker(place, cuisineType, 0)
        })
}

//add place with key being placeid value being a rating of 0 to the firestore
function addPlace(placeid) {
    const url = "http://localhost:5001/delish-2/us-central1/addPlace?text=" + placeid;
    fetch(url)
        .then(response => response.json())
        .catch((error) => {
            console.error("Error:", error)
        });
}

//update rating in firestore by parsing value passed in
//will increment rating based on value passed by client
function updateRating(placeid, voteVal) {
    alert(`${voteVal} recorded!`);
    const url = "http://localhost:5001/delish-2/us-central1/updateRating?text=" + placeid + ":" + voteVal;
    fetch(url)
    .catch((error) => {
        console.error("Error:", error)
    });
}