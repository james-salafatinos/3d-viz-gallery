
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5);

/*
Camera, Renderer, and Controls Definition
*/
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

// const controls = new OrbitControls(camera, renderer.domElement);
// camera.position.z = -52;
// camera.position.y = 72;

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

/*
Light Handling
*/
import { lights } from "./_lights.js";
Object.entries(lights).forEach((element) => {
  scene.add(element[1]);
});

/*
Object Handling
*/

import { items } from "./_items.js";
import { setFlagsFromString } from "v8";
import { AnyRecord } from "dns";
Object.entries(items).forEach((element) => {
  scene.add(element[1]);
});


/*
Animate
*/
var animate = function () {
  requestAnimationFrame(animate);
  controls.update();

  dragObject();
  render();
};

function render() {
  renderer.render(scene, camera);
}
animate();
