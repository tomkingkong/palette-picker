const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('express-cors');
app.set('port', process.env.PORT || 3000);

const colors = require('./routes/colorsAPI');

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

app.listen(app.get('port'), () => {
  console.log(`Hey, Listen! Running on http://localhost:${app.get('port')}`)
});