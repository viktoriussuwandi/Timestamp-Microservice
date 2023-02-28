// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/:date?", (req,res) => {
  let input = req.params.date;

  /*1.create variable for checking :  
      a.isValidDate 
        to check if input is string with valid date format -> 
        if not valid date, it will return NaN 
        example : 
        -valid   : 2015-12-25, 
        -invalid : 2015-02-31, 1451001600000
  */
  let isValidDate       = Date.parse(input); 

  /*  b.isValidUnixNumber
        to check if input is string with whole number(no symbol or character in the middle of input) -> 
        it must be valid unix (source : https://benjaminsemah.com/build-timestamp-microservice)
  */
  let isValidUnixNumber = /^[0-9]+$/.test(input)

  //  c.isEmpty to check there is nothing in input
  let isEmpty = input == "" || input == null;
  
  //3.create another variables used in if-else
  let unix_output = 0;
  let utc_output  = "";
  
  if (isValidDate) {
    unix_output = new Date(input);
    utc_output  = unix_output.toUTCString();
    // valueOf used for getting a variable back to primitive type
    return res.json({unix : unix_output.valueOf(), utc : utc_output});
  }
  else if (isNaN(isValidDate) && isValidUnixNumber) {
    unix_output = new Date(parseInt(input));
    utc_output  = unix_output.toUTCString();
    return res.json({unix : unix_output.valueOf(), utc : utc_output});
  }
  else if (isEmpty) {
    unix_output = new Date();
    utc_output  = unix_output.toUTCString();
    return res.json({unix : unix_output.valueOf(), utc : utc_output});  
  }
  else {
    res.json({error: "Invalid Date"});
  }
  
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});