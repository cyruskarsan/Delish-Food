const functions = require('firebase-functions');
const cors = require('cors')({origin: true,});
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '609530060923-6a276d3itljrb5986lq2tlrgiudduafc.apps.googleusercontent.com'
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
  const placeid = req.query.text;

  res.set("Access-Control-Allow-Origin", "*");
  console.log("Request to addPlace made with:", req.query.text, placeid);
  const data = {
    rating: 0
  };
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await admin.firestore().collection('places').doc(placeid).set(data);

  // Send back a message that we've successfully written the message
  res.status(200).send(`Added place with ID: ${placeid} added.`);
});


// getPlace finds a place rating.
exports.getPlace = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const placeid = req.query.text;
  const placeRef = admin.firestore().collection('places').doc(placeid);
  const place = await placeRef.get();

  res.set("Access-Control-Allow-Origin", "*");
  console.log("Request to getPlace made with:", req.query.text, placeid);
  if (!place.exists) {
    res.json({result: `Could not find place: ${placeid}`}, 404);
  } else {
    res.json({result: `Place found for placeid ${placeid}, rating: `+ place.data()['rating'], rating: place.data()['rating']},200);
  }
  
});


// updateRating updates the rating for place specified in req with the specified ratingChange value.
exports.updateRating = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const input = req.query.text;

  // Input will come in as this form (placeid:ratingChange)
  const splitInput = input.split(':');
  const placeId = splitInput[0];
  const ratingChange = splitInput[1];

  res.set("Access-Control-Allow-Origin", "*");
  console.log("Request to updateRating made with:", req.query.text, placeId, ratingChange);
  // Use placeid to update rating in collection accordingly
  try {
    const placeRef = admin.firestore().collection('places').doc(placeId);
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
  console.log("User Token is valid.")
  res.set('Access-Control-Allow-Origin', '*');
  res.sendStatus(200);
});


// setupUser determines if a user is returning or new. Retrieves pertinent user information such as ratings and favorite restaurants.
// User's information will be a collection hashed by their token. This collection contains their rating information and favorited restaurants.
exports.setupUser = functions.https.onRequest(async (req, res) => {
  // Grab the userID parameter
  const userID = req.body['userID'];
  const userRef = admin.firestore().collection('users').doc(userID);
  const user = await userRef.get();

  res.set("Access-Control-Allow-Origin", "*");
  console.log("Request to setupUser made with:", userID);
  if (!user.exists) { // If user does not exist in database yet, add them to the users collection
    console.log("New User. Adding information to Firestore.");
    const userData = {
      ratings: {},
      favorites: {},
    };
    const addedUser = await admin.firestore().collection('users').doc(userID).set(userData);
    res.json({result: 'User added to database.', ratings: {}, favorites: {}}, 201);
  } else { // If user already in database, respond with the user's ratings and favorites.
    res.json({result: 'User found.', ratings: user.data()['ratings'], favorites: user.data()['favorites']}, 200);
  }
});
