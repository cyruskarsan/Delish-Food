const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios')
const path = require('path');
const router = express.Router();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

//required by swagger JS to setup initial swagger doc
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
      info: {
        version: "1.0.0",
        title: "Delish API",
        description: "Delish API ratings information",
        contact: {
          name: "Cyrus Karsan"
        }
      }
    },
    apis: ["server.js"]
  };

//define the OpenAPI doc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

//setup the visual api doc tester
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//bodyparser parses json in the request body
app.use(bodyParser.json());

//cors allows us to access API from different machines with different ips
app.use(cors());

//setup connection to mongoDB atlas
const MongoClient = require('mongodb').MongoClient; //create client to use mongodb
const uri = `mongodb+srv://delishfood:delishfood@cluster0.ailvm.mongodb.net/delishfood?retryWrites=true&w=majority`; //url to connect to mongodb atlas cluster
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); //initalize our client

//define MongoDB schema
const RatingSchema = mongoose.Schema({
    placeid: String,
    rating: {
        type: Number,
        default: 0
    }
});

//create a document based on the rating schema
const ratingDoc = mongoose.model('ratingDoc', RatingSchema);

//connect to database
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
    console.log("Connected to database!"));

/**
 * @swagger
 * /get-docs:
 *  get:
 *    summary: Retrieves all documents in the ratings collection in MongoDB
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/get-docs', async (req, res) => {
    try {
        const getRatings = await ratingDoc.find();
        res.json(getRatings);
    }
    catch (err) {
        res.json({ message: err });
    }
});

/**
 * @swagger
 * /add-doc:
 *  post:
 *    summary: Add a new rating to the ratings collection in MongoDB
 *    description: Create a new document in the ratings collection of the resturant and it's rating
 *    requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      placeid:
 *                          type: string
 *                      rating:
 *                          type: integer
 *                          format: int64
 *                          minimum: 1
 * 
 *
 *    responses:
 *      '200':
 *        description: Rating added successfully
 */
router.post('/add-doc', async (req, res) => {
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

/**
 * @swagger
 * /{mongo_id}:
 *  get:
 *    summary: Retrieves document of given id
 *    description: Given a unique MongoDB document _id, return the data associated with the document.
 *    parameters:
 *      - name: mongo_id
 *        in: path 
 *        required: true
 *        description: unique mongo document _id
 *        schema:
 *          type: string    
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/:mongo_id', async (req, res) => {
    try {
        const findSpecificDoc = await ratingDoc.findById(req.params.mongo_id);
        res.json(findSpecificDoc);
    }
    catch (err) {
        res.json({ message: err });
    }
});

/**
 * @swagger
 * /{mongo_id}:
 *  delete:
 *    summary: Removes document from ratings collection
 *    description: Given a unique MongoDB document _id, delete the document associated with the _id
 *    parameters:
 *      - name: mongo_id
 *        in: path 
 *        required: true
 *        description: unique document _id
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.delete('/:mongo_id', async (req, res) => {
    try {
        const removedDoc = await ratingDoc.remove({ _id: req.params.mongo_id});
        res.json(removedDoc);
    }
    catch (err) {
        res.json({ message: err });
    }
});

/**
 * @swagger
 * /{mongo_id}:
 *  patch:
 *    summary: increment rating of resturant in document
 *    parameters:
 *      - name: mongo_id
 *        in: path 
 *        required: true
 *        description: unique document _id
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.patch('/:mongo_id', async (req, res) => {
    try {
        const updatedDoc = await ratingDoc.updateOne({ _id: req.params.mongo_id }, { $inc: { rating: 1 } });
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
