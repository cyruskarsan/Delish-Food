//require("dotenv").config() //ignore

//console.log(process.env); // ignore 

const express = require('express'); // "imports" express framework
const mongoose = require('mongoose');
const app = express(); // creates the webapp
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios')
const path = require('path');
const router = express.Router();

app.use(bodyParser.json());
app.use(cors());

const MongoClient = require('mongodb').MongoClient; //create client to use mongodb
const uri = `mongodb+srv://delishfood:delishfood@cluster0.ailvm.mongodb.net/delishfood?retryWrites=true&w=majority`; //url to connect to mongodb atlas cluster
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); //initalize our client

const RatingSchema = mongoose.Schema({
    placeid: String,
    rating: {
        type: Number,
        default: 0
    }
});

const ratingDoc = mongoose.model('ratingDoc', RatingSchema);

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
    console.log("Connected to database!"));

/*async function upVote(client, id) {
    await client.connect();
    result = await client.db("delishfood").collection("ratings")
    .updateOne({ _id: "sample_place" }, { $inc: { rating: 1} });
    console.log("Found id:" + id);
}

upVote(client, "sample_place");*/

app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, '/public')));

//gets all documents in ratingsDoc collection in delishfood database
router.get('/', async (req, res) => {
    try {
        const getRatings = await ratingDoc.find();
        res.json(getRatings);
    }
    catch (err) {
        res.json({ message: err });
    }
});

//take data and store in our ratingDoc collection, sets id and rating. (rating has default 0)
router.post('/', async (req, res) => {
    const rating = new ratingDoc({
        placeid: req.body.placeid,
        rating: req.body.rating
    });
    try {
        const savedRating = await rating.save();
        res.json(savedRating);
    }
    catch (err) {
        res.json({ message: err });
    }
});

//takes a param from url, searches database for document with param, return the document if found
router.get('/:placeId', async (req, res) => {
    try {
        const findSpecificDoc = await ratingDoc.findById(req.params.placeId);
        res.json(findSpecificDoc);
    }
    catch (err) {
        res.json({ message: err });
    }
});

//takes a param from url, searches database for document with param, deletes document if found
router.delete('/:placeId', async (req, res) => {
    try {
        const removedDoc = await ratingDoc.remove({ _id: req.params.placeId });
        res.json(removedDoc);
    }
    catch (err) {
        res.json({ message: err });
    }
});

//finds a document with matching param from url, increments the rating by one
router.patch('/:placeId', async (req, res) => {
    try {
        const updatedDoc = await ratingDoc.updateOne({ _id: req.params.placeId }, { $inc: { rating: 1 } });
        res.json(updatedDoc);
    }
    catch (err) {
        res.json({ message: err });
    }
});


app.use('/', router);

app.listen(process.env.port || 8080);

console.log('Server listening on port 8080!');
console.log('Open up a browser and go to localhost:8080/');
