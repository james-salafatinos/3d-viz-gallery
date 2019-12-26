function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('p5Div');
  fill('red');
  ellipse(width / 2, height / 2, 80, 80);
}

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