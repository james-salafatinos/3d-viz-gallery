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
const sphereTexture = loader.load('https://cdn.glitch.com/4ce94fe8-ed51-4ffd-be03-fb92308989d7%2Fpanel%2B023.jpgb2eb29dc-b2c3-4ac7-b9fc-aced0370ab0dLarger.jpg?v=1628445916919')
const displace = loader.load('https://cdn.glitch.com/4ce94fe8-ed51-4ffd-be03-fb92308989d7%2Fcity%2Bdepth%2Bmap.jpg?v=1628446293385')
const sphereNormal = loader.load('https://cdn.glitch.com/4ce94fe8-ed51-4ffd-be03-fb92308989d7%2FXsfXDr.jpg?v=1628448132617')
const alpha  = loader.load('https://cdn.glitch.com/4ce94fe8-ed51-4ffd-be03-fb92308989d7%2Fphoto-1621623681348-8ef41a7060ae.jpg?v=1628445985831')


// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);
// const gridHelper = new THREE.GridHelper(5);
// scene.add(gridHelper);

/**
 * Math
 */


var balls_in_play = []
var toggle_balls_in_play = false;
const G = .0098
const shoot_velocity = 2
let shoot_basic = function (dirVector) {
    let geo = new THREE.SphereBufferGeometry(.2)
    let mat = new THREE.MeshPhongMaterial()
    let mesh = new THREE.Mesh(geo, mat)
    mesh.position.x = camera.position.x
    mesh.position.y = camera.position.y
    mesh.position.z = camera.position.z
    mesh.userData.dirVector = dirVector.multiplyScalar(.2)
    // mesh.material.color = new THREE.Color(`hsl(${2000 - 100}, 100%, 50%)`);
               
    mesh.material.color = new THREE.Color(`hsl(${300}, 100%, 50%)`);
               
    mesh.userData.isWall = false;
    balls_in_play.push(mesh)

    scene.add(mesh)
}


let spacing = 10;
let createPlaneFace = function(x,y,z, rotateX,rotateY,rotateZ, n_x, n_y, n_z){

    let color = new THREE.Color(0xfff3f3)
    let mat = new THREE.MeshPhongMaterial({
        depthTest: true,
        transparent: true,
        alpha: .2,
        side: THREE.DoubleSide,
        color: color
    })

    let geo = new THREE.PlaneBufferGeometry(spacing*2, spacing*2)
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

var top = createPlaneFace(0, spacing,0, .5,1,1, 0, 1, 0)
scene.add(top)//constructRacquetballRoom()

var bottom = createPlaneFace(0, -spacing,0, .5,1,1, 0, -1,0)
scene.add(bottom)//constructRacquetballRoom()

var left = createPlaneFace(0,0, -spacing, 1,1,1, 0,0, -1)
scene.add(left)//constructRacquetballRoom()

var right = createPlaneFace(0,0, spacing, 1,1,1, 0,0, 1)
scene.add(right)

var left2 = createPlaneFace(spacing,0,0, 1,.5,1, -1,0, 0)
scene.add(left2)
var right2 = createPlaneFace(-spacing,0,0, 1,.5,1, 1,0, 0)
scene.add(right2)


let createCubeViz = function(spacing){

    let mat = new THREE.MeshPhongMaterial({
 
        wireframe: false,
        map:texture,
        transparent: false,
        depthTest:true,
        side: THREE.DoubleSide
      });

    let geo = new THREE.BoxGeometry(spacing, spacing,spacing)
    let mesh = new THREE.Mesh(geo, mat)
    return mesh

}
// scene.add(createCubeViz(spacing*2-.1))






let createCornerLight = function () {
    let pointLight = new THREE.PointLight(0xffffff, .8)
    let ambientLight = new THREE.AmbientLight(0xffffff,.2)
    pointLight.position.set(0, 0, 0);
    let ambientLight2 = new THREE.AmbientLight(0xffffff,1)
    ambientLight2.position.set(-30, 20, -30);
    const pointHelper = new THREE.PointLightHelper(pointLight, 0);
    scene.add(pointLight, pointHelper, ambientLight),ambientLight2
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
        var vector = new THREE.Vector3(0, 0, -1);
        vector.applyEuler(camera.rotation, camera.rotation.order);
        return vector;
    }
    if (event.keyCode == 32) {
        shoot_basic(cameraLookDir(camera))
        toggle_balls_in_play = true
    }
}


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
    let planeNormal = new THREE.Vector3(planeMesh.userData.normal.x,planeMesh.userData.normal.y,planeMesh.userData.normal.z )
    let d = v1.clone().sub(planeNormal.multiplyScalar(2*(v1.clone().dot(planeNormal.clone()))))
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
        if (Math.abs(y - top.position.y) < eps){
            // console.log("hit a wall")
            let ball = balls_in_play[i].clone()
            let deltaPlane = planeCollisionVector(ball.userData.dirVector, top)
            balls_in_play[i].userData.dirVector = deltaPlane
        }

        if (Math.abs(y - bottom.position.y) < eps){
            // console.log("hit a wall")
            let ball = balls_in_play[i].clone()
            let deltaPlane = planeCollisionVector(ball.userData.dirVector, bottom)
            balls_in_play[i].userData.dirVector = deltaPlane
        }

        if (Math.abs(z - left.position.z) < eps){
            // console.log("hit a wall")
            let ball = balls_in_play[i].clone()
            let deltaPlane = planeCollisionVector(ball.userData.dirVector, left)
            balls_in_play[i].userData.dirVector = deltaPlane
        }

        if (Math.abs(z - right.position.z) < eps){
            // console.log("hit a wall")
            let ball = balls_in_play[i].clone()
            let deltaPlane = planeCollisionVector(ball.userData.dirVector, right)
            balls_in_play[i].userData.dirVector = deltaPlane
        }

        if (Math.abs(x - left2.position.x) < eps){
            // console.log("hit a wall")
            let ball = balls_in_play[i].clone()
            let deltaPlane = planeCollisionVector(ball.userData.dirVector, left2)
            balls_in_play[i].userData.dirVector = deltaPlane
        }
        

        if (Math.abs(x - right2.position.x) < eps){
            // console.log("hit a wall")
            let ball = balls_in_play[i].clone()
            let deltaPlane = planeCollisionVector(ball.userData.dirVector, right2)
            balls_in_play[i].userData.dirVector = deltaPlane
        }

        for (let j = i; j < balls_in_play.length; j++) {
            let _x = balls_in_play[j].position.x
            let _y = balls_in_play[j].position.y
            let _z = balls_in_play[j].position.z

            if (i == j) {
                //Do Nothing
                // console.log('These are the same ball...')
            }
            else {
                if (((_x - x) ** 2 + (_y - y) ** 2 + (_z - z) ** 2) ** .5 < 2 * eps) {
                    let ball = balls_in_play[i].clone()
                    let ball_vector = new THREE.Vector3(ball.userData.dirVector.x, ball.userData.dirVector.y, ball.userData.dirVector.z)
                    let ball_pos = new THREE.Vector3(ball.position.x, ball.position.y, ball.position.z)

                    let ball2 = balls_in_play[j].clone()
                    let ball2_vector = new THREE.Vector3(ball2.userData.dirVector.x, ball2.userData.dirVector.y, ball2.userData.dirVector.z)
                    let ball2_pos = new THREE.Vector3(ball2.position.x, ball2.position.y, ball2.position.z)

                    let delta1 = collisionVector(ball_vector, ball2_vector, ball_pos, ball2_pos)
                    let delta2 = collisionVector(ball2_vector, ball_vector, ball2_pos, ball_pos)


                    balls_in_play[i].userData.dirVector = delta1
                    balls_in_play[j].userData.dirVector = delta2

                    balls_in_play[i].material.color = new THREE.Color(`hsl(${2000 - delta1.length()*1000}, 100%, 50%)`);
                    balls_in_play[j].material.color = new THREE.Color(`hsl(${2000 - delta2.length()*1000}, 100%, 50%)`);
                    

                } else {
                    //Do nothing
                }

            }
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
            
            //Gravity
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
