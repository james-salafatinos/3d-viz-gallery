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

// const axesHelper = new THREE.AxesHelper(1);
// scene.add(axesHelper);

// const gridHelper = new THREE.GridHelper(32);
// scene.add(gridHelper);

let t = .01;

let wave = function(i,j,t, amplitude, humpfactor, posx, posy){

  return amplitude*(1/(1+t))*Math.exp((-1/humpfactor)*
  (-Math.sqrt((i*(1/(Math.log1p(2+t)))-posx)**2+(j*(1/(Math.log1p(2+t)))-posy)**2)+t-20 )**2)* 
  Math.sin(Math.sqrt((i*(1/(Math.log1p(2+t)))-posx)**2+(j*(1/((Math.log1p(2+t))))-posy)**2)-t)
}

// let wave = function(i,j,t, amplitude, humpfactor, posx, posy){

//   return amplitude*Math.exp((-1/humpfactor)*
//   (-Math.sqrt((i-posx)**2+(j-posy)**2)+t-15 )**2)* 
//   Math.sin(Math.sqrt((i-posx)**2+(j-posy)**2)+t)
// }
// let func = function(i, j, t){
//   // return Math.exp((-1/100)*((i+j)/2-t+20)**2) * Math.cos((i+j)/2-t+20)+ Math.exp((-1/100)*((j+t)**2)) *Math.sin(j+t)
//   // return Math.cos(i+j+t)+ Math.sin(j+t)
//   return 3*Math.exp((-1/20)*
//   (-Math.sqrt((i+10)**2+(j+10)**2)+t-15 )**2)* 
//   Math.sin(Math.sqrt((i+10)**2+(j+10)**2)+t) + 

//   3*Math.exp((-1/20)*
//   (-Math.sqrt((i-10)**2+(j-10)**2)+t-15 )**2)* 
//   Math.sin(Math.sqrt((i-10)**2+(j-10)**2)+t) +
//   3*Math.exp((-1/20)*
//   (-Math.sqrt((i+15)**2+(j-15)**2)+t-15 )**2)* 
//   Math.sin(Math.sqrt((i+15)**2+(j-15)**2)+t) +
//   3*Math.exp((-1/20)*
//   (-Math.sqrt((i-15)**2+(j+15)**2)+t-15 )**2)* 
//   Math.sin(Math.sqrt((i-15)**2+(j+15)**2)+t) 
//   // Math.exp((-1/100)*((i+j)/2-t+40)**2) * Math.cos((i+j)/2-t+40)
  
// }


var meta_waves = [];

let func = function(i,j,t){
  // let wave_add = 0;
  // for ( let i = 0; i < meta_waves.length; i ++ ) {
  //   // console.log(meta_waves[i][0])
  //   wave_add += wave(i,j,t-elapsedTime, 50, 10, meta_waves[i][0], meta_waves[i][1])
  // } 
    return wave(i,j,t, 50, 100, 10,10) + 
  wave(i,j,t, 25, 50, -10,10) + 
  wave(i,j,t, 25, 50, -10,-15) + 
  wave(i,j,t, 35, 200, 10,-15) //+ wave_add//+ wave(i,j,t, 35,50,0,0)
  // return wave_add

  // }
  // return wave(i,j,t, 50, 100, 10,10) + 
  // wave(i,j,t, 25, 50, -10,10) + 
  // wave(i,j,t, 25, 50, -10,-15) + 
  // wave(i,j,t, 35, 200, 10,-15)
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


function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

const raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = .1;
const mouse = new THREE.Vector2();

let drawBox = function(event){

  // update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );
  // console.log(intersects)
  let intsct_z = intersects[0].point.x * 100;
  let intsct_x = intersects[0].point.y * 100;
  let intsct_y = intersects[0].point.z * 100;
  console.log('x', intsct_x)
  console.log('y', intsct_y)
  console.log('z', intsct_z)
  console.log([intsct_x,intsct_z])
  meta_waves.push([intsct_x, intsct_y])
 
  return null

}

document.addEventListener('click', drawBox)

/**
 * Animate
 */
const clock = new THREE.Clock();

let id_stack = []
var animate = function () {
  const elapsedTime = clock.getElapsedTime();



  // Update controls
  controls.update();

  let M = 64
  let N = 64
  let scaler = 10;
  let vertices = [];
   for (let x = -M; x <= M ; x += 1) {
      for (let z = -N; z <= N; z += 1) {
  
        vertices.push(x/scaler,1.4*func(x,z,elapsedTime*3)/scaler,z/scaler)
  
      }
     }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
  
  let material = new THREE.PointsMaterial( { size: .02, sizeAttenuation: true, alphaTest: 0.5, transparent: true } );
  material.color.setHSL( .6, 0.8, 0.9 );
  // const color = new THREE.Color(`hsl(${id_stack.length*4}, 50%, 40%)`);
  // material.color = color
  const particles = new THREE.Points( geometry, material );
  // console.log(vertices)
  scene.add( particles );
 
  var selectedObject = scene.getObjectById(id_stack.length+8);
  // console.log(selectedObject)
  // console.log(scene)
  scene.remove( selectedObject );
  id_stack.push(1)










    // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(animate);
};

animate();
