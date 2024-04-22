import "./style.css";
import gsap from "gsap/gsap-core";
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// render
const canvas = document.querySelector(".webgl");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
// console.log("canvas", canvas);
const renderer = new THREE.WebGLRenderer({ canvas });

// renderer.render(scene, camera);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// scene
const scene = new THREE.Scene();
// console.log("scene", scene);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 2);
// camera.position.z = 2;
camera.lookAt(0, 0, 0);
scene.add(camera);
// console.log("camera", camera);

// llght;

// const hemiLight = new THREE.HemisphereLight(0x111111, 0xffd700);
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
scene.add(hemisphereLight);

// const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
// scene.add(light);
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
scene.add(pointLight);

// const spotLight = new THREE.SpotLight(0xffffff, 3, 100, 0.2, 0.5);
// spotLight.position.set(0, 25, 0);
// scene.add(spotLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(0, 1, 1); // from above
scene.add(directionalLight);

// glb file - loader
const loader = new GLTFLoader();
let model;
loader.load("assets/burger.glb", (glb) => {
  // loader.load("assets/female/scene.gltf", (gltf) => {
  console.log("loading glb", glb);
  const root = glb.scene;
  model = root;
  root.scale.set(0.5, 0.5, 0.5);
  root.position.y = -0.5;
  scene.add(root);
});

// gltf file
// const loader1 = new GLTFLoader().setPath("assets/female/");
// let model;
// loader1.load("scene.gltf", (gltf) => {
//   console.log("loading gltf", gltf);
//   const root = gltf.scene;
//   model = root;
//   root.scale.set(0.5, 0.5, 0.5);
//   root.position.y = -0.5;
//   scene.add(root);
// });

// controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;
controls.enablePan = false;
controls.enableZoom = false;
// controls.autoRotate = true;
// controls.autoRotateSpeed = 8;

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Update the sphere rotation
  // mesh.rotation.x += 0.005;
  // mesh.rotation.y += 0.005;
  controls.update();
  renderer.render(scene, camera);
}

animate();

// Move on mouse -  Get the center of the screen
const center = { x: sizes.width / 2, y: sizes.height / 2 };

// Function to update cube rotation based on mouse position
function updateCubeRotation(event) {
  if (!model) return; // Ensure the model is loaded
  // Calculate the offset of mouse position from the center
  const offsetX = event.clientX - center.x;
  const offsetY = event.clientY - center.y;

  // Calculate rotation angles based on mouse position
  const rotationY = (Math.atan2(offsetX, sizes.height) * 180) / Math.PI;
  const rotationX = (Math.atan2(offsetY, sizes.width) * 180) / Math.PI;

  // Set cube rotation
  model.rotation.y = (rotationY * Math.PI) / 180;
  model.rotation.x = (-rotationX * Math.PI) / 180;
}

// Add mousemove event listener to update cube rotation
window.addEventListener("mousemove", updateCubeRotation);
