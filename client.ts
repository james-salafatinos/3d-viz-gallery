// If using Relative Import References
import * as THREE from '/build/three.module.js'
import { OrbitControls } from '/jsm/controls/OrbitControls'


const scene: THREE.Scene = new THREE.Scene()
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 3

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)



let createBox = function(){
    let geometry = new THREE.BoxBufferGeometry()
    let material = new THREE.MeshBasicMaterial()
    let mesh = new THREE.Mesh(geometry,material)
    return mesh
}

let createPlane = function(){
    let v1 = new THREE.Vector3(1,4,5)
    let v2 = new THREE.Vector3(6,6,7)
    let line = new THREE.LineCurve3(v1,v2)
    let geo = new THREE.PlaneGeometry(1,1,1)
    let material = new THREE.MeshBasicMaterial({side:THREE.DoubleSide})
    let mesh = new THREE.Mesh(geo,material)
    return mesh
}
let plane = createPlane()
scene.add(plane)

 








window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

let scaler:number = 100;

var animate = function () {
    requestAnimationFrame(animate)

    plane.position.x += THREE.MathUtils.randFloatSpread(1)/scaler
    plane.position.y += THREE.MathUtils.randFloatSpread(1)/scaler
    plane.position.z += THREE.MathUtils.randFloatSpread(1)/scaler
    render()

};

function render() {
    renderer.render(scene, camera)
   
}
animate();