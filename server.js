// server.js
// where your node app starts

// init project
const express = require("express");
const port = 3000;
const app = express();
const path = require('path')

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

//set https
// app.set('trust proxy', true); // <- required
// app.use((req, res) => {
//   // if(!req.secure) return res.redirect('https://' + req.get('host') + req.url);
//   res.send()
// });


app.use(express.static("public"));

app.get("/", function (request, response) {
  app.use('/build/three.module.js', express.static(path.join(__dirname, './node_modules/three/build/three.module.js')))
  response.sendFile(__dirname + "/views/homepage.html");
});

app.get("/wave-touch", function (request, response) {
  app.use('/build/three.module.js', express.static(path.join(__dirname, './node_modules/three/build/three.module.js')))
  app.use('/jsm/controls/OrbitControls', express.static(path.join(__dirname, '/node_modules/three/examples/jsm/controls/OrbitControls.js')))
  response.sendFile(__dirname + "/views/wave-touch.html");
});
app.get("/balls-in-a-spaceship", function (request, response) {
  app.use('/build/three.module.js', express.static(path.join(__dirname, './node_modules/three/build/three.module.js')))
  app.use('/jsm/controls/OrbitControls', express.static(path.join(__dirname, '/node_modules/three/examples/jsm/controls/OrbitControls.js')))
  response.sendFile(__dirname + "/views/balls-in-a-spaceship.html");
});

app.get("/locked-in-a-room", function (request, response) {
  app.use('/build/three.module.js', express.static(path.join(__dirname, './node_modules/three/build/three.module.js')))
  app.use('/jsm/controls/OrbitControls', express.static(path.join(__dirname, '/node_modules/three/examples/jsm/controls/OrbitControls.js')))
  app.use('/jsm/controls/PointerLockControls', express.static(path.join(__dirname, '/node_modules/three/examples/jsm/controls/PointerLockControls.js')))
  response.sendFile(__dirname + "/views/locked-in-a-room.html");
});

app.get("/splines", function (request, response) {
  app.use('/build/three.module.js', express.static(path.join(__dirname, './node_modules/three/build/three.module.js')))
  app.use('/jsm/controls/OrbitControls', express.static(path.join(__dirname, '/node_modules/three/examples/jsm/controls/OrbitControls.js')))
  // app.use('/jsm/controls/PointerLockControls', express.static(path.join(__dirname, '/node_modules/three/examples/jsm/controls/PointerLockControls.js')))
  response.sendFile(__dirname + "/views/splines.html");
});



app.get("/rs-mini", function (request, response) {
  app.use('/build/three.module.js', express.static(path.join(__dirname, './node_modules/three/build/three.module.js')))
  app.use('/jsm/controls/OrbitControls', express.static(path.join(__dirname, '/node_modules/three/examples/jsm/controls/OrbitControls.js')))
  // app.use('/jsm/controls/PointerLockControls', express.static(path.join(__dirname, '/node_modules/three/examples/jsm/controls/PointerLockControls.js')))
  response.sendFile(__dirname + "/views/rs-mini.html");
});


app.get("/ants", function (request, response) {
  app.use('/build/three.module.js', express.static(path.join(__dirname, './node_modules/three/build/three.module.js')))
  app.use('/jsm/controls/OrbitControls', express.static(path.join(__dirname, '/node_modules/three/examples/jsm/controls/OrbitControls.js')))
  // app.use('/jsm/controls/PointerLockControls', express.static(path.join(__dirname, '/node_modules/three/examples/jsm/controls/PointerLockControls.js')))
  response.sendFile(__dirname + "/views/ants.html");
});



app.get("/class", function (request, response) {
  app.use('/build/three.module.js', express.static(path.join(__dirname, './node_modules/three/build/three.module.js')))
  app.use('/jsm/controls/OrbitControls', express.static(path.join(__dirname, '/node_modules/three/examples/jsm/controls/OrbitControls.js')))
  // app.use('/jsm/controls/PointerLockControls', express.static(path.join(__dirname, '/node_modules/three/examples/jsm/controls/PointerLockControls.js')))
  response.sendFile(__dirname + "/views/class.html");
});



app.get("/billiards", function (request, response) {
  app.use('/build/three.module.js', express.static(path.join(__dirname, './node_modules/three/build/three.module.js')))
  app.use('/jsm/controls/OrbitControls', express.static(path.join(__dirname, '/node_modules/three/examples/jsm/controls/OrbitControls.js')))
  // app.use('/jsm/controls/PointerLockControls', express.static(path.join(__dirname, '/node_modules/three/examples/jsm/controls/PointerLockControls.js')))
  response.sendFile(__dirname + "/views/billiards.html");
});

app.get("/double_pendulum", function (request, response) {
  app.use('/build/three.module.js', express.static(path.join(__dirname, './node_modules/three/build/three.module.js')))
  app.use('/jsm/controls/OrbitControls', express.static(path.join(__dirname, '/node_modules/three/examples/jsm/controls/OrbitControls.js')))
  // app.use('/jsm/controls/PointerLockControls', express.static(path.join(__dirname, '/node_modules/three/examples/jsm/controls/PointerLockControls.js')))
  response.sendFile(__dirname + "/views/double_pendulum.html");
});

app.get("/particle_collision", function (request, response) {
  app.use('/build/three.module.js', express.static(path.join(__dirname, './node_modules/three/build/three.module.js')))
  app.use('/jsm/controls/OrbitControls', express.static(path.join(__dirname, '/node_modules/three/examples/jsm/controls/OrbitControls.js')))
  // app.use('/jsm/controls/PointerLockControls', express.static(path.join(__dirname, '/node_modules/three/examples/jsm/controls/PointerLockControls.js')))
  response.sendFile(__dirname + "/views/particle_collision.html");
});

app.get("/wikipedia-viz", function (request, response) {

  app.use('/static', express.static('files'))
  response.sendFile(__dirname + "/views/wikipedia-viz.html");
});




//Listening with a link
app.listen(port, () => {
  console.log(`wExplore app listening at http://localhost:${port}`);
});