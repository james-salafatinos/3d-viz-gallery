// server.js
// where your node app starts

// init project
const express = require("express");
const port = 3000;
const app = express();

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

//set https
// app.set('trust proxy', true); // <- required
// app.use((req, res) => {
//   // if(!req.secure) return res.redirect('https://' + req.get('host') + req.url);
//   res.send()
// });


app.use(express.static("public"));


app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/homepage.html");
});

app.get("/wave-touch", function(request, response) {
  response.sendFile(__dirname + "/views/wave-touch.html");
});
app.get("/balls-in-a-spaceship", function(request, response) {
  response.sendFile(__dirname + "/views/balls-in-a-spaceship.html");
});


//Listening with a link
app.listen(port, () => {
  console.log(`wExplore app listening at http://localhost:${port}`);
});