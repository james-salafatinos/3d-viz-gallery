
import * as THREE from 'https://cdn.skypack.dev/three';
let hemiLight = new THREE.HemisphereLight(0xffffff, 0.2);

let dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(-30, 50, -30);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 512;
dirLight.shadow.mapSize.height = 512;
dirLight.shadow.camera.top = 70;
dirLight.shadow.camera.left = -70;
dirLight.shadow.camera.right = 70;
dirLight.shadow.camera.bottom = -70;

const helper = new THREE.DirectionalLightHelper(dirLight, 3);

export let lights = {
  hemiLight: hemiLight,
  dirLight: dirLight,
  helper: helper,
};
