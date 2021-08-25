import * as THREE from "https://cdn.skypack.dev/three";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls";

console.log("HELLO", THREE, OrbitControls);
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);
// const gridHelper = new THREE.GridHelper(32);
// scene.add(gridHelper);

let t = .01;
let wave = function (i, j, t, amplitude, humpfactor, posx, posy, delay) {
  return amplitude * (1 / (1 + t))
   * Math.exp((-1 / humpfactor) *
    (-Math.sqrt((i - posx) ** 2 + (j - posy) ** 2) + t - delay) ** 2) *
    Math.sin(Math.sqrt((i - posx) ** 2 + (j  - posy) ** 2)*(1 / (Math.log1p(2 + t))) - t)
}

// let wave = function (i, j, t, amplitude, humpfactor, posx, posy, delay) {
//   return amplitude * (1 / (1 + t))
//    * Math.exp((-1 / humpfactor) *
//     (-Math.sqrt((i * (1 / (Math.log1p(2 + t))) - posx) ** 2 + (j * (1 / (Math.log1p(2 + t))) - posy) ** 2) + t - delay) ** 2) *
//     Math.sin(Math.sqrt((i * (1 / (Math.log1p(2 + t))) - posx) ** 2 + (j * (1 / ((Math.log1p(2 + t)))) - posy) ** 2) - t)
// }

var t_ = [];
var clicks = 0;
var click_wave_origin_xy = [];
var to_log = true
let func = function (i, j, t) {
  let w1 = wave(i,j,t, 50, 100, 10,10, 20)
  let w2 = wave(i,j,t, 25, 50, -10,-15, 20)
  
  if (click_wave_origin_xy.length > 0) {
    if (to_log){
      console.log("Initial Click Wave Origin", click_wave_origin_xy[0][0]*2)
      to_log = false
    }

    let consolidated_wave_output = 0;
    for (let u = 1; u <= clicks; u ++) {
      let delta = wave(i, j, t-(t_[u-1]), 25, 200, click_wave_origin_xy[u-1][0]*10, click_wave_origin_xy[u-1][1]*10, 10)
      consolidated_wave_output += delta
    }
        return consolidated_wave_output
    // return w1 + w2 + 
    // wave(i, j, t-(t_[clicks-1]), 25, 50, click_wave_origin_xy[clicks-1][0], click_wave_origin_xy[clicks-1][1])

    //MW.reduce((a, b) => a + b, 0)
  }
  else {
    return w1 + w2
  }
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

function onMouseMove(event) {

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

}

window.addEventListener('dblclick', function (event) {
  console.log("In Double Click")
  var mouse = { x: 1, y: 1 };
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  var raycaster = new THREE.Raycaster();

  raycaster.params.Points.threshold = .05;
  var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
  raycaster.ray.set(camera.position, vector.sub(camera.position).normalize());

  var intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    // console.log("# Points intersected", intersects.length)
    // console.log("In Intersects, first intersection: ", intersects[0])
    // // console.log("Pushing X,Y", intersects[0].point.x, intersects[0].point.y)
    console.log("Pushing X,Y,Z", intersects[0].point.x, intersects[0].point.y, intersects[0].point.z)
    click_wave_origin_xy.push([intersects[0].point.x, intersects[0].point.z])
  
    
    //Box
    let g = new THREE.BoxBufferGeometry()
    let matt = new THREE.MeshBasicMaterial()
    let meshh = new THREE.Mesh(g, matt)
    meshh.position.x = intersects[0].point.x
    meshh.position.z = intersects[0].point.z
    scene.add(meshh)
    
    t_.push(T)
    clicks +=1;
    console.log("Clicks", clicks)
    console.log("Meta Waves", click_wave_origin_xy)
    console.log('Stack Length', t_)
    console.log('T', T)


  } else {
    // do nothing
  }
}
)


/**
 * Animate
 */
const clock = new THREE.Clock();
var T = 0;
let id_stack = []
var animate = function () {
  const elapsedTime = clock.getElapsedTime();
  T = elapsedTime*3
  controls.update();
  //Re-draw
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
  // const color = new THREE.Color(`hsl(${id_stack.length*4}, 50%, 40%)`);
  // material.color = color
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  var selectedObject = scene.getObjectById(id_stack.length + 11);
  scene.remove(selectedObject);
  id_stack.push(1)










  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(animate);
};

animate();
