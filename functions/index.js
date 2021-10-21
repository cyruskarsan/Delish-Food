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

// Add New Place
// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
exports.addPlace = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
  const placeid = req.query.text;

  console.log("Request to addPlace made with:", req.query.text, placeid);

  const data = {
    rating: 0
  };
  res.set("Access-Control-Allow-Origin", "*");
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await admin.firestore().collection('places').doc(placeid).set(data);
  // Send back a message that we've successfully written the message
  
  res.status(200).send(`Added place with ID: ${placeid} added.`);
});

//findplacerating
exports.getPlace = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const placeid = req.query.text;
  const placeRef = admin.firestore().collection('places').doc(placeid);
  const place = await placeRef.get();

  console.log("Request to getPlace made with:", req.query.text, placeid);
  res.set("Access-Control-Allow-Origin", "*");
  if (!place.exists) {
    res.json({result: `Could not find place: ${placeid}`}, 404);
  } else {
    res.json({ result: `Place found for placeid ${placeid},rating: `+ place.data()['rating'], rating: place.data()['rating']},200);
  }
  
});

//updateRating
//in the query, pass placeid and append some char for upvote/downvote
//split string into placeid and up/downvote char
//retrieve rating by doing a get with placeid
//update rating using the function thing

exports.updateRating = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const input = req.query.text;
  // input will come in as this form (placeid:ratingChange)
  const splitInput = input.split(':')
  const placeId = splitInput[0]
  const ratingChange = splitInput[1]
  res.set("Access-Control-Allow-Origin", "*")
  console.log("Request to updateRating made with:", req.query.text, placeId, ratingChange);

  //use placeid to update rating in collection accordingly
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


// Verify google user upon login
// reference documentation: https://developers.google.com/identity/sign-in/web/backend-auth
exports.verifyUserIdToken = functions.https.onRequest(async (req, res) => {
  const tokenIdString = req.body['idtoken'];
  let status = 200;
  async function verify() { // Verify google user id token is valid
    const ticket = await client.verifyIdToken({
      idToken: tokenIdString,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
  }
  verify().catch(console.error);
  console.log("User Token is valid.")
  res.set('Access-Control-Allow-Origin', '*');
  res.sendStatus(status);
});
