//require("dotenv").config() //ignore

//console.log(process.env); // ignore 

const express = require('express'); // "imports" express framework
const app = express(); // creates the webapp
const axios = require('axios')
const path = require('path');
var mongoose = require('mongoose');
const router = express.Router();
const Realm = require("realm");

const MongoClient = require('mongodb').MongoClient; //create client to use mongodb
const uri = `mongodb+srv://delishfood:delishfood@cluster0.ailvm.mongodb.net/delishfood?retryWrites=true&w=majority`; //url to connect to mongodb atlas cluster
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); //initalize our client

//mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
    //console.log("connected to database")); 

    //name of database 
const dbName = "delishfood"; 

const realmApp = new Realm.App({ id: "application-0-tesrq" });

const RatingSchema = {
    name: 'ratings',
    properties: {
      _id: 'objectId',
      rating: 'int',
    },
    primaryKey: '_id',
  };
  
  async function handleLogin() {
    // Create a Credentials object to identify the user.
    // Anonymous credentials don't have any identifying information, but other
    // authentication providers accept additional data, like a user's email and
    // password.
    const credentials = Realm.Credentials.anonymous();
    // You can log in with any set of credentials using `app.logIn()`
    const user = await realmApp.logIn(credentials);
    console.log(`Logged in with the user id: ${user.id}`);
  };
  handleLogin().catch(err => {
    console.error("Failed to log in:", err)
  });


 
async function run() {
  await realmApp.logIn(new Realm.Credentials.anonymous());
  // When you open a synced realm, the SDK automatically automatically
  // creates the realm on the device (if it didn't exist already) and
  // syncs pending remote changes as well as any unsynced changes made
  // to the realm on the device.
  const realm = await Realm.open({
    schema: [RatingSchema],
    sync: {
      user: realmApp.currentUser,
      partitionValue: "ratings",
    },
  });

  // The myPartition realm is now synced to the device. You can
  // access it through the `realm` object returned by `Realm.open()`
}
run().catch(err => {
  console.error("Failed to open realm:", err)
}); 


//function to test interacting with the database (adding a document and finding it)
 /*async function run() {
    try {
         await client.connect();
         console.log("Connected correctly to database");

         // use database "delishfood"
         const db = client.db(dbName);

         // Use the collection "ratings"
         const col = db.collection("ratings");

         // Construct a document                                                                                                                                                              
         let ratingsDocument = {
             "rating": 5
         }

         // Insert a single document, wait for promise so we can read it back
         const p = await col.insertOne(ratingsDocument);
         // Find one document
         const myDoc = await col.findOne();
         // Print to the console
         console.log(myDoc);

        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}
//run the db testing function
run().catch(console.dir); */

async function upVote(client, id) {
    await client.connect();
    result = await client.db("delishfood").collection("ratings")
    .updateOne({ _id: "sample_place" }, { $inc: { rating: 1} });
    console.log("Found id:" + id);
}

upVote(client, "sample_place");

app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, '/public'))); 

router.get('/', (req,res) => {
  res.render("index");
});


router.post('/', (req,res) => {
    
});

app.use('/', router); 

app.listen(process.env.port || 8080);

console.log('Server listening on port 8080!');
console.log('Open up a browser and go to localhost:8080/');
