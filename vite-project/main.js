import './style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio ( window.devicePixelRatio);
renderer.setSize( window.innerWidth,window.innerHeight);
camera.position.setZ(30);

renderer.render( scene, camera);

// add objects
const geometry = new THREE.TorusGeometry( 10, 2, 16, 100);
const material = new THREE.MeshStandardMaterial ({color: 0x291b52}); 
const torus = new THREE.Mesh( geometry, material);

scene.add(torus);

const pointLight1 = new THREE.PointLight(0x1f8fff, 400);
pointLight1.position.set(12, 2,5);

const pointLight2 = new THREE.PointLight(0xf246d3, 400);
pointLight2.position.set(-5, 2,15);

const ambientLight = new THREE.AmbientLight(0xffffff, 3); // light everything

scene.add(pointLight1, pointLight2, ambientLight);

const lightHelper1 = new THREE.PointLightHelper(pointLight1);
const lightHelper2 = new THREE.PointLightHelper(pointLight2);
const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(lightHelper1, lightHelper2, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar(){
  const geometry = new THREE.SphereGeometry( 0.25, 24, 24);
  const blueMaterial = new THREE.MeshStandardMaterial( { color: 0x518ee8});
  const pinkMaterial = new THREE.MeshStandardMaterial( { color: 0xc25dbd});
  const blueStar = new THREE.Mesh( geometry, blueMaterial);
  const pinkStar = new THREE.Mesh( geometry, pinkMaterial);

  const [x, y, z ] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ));
  const [a, b, c ] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ));
  pinkStar.position.set(x,y,z);
  blueStar.position.set(a,b,c);
  scene.add(blueStar, pinkStar);
  
}


Array(100).fill().forEach(addStar);

const moonTexture = new THREE.TextureLoader().load('/moon.jpg');
const moonNormalTexture = new THREE.TextureLoader().load('/moonmap.png');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: moonNormalTexture,
  }  )
);

scene.add(moon);

// background
const spaceTexture = new THREE.TextureLoader().load('/galaxy.jpg');
scene.background = spaceTexture;

moon.position.z = 0;
moon.position.x = 0;

//camera.position.set(20, 20, 50);

function moveCamera(){
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  camera.position.z = 10 + t * -0.01;
  camera.position.x = 10 + t * -0.002;
  camera.position.y = 0 +t * -0.002;

}

document.body.onscroll = moveCamera;

function animate(){
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();
