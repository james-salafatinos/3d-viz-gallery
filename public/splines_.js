// import * as THREE from "https://cdn.skypack.dev/three";
import * as THREE from "/build/three.module.js"
// import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls";
import { OrbitControls } from '/jsm/controls/OrbitControls'
// import macromanDatGui from 'https://cdn.skypack.dev/@macroman/dat.gui';

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


let globalCubeCoords = [];
let createSpline = function (p1, p2, p3, p4) {
    /*
    Accepts Vector3s
    */
    let curve_input = [p1, p2, p3, p4]
    let spline = new THREE.CatmullRomCurve3(curve_input);
    console.log("Spline in Create Spline", spline)
    const points = spline.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const splineMesh = new THREE.Line(geometry, material);
    console.log("Spline in Create Spline", splineMesh)
    return splineMesh
}

createSpline(
    new THREE.Vector3(-3, 0, 3),
    new THREE.Vector3(-2, 1, 2),
    new THREE.Vector3(-1, 2, 1),
    new THREE.Vector3(1, 1, 5)
)

let drawSpline = function(){
    if (globalCubeCoords.length % 2 == 0) {
        let L = globalCubeCoords.length
        let u = globalCubeCoords[L - 1]
        let v = globalCubeCoords[L - 2]
        console.log("U<V", u, v)

        let spread = 15
        let rm = new THREE.Vector3(
            THREE.MathUtils.randFloatSpread(spread),
            THREE.MathUtils.randFloatSpread(spread),
            THREE.MathUtils.randFloatSpread(spread))

        let rn = new THREE.Vector3(
            THREE.MathUtils.randFloatSpread(spread),
            THREE.MathUtils.randFloatSpread(spread),
            THREE.MathUtils.randFloatSpread(spread))

     
        let interim_spline = new THREE.CatmullRomCurve3([u, u.clone().add(rm), v.clone().add(rn), v])
        console.log("ArcLength", interim_spline.getPointAt(.5))



        let _x = interim_spline.getPointAt(.5).x
        let _y = interim_spline.getPointAt(.5).y
        let _z = interim_spline.getPointAt(.5).z
        scene.add(createCube(_x, _y, _z))


        let splineMesh = createSpline(u, u.clone().add(rm), v.clone().add(rn), v)
        scene.add(splineMesh)
        }
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

    let cubeCoords = [intersects[0].point.x, intersects[0].point.y, intersects[0].point.z]
    globalCubeCoords.push(new THREE.Vector3(...cubeCoords))
    scene.add(createCube(...cubeCoords))

    if (globalCubeCoords.length % 2 == 0) {
        let L = globalCubeCoords.length
        let u = globalCubeCoords[L - 1]
        let v = globalCubeCoords[L - 2]
        console.log("U<V", u, v)

        let spread = 15
        let rm = new THREE.Vector3(
            THREE.MathUtils.randFloatSpread(spread),
            THREE.MathUtils.randFloatSpread(spread),
            THREE.MathUtils.randFloatSpread(spread))

        let rn = new THREE.Vector3(
            THREE.MathUtils.randFloatSpread(spread),
            THREE.MathUtils.randFloatSpread(spread),
            THREE.MathUtils.randFloatSpread(spread))

    
        let interim_spline = new THREE.CatmullRomCurve3([u, u.clone().add(rm), v.clone().add(rn), v])
        console.log("ArcLength", interim_spline.getPointAt(.5))



        let _x = interim_spline.getPointAt(.5).x
        let _y = interim_spline.getPointAt(.5).y
        let _z = interim_spline.getPointAt(.5).z
        scene.add(createCube(_x, _y, _z))


        let splineMesh = createSpline(u, u.clone().add(rm), v.clone().add(rn), v)

        scene.add(splineMesh)
    }

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




//Const
const clock = new THREE.Clock();

let frameIndex = 0;
var animate = function () {
    frameIndex ++;

    //Controls
    controls.update();

    //Time
    const elapsedTime = clock.getElapsedTime();


    if (frameIndex % 10 == 0){
        let cubeCoords =
        [THREE.MathUtils.randFloatSpread(200),
        THREE.MathUtils.randFloatSpread(200),
        THREE.MathUtils.randFloatSpread(200)]
    globalCubeCoords.push(new THREE.Vector3(...cubeCoords))
    scene.add(createCube(...cubeCoords))
    drawSpline()


    }


    if (scene.children.length > 100){
        for (let k = 3; k <= 100; k++) {
            // console.log("In 4",  scene.children)
            // scene.children[k - 1].geometry.dispose()
            // scene.children[k - 1].material.dispose()
            scene.remove(scene.children[k])
        }

    }
 



    // Render
    renderer.render(scene, camera);
    // Call tick again on the next frame
    window.requestAnimationFrame(animate);
};

animate();
