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


/**
 * Math
 */
var world_objects = []
var world_objects_in_play = false;
const G = .000
const SPACING = 10
const OBJECT_SIZE = .01

 let add_object = function (dirVector, object_size) {
     /**
     dirVector: THREE.Vector3
     object_size: number
     */
     let geo = new THREE.SphereBufferGeometry(object_size)
     let mat = new THREE.MeshBasicMaterial()
     let mesh = new THREE.Mesh(geo, mat)
     mesh.userData.dirVector = dirVector.multiplyScalar(.2)
     mesh.material.color = new THREE.Color(`hsl(${300}, 100%, 50%)`);
     mesh.userData.isWall = false;
     mesh.userData.hitCounts = 0;
     
     world_objects.push(mesh)

     scene.add(mesh)
 }
 
 let createWall = function () {

    let color = new THREE.Color(0xfff3f3)
    let mat = new THREE.MeshPhongMaterial({
        alpha: .2,
        side: THREE.DoubleSide,
        color: color,
        visible:true
    })

    let geo = new THREE.BoxBufferGeometry(25,25,25)
    let mesh = new THREE.Mesh(geo, mat)
    mesh.userData.dirVector = new THREE.Vector3(0, 0, 0)
    mesh.userData.isWall = true
    return mesh

}

var box = createWall()
scene.add(box)
// const helper = new THREE.VertexNormalsHelper( box, 1, 0xff0000 );
// scene.add( helper );
// console.log("Logging Normal of Plane", box.geometry.computeVertexNormals())

//Const
const clock = new THREE.Clock();


var animate = function () {

    //Controls
    controls.update();

 
    //Time
    const elapsedTime = clock.getElapsedTime();


    // Render
    renderer.render(scene, camera);
    // Call tick again on the next frame
    window.requestAnimationFrame(animate);
};

animate();
