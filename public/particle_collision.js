import * as THREE from "/build/three.module.js"
import { OrbitControls } from '/jsm/controls/OrbitControls'

//Standard Setup
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();
const texture = loader.load('https://cdn.glitch.com/4ce94fe8-ed51-4ffd-be03-fb92308989d7%2Fdownload.jpg?v=1630059706571')

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
const gridHelper = new THREE.GridHelper(5);
scene.add(gridHelper);


/**
 * Lights
 */
let createCornerLight = function () {
    let pointLight = new THREE.PointLight(0xffffff, .8)
    let ambientLight = new THREE.AmbientLight(0xffffff, .2)
    pointLight.position.set(0, 0, 0);
    let ambientLight2 = new THREE.AmbientLight(0xffffff, 1)
    ambientLight2.position.set(-30, 20, -30);
    const pointHelper = new THREE.PointLightHelper(pointLight, 0);
    scene.add(pointLight, pointHelper, ambientLight), ambientLight2
}
createCornerLight()

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

//Re-draw Vertices
const M = 1




/**
 * Math
 */

let dt;

var vertices = [];
var velocities = [];
var accelerations = [];
var masses = [];

//Array setup, memory reservation
for (let iter = 0; iter <= M; iter += 1) {
    vertices.push(Math.random(), Math.random(), 0) // x, y, z
    velocities.push(0, 0, 0) //vx, vy, vz
    accelerations.push(0, .0001, 0) //ax, ay, az
    masses.push(1, 1, 1)
}


const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
let material = new THREE.PointsMaterial({ size: .02, sizeAttenuation: true, alphaTest: 0.5, transparent: true });
material.color.setHSL(.6, 0.8, 0.9);
const particles = new THREE.Points(geometry, material);
scene.add(particles);


let checkIfNotDivisibleByThree = (set) => {
    if (set.length % 3 != 0) {
        return true
    } else {
        return false
    }
}

let checkParticles = (vertices_set) => {

    //Check validity of set
    if (checkIfNotDivisibleByThree(vertices_set)) {
        console.log("Error, vertex set is not divisible by three")
        return RangeError
    }

    //Iterate through sets
    for (let i = 0; i <= vertices_set.length; i += 3) {
        let particle_set = [vertices_set[i], vertices_set[i + 1], vertices_set[i + 2]]
        console.log(particle_set)
    }
}

let N = 2
let softening = .01

// let getAccelerations = () =>{
//     for (let i = 0; i <= Array(N).length; i += 1) {
//         for (let j = 0; i <= Array(N).length; j += 1) {
//             let dx = vertices[j] - vertices[i];
//             let dy = vertices[j + 1] - vertices[i + 1];
//             let dz = vertices[j + 1] - vertices[i + 2];
//             // console.log(`dx: ${dx}, dy: ${dy}, dz: ${dz}`)
//             // let inv_r3 = (dx ** 2 + dy ** 2 + dz ** 2 + softening ** 2) ** (-1.5);
    
//             // accelerations[i] += G * (dx * inv_r3) * mass[j];
//             // accelerations[i + 1] += G * (dy * inv_r3) * mass[j];
//             // accelerations[i + 1] += G * (dz * inv_r3) * mass[j];
    
//         }
//     }

// }




let updatePositions = () => {
    for (let iter = 0; iter <= vertices.length; iter += 3) {
        geometry.attributes.position.array[iter] += velocities[iter]
        geometry.attributes.position.array[iter + 1] += velocities[iter + 1]
        geometry.attributes.position.array[iter + 2] += velocities[iter + 2]
    }
}

let updateVelocities = () => {
    for (let iter = 0; iter <= vertices.length; iter += 3) {
        velocities[iter] += accelerations[iter]
        velocities[iter + 1] += accelerations[iter + 1]
        velocities[iter + 2] += accelerations[iter + 2]
    }
}

//Update Global Particle Bunch
console.log(velocities)
let updateParticles = () => {
    updateVelocities()
    updatePositions()



}


//Const
let frameIndex = 0;
const clock = new THREE.Clock();
var animate = function () {

    //Controls
    controls.update();
    if (frameIndex == 0) {
        checkParticles(vertices)
    }

    // getAccelerations()
    updateParticles()
    // console.log(vertices)
    geometry.attributes.position.needsUpdate = true;

    //Time
    const elapsedTime = clock.getElapsedTime();


    // Render
    renderer.render(scene, camera);
    // Call tick again on the next frame
    window.requestAnimationFrame(animate);
    frameIndex++;
};

animate();
