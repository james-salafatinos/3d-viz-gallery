import * as THREE from 'https://cdn.skypack.dev/three';

let createIso = function () {
  let scale = { x: 6, y: 6, z: 6 };
  let pos = { x: 15, y: scale.y / 2, z: -15 };

  const geometry =
    new THREE.IcosahedronBufferGeometry(2, 0);
  const material = new THREE.MeshPhongMaterial({
    color: 0x1e81b0,
    wireframe: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(pos.x, pos.y, pos.z);
  mesh.scale.set(scale.x, scale.y, scale.z);

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  mesh.userData.draggable = true;
  mesh.userData.name = "ISO";
  return mesh;
};

let createPlane = function () {

  const geometry =
    new THREE.PlaneBufferGeometry(5, 5);
  const material = new THREE.MeshBasicMaterial({
    color: 0x1e81b0,
    wireframe: false,
  });

  const mesh = new THREE.Mesh(geometry, material);
  
  mesh.material.side = THREE.DoubleSide;
  mesh.rotation.x += Math.PI *.5
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  mesh.userData.draggable = true;
  mesh.userData.name = "Plane";
  return mesh;
};



export let items = {
  iso: createIso(),
  plane: createPlane()
};