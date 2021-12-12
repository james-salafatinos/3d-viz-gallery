// import * as THREE from "/build/three.module.js"
// import { OrbitControls } from '/jsm/controls/OrbitControls'
import * as THREE from "https://cdn.skypack.dev/three";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls";
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
camera.position.x = 11;
camera.position.y = 40;
camera.position.z = 50;
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




const M = 5000




/**
 * Math
 */

var vertices = [];
var velocities = [];
var accelerations = [];
var masses = [];
var G = 1



THREE.Vector3.prototype.randomUnitVector = function () {
    this.x = Math.random() * 2 - 1;
    this.y = Math.random() * 2 - 1;
    this.z = Math.random() * 2 - 1;
    this.normalize();
    return this;
}

//Array setup, memory reservation
for (let iter = 0; iter <= M; iter += 1) {
    // vertices.push(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1) // x, y, z
    let V = new THREE.Vector3().randomUnitVector();
    vertices.push(V.x, V.y, V.z)
    velocities.push(V.x, V.y, V.z) //vx, vy, vz
    accelerations.push(0, -.02, 0) //ax, ay, az
    masses.push(1, 1, 1)
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
let material = new THREE.PointsMaterial({ size: .8, sizeAttenuation: true, alphaTest: 0.6, transparent: false });
material.color.setHSL(.6, 0.8, 0.3);
const particles = new THREE.Points(geometry, material);
scene.add(particles);


let spacing = 25;
let createPlaneFace = function (x, y, z, rotateX, rotateY, rotateZ, n_x, n_y, n_z) {

    let color = new THREE.Color(0xfff3f3)
    let mat = new THREE.MeshPhongMaterial({
        depthTest: true,
        transparent: false,

        side: THREE.DoubleSide,
        color: color,
        visible: true
    })

    let geo = new THREE.PlaneBufferGeometry(spacing, spacing)
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

function planeCollisionVector(_v1, planeMesh) {
    let v1 = new THREE.Vector3(_v1.x, _v1.y, _v1.z)
    // let planeNormal = new THREE.Vector3(0,1,0).clone()
    let planeNormal = new THREE.Vector3(planeMesh.userData.normal.x, planeMesh.userData.normal.y, planeMesh.userData.normal.z)
    let d = v1.clone().sub(planeNormal.multiplyScalar(2 * (v1.clone().dot(planeNormal.clone()))))
    return d
}

var eps = .0001
var collisionCheck = function () {
    for (let i = 0; i < vertices.length; i += 3) {
        let x = geometry.attributes.position.array[i]
        let y = geometry.attributes.position.array[i + 1]
        let z = geometry.attributes.position.array[i + 2]

        let vx = velocities[i]
        let vy = velocities[i + 1]
        let vz = velocities[i + 2]
       
        let scaler = 1

        if (y - top.position.y <= eps) {
            // console.log("hit a wall")
            console.log('top')
            // console.log("TOP COdLLISION!!!")
            let deltaPlane = planeCollisionVector(new THREE.Vector3(vx, vy, vz), top)
            // console.log(vertices[i+1], top.position.y)
            // vertices[i + 1] = top.position.y
            velocities[i] = deltaPlane.x * scaler
            velocities[i + 1] = deltaPlane.y * scaler
            velocities[i + 2] = deltaPlane.z * scaler

        }

        if (y - bottom.position.y <= eps) {
            // console.log("BOTTOM COLLISION!!!")
            let deltaPlane = planeCollisionVector(new THREE.Vector3(vx, vy, vz), bottom)
            // vertices[i + 1] = bottom.position.y
            velocities[i] = deltaPlane.x * scaler
            velocities[i + 1] = deltaPlane.y * scaler
            velocities[i + 2] = deltaPlane.z * scaler
        }

        if (z - left.position.z <= eps) {
            // console.log("LEFT COLLISION!!!")
            // vertices[i + 2] = left.position.z
            let deltaPlane = planeCollisionVector(new THREE.Vector3(vx, vy, vz), left)
            velocities[i] = deltaPlane.x * scaler
            velocities[i + 1] = deltaPlane.y * scaler
            velocities[i + 2] = deltaPlane.z * scaler
        }

        if (z - right.position.z <= eps) {
            // console.log("RIGHT COLLISION!!!")
            // vertices[i + 2] = right.position.z
            let deltaPlane = planeCollisionVector(new THREE.Vector3(vx, vy, vz), right)
            velocities[i] = deltaPlane.x * scaler
            velocities[i + 1] = deltaPlane.y * scaler
            velocities[i + 2] = deltaPlane.z * scaler
        }

        if (x - left2.position.x <= eps) {
            // // console.log("hit a wall")
            // console.log("LEFT2 COLLISION!!!")
            // vertices[i] = left2.position.x
            let deltaPlane = planeCollisionVector(new THREE.Vector3(vx, vy, vz), left2)
            velocities[i] = deltaPlane.x * scaler
            velocities[i + 1] = deltaPlane.y * scaler
            velocities[i + 2] = deltaPlane.z * scaler
        }


        if (x - right2.position.x <= eps) {
            // console.log("RIGHT2 COLLISION!!!")
            // console.log(vertices[i])
            // vertices[i] = right2.position.x
            // console.log(vertices[i])
            let deltaPlane = planeCollisionVector(new THREE.Vector3(vx, vy, vz), right2)
            velocities[i] = deltaPlane.x * scaler
            velocities[i + 1] = deltaPlane.y * scaler
            velocities[i + 2] = deltaPlane.z * scaler
        }

        for (let j = i; j < vertices.length; j+=3) {

            let x2 = geometry.attributes.position.array[j]
            let y2 = geometry.attributes.position.array[j + 1]
            let z2 = geometry.attributes.position.array[j + 2]
    
            let vx2 = velocities[i]
            let vy2 = velocities[i + 1]
            let vz2 = velocities[i + 2]
    
            let scaler = 1

        
     
            if (i == j) {
                //Do Nothing
                // console.log('These are the same ball...')
            }
            else {
                if (((x2 - x) ** 2 + (y2 - y) ** 2 + (z2 - z) ** 2) ** .5 < 2 * eps) {
                    // console.log("Collision")
                    // console.log('Pos', x2,y2,z2)
                    let xyz2_pos = new THREE.Vector3(x2, x2, x2)
                    let vxyz2_vector = new THREE.Vector3(vx2, vy2, vz2)

                    let xyz1_pos = new THREE.Vector3(x, x, x)
                    let vxyz1_vector = new THREE.Vector3(vx, vy, vz)
                    // console.log('vector', vxyz1_vector)

                    let delta1 = collisionVector(xyz1_pos, xyz2_pos, xyz1_pos, xyz2_pos)
                    let delta2 = collisionVector(vxyz2_vector, vxyz1_vector, xyz2_pos, xyz1_pos)
                    
                    // console.log(delta1)
                    // velocities[iter] = accelerations[iter]
                    // velocities[iter + 1] = accelerations[iter + 1]
                    // velocities[iter + 2] = accelerations[iter + 2]
                    // console.log(velocities[i])
                    velocities[i] += delta1.x 
                    velocities[i + 1] = delta1.y 
                    velocities[i + 2] = delta1.z 

                    velocities[j] = delta2.x 
                    velocities[j + 1] = delta2.y 
                    velocities[j + 2] = delta2.z 
                    // var colors = pointCloud.geometry.attributes.color.array;
                    // console.log(material)
                    // balls_in_play[i].material.color = new THREE.Color(`hsl(${2000 - delta1.length()*1000}, 100%, 50%)`);
                    // balls_in_play[j].material.color = new THREE.Color(`hsl(${2000 - delta2.length()*1000}, 100%, 50%)`);
                    
            
                }

            }
        //         if (((_x - x) ** 2 + (_y - y) ** 2 + (_z - z) ** 2) ** .5 < 2 * eps) {
        //             let ball = balls_in_play[i].clone()
        //             let ball_vector = new THREE.Vector3(ball.userData.dirVector.x, ball.userData.dirVector.y, ball.userData.dirVector.z)
        //             let ball_pos = new THREE.Vector3(ball.position.x, ball.position.y, ball.position.z)

        //             let ball2 = balls_in_play[j].clone()
        //             let ball2_vector = new THREE.Vector3(ball2.userData.dirVector.x, ball2.userData.dirVector.y, ball2.userData.dirVector.z)
        //             let ball2_pos = new THREE.Vector3(ball2.position.x, ball2.position.y, ball2.position.z)

        //             let delta1 = collisionVector(ball_vector, ball2_vector, ball_pos, ball2_pos)
        //             let delta2 = collisionVector(ball2_vector, ball_vector, ball2_pos, ball_pos)


        //             velocities[i] = delta1.x
        //             velocities[i+1] = delta1.y
        //             velocities[i+2] = delta1.z
        //             balls_in_play[j].userData.dirVector = delta2

        //             // balls_in_play[i].material.color = new THREE.Color(`hsl(${2000 - delta1.length() * 1000}, 100%, 50%)`);
        //             // balls_in_play[j].material.color = new THREE.Color(`hsl(${2000 - delta2.length() * 1000}, 100%, 50%)`);


        //         } else {
        //             //Do nothing
        //         }

        //     }
        // }
    }
}}


function collisionVector(v1, v2, x1, x2) {
    let d = v1.clone().sub(
        ((x1.clone()).sub(x2.clone())).multiplyScalar(
            ((v1.clone()).sub(v2.clone())).dot(
                (x1.clone()).sub(x2.clone())
            ) / (((x1.clone()).sub(x2.clone())).length() ** 2)))

    return d
}


// var TRACED_MAX_POINTS = 4000;
// // geometry
// var tracedGeometry = new THREE.BufferGeometry();
// // attributes
// var tracedPositions = new Float32Array(TRACED_MAX_POINTS * 3); // 3 vertices per point
// tracedGeometry.addAttribute('position', new THREE.BufferAttribute(tracedPositions, 3));
// // draw range
// let tracedDrawCount = 1000; // \
// tracedGeometry.setDrawRange(0, tracedDrawCount);
// // material
// var lineMaterial = new THREE.LineBasicMaterial({ color: 0xff3212 });
// // line
// let tracedLine = new THREE.Line(tracedGeometry, lineMaterial);
// scene.add(tracedLine);


// var tracedX = 0;
// var tracedY = 0;
// var tracedZ = 0;
// var tracedIndex = 0;
// var tracedPositions = tracedLine.geometry.attributes.position.array;
// for (var i = 0, l = TRACED_MAX_POINTS; i < l; i++) {
//     tracedPositions[tracedIndex++] = tracedX;
//     tracedPositions[tracedIndex++] = tracedY;
//     tracedPositions[tracedIndex++] = tracedZ;
// }

// let updateTracedPositions = (frameIndex, x2, y2,z2) => {
//     tracedPositions[frameIndex] = x2
//     tracedPositions[frameIndex + 1] = y2
//     tracedPositions[frameIndex + 2] = z2

//     tracedLine.geometry.attributes.position.needsUpdate = true

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

let updateParticles = () => {
    updateVelocities()
    updatePositions()
}

// console.log(getPosDifferentials())
console.log("Vertices", vertices)
console.log("Velocities", velocities)
//Const
let frameIndex = 0;
const clock = new THREE.Clock();
var animate = function () {

    //Controls
    controls.update();

    collisionCheck()
    updateParticles()

    geometry.attributes.position.needsUpdate = true;

    // if (frameIndex % 3 == 0 | frameIndex == 0) {

    //     updateTracedPositions(frameIndex, Math.random()*20,Math.random()*20, Math.random())
    //     // console.log(vertices[1], vertices[2])
    //     // updateTracedPositions(frameIndex, x2, y2)

    //     tracedGeometry.setDrawRange(1, tracedDrawCount);
    //     tracedDrawCount += 1
    // }
    //Time
    const elapsedTime = clock.getElapsedTime();


    // Render
    renderer.render(scene, camera);
    // Call tick again on the next frame
    window.requestAnimationFrame(animate);
    frameIndex++;
};

animate();
