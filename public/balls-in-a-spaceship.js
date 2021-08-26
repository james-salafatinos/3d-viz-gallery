import * as THREE from "https://cdn.skypack.dev/three";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls";
import macromanDatGui from 'https://cdn.skypack.dev/@macroman/dat.gui';



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


var balls_in_play = []
var toggle_balls_in_play = false;

// let shoot = function () {
//     let geo = new THREE.SphereBufferGeometry(.2)
//     let mat = new THREE.MeshBasicMaterial()
//     let mesh = new THREE.Mesh(geo, mat)
//     mesh.position.x = THREE.MathUtils.randFloatSpread(2)
//     mesh.position.y = THREE.MathUtils.randFloatSpread(2)
//     mesh.position.z = THREE.MathUtils.randFloatSpread(2)
//     balls_in_play.push(mesh)
// }

let shoot_basic = function (dirVector) {
    let geo = new THREE.SphereBufferGeometry(.2)
    let mat = new THREE.MeshBasicMaterial()
    let mesh = new THREE.Mesh(geo, mat)
    mesh.position.x = camera.position.x
    mesh.position.y = camera.position.y
    mesh.position.z = camera.position.z
    mesh.userData.dirVector = dirVector
    balls_in_play.push(mesh)
    
    scene.add(mesh)
}

// shoot()
// scene.add(balls_in_play[0])

let constructRacquetballRoom = function () {
    let geo = new THREE.BoxBufferGeometry(20, 20, 20)

    let color = new THREE.Color(0xfff3f3)
    let mat = new THREE.MeshPhongMaterial({ depthTest: true, transparent: true, side: THREE.DoubleSide, color: color })
    let mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)
}
constructRacquetballRoom()


let createCornerLight = function () {
    let pointLight = new THREE.PointLight(0xffffff, .5)
    pointLight.position.set(-2, 2, -2);
    const pointHelper = new THREE.PointLightHelper(pointLight, .5);
    scene.add(pointLight, pointHelper)
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

document.body.onkeyup = function (event) {
    var mouse = { x: 1, y: 1 };
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    let cameraLookDir = function (camera) {
        var vector = new THREE.Vector3(0,0, -1);
        vector.applyEuler(camera.rotation, camera.rotation.order);
        
        return vector;
    }

    if (event.keyCode == 32) {
        shoot_basic(cameraLookDir(camera))
        toggle_balls_in_play = true
    }


}


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

var animate = function () {

    //Controls
    controls.update();


    // console.log("Look Vector x,y,z", cameraLookDir(camera).x, cameraLookDir(camera).z, cameraLookDir(camera).y)

    if (toggle_balls_in_play) {
        balls_in_play.forEach(function (ball) {
            ball.position.x += ball.userData.dirVector.x*.01;
            ball.position.y += ball.userData.dirVector.y*.01;
            ball.position.z += ball.userData.dirVector.z*.01;  // move for example in Z direction
            // console.log(ball.geometry.parameters.radius)
        });
    }
    //Time
    const elapsedTime = clock.getElapsedTime();

    // Render
    renderer.render(scene, camera);
    // Call tick again on the next frame
    window.requestAnimationFrame(animate);
};

animate();
