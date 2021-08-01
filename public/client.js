// import './style.css'
// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import * as dat from 'dat.gui'
// import { DirectionalLightHelper } from 'three'
// import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

import * as THREE from 'https://cdn.skypack.dev/three';
import { OrbitControls }from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls'

console.log("HELLO", THREE, OrbitControls)
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

import { lights } from "./_lights.js";
Object.entries(lights).forEach((element) => {
  scene.add(element[1]);
});

import { items } from "./_items.js";
Object.entries(items).forEach((element) => {
  console.log(element[1])
  scene.add(element[1]);
});


var starPositions = [];
let stack = [];
var score = 0;

let distributeStars = function () {
  const vertices = [];
  for (let i = 0; i < 500; i++) {
    const x = THREE.MathUtils.randFloatSpread(200);
    const y = THREE.MathUtils.randFloatSpread(200);
    const z = THREE.MathUtils.randFloatSpread(200);
    console.log(x, y, z);
    vertices.push(x, y, z);
    starPositions.push(x, y, z);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  const color = new THREE.Color(`hsl(${30 + stack.length * 4}, 100%, 50%)`);
  const material = new THREE.PointsMaterial({ color });

  const points = new THREE.Points(geometry, material);

  return points;
};
scene.add(distributeStars())




let calculateGravity = function(starPositions, G){
  let newStarPositions = []
  for (let i = 0; i < starPoisitions.length; i++) {
    newStarPositions.push(starPositions[i]+.1)
    
  }
  
}


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()
  
  
    let newStarPositions = calculateGravity(starPositions, 9.8)
    starPositions = newStarPositions
  
    console.log(newStarPositions)


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()