//require("dotenv").config() //ignore

//console.log(process.env); // ignore 

const express = require('express'); // "imports" express framework
const app = express(); // creates the webapp
const axios = require('axios')
const path = require('path');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient; //create client to use mongodb
const uri = `mongodb+srv://delishfood:delishfood@cluster0.ailvm.mongodb.net/delishfood?retryWrites=true&w=majority`; //url to connect to mongodb atlas cluster
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); //initalize our client

//name of database 
const dbName = "delishfood"; 
 
//function to test interacting with the database (adding a document and finding it)
 async function run() {
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
run().catch(console.dir);
/*
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, '/public'))); 


router.get('/', (req,res) => {
  res.render("index");
});

app.use('/', router); 
*/
app.listen(process.env.port || 8080);

console.log('Server listening on port 8080!');
console.log('Open up a browser and go to localhost:8080/');


