const functions = require('firebase-functions');
const cors = require('cors')({origin: true,});

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

//addnewplace
// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
exports.addPlace = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
  const placeid = req.query.text;

  const data = {
    rating: 0
  };
  res.set("Access-Control-Allow-Origin", "*")
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
  res.set("Access-Control-Allow-Origin", "*")
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
  // input will come in as this form (placeid:1)
  const splitInput = input.split(':')
  const placeId = splitInput[0]
  const ratingChange = splitInput[1]
  res.set("Access-Control-Allow-Origin", "*")
  //use placeid to update rating in collection accordingly
  try {
    console.log('placeid', placeId)
    const placeRef = admin.firestore().collection('places').doc(placeId);
    console.log('placeref', placeRef)
    const results = await placeRef.update({
      rating: admin.firestore.FieldValue.increment(parseInt(ratingChange))
    });
    res.json({ results: results })
  }
  catch (err) {
    res.send({ message: err },404);
}
  
  
  // if (!place.exists) {
  //   res.json({result: `No place found for placeid ${placeid}`});
  // } 

  // else {
  //   //update thsplitString[1]e rating
  //   const data = {
  //     rating: ratingChange
  //   };
  //   // Push the new message into Firestore using the Firebase Admin SDK.
  //   const writeResult = await admin.firestore().collection('places').doc(placeid).set(data);
  //   res.json({result: `Update place with ID: ${placeid}. New rating: ` + place.data()['rating']});
  // }
});

//tests:
//http://localhost:5001/delish-2/us-central1/addMessage?text=asdf1234ghjk
//http://localhost:5001/delish-2/us-central1/addMessage?text=asdf1234ghjk