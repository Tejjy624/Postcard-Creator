// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const assets = require('./assets');
app.use(express.json());

// Multer is a module to read and handle FormData objects, on the server side
const multer = require('multer');
const fs = require("fs");

// Make a "storage" object that explains to multer where to store the images...in /images
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/images')    
  },
  // keep the file's original name
  // the default behavior is to make up a random string
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

// Use that storage object we just made to make a multer object that knows how to 
// parse FormData objects and store the files they contain
let uploadMulter = multer({storage: storage});

// First, server any static file requests
app.use(express.static('public'));
app.use(express.static('display'));

// Next, serve any images out of the /images directory
app.use("/images",express.static('images'));

// Next, serve images out of /assets (we don't need this, but we might in the future)
app.use("/assets", assets);

// Next, if no path is given, assume we will look at the postcard creation page
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

// Next, handle post request to upload an image
// by calling the "single" method of the object uploadMulter that we made above
app.post('/upload', uploadMulter.single('newImage'), function (request, response) {
  // file is automatically stored in /images
  // WARNING!  Even though Glitch is storing the file, it won't show up 
  // when you look at the /images directory when browsing your project
  // until later (or unless you open the console (Tools->Terminal) and type "refresh").  
  // So sorry. 
  console.log("Recieved",request.file.originalname,request.file.size,"bytes")
  // the file object "request.file" is truthy if the file exists
  if(request.file) {
    // Always send HTTP response back to the browser.  In this case it's just a quick note. 
    response.end("Server recieved "+request.file.originalname);
  }
  else throw 'error';
})

app.post('/saveDisplay', function(request,response){
  console.log(request.body);
  fs.writeFile(
    "postcardData.json",
    JSON.stringify(request.body),
    "utf8",
    function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("Postcard data retrieved and save onto postcardData.json");
    }
  );
  response.send(request.body);
  response.end();
});

app.get("/saveDisplay", function(request, response){
  response.writeHead(200, { "Content-Type": "application/json" });
  let data = fs.readFileSync("/app/postcardData.json");
  let jsondata = JSON.parse(data);
  response.write(JSON.stringify(jsondata));
  console.log(jsondata);
  response.end();
});

// listen for HTTP requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
