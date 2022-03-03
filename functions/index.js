// Init requirements for Firebase and OAuth functionality
const functions = require('firebase-functions');
const {OAuth2Client} = require('google-auth-library');
const cors = require('cors')({origin: true,});
const axios = require('axios');

// Run secrets.js where process.env.GOOGLE_API_KEY, retrieve key
require('./secrets');
const placesAPIKey = process.env.GOOGLE_API_KEY;

/*  Initialize sign in client_id and client attribute to handle google sign-ins.
    Note: would be better retrieved through .env, temporarily hardcoded for local development. */
const CLIENT_ID = '1004973629155-j40kd0cl0grnku1a3nihciidnvrhat1a.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

/*
Below exist the firebase functions/routes which are utilized to add places, retrieve places, and keep track of 
user votes. Additional routes which exist are the processing of user sign-ins. 

Soon to be implemented is the transferred responsiblity of Places API calls to the backend as
well as the caching of API calls via (longitude, latitude) buckets. 
*/

/*addPlace adds a new place to our database by google's returned place ID.
  Take the text parameter passed to this HTTP endpoint and insert it into 
  Firestore under the path /messages/:documentId/original */
async function addNewPlace(newPlaceID) {
  // Retrieve the text parameter for the unique place ID
  console.log("Request to addPlace made with:", newPlaceID);
  const data = {
    rating: 0
  };

  // Push the new message into Firestore using the Firebase Admin SDK
  const writeResult = await admin.firestore().collection('places').doc(newPlaceID).set(data);
}

exports.addPlace = functions.https.onRequest(async (req, res) => {
  // Retrieve the text parameter for the unique place ID
  const placeID = req.query.text;
  res.set("Access-Control-Allow-Origin", "*");
  console.log("Request to addPlace made with:", placeID);
  const data = {
    rating: 0
  };

  // Push the new message into Firestore using the Firebase Admin SDK
  const writeResult = await admin.firestore().collection('places').doc(placeID).set(data);

  // Send back a message that we've successfully written the message
  res.status(200).send(`Added place with ID: ${placeID} added.`);
});

// Attempts to retrieve a place from Firestore 'places' collection
async function retrievePlace(placeID) {
  const placeRef = admin.firestore().collection('places').doc(placeID);
  const place = await placeRef.get();
  return place;
}

// getPlace finds a place rating
exports.getPlace = functions.https.onRequest(async (req, res) => {
  // Retrieve the text parameter for the unique place ID
  const placeID = req.query.text;
  const place = await retrievePlace(placeID);

  res.set("Access-Control-Allow-Origin", "*");
  console.log("Request to getPlace made with:", req.query.text, placeID);
  if (!place.exists) { // Place does not exist, return 404
    res.json({result: `Could not find place: ${placeID}`}, 404);
  } else { // Place exists, return associated rating for place 
    res.json({result: `Place found for placeID ${placeID}, rating: `+ place.data()['rating'], rating: place.data()['rating']},200);
  }
});

// getUserVote is a helper function of updateRating to determine current user vote value for a place
function getUserVote(ratingChange) {
  let userVote = 0;

  // Determine if vote is a down vote, based on ratingChange (vote value - previous vote value)
  if (ratingChange < 0) { 
    // 1 -> -1 = -2 or 0 -> -1 = -1 (down vote)
    userVote = -1;
  } else if (ratingChange > 0) { 
    // -1 -> 1 = 2 or 0 -> 1 = 1 (up vote)
    userVote = 1;
  } else {
    // 1 -> 1 = 0 or -1 -> -1 = 0 (vote is revoked)
    userVote = 0;
  }

  return userVote;
}

// setUserVote is a helper function of updateRating to determine the change to total vote count for a place
function getRatingChange(user, placeID, voteValue) {
  let userRatings = user.data()['ratings'];

  if (userRatings[placeID]) { // If user has already voted on this place, return value of vote minus current user vote value
    return voteValue - userRatings[placeID];
  } else { // If user has not voted on this place yet, set value to voteValue in ratings dict
    return voteValue;
  }
}


// updateRating updates the rating for place specified in req with the specified voteValue value.
exports.updateRating = functions.https.onRequest(async (req, res) => {
  // Verify that user is logged in/exists in database (eligible to rate places)
  const userID = req.query.userID;
  const userRef = admin.firestore().collection('users').doc(userID);
  const user = await userRef.get();
  if (!user.exists) {
    res.set('Access-Control-Allow-Origin', '*');
    console.log("User does not exist");
    res.status(500).json({message: 'User does not exist in database.'});
    return;
  }

  // Retrieve place id and vote value
  const placeID = req.query.place;
  const voteValue = req.query.voteVal;

  // Call on getRatingChange and getUserVote to determine rating change for place total and user vote status
  let ratingChange = getRatingChange(user, placeID, voteValue);
  const userVote = getUserVote(ratingChange);

  // If ratingChange is 0, return 1 or -1 (revoked vote case, e.g. upvoted but clicked upvote again) 
  if (ratingChange === 0) { // 1 -> 1 = 0 or -1 -> -1 = 0 (base case for revoked vote)
    ratingChange = voteValue > 0 ? -1 : 1;
  }
  const updateUserRatings = await admin.firestore().collection('users').doc(userID).update({
    ratings: {
      [placeID]: parseInt(userVote), 
    }
  });

  // Dev note: Should likely return userVote in the response and updated total to dictate window display (e.g. show current vote status and 'realtime' up/downvote)
  res.set("Access-Control-Allow-Origin", "*");
  console.log("Request to updateRating made with:", placeID, voteValue, ratingChange, userVote);
  // Use placeID to update rating in collection accordingly
  try {
    const placeRef = admin.firestore().collection('places').doc(placeID);
    const results = await placeRef.update({
      rating: admin.firestore.FieldValue.increment(parseInt(ratingChange))
    });
    res.json({ results: results });
  }
  catch (err) {
    res.send({ message: err }, 404);
  }
});

