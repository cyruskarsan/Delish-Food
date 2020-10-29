
require('dotenv').config(); //loads the environment variables from .env

const places_api_key = process.env.PLACES_API_KEY //holds places api key

//console.log(process.env); // uncomment this line to show that the api keys are properly loaded when you run the server
                            //not needed for production just a testing line to make sure theyre stored and loaded properly

const express = require('express'); // "imports" express framework
const app = express(); // creates the webapp
const path = require('path');
const router = express.Router();

app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, '/public')));

router.get('/', (req,res) => {
  res.render("index");
});


app.use('/', router);
app.listen(process.env.port || 8080);

console.log('Server listening on port 8080!');
console.log('Open up a browser and go to localhost:8080/');

