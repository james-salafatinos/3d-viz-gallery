// import './style.css'
// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import * as dat from 'dat.gui'
// import { DirectionalLightHelper } from 'three'
// import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

import * as THREE from "https://cdn.skypack.dev/three";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls";

console.log("HELLO", THREE, OrbitControls);
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

// import { lights } from "./_lights.js";
// Object.entries(lights).forEach(element => {
//   scene.add(element[1]);
// });
// const points = [];
// points.push( new THREE.Vector3( - 10, 0, 0 ) );
// points.push( new THREE.Vector3( 0, 10, 0 ) );
// points.push( new THREE.Vector3( 10, 0, 0 ) );
// const material  = new THREE.LineBasicMaterial( { color: 0xffffff } );

// const geometry = new THREE.BufferGeometry().setFromPoints( points );
// const line = new THREE.Line( geometry, material );
// // All that's left is to add it to the scene and call render.

// scene.add( line );


const MAX_POINTS = 150;

// geometry
const geometry = new THREE.BufferGeometry();

// attributes
const positions = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// draw range
const drawCount = 100; // draw the first 2 points, only
geometry.setDrawRange(0, drawCount);

// material
const material = new THREE.LineBasicMaterial({ color: 0xffffff });

// line
const line = new THREE.Line(geometry, material);
scene.add(line);

let stack = [];

let drawLine = function (P, mx, my) {

  // let P = line.geometry.attributes.position.array;
  const points = [];
  for (let i = 0, l = MAX_POINTS * 3; i < l; i += 3) {
    points.push(new THREE.Vector3(P[i], P[i + 1], P[i + 2]));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  // const color = new THREE.Color(`hsl(${60 + my *10}, ${mx *10}%, 40%)`);
  const color = new THREE.Color(`hsl(180, 4%, 40%)`);
  // const color = new THREE.Color(`hsl(${60+ stack.length}, 60%, 30%)`);
  const mat = new THREE.LineBasicMaterial({ color: color });
  const line2 = new THREE.Line(geo, mat);
  return line2
}




let updatePositions = function (mx,my) {
  const positions = line.geometry.attributes.position.array;
  let x, y, z, index;
  x = y = z = index = 0;
  for (let i = 0, l = MAX_POINTS; i < l; i++) {
    positions[index++] = x;
    positions[index++] = y;
    positions[index++] = z;
    x += (Math.random() - .5) * 1 + mx;
    z += (Math.random() - .5) * 1 ;
    y += (Math.random() - .5) * 1 + my ;
  }
}

// const size = 10;
// const divisions = 10;

// const gridHelper = new THREE.GridHelper( size, divisions );
// scene.add( gridHelper );


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

document.addEventListener('mousemove', animateY)
let mouseY = 0;

function animateY(event) {
  mouseY = event.clientY
}

document.addEventListener('mousemove', animateX)
let mouseX = 0;

function animateX(event) {
  mouseX = event.clientX
}


/**
 * Animate
 */
const clock = new THREE.Clock();

let newValue = 0;
let last_time = 0;
var animate = function () {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  var vec = new THREE.Vector3(); // create once and reuse
  var pos = new THREE.Vector3(); // create once and reuse
  
  vec.set(
      ( mouseX / window.innerWidth ) * 2 - 1,
      - ( mouseY / window.innerHeight ) * 2 + 1,
      0.5 );
  
  vec.unproject( camera );
  
  vec.sub( camera.position ).normalize();
  
  var distance = - camera.position.z / vec.z;
  
  pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );
  // console.log(pos)
  if (elapsedTime - last_time >.05  ) {

    // line.geometry.setDrawRange(0, newValue);
    let newLine = drawLine(line.geometry.attributes.position.array, mouseX, mouseY)
    scene.add(newLine)

    // console.log(camera.position)
 
    console.log(pos.x,pos.y, pos.z)
    // updatePositions(pos.x*.1,pos.y*.1)
    updatePositions(pos.x*0,pos.y*0)
    newValue++;
    line.geometry.attributes.position.needsUpdate = true;
    last_time = elapsedTime
    stack.push(1)
  }


  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(animate);
};

animate();
