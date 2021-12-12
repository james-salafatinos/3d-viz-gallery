import * as THREE from "https://cdn.skypack.dev/three";
// import * as THREE from "/build/three.module.js"
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls";
// import { OrbitControls } from '/jsm/controls/OrbitControls'
// import macromanDatGui from 'https://cdn.skypack.dev/@macroman/dat.gui';





// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(0);
scene.add(axesHelper);
const gridHelper = new THREE.GridHelper(0);
scene.add(gridHelper);

/**
 * Math
 */
//Function Builder
let wave = function (i, j, t, amplitude, humpfactor, posx, posy, delay) {
  return amplitude * (1 / (1 + t))
    * Math.exp((-1 / humpfactor) *
      (-Math.sqrt((i - posx) ** 2 + (j - posy) ** 2) + t - delay) ** 2) *
    Math.sin(Math.sqrt((i - posx) ** 2 + (j - posy) ** 2) * (1 / (Math.log1p(2 + t))) - t)
}

//Func Global Statuses
var t_ = [];
var clicks = 0;
var click_wave_origin_xy = [];
let chop_offset = 0;

//IJT Iterator
let func = function (i, j, t) {
  let consolidated_wave_output = 0;
  for (let u = 1+chop_offset; u <= clicks; u++) {
    let delta = wave(i, j, t - (t_[u - 1]), 30, 200 , click_wave_origin_xy[u - 1][0] * 10, click_wave_origin_xy[u - 1][1] * 10, 10)
    consolidated_wave_output += delta
  }
  return consolidated_wave_output
}



/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));



/**
 * DOM Callbacks
 */
window.addEventListener('click', function (event) {
  console.log("In Double Click")
  var mouse = { x: 1, y: 1 };
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  if(click_wave_origin_xy.length - chop_offset > 10){
    console.log("MORE THAN 10, chop!")
    chop_offset+=1
  }
  //Raycast
  var raycaster = new THREE.Raycaster();
  raycaster.params.Points.threshold = .05;
  var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
  raycaster.ray.set(camera.position, vector.sub(camera.position).normalize());
  var intersects = raycaster.intersectObjects(scene.children);
  
  if (intersects.length > 0) {
    console.log("Pushing X,Y,Z", intersects[0].point.x, intersects[0].point.y, intersects[0].point.z)
    click_wave_origin_xy.push([intersects[0].point.x, intersects[0].point.z])
    //Sphere
    let g = new THREE.SphereBufferGeometry()
    let matt = new THREE.MeshBasicMaterial()
    let meshh = new THREE.Mesh(g, matt)
    meshh.position.x = intersects[0].point.x
    meshh.position.z = intersects[0].point.z
    scene.add(meshh)

    //Inform Func
    t_.push(T)
    clicks += 1;
  } else {
    // do nothing
  }
})


/**
 * GUI
 */
// let gui = new macromanDatGui.GUI()
// const cameraFolder = gui.addFolder('Camera')
// cameraFolder.add(camera.position, 'x', 0, 15)
// cameraFolder.add(camera.position, 'y', 0, 15)
// cameraFolder.add(camera.position, 'z', 0, 15)
// cameraFolder.open()
// console.log("SCENE CHILDREN", scene.children)

/**
 * Animate
 */

//Const
const clock = new THREE.Clock();
var T = 0;
let id_stack = []

var animate = function () {

  //Controls
  controls.update();

  //Time
  const elapsedTime = clock.getElapsedTime();
  T = elapsedTime * 3

  //Re-draw Vertices
  let M = 64
  let N = 64
  let scaler = 10;
  let vertices = [];
  for (let x = -M; x <= M; x += 1) {
    for (let z = -N; z <= N; z += 1) {
      vertices.push(x / scaler, 1.4 * func(x, z, T) / scaler, z / scaler)
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  let material = new THREE.PointsMaterial({ size: .02, sizeAttenuation: true, alphaTest: 0.5, transparent: true });
  material.color.setHSL(.6, 0.8, 0.9);
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  //Disposal
  for (let k = 4; k <= scene.children.length; k++) {
    // console.log("In 4",  scene.children)
    scene.children[k - 1].geometry.dispose()
    scene.children[k - 1].material.dispose()
    scene.remove(scene.children[k])
  }
  scene.remove(scene.children[1])
  particles.geometry.dispose()
  particles.material.dispose()

  //Tracking
  id_stack.push(1)
  // Render
  renderer.render(scene, camera);
  // Call tick again on the next frame
  window.requestAnimationFrame(animate);
};

animate();
