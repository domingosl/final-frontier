import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'


//https://www.youtube.com/watch?v=Q7AOvWpIVHU

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg")
});

const controls = new OrbitControls(camera, renderer.domElement)


const spotLight = new THREE.SpotLight( 0xffffff, 2.4 );
spotLight.position.set( 0, 300, 100 );

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

scene.add( spotLight );


const helper = new THREE.SpotLightHelper( spotLight, 255 );
scene.add( helper );


const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

const gltfLoader = new GLTFLoader();
const plyLoader = new PLYLoader();


renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(300);
camera.position.setY(100);

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

let mainObj;
gltfLoader.load(
    'models/spacesuit/scene.gltf',
    function ( gltf ) {

        scene.add( gltf.scene );
        mainObj = gltf.scene;

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object

    },
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) {
        console.log( 'An error happened', error );
    }
);


function animate() {
    requestAnimationFrame(animate);

    //torus.rotation.x += 0.001;

    //camera.position.z += 0.1;
    renderer.render(scene, camera);
    //spotLight.position.x += 0.1;
    //mainObj.position.x = perlin.generatePerlinNoise(480, 480)[0]/2;

}

animate();