// P5.JS + ML5.JS PART
//🎨🖌🖼.js + 🤖🚜🚗.js

let video;
let poseNet;
let poses = [];

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('p5Div');
  fill('white');
  textSize(25);
  text('What’s going on here? p5.js is accessing your web camera, drawing the big red ellipse in the center of the screen. 3D cube is rotating with three.js. ML5.js is detecting your body parts (you can find)', width / 2.9, 30, 500, 200);
  fill('red');
  ellipse(width / 2, height / 2, 80, 80);
  video = createCapture(VIDEO);
  video.size(width, height);
  
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function(results) {
    poses = results;
    console.log(poses);
  });
  video.hide();
}

function draw() {
  image(video, 0, 0, 200, 200);
  drawKeypoints();
}

function modelReady(){
  console.log('it is ready ');
}

function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// THREE.JS PART
//🌳🌲🌴🎄.js

var scene = new THREE.Scene();
var cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({
  color: 0xCE03AE
});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

cam.position.z = 5;

var render = function() {
  requestAnimationFrame(render);

  cube.rotation.x += 0.02;
  cube.rotation.y += 0.05;

  renderer.render(scene, cam);
};

render();