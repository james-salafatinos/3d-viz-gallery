
// import * as THREE from "https://cdn.skypack.dev/three";
import * as THREE from "/build/three.module.js"
// import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls";
import { OrbitControls } from '/jsm/controls/OrbitControls'
// import macromanDatGui from 'https://cdn.skypack.dev/@macroman/dat.gui';



// // Canvas
// const canvas = document.querySelector("canvas.webgl");
// dom
let container = document.getElementById('container');

// Scene
const scene = new THREE.Scene();

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);
// const gridHelper = new THREE.GridHelper(5);
// scene.add(gridHelper);

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
let frameIndex = 0;
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();


let tiles = []

let Tile = function (tile_size,seed, rotation) {
    let base_plane = new THREE.PlaneBufferGeometry(tile_size, tile_size)
    let color = new THREE.Color(`hsl(${seed + THREE.MathUtils.randFloatSpread(100)}, 29%, 50%)`);
    let base_mat = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide })
    let tile = new THREE.Mesh(base_plane, base_mat)
    tile.rotation.x = Math.PI * rotation
    return tile
}
let generateTiles = function (originX, originY, size_m, size_n, tile_size,seed, rotation) {
    for (let i = originX-size_m; i < originX+size_m; i++) {
        for (let j = originY-size_n; j < originY+size_n; j++) {

            let tile = Tile(tile_size, seed,rotation)
            tile.position.x = i
            tile.position.z = j


            tiles.push(tile)
            scene.add(tile)
        }
    }
}
generateTiles(0,0, 8, 8, 2,140, .5)


let players = []
let Player = function () {
    let base_geo = new THREE.BoxBufferGeometry(1, 1)
    let color = new THREE.Color(`hsl(${50}, 7%, 88%)`);
    let base_mat = new THREE.MeshLambertMaterial({ color: color, side: THREE.DoubleSide })
    let player = new THREE.Mesh(base_geo, base_mat)
    return player
}
let initPlayer = function (id) {
    let player = Player()
    player.userData.id = id
    player.position.y = .5
    players.push(player)
    scene.add(player)
    return player
}
let setPlayerPos = function (player, _x, _y, _z) {
    player.position.x = _x
    player.position.y = _y
    player.position.z = _z

}
initPlayer('root')

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
camera.position.x = 1;
camera.position.y = 10;
camera.position.z = 8;
scene.add(camera);



/**
 * Renderer
 */

// renderer
let renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);
// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


let splines = []
let splineMeshes = []
let createSpline = (p1, p2) => {
    console.log(p1, p2)
    // Create a sine-like wave
    // let midpointX = (p2.x - p1.x)/(p1.x+p2.x)
    // let midpointZ = (p2.z - p1.z)/(p1.z+p2.z)
    const curve = new THREE.CatmullRomCurve3([
        p1, p2
    ]);

    const points = curve.getPoints(25);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

    // Create the final object to add to the scene
    const splineObject = new THREE.Line(geometry, material);
    console.log(splineObject)
    splines.push(curve)
    splineMeshes.push(splineObject)
    scene.add(splineObject)
}
/**
 * DOM Callbacks
 */
let walking = false;
let walkingTo = new THREE.Vector3()

window.addEventListener('click', function (event) {
    console.log("In Click")
    frameIndex =0
    var mouse = { x: 1, y: 1 };
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //Raycast
    var raycaster = new THREE.Raycaster();
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
    raycaster.ray.set(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        // console.log(intersects)
        // console.log("Pushing X,Y,Z", intersects[0].object.position.x, intersects[0].point.y, intersects[0].point.z)
        // let new_player = initPlayer()
        // setPlayerPos(new_player,intersects[0].point.x, intersects[0].point.y+.5, intersects[0].point.z )

        let p1 = new THREE.Vector3(players[0].position.x, 0, players[0].position.z)
        let p2 = new THREE.Vector3(intersects[0].object.position.x, 0, intersects[0].object.position.z)
        createSpline(p1, p2)

        walking = true
        walkingTo = p2.clone()
        // players[0].position.x = intersects[0].object.position.x
        // players[0].position.z = intersects[0].object.position.z

    }
}
);




let CANVAS_WIDTH = 150;
let CANVAS_HEIGHT = 150;
let CAM_DISTANCE = 400;

// dom
let container2 = document.getElementById('insert');

// renderer
let renderer2 = new THREE.WebGLRenderer();
renderer2.setClearColor(0xf0f0f0, 1);
renderer2.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
renderer2.setPixelRatio(0.5);
container2.appendChild(renderer2.domElement);

// camera
let camera2 = new THREE.OrthographicCamera(CANVAS_WIDTH / - 8, CANVAS_WIDTH / 8, CANVAS_HEIGHT / 8, CANVAS_HEIGHT / - 8, 1, 100);
console.log(camera2)
camera2.position.x = 0
camera2.position.y = 10
camera2.position.z = 0
camera2.lookAt(0, 0, 0)


/**
 * Animate
 */
let createDoor = ()=>{
    let door = Tile(1,180,1)
    door.position.x = 4
    door.position.z = 8
    door.position.y = .5
    scene.add(door)
    return door
}
let door = createDoor()
let doorCheck = (x,y,z) =>{
    console.log('doorcheck')
    if (((players[0].position.x - door.position.x) ** 2
    + (players[0].position.y - door.position.y) ** 2
    + (players[0].position.z - door.position.z) ** 2) ** .5
    < 2 * eps) {
        console.log('doorfound')
    
        generateTiles(0,16, 8, 8, 2,140, .5)
}}

let render = function () {
    renderer.render(scene, camera);
    renderer2.render(scene, camera2);
}

//Const
const clock = new THREE.Clock();
let eps = .33

var animate = function () {
    frameIndex++;
    //Time
    const elapsedTime = clock.getElapsedTime();

    if (walking) {
        
        // console.log(splines)
        var camPos = splines[splines.length - 1].getPoint((frameIndex ) / 200);
        var camRot = splines[splines.length - 1].getTangent((frameIndex) / 200);

        players[0].position.x = camPos.x;
        // players[0].position.y = camPos.y;
        players[0].position.z = camPos.z;

        // // players[0].rotation.x = camRot.x;
        // players[0].rotation.y = camRot.y;
        // // players[0].rotation.z = camRot.z;

        // players[0].lookAt(splines[splines.length - 1].getPoint((frameIndex + 1) / 100));

        if (((players[0].position.x - walkingTo.x) ** 2
            + (players[0].position.y - walkingTo.y) ** 2
            + (players[0].position.z - walkingTo.z) ** 2) ** .5
            < 2 * eps) {
                console.log('TOUCHIN')
                doorCheck()
                walking = false;
                frameIndex =0;
                splines = []
                console.log(splines, frameIndex)
                splineMeshes.forEach((splineMesh)=>{
                    scene.remove(splineMesh)
            })
            


            

        }

    }

    // Render
    render()
    // Call tick again on the next frame
    window.requestAnimationFrame(animate);
};

animate();
