// import './style.css'
// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import * as dat from 'dat.gui'
// import { DirectionalLightHelper } from 'three'
// import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

import * as THREE from 'https://cdn.skypack.dev/three';
import { OrbitControls }from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls'

console.log("HELLO", THREE, OrbitControls)


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()



const pointLight = new THREE.PointLight(0x0000ff, .5, 1); //color, strength, falloff
// pointLight.color = new THREE.Color(0x0000ff);
pointLight.position.set(1, -.5, 1);
scene.add(pointLight);

const hemiLight = new THREE.HemisphereLight(0xff00ff, 0xff0000, .3);
hemiLight.color = new THREE.Color(0x0000ff);
scene.add(hemiLight);

const directionalLight = new THREE.DirectionalLight(0xccf00c, .3);
directionalLight.position.set(.5, .25, .25);
scene.add(directionalLight)

const rectAreaLight = new THREE.RectAreaLight(0x0000ff, 1, 2, 2); //color, intensity, w, h
//rectarea only works with mesh standard or mesh physical mats
rectAreaLight.position.set(-1, 1.25, -1);
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)


const spotLight = new THREE.SpotLight(0x00ff00, 3, 5, Math.PI * .1, .01, 1); //color, intensity, w
spotLight.position.set(0, 2, 3);
// you can use look at for spotlight!!
spotLight.target.position.x = -.75;
scene.add(spotLight.target)
scene.add(spotLight)


//helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemiLight, .2)
const directionalHelper = new THREE.DirectionalLightHelper(directionalLight, .2)
const pointLightHelper = new THREE.PointLightHelper(pointLight, .2)
const spotLightHelper = new THREE.SpotLightHelper(spotLight, .2)

scene.add(hemisphereLightHelper, directionalHelper, pointLightHelper, spotLightHelper)

window.requestAnimationFrame(()=>{
    spotLightHelper.update()
})


/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()