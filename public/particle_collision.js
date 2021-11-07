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
camera.position.x = 11;
camera.position.y = 10;
camera.position.z = 20;
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
const M = 6000




/**
 * Math
 */

let dt;

var vertices = [];
var velocities = [];
var accelerations = [];
var masses = [];
var G = 1



THREE.Vector3.prototype.randomUnitVector = function () {
    this.x = Math.random() * 2 - 1;
    this.y = Math.random() * 2 - 1;
    this.z = 0//Math.random() * 2 - 1;
    this.normalize();
    return this;
}

//Array setup, memory reservation
for (let iter = 0; iter <= M; iter += 1) {
    // vertices.push(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1) // x, y, z
    let V = new THREE.Vector3().randomUnitVector();
    vertices.push(V.x, V.y, V.z)
    velocities.push(V.x, V.y, V.z) //vx, vy, vz
    accelerations.push(0, 0, 0) //ax, ay, az
    masses.push(1, 1, 1)
}


const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
let material = new THREE.PointsMaterial({ size: .8, sizeAttenuation: true, alphaTest: 0.6, transparent: false });
material.color.setHSL(.6, 0.8, 0.3);
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
        // console.log(particle_set)
    }
}

// let N = 25
// let softening = .01
// let getAccelerations = () =>{
//     for (let i = 0; i <= Array(N).length; i += 1) {
//         for (let j = i; i <= Array(N).length; j += 1) {
//             let dx = vertices[j] - vertices[i];
//             let dy = vertices[j + 1] - vertices[i + 1];
//             let dz = vertices[j + 1] - vertices[i + 2];
//             // let inv_r3 = (dx ** 2 + dy ** 2 + dz ** 2 + softening ** 2) ** (-1.5);

//             // accelerations[i] += G * (dx * inv_r3) * masses[j];
//             // accelerations[i + 1] += G * (dy * inv_r3) * masses[j];
//             // accelerations[i + 2] += G * (dz * inv_r3) * masses[j];
//             console.log("Dx, dy,dz", dx,dy,dz)
//         }
//     }

// }

let getPosDifferentials = () => {
    //dx
    let dxs = [];
    for (let i = 0; i <= vertices.length; i += 2) {
        for (let j = i; i <= vertices.length; j += 2) {
            // console.log(i,j)
        }
    }
    return dxs
}


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

var eps = .5
var collisionCheck = function () {
    for (let i = 0; i < vertices.length; i += 3) {
        let x = geometry.attributes.position.array[i]
        let y = geometry.attributes.position.array[i + 1]
        let z = geometry.attributes.position.array[i + 2]

        let vx = velocities[i]
        let vy = velocities[i + 1]
        let vz = velocities[i + 2]


        // if (i%10000 == 0){
        //     console.log("X,Y,Z",i, x,y,z)
        // }


        let scaler = .6

        if (Math.abs(y - top.position.y) < eps) {
            // console.log("hit a wall")

            // console.log("TOP COLLISION!!!")
            let deltaPlane = planeCollisionVector(new THREE.Vector3(vx, vy, vz), top)
            velocities[i] = deltaPlane.x * scaler
            velocities[i + 1] = deltaPlane.y * scaler
            velocities[i + 2] = deltaPlane.z * scaler

        }

        if (Math.abs(y - bottom.position.y) < eps) {
            // console.log("BOTTOM COLLISION!!!")
            let deltaPlane = planeCollisionVector(new THREE.Vector3(vx, vy, vz), bottom)
            velocities[i] = deltaPlane.x * scaler
            velocities[i + 1] = deltaPlane.y * scaler
            velocities[i + 2] = deltaPlane.z * scaler
        }

        if (Math.abs(z - left.position.z) < eps) {
            // console.log("LEFT COLLISION!!!")
            let deltaPlane = planeCollisionVector(new THREE.Vector3(vx, vy, vz), left)
            velocities[i] = deltaPlane.x * scaler
            velocities[i + 1] = deltaPlane.y * scaler
            velocities[i + 2] = deltaPlane.z * scaler
        }

        if (Math.abs(z - right.position.z) < eps) {
            // console.log("RIGHT COLLISION!!!")
            let deltaPlane = planeCollisionVector(new THREE.Vector3(vx, vy, vz), right)
            velocities[i] = deltaPlane.x * scaler
            velocities[i + 1] = deltaPlane.y * scaler
            velocities[i + 2] = deltaPlane.z * scaler
        }

        if (Math.abs(x - left2.position.x) < eps) {
            // // console.log("hit a wall")
            // console.log("LEFT2 COLLISION!!!")
            let deltaPlane = planeCollisionVector(new THREE.Vector3(vx, vy, vz), left2)
            velocities[i] = deltaPlane.x * scaler
            velocities[i + 1] = deltaPlane.y * scaler
            velocities[i + 2] = deltaPlane.z * scaler
        }


        if (Math.abs(x - right2.position.x) < eps) {
            // console.log("RIGHT2 COLLISION!!!")
            let deltaPlane = planeCollisionVector(new THREE.Vector3(vx, vy, vz), right2)
            velocities[i] = deltaPlane.x * scaler
            velocities[i + 1] = deltaPlane.y * scaler
            velocities[i + 2] = deltaPlane.z * scaler
        }
    }
}

var TRACED_MAX_POINTS = 4000;
// geometry
var tracedGeometry = new THREE.BufferGeometry();
// attributes
var tracedPositions = new Float32Array(TRACED_MAX_POINTS * 3); // 3 vertices per point
tracedGeometry.addAttribute('position', new THREE.BufferAttribute(tracedPositions, 3));
// draw range
let tracedDrawCount = 1000; // draw the first 2 points, only
tracedGeometry.setDrawRange(0, tracedDrawCount);
// material
var lineMaterial = new THREE.LineBasicMaterial({ color: 0xff3212 });
// line
let tracedLine = new THREE.Line(tracedGeometry, lineMaterial);
scene.add(tracedLine);


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

let updateTracedPositions = (frameIndex, x2, y2,z2) => {
    tracedPositions[frameIndex] = x2
    tracedPositions[frameIndex + 1] = y2
    tracedPositions[frameIndex + 2] = z2

    tracedLine.geometry.attributes.position.needsUpdate = true

}

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
    if (frameIndex == 0) {
        checkParticles(vertices)
    }

    // getAccelerations()
    collisionCheck()
    updateParticles()
    // getAccelerations()

    // console.log(vertices)
    geometry.attributes.position.needsUpdate = true;

    if (frameIndex % 3 == 0 | frameIndex == 0) {

        updateTracedPositions(frameIndex, Math.random()*20,Math.random()*20, Math.random())
        // console.log(vertices[1], vertices[2])
        // updateTracedPositions(frameIndex, x2, y2)

        tracedGeometry.setDrawRange(1, tracedDrawCount);
        tracedDrawCount += 1
    }
    //Time
    const elapsedTime = clock.getElapsedTime();


    // Render
    renderer.render(scene, camera);
    // Call tick again on the next frame
    window.requestAnimationFrame(animate);
    frameIndex++;
};

animate();
