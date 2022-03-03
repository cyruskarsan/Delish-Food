// Server attributes
const serverDomain = 'http://localhost:5001/delish-2/us-central1';

// Test endpoints
var endpoints = {
    retrieveRestaurants: 'retrieveRestaurants',
};

// Set route query parameters
var cuisine = 'mexican';
var lat = 37.7749;
var lng = 122.4194;
var radius = 5;

// Set request reference
var request = require('request');

// Set request options
var options = {
    method: 'GET',
    url: `${serverDomain}/${endpoints.retrieveRestaurants}?cuisine=${cuisine}&lat=${lat}&lng=${lng}&radius=${radius}`,
    headers: {
        'accept': 'application/json'
    },
    json: true
}

request(options, (error, response, body) => {
    console.log(error);
    if (error) throw new Error(error)

    console.log('This is response JSON: ' + JSON.stringify(body))
});