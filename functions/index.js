// Init requirements for firebase and sign in apis
const functions = require('firebase-functions');
const cors = require('cors')({origin: true,});
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '609530060923-6a276d3itljrb5986lq2tlrgiudduafc.apps.googleusercontent.com'; // Ideally retrieved through .env
const client = new OAuth2Client(CLIENT_ID);

// firebase emulators:start
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();


// addPlace adds a new place.
// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
exports.addPlace = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const placeID = req.query.text;

  res.set("Access-Control-Allow-Origin", "*");
  console.log("Request to addPlace made with:", req.query.text, placeID);
  const data = {
    rating: 0
  };
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await admin.firestore().collection('places').doc(placeID).set(data);

  // Send back a message that we've successfully written the message
  res.status(200).send(`Added place with ID: ${placeID} added.`);
});


// getPlace finds a place rating.
exports.getPlace = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const placeID = req.query.text;
  const placeRef = admin.firestore().collection('places').doc(placeID);
  const place = await placeRef.get();

  res.set("Access-Control-Allow-Origin", "*");
  console.log("Request to getPlace made with:", req.query.text, placeID);
  if (!place.exists) {
    res.json({result: `Could not find place: ${placeID}`}, 404);
  } else {
    res.json({result: `Place found for placeID ${placeID}, rating: `+ place.data()['rating'], rating: place.data()['rating']},200);
  }
  
});


// getUserVote is a helper function of updateRating to determine current user vote value for a place
function getUserVote(ratingChange) {
  let userVote = 0;

  if (ratingChange < 0) { // 1 -> -1 = -2 or 0 -> -1 = -1 (down vote)
    userVote = -1;
  } else if (ratingChange > 0) { // -1 -> 1 = 2 or 0 -> 1 = 1 (up vote)
    userVote = 1;
  } else { // 1 -> 1 = 0 or -1 -> -1 = 0 (revoked vote)
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
  // Verify that user is logged in (eligible to rate places)
  const userID = req.query.userID;
  const userRef = admin.firestore().collection('users').doc(userID);
  const user = await userRef.get();
  if (!user.exists) {
    res.set('Access-Control-Allow-Origin', '*');
    console.log("User does not exist");
    res.status(500).json({message: 'User does not exist in database.'});
    return;
  }

  // Grab the text parameter
  const input = req.query.text;

  // Input will come in as this form (placeID:voteValue)
  const splitInput = input.split(':');
  const placeID = splitInput[0];
  const voteValue = splitInput[1];

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
  console.log("Request to updateRating made with:", req.query.text, placeID, ratingChange, userVote);
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

// Format to use for removing place in ratings dict: delete ratings[placeID];
// Format to use for adding place to rating for a specified user: dict[placeID] = vote_value;
// After both of these update the respective objects dictionaries. (Might want to have users store collections instead of docs with maps in them...)
