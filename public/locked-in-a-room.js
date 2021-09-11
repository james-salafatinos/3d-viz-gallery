// import * as THREE from "https://cdn.skypack.dev/three";
// import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls";
// import macromanDatGui from 'https://cdn.skypack.dev/@macroman/dat.gui';
// import { PointerLockControls } from "https://threejs.org/examples/jsm/controls/PointerLockControls.js"

// import * as THREE from "https://cdn.skypack.dev/three";
import * as THREE from "/build/three.module.js"
// import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls";
import { PointerLockControls } from '/jsm/controls/PointerLockControls'
// import macromanDatGui from 'https://cdn.skypack.dev/@macroman/dat.gui';



//https://threejs.org/examples/misc_controls_pointerlock.html
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
const gridHelper = new THREE.GridHelper(5);
scene.add(gridHelper);

/**
 * Math
 */
const objects = [];
let raycaster;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();


let spacing = 100;
let createPlaneFace = function (sizeX, sizeY, x, y, z, rotateX, rotateY, rotateZ, n_x, n_y, n_z, c, collidable) {

    let color = new THREE.Color(c)
    let mat = new THREE.MeshPhongMaterial({
        depthTest: true,
        side: THREE.DoubleSide,
        color: color
    })

    let geo = new THREE.PlaneBufferGeometry(sizeX, sizeY)
    let mesh = new THREE.Mesh(geo, mat)

    mesh.rotateX(Math.PI * rotateX)
    mesh.rotateY(Math.PI * rotateY)
    mesh.position.x = x
    mesh.position.y = y
    mesh.position.z = z
    mesh.userData.dirVector = new THREE.Vector3(0, 0, 0)
    mesh.userData.isWall = true
    mesh.userData.normal = new THREE.Vector3(n_x, n_y, n_z)
    mesh.userData.canCollide = collidable

    return mesh

}

let floor = createPlaneFace(200, 200, 0, 9, 0, .5, 1, 1, 0, -1, 0, "white", false)
// objects.push(floor)
scene.add(floor)

var wall = createPlaneFace(4, 4, 10, 9, -8, 1, 1, 1, 0, -1, 0, "blue", true)
objects.push(wall)
scene.add(wall)//constructRacquetballRoom()

// var top = createPlaneFace(0, spacing, 0, .5, 1, 1, 0, 1, 0)
// scene.add(top)//constructRacquetballRoom()

// var bottom = createPlaneFace(0, -spacing, 0, .5, 1, 1, 0, -1, 0)
// scene.add(bottom)//constructRacquetballRoom()

// var left = createPlaneFace(0, 0, -spacing, 1, 1, 1, 0, 0, -1)
// scene.add(left)//constructRacquetballRoom()

// var right = createPlaneFace(0, 0, spacing, 1, 1, 1, 0, 0, 1)
// scene.add(right)

// var left2 = createPlaneFace(spacing, 0, 0, 1, .5, 1, -1, 0, 0)
// scene.add(left2)
// var right2 = createPlaneFace(-spacing, 0, 0, 1, .5, 1, 1, 0, 0)
// scene.add(right2)








let createCornerLight = function () {
    let pointLight = new THREE.PointLight(0xffffff, .8)
    let ambientLight = new THREE.AmbientLight(0xffffff, .2)
    pointLight.position.set(15, 15, 15);
    let ambientLight2 = new THREE.AmbientLight(0xffffff, .6)
    ambientLight2.position.set(-30, 20, -30);
    // let hemiLight = new THREE.HemisphereLight(0xffffff,.4)
    const pointHelper = new THREE.PointLightHelper(pointLight, 1);
    scene.add(pointLight, pointHelper, ambientLight, ambientLight2)
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
// camera.position.x = 1;
// camera.position.y = 1;
// camera.position.z = 2;
camera.userData.canCollide = true
scene.add(camera);
objects.push(camera)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Controls

const menuPanel = document.getElementById('menuPanel')
const startButton = document.getElementById('startButton')
startButton.addEventListener('click', function () { controls.lock() }, false)

const controls = new PointerLockControls(camera, renderer.domElement)
//controls.addEventListener('change', () => console.log("Controls Change"))
controls.addEventListener('lock', () => (menuPanel.style.display = 'none'))
controls.addEventListener('unlock', () => (menuPanel.style.display = 'block'))


const onKeyDown = function (event) {

    switch (event.code) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;

        case 'Space':
            if (canJump === true) velocity.y += 100;
            canJump = false;
            break;

    }

};

const onKeyUp = function (event) {

    switch (event.code) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;

    }

};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);

/**
 * DOM Callbacks
 */



/**
 * Animate
 */



//Const
const clock = new THREE.Clock();

var eps = .3
var collisionCheck = function () {
    for (let i = 0; i < objects.length; i++) {
        let x = objects[i].position.x
        let y = objects[i].position.y
        let z = objects[i].position.z
        for (let j = i; j < objects.length; j++) {
            // console.log(objects[i].uuid, objects[j].uuid)
            let _x = objects[j].position.x
            let _y = objects[j].position.y
            let _z = objects[j].position.z

            if (objects[i].uuid == objects[j].uuid) {
                //Do Nothing
                // console.log('These are the same ball...')
                // console.log("Same object!!!!", objects[j])

            }
            else {
                if (((_x - x) ** 2 + (_y - y) ** 2 + (_z - z) ** 2) ** .5 < 2 * eps) {
                    console.log('Touch')
                    if ((objects[i].userData.canCollide) && (objects[j].userData.canCollide)) {
                        console.log("COLLISION BETWEEN", objects[i].uuid, objects[j].uuid)
                    } else {
                        //Nothing
                    }

                } else {
                    //Nothing
                }

            }
        }
    }
}


console.log(objects)
var animate = function () {

    //Controls
    // controls.update();

    if (objects.length > 0) {
        // console.log("Enter Toggle Balls In Play,", balls_in_play)

        objects.forEach(function (obj) {
            //Something
        });
        collisionCheck()
    }


    //Time
    const elapsedTime = clock.getElapsedTime();

    const time = performance.now();

    if (controls.isLocked === true) {

        raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 10;

        const intersections = raycaster.intersectObjects(objects);

        const onObject = intersections.length > 0;

        const delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 3.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

        if (onObject === true) {

            velocity.y = Math.max(0, velocity.y);
            canJump = true;

        }

        controls.moveRight(- velocity.x * delta);
        controls.moveForward(- velocity.z * delta);

        controls.getObject().position.y += (velocity.y * delta); // new behavior

        if (controls.getObject().position.y < 10) {

            velocity.y = 0;
            controls.getObject().position.y = 10;

            canJump = true;

        }

    }

    prevTime = time;


    // Render
    renderer.render(scene, camera);
    // Call tick again on the next frame
    window.requestAnimationFrame(animate);
};

animate();
