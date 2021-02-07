const functions = require('firebase-functions');

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

// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
    .onCreate((snap, context) => {
      // Grab the current value of what was written to Firestore.
      const original = snap.data().original;

      // Access the parameter `{documentId}` with `context.params`
      functions.logger.log('Uppercasing', context.params.documentId, original);
      
      const uppercase = original.toUpperCase();
      
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to Firestore.
      // Setting an 'uppercase' field in Firestore document returns a Promise.
      return snap.ref.set({uppercase}, {merge: true});
    });

//addnewplace
// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const placeid = req.query.text;

  const data = {
    rating: 0
  };
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await admin.firestore().collection('places').doc(placeid).set(data);
  // Send back a message that we've successfully written the message
  res.json({result: `Message with ID: ${writeResult.id} added.`});
});

//findplacerating
exports.getPlace = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const placeid = req.query.text;

  const placeRef = admin.firestore().collection('places').doc(placeid);
  const place = await placeRef.get();

  if(!place.exists) {
    res.json({result: `No place found for placeid ${placeid}`});
  } else {
    res.json({result: `Place found for placeid ${placeid},`+ place.data()[rating]});
  }
  // Push the new message into Firestore using the Firebase Admin SDK.
  // Send back a message that we've successfully written the message
  res.json({result: `Place with ID: ${placeid} searched.`});
});


//updateRating