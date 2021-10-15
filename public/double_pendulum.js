// import * as THREE from "https://cdn.skypack.dev/three";
import * as THREE from "/build/three.module.js"
// import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls";
import { OrbitControls } from '/jsm/controls/OrbitControls'
// import macromanDatGui from 'https://cdn.skypack.dev/@macroman/dat.gui';



// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const loader = new THREE.TextureLoader();
const texture = loader.load('https://cdn.glitch.com/4ce94fe8-ed51-4ffd-be03-fb92308989d7%2Fdownload.jpg?v=1630059706571')

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);
// const gridHelper = new THREE.GridHelper(5);
// scene.add(gridHelper);

/**
 * Math
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


var MAX_POINTS = 4;
// geometry
var geometry = new THREE.BufferGeometry();
// attributes
var positions = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
// draw range
let drawCount = 4; // draw the first 2 points, only
geometry.setDrawRange(0, drawCount);
// material
var material = new THREE.LineBasicMaterial({ color: 0xff0000 });
// line
let line = new THREE.Line(geometry, material);
scene.add(line);



var TRACED_MAX_POINTS = 1000;
// geometry
var tracedGeometry = new THREE.BufferGeometry();
// attributes
var tracedPositions = new Float32Array(TRACED_MAX_POINTS * 3); // 3 vertices per point
tracedGeometry.addAttribute('position', new THREE.BufferAttribute(tracedPositions, 3));
// draw range
let tracedDrawCount = 0
tracedGeometry.setDrawRange(0, tracedDrawCount);
// material
var tracedMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, lineWidth:.1, transparent: true, opacity: .4});
// line
let tracedLine = new THREE.Line(tracedGeometry, tracedMaterial);
scene.add(tracedLine);



/**
 * DOM Callbacks
 */
window.addEventListener('click', function (event) {
    console.log("In Double Click")
    var mouse = { x: 1, y: 1 };
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //Raycast
    var raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = .05;
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
    raycaster.ray.set(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(scene.children);
    console.log(intersects)

})

THREE.Vector3.prototype.randomUnitVector = function () {
    this.x = Math.random() * 2 - 1;
    this.y = Math.random() * 2 - 1;
    this.z = 0//Math.random() * 2 - 1;
    this.normalize();
    return this;
}



var SCALER = 50
var r1 = 125 / SCALER;
var r2 = 125 / SCALER;
var m1 = 5;
var m2 = 5;
var a1 = 0;
var a2 = 0;
var a1_v = 0;
var a2_v = 0;
var g = .98;

let px2 = -1;
let py2 = -1;
let cx, cy;
let nx = 0;
let ny = 0;
let nz = 0;

let buffer;

let calculate = function () {
    let x1 = r1 * Math.sin(a1)
    let y1 = r1 * Math.cos(a1)
    let x2 = x1 + r2 * Math.sin(a2)
    let y2 = y1 + r2 * Math.cos(a2)
    return { x1: x1, x2: x2, y1: -y1, y2: -y2 }
}


let drawSphere = (m) => {
    let mat = new THREE.MeshPhongMaterial({
        wireframe: false,
        transparent: false,
        depthTest: true,
        side: THREE.DoubleSide
    });
    let geo = new THREE.SphereGeometry(m, 10)
    let mesh = new THREE.Mesh(geo, mat)
    return mesh
}
let sphere1 = drawSphere(m1 / 100)
scene.add(sphere1)


let sphere2 = drawSphere(m2 / 100)
scene.add(sphere2)



/**
 * Animate
 */



var x = 0;
var y = 0;
var z = 0;
var index = 0;

var positions = line.geometry.attributes.position.array;
for (var i = 0, l = MAX_POINTS; i < l; i++) {
    positions[index++] = x;
    positions[index++] = y;
    positions[index++] = z;
}

var tracedX = 0;
var tracedY = 0;
var tracedZ = 0;
var tracedIndex = 0;
var tracedPositions = tracedLine.geometry.attributes.position.array;
for (var i = 0, l = TRACED_MAX_POINTS; i < l; i++) {
    tracedPositions[tracedIndex++] = tracedX;
    tracedPositions[tracedIndex++] = tracedY;
    tracedPositions[tracedIndex++] = tracedZ;
}


let updateLinePositions = (x1, x2, y1, y2) => {
    positions[positions.length] = 0
    positions[positions.length + 1] = 0
    positions[positions.length + 2] = 0
    positions[positions.length - 6] = x1
    positions[positions.length - 5] = y1
    positions[positions.length - 4] = 0

    positions[positions.length + 3] = x1
    positions[positions.length + 4] = x2
    positions[positions.length + 5] = 0
    positions[positions.length - 3] = x2
    positions[positions.length - 2] = y2
    positions[positions.length - 1] = 0
    line.geometry.attributes.position.needsUpdate = true;
}

let updateTracedPositions = (frameIndex, x2, y2) => {
    tracedPositions[frameIndex] = x2
    tracedPositions[frameIndex + 1] = y2
    tracedPositions[frameIndex + 2] = 0

    tracedLine.geometry.attributes.position.needsUpdate = true

}



a1 += Math.PI / 2
a2 += Math.PI / 4
//Const
const clock = new THREE.Clock();

let frameIndex = 0;
var animate = function () {

    // console.log(frameIndex)
    let { x1, x2, y1, y2 } = calculate()
    sphere1.position.x = x1
    sphere1.position.y = y1
    sphere2.position.x = x2
    sphere2.position.y = y2


    // if (frameIndex % 1 == 0) {
    let num1 = -g * (2 * m1 + m2) * Math.sin(a1);
    let num2 = -m2 * g * Math.sin(a1 - 2 * a2);
    let num3 = -2 * Math.sin(a1 - a2) * m2;
    let num4 = a2_v * a2_v * r2 + a1_v * a1_v * r1 * Math.cos(a1 - a2);
    let den = r1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
    let a1_a = (num1 + num2 + num3 * num4) / den;

    num1 = 2 * Math.sin(a1 - a2);
    num2 = (a1_v * a1_v * r1 * (m1 + m2));
    num3 = g * (m1 + m2) * Math.cos(a1);
    num4 = a2_v * a2_v * r2 * m2 * Math.cos(a1 - a2);
    den = r2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
    let a2_a = (num1 * (num2 + num3 + num4)) / den;


    a1_v += a1_a / SCALER * 1.25;
    a2_v += a2_a / SCALER * 1.25;
    a1 += a1_v
    a2 += a2_v

    a1_v *= 0.998;
    a2_v *= 0.998;


    updateLinePositions(x1, x2, y1, y2)

    if (frameIndex %3 == 0 | frameIndex ==0){
        updateTracedPositions(frameIndex, x2, y2)
       
        tracedGeometry.setDrawRange(1, tracedDrawCount);
        tracedDrawCount += 1
    }



    //Controls
    controls.update();




    //Time
    const elapsedTime = clock.getElapsedTime();

    frameIndex++;
    // Render
    renderer.render(scene, camera);
    // Call tick again on the next frame
    window.requestAnimationFrame(animate);
};

animate();
