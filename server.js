var express = require('express');
var cors = require('express-cors');
var port = process.env.PORT || 3000;
var app = express();
var bodyParser = require('body-parser');
var colors = require('./routes/colorsAPI');

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', colors);

app.listen(port);

console.log(`Listening at http://localhost:${port}`);