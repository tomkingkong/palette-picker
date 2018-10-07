// imports express function
const express = require('express');

// initializes server with express function, 
// gaining access to all of express methods
const app = express();

// import body parser object
const bodyParser = require('body-parser');

// import express cors function
const cors = require('express-cors');

// set port to either an existing environment PORT key, 
// or default to 3000
app.set('port', process.env.PORT || 3000);

// import query request handlers 
const colors = require('./routes/colorsAPI');

// have server point to public folder to retreive 
// resources
app.use(express.static('public'));

// apply cors method to all requests
// totally uncessary precaution
app.use(cors());

// apply cors headers to all requests
// totally uncessary precaution
app.use(function(req, res, next) {
  // enable all origins
  res.header("Access-Control-Allow-Origin", "*");
  // enable all methods
  res.header("Access-Control-Allow-Methods", "*");
  // enable for all headers
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // process any remaining middleware
  next();
});

// apply bodyparser to all requests to  
// have payload bodies return parsed data
// from either JSON or urlencoded formats
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// apply colors request methods to every path
app.use('/', colors);

// have the server listen for any request made to
// the given port
app.listen(app.get('port'), () => {
  // console log the port being used
  console.log(`Hey, Listen! Running on http://localhost:${app.get('port')}`)
});