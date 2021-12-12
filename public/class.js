import * as THREE from "https://cdn.skypack.dev/three";
// import * as THREE from "/build/three.module.js"
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls";
// import { OrbitControls } from '/jsm/controls/OrbitControls'
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


var balls_in_play = []
var toggle_balls_in_play = false;
const G = .000
const shoot_velocity = 2
let shoot_basic = function (dirVector) {
    let geo = new THREE.SphereBufferGeometry(.01)
    let mat = new THREE.MeshBasicMaterial()
    let mesh = new THREE.Mesh(geo, mat)
    // mesh.position.x = camera.position.x
    // mesh.position.y = camera.position.y
    // mesh.position.z = camera.position.z
    mesh.userData.dirVector = dirVector.multiplyScalar(.2)
    mesh.material.color = new THREE.Color(`hsl(${300}, 100%, 50%)`);
    mesh.userData.isWall = false;
    mesh.userData.hitCounts = 0;
    balls_in_play.push(mesh)
    scene.add(mesh)
}


let spacing = 10;
let createPlaneFace = function (x, y, z, rotateX, rotateY, rotateZ, n_x, n_y, n_z) {

    let color = new THREE.Color(0xfff3f3)
    let mat = new THREE.MeshPhongMaterial({
        // depthTest: true,
        // transparent: true,
        alpha: .2,
        side: THREE.DoubleSide,
        color: color,
        visible:false
    })

    let geo = new THREE.PlaneBufferGeometry(spacing * 2, spacing * 2)
    let mesh = new THREE.Mesh(geo, mat)

    mesh.rotateX(Math.PI * rotateX)
    mesh.rotateY(Math.PI * rotateY)
    mesh.position.x = x
    mesh.position.y = y
    mesh.position.z = z
    mesh.userData.dirVector = new THREE.Vector3(0, 0, 0)
    mesh.userData.isWall = true
    mesh.userData.normal = new THREE.Vector3(n_x, n_y, n_z)
    return mesh

}

var top = createPlaneFace(0, spacing, 0, .5, 1, 1, 0, 1, 0)
scene.add(top)//constructRacquetballRoom()

var bottom = createPlaneFace(0, -spacing, 0, .5, 1, 1, 0, -1, 0)
scene.add(bottom)//constructRacquetballRoom()

var left = createPlaneFace(0, 0, -spacing, 1, 1, 1, 0, 0, -1)
scene.add(left)//constructRacquetballRoom()

var right = createPlaneFace(0, 0, spacing, 1, 1, 1, 0, 0, 1)
scene.add(right)

var left2 = createPlaneFace(spacing, 0, 0, 1, .5, 1, -1, 0, 0)
scene.add(left2)
var right2 = createPlaneFace(-spacing, 0, 0, 1, .5, 1, 1, 0, 0)
scene.add(right2)



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


THREE.Vector3.prototype.randomUnitVector = function(){
    this.x = Math.random() * 2 - 1;
    this.y = Math.random() * 2 - 1;
    this.z = 0//Math.random() * 2 - 1;
    this.normalize();
    return this;
}



document.body.onkeyup = function (event) {
    var mouse = { x: 1, y: 1 };
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    let cameraLookDir = function (camera) {
        var vector = new THREE.Vector3(0, 0, -1);
        vector.applyEuler(camera.rotation, camera.rotation.order);
        return vector;
    }
    if (event.keyCode == 32) {
        // console.log(cameraLookDir(camera))
        // console.log("Sum", Math.abs(cameraLookDir(camera).x) + Math.abs(cameraLookDir(camera).y) + Math.abs(cameraLookDir(camera).z ))
        // shoot_basic(cameraLookDir(camera))
        let NUM_BALLS = 5000
        for (let index = 0; index < NUM_BALLS; index++) {
            let V = new THREE.Vector3().randomUnitVector();
            // let V = new THREE.Vector3(THREE.MathUtils.randFloatSpread(1), THREE.MathUtils.randFloatSpread(1), THREE.MathUtils.randFloatSpread(0))
            console.log("HI", V)
            shoot_basic(V)
            
        }
   
        
     
        toggle_balls_in_play = true
    }
}



// let genVector3s = () =>{
//     return list_of_vectors
// }




/**
 * Animate
 */



function collisionVector(v1, v2, x1, x2) {
    let d = v1.clone().sub(
        ((x1.clone()).sub(x2.clone())).multiplyScalar(
            ((v1.clone()).sub(v2.clone())).dot(
                (x1.clone()).sub(x2.clone())
            ) / (((x1.clone()).sub(x2.clone())).length() ** 2)))

    return d
}


function planeCollisionVector(_v1, planeMesh) {
    let v1 = new THREE.Vector3(_v1.x, _v1.y, _v1.z)
    // let planeNormal = new THREE.Vector3(0,1,0).clone()
    let planeNormal = new THREE.Vector3(planeMesh.userData.normal.x, planeMesh.userData.normal.y, planeMesh.userData.normal.z)
    let d = v1.clone().sub(planeNormal.multiplyScalar(2 * (v1.clone().dot(planeNormal.clone()))))
    return d
}

var eps = .209
var collisionCheck = function () {
    for (let i = 0; i < balls_in_play.length; i++) {
        let x = balls_in_play[i].position.x
        let y = balls_in_play[i].position.y
        let z = balls_in_play[i].position.z


        // console.log('Top', top)
        // console.log(balls_in_play[i], top.position)
        if (Math.abs(y - top.position.y) < eps) {
            // console.log("hit a wall")
            let ball = balls_in_play[i].clone()
            let deltaPlane = planeCollisionVector(ball.userData.dirVector, top)
            balls_in_play[i].userData.dirVector = deltaPlane
            balls_in_play[i].userData.hitCounts += 1;
            balls_in_play[i].material.color = new THREE.Color(`hsl(${300 + 10*balls_in_play[i].userData.hitCounts}, 100%, 50%)`);
            // mesh.material.color = new THREE.Color(`hsl(${300}, 100%, 50%)`);
        }

        if (Math.abs(y - bottom.position.y) < eps) {
            // console.log("hit a wall")
            let ball = balls_in_play[i].clone()
            let deltaPlane = planeCollisionVector(ball.userData.dirVector, bottom)
            balls_in_play[i].userData.dirVector = deltaPlane
            balls_in_play[i].userData.hitCounts += 1;
            balls_in_play[i].material.color = new THREE.Color(`hsl(${300 + 10*balls_in_play[i].userData.hitCounts}, 100%, 50%)`);
        }

        if (Math.abs(z - left.position.z) < eps) {
            // console.log("hit a wall")
            let ball = balls_in_play[i].clone()
            let deltaPlane = planeCollisionVector(ball.userData.dirVector, left)
            balls_in_play[i].userData.dirVector = deltaPlane
            balls_in_play[i].userData.hitCounts += 1;
            balls_in_play[i].material.color = new THREE.Color(`hsl(${300 + 10*balls_in_play[i].userData.hitCounts}, 100%, 50%)`);
        }

        if (Math.abs(z - right.position.z) < eps) {
            // console.log("hit a wall")
            let ball = balls_in_play[i].clone()
            let deltaPlane = planeCollisionVector(ball.userData.dirVector, right)
            balls_in_play[i].userData.dirVector = deltaPlane
            balls_in_play[i].userData.hitCounts += 1;
            balls_in_play[i].material.color = new THREE.Color(`hsl(${300 + 10*balls_in_play[i].userData.hitCounts}, 100%, 50%)`);
        }

        if (Math.abs(x - left2.position.x) < eps) {
            // console.log("hit a wall")
            let ball = balls_in_play[i].clone()
            let deltaPlane = planeCollisionVector(ball.userData.dirVector, left2)
            balls_in_play[i].userData.dirVector = deltaPlane
            balls_in_play[i].userData.hitCounts += 1;
            balls_in_play[i].material.color = new THREE.Color(`hsl(${300 + 10*balls_in_play[i].userData.hitCounts}, 100%, 50%)`);
        }


        if (Math.abs(x - right2.position.x) < eps) {
            // console.log("hit a wall")
            let ball = balls_in_play[i].clone()
            let deltaPlane = planeCollisionVector(ball.userData.dirVector, right2)
            balls_in_play[i].userData.dirVector = deltaPlane
            balls_in_play[i].userData.hitCounts += 1;
            balls_in_play[i].material.color = new THREE.Color(`hsl(${300 + 10*balls_in_play[i].userData.hitCounts}, 100%, 50%)`);
        }
    }
}



//Const
const clock = new THREE.Clock();


var animate = function () {

    //Controls
    controls.update();

    if (toggle_balls_in_play) {
        // console.log("Enter Toggle Balls In Play,", balls_in_play)

        balls_in_play.forEach(function (ball) {

            // // Gravity
            // ball.userData.dirVector.y -= G

            // //Loss to heat/friction
            // ball.userData.dirVector.multiplyScalar(.998)

            //Continuity
            ball.position.x += ball.userData.dirVector.x;
            ball.position.y += ball.userData.dirVector.y;
            ball.position.z += ball.userData.dirVector.z;

        });
        collisionCheck()
    }
    //Time
    const elapsedTime = clock.getElapsedTime();


    // Render
    renderer.render(scene, camera);
    // Call tick again on the next frame
    window.requestAnimationFrame(animate);
};

animate();
