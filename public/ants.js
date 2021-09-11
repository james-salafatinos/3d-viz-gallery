// import * as THREE from "https://cdn.skypack.dev/three";
import * as THREE from "/build/three.module.js"
// import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls";
import { OrbitControls } from '/jsm/controls/OrbitControls'
// import macromanDatGui from 'https://cdn.skypack.dev/@macroman/dat.gui';


const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

/**
 * Helpers
 */
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
const gridHelper = new THREE.GridHelper(50);
scene.add(gridHelper);

/**
 * Math
 */


var V = [];

let createStars = function () {
    let M = 64
    let N = 64
    let vertices = [];
    for (let x = -M; x <= M; x += 1) {
        for (let z = -N; z <= N; z += 1) {
            // vertices.push(x / scaler, 0 / scaler, z / scaler)
            vertices.push(x,0,z)
            V.push(x,0,z)
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    let material = new THREE.PointsMaterial({ size: .07, sizeAttenuation: true, alphaTest: 0.5, transparent: true });
    material.color.setHSL(.6, 0.8, 0.9);
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
}
createStars()



let next_time_step = () =>{
    

}




let createLight = function () {
    let pointLight = new THREE.PointLight(0xffffff, .8)
    let ambientLight = new THREE.AmbientLight(0xffffff, .2)
    pointLight.position.set(-5, 5, -5);
    let ambientLight2 = new THREE.AmbientLight(0xffffff, .4)
    ambientLight2.position.set(-30, 20, -30);
    const pointHelper = new THREE.PointLightHelper(pointLight, 1);
    scene.add(pointLight, pointHelper, ambientLight), ambientLight2
}
createLight()


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
camera.position.y = 10;
camera.position.z = 13;
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
 * Animate
 */


//Const
const clock = new THREE.Clock();

var animate = function () {


    //Controls
    controls.update();

    console.log(V)
    //Time
    const elapsedTime = clock.getElapsedTime();


    // Render
    renderer.render(scene, camera);
    // Call tick again on the next frame
    window.requestAnimationFrame(animate);
};

animate();