// verifyUserIdToken verifies a google user id token upon login.
// Reference documentation: https://developers.google.com/identity/sign-in/web/backend-auth
exports.verifyUserIdToken = functions.https.onRequest(async (req, res) => {
  // Grab the token parameter
  const tokenId = req.body['idtoken'];

  // Verify that google user id token is valid
  async function verify() { 
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
  }
  verify().catch(console.error);
  console.log("User Token is valid.");
  res.set('Access-Control-Allow-Origin', '*');
  res.sendStatus(200);
});


// setupUser determines if a user is returning or new. Retrieves pertinent user information such as ratings and favorite restaurants.
// User's information will be a collection hashed by their token. This collection contains their rating information and favorited restaurants.
exports.setupUser = functions.https.onRequest(async (req, res) => {
  // Grab the userID parameter, update userID global
  let ID = req.body['userID'];
  const userRef = admin.firestore().collection('users').doc(ID);
  const user = await userRef.get();

  res.set("Access-Control-Allow-Origin", "*");
  console.log("Request to setupUser made with:", ID);
  if (!user.exists) { // If user does not exist in database yet, add them to the users collection
    console.log("New User. Adding information to Firestore.");
    const userData = {
      ratings: {},
      favorites: {},
    };
    const addedUser = await admin.firestore().collection('users').doc(ID).set(userData);
    res.status(201).json({result: 'User added to database.', ratings: {}, favorites: {}});
  } else { // If user already in database, respond with the user's ratings and favorites.
    res.status(200).json({result: 'User found.', ratings: user.data()['ratings'], favorites: user.data()['favorites']});
  }
});


// Run request for restaurants close with lat, lng center for cuisine type
async function retrieveRestaurantsHelper(cuisine, lat, lng, radius) {
  // Set places search type to 'restaurant' and noClampNoWrap to true (bounds on latlng), places URL
  const searchType = 'restaurant';
  const noClampNoWrap = 14;
  const placesRoute = 'https://maps.googleapis.com/maps/api/place/textsearch/json?';

  //console.log(`URL: ${placesRoute}latlng=${lat},${lng},${noClampNoWrap}&type=${searchType}&radius=${radius}&query=${cuisine}&key=${placesAPIKey}`);
  try {
    const {data} = await axios.get(
      `${placesRoute}location=${lat}%2C${lng}&type=${searchType}&radius=${radius}&query=${cuisine}&key=${placesAPIKey}`);
    //console.log("Data retrieved from places:", data);
    return data;
  } catch (err) {
    next(err) // Pass errors to express
  }
}

// Find place ratings for restaurants by place ID, if none then initialize entry for place
async function findRestaurantRatings(restaurants) {
  return new Promise(async function(resolve, reject) {
    // For each restaurant, attempt to find local rating, else set to 0
    const mapRatingResults = await Promise.all(restaurants.results.map(async (result) => { 
      var place = await retrievePlace(result.place_id);
      
      // If place does not exist, add place to database, set localRating to 0
      if (!place.exists) { 
        console.log("place does not exist");
        result["localRating"] = 0;
        addNewPlace(result.place_id);
      } else { // Place exists, set localRating to it's stored rating value
        console.log("place exists");
        result["localRating"] = place.data()['rating'];
      }

      // Return updated result
      return result;
    }));

    // If localRatings have been set, resolve, else error
    if (mapRatingResults[0].localRating >= 0) { 
      resolve("Local rating set.");
    } else {
      reject(Error("Local ratings not set."));
    }
  });
}

// Retrieve restaurants for cuisine type, check for stored ratings, soon to incorporate checks for cached results
exports.retrieveRestaurants = functions.https.onRequest(async (req, res) => {
  // Attempt to retrieve request query parameters
  const cuisine = req.query.cuisine || null;
  const lat = req.query.lat || null;
  const lng = req.query.lng || null;
  const radius = req.query.radius || null;

  console.log("Lat lng inside retrieve restaurants:", lat, lng);

  // Set Allow-Access-Origin
  res.set('Access-Control-Allow-Origin', '*');
  console.log(`Inside retrieve restaurants with ${cuisine}, ${lat}, ${lng}, ${radius}, ${placesAPIKey}, ${process.env.GOOGLE_API_KEY}`);
  // If necessary paremeters are not specified, respond with error
  if (!(cuisine && lat && lng && radius)) {
    // Notify unsuccessful retrieval of restaurants
    console.log("Bad request, at least one of the necessary parameters not provided: cuisine, lat, lng, radius.")
    res.status(400);
    res.json({message: "Bad request, at least one of the necessary parameters not provided: cuisine, lat, lng, radius."})
    res.send();
  }

  // Want to check our cache to see if we have served request previously

  // Utilize helper to retrieve restaurant results, process restaurants to see if they have previously stored rating data
  try {
    var restaurants = await retrieveRestaurantsHelper(cuisine, lat, lng, radius);
    findRestaurantRatings(restaurants)
    .then(_ => { // Once ratings have been retrieved, serve request
      console.log("This is local rating retrieved:", restaurants.results[0].localRating);
      res.status(200).json({message: "Successfully retrieved restaurants.", restaurants: restaurants});
      res.send();
    });
  } catch (err) {
    // Notify unsuccessful retrieval of restaurants
    console.log(`Error occured in retrieve restaurants: ${err}`);
    res.status(500);
    res.json({message: "Error occurred when retrieving restaurants."});
    res.send();
  }
});
