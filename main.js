import { Clock, Color, PCFSoftShadowMap, PerspectiveCamera, Scene, TextureLoader, Vector2, WebGLRenderer } from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import initPostEffects from "./src/initPostEffects";
import initLights from "./src/initLights";
import { CameraController } from "./src/cameraController";


const scene = new Scene();
scene.background = new Color(10, 10, 10)

const renderer = new WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
console.log(renderer.domElement)
const cameraControls = new CameraController(camera, renderer.domElement);
cameraControls.listen();
// Instantiate a loader
const loader = new GLTFLoader();

const buttons = document.querySelectorAll('button');

buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
        switchCamera(button.id)
    });
})

camera.position.set(4.2, 4, 6)


function switchCamera(cameraIndex) {
    if (cameraIndex === 'camera-1') {
        camera.position.set(22, 4, 12)
    }

    if (cameraIndex === 'camera-2') {
        camera.position.set(4.2, 4, 6)
    }

    if (cameraIndex === 'camera-3') {
        camera.position.set(-4, 9.6, 23)
    }

    if (cameraIndex === 'camera-4') {
        camera.position.set(15, 2.2, 4)
    }
}

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
loader.setDRACOLoader(dracoLoader);

// Load a glTF resource
loader.load(
    './scene.glb',
    function (gltf) {
        gltf.scene.traverse((obj) => {
            if (obj.type === "Mesh") {
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        })
        scene.add(gltf.scene);
        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object

    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.log('An error happened', error);
    }
);

const { composer, CCTVPass, bloomPass } = initPostEffects(renderer, scene, camera);
const { ambient, light } = initLights(scene);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    bloomPass.resolution = new Vector2(window.innerWidth, window.innerHeight);
    CCTVPass.uniforms.windowAspectRatio.value = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

setInterval(() => {
    if (Math.random() > 0.95) {
        CCTVPass.uniforms.byp.value = 1;
    } else {
        CCTVPass.uniforms.byp.value = 0;
    }
}, 1000)

const clock = new Clock();

function animate() {
    CCTVPass.uniforms.seed.value = Math.random() * 10;
    CCTVPass.uniforms.time.value += 0.01;
    composer.render(scene, camera)
    cameraControls.delta = clock.getDelta() / 8;
    if (cameraControls.currentKey === 'ArrowLeft' || cameraControls.currentKey === 'KeyA' || cameraControls.touchDirection === 'left') {
        cameraControls.rotateLeft();
    }

    if (cameraControls.currentKey === 'ArrowRight' || cameraControls.currentKey === "KeyD" || cameraControls.touchDirection === 'right') {
        cameraControls.rotateRight();
    }

    if (cameraControls.currentKey === 'ArrowUp' || cameraControls.currentKey === "KeyW" || cameraControls.touchDirection === 'up') {
        cameraControls.rotateUp();
    }

    if (cameraControls.currentKey === 'ArrowDown' || cameraControls.currentKey === 'KeyS' || cameraControls.touchDirection === 'down') {
        cameraControls.rotateDown();
    }

    if (cameraControls.currentKey === 'Equal' || cameraControls.touchZoomDirection === 'in') {
        cameraControls.zoomIn();
    }

    if (cameraControls.currentKey === 'Minus' || cameraControls.touchZoomDirection === 'out') {
        cameraControls.zoomOut();
    }
}

renderer.setAnimationLoop(animate);