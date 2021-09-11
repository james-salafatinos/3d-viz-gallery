// import * as THREE from "https://cdn.skypack.dev/three";
import * as THREE from "/build/three.module.js"
// import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls";
import { OrbitControls } from '/jsm/controls/OrbitControls'
// import macromanDatGui from 'https://cdn.skypack.dev/@macroman/dat.gui';




let frameIndex = 0;
let eps = 1
var atDestination = false;
let completedSplines = 0;

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

/**
 * Helpers
 */
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);
const gridHelper = new THREE.GridHelper(50);
scene.add(gridHelper);

/**
 * Math
 */


let createCube = function (_x, _y, _z) {
    let mat = new THREE.MeshPhongMaterial({

        wireframe: false,
        transparent: false,
        depthTest: true,
        side: THREE.DoubleSide
    });
    let geo = new THREE.BoxGeometry(.5, .5, .5)
    let mesh = new THREE.Mesh(geo, mat)
    mesh.position.x = _x
    mesh.position.y = _y
    mesh.position.z = _z
    return mesh

}

let createStars = function () {
    let M = 64
    let N = 64
    let scaler = 10;
    let vertices = [];
    let spacing_scale = 50
    for (let x = -M; x <= M; x += 1) {
        for (let z = -N; z <= N; z += 1) {
            // vertices.push(x / scaler, 0 / scaler, z / scaler)
            vertices.push(
                THREE.MathUtils.randFloatSpread(200),
                THREE.MathUtils.randFloatSpread(200),
                THREE.MathUtils.randFloatSpread(200))
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

var spline_lookup = [];
let globalCubeCoords = [];
let createSpline = function (p1, p2, p3, p4) {
    /*
    Accepts Vector3s
    */
    let curve_input = [p1, p2, p3, p4]
    let spline = new THREE.CatmullRomCurve3(curve_input);
    spline_lookup.push(spline.clone())
    console.log("Spline in Create Spline", spline)
    const points = spline.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const splineMesh = new THREE.Line(geometry, material);
    console.log("Spline Mesh in Create Spline", splineMesh)
    return splineMesh
}




window.addEventListener('dblclick', function (event) {
    console.log("In Click")
    var mouse = { x: 1, y: 1 };
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //Raycast
    var raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = .003;
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
    raycaster.ray.set(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(scene.children);
    console.log(intersects)
    console.log("Pushing X,Y,Z", intersects[0].point.x, intersects[0].point.y, intersects[0].point.z)


    let cameraLookDir = function (camera) {
        var vector = new THREE.Vector3(0, 0, -1);
        vector.applyEuler(camera.rotation, camera.rotation.order);
        return vector;
    }
    console.log("CAMERA", cameraLookDir(camera))

    let cubeCoords = [intersects[0].point.x, intersects[0].point.y, intersects[0].point.z]
    globalCubeCoords.push(new THREE.Vector3(...cubeCoords))
    scene.add(createCube(...cubeCoords))

    let L = globalCubeCoords.length
    let u = camera.position
    let v = globalCubeCoords[L - 1]
    // console.log("U<V", u, v)

    let spread = 10
    let rm = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(spread),
        THREE.MathUtils.randFloatSpread(spread),
        THREE.MathUtils.randFloatSpread(spread))

    let rn = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(spread),
        THREE.MathUtils.randFloatSpread(spread),
        THREE.MathUtils.randFloatSpread(spread))


    // let interim_spline = new THREE.CatmullRomCurve3([u, u.clone().add(rm), v.clone().add(rn), v])
    // console.log("ArcLength", interim_spline.getPointAt(.5))
    // let _x = interim_spline.getPointAt(.5).x
    // let _y = interim_spline.getPointAt(.5).y
    // let _z = interim_spline.getPointAt(.5).z
    // scene.add(createCube(_x, _y, _z))


    let splineMesh = createSpline(u, rm, rn, v)

    scene.add(splineMesh)
    atDestination = false


})

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

let createCameraBox = function(){
    let geo = new THREE.BoxBufferGeometry()
    let mat = new THREE.MeshBasicMaterial()
    let m = new THREE.Mesh(geo,mat)
    return m
}
let box = createCameraBox()
scene.add(box)

//Const
const clock = new THREE.Clock();

var animate = function () {
    frameIndex++;

    //Controls
    controls.update();


    //Time
    const elapsedTime = clock.getElapsedTime();

    if (frameIndex > 1000){
        frameIndex = 0;
    }
    // console.log(spline_lookup)
    if (spline_lookup.length >= 1) {
     

        var camPos = spline_lookup[spline_lookup.length - 1].getPoint((frameIndex+200) / 1000);
 
        var camRot = spline_lookup[spline_lookup.length - 1].getTangent((frameIndex+200) / 1000);
  
        box.position.x = camPos.x;
        box.position.y = camPos.y;
        box.position.z = camPos.z;

        box.rotation.x = camRot.x;
        box.rotation.y = camRot.y;
        box.rotation.z = camRot.z;

        if (atDestination) {
            // console.log("At Destination")


        } else {
            // console.log("Start Descent")
                // console.log(spline_lookup)
                // console.log(frameIndex)
            var camPos = spline_lookup[spline_lookup.length - 1].getPoint(frameIndex / 1000);
            // console.log("camPos", camPos)
            var camRot = spline_lookup[spline_lookup.length - 1].getTangent(frameIndex / 1000);

            camera.position.x = camPos.x;
            camera.position.y = camPos.y;
            camera.position.z = camPos.z;

            camera.rotation.x = camRot.x;
            camera.rotation.y = camRot.y;
            camera.rotation.z = camRot.z;

            // console.log("point", spline_lookup[spline_lookup.length - 1].getPoint((frameIndex + 1)))
            camera.lookAt(spline_lookup[spline_lookup.length - 1].getPoint((frameIndex + 1) / 1000));


            let P = spline_lookup[spline_lookup.length - 1].points[3]

            //Collision Check
            if (((camera.position.x - P.x) ** 2
                + (camera.position.y - P.y) ** 2
                + (camera.position.z - P.z) ** 2) ** .5
                < 2 * eps) {
                console.log('TOUCHIN')
                console.log(controls.target)
                completedSplines++;


                console.log(P)
                controls.target.set(P.x, P.y, P.z)
                console.log(controls.target)
                controls.update()
            

                atDestination = true
            }

        }
    }


    // Render
    renderer.render(scene, camera);
    // Call tick again on the next frame
    window.requestAnimationFrame(animate);
};

animate();
