import * as THREE from 'three';

import * as dat from 'dat.gui';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'


//https://www.youtube.com/watch?v=Q7AOvWpIVHU

const gui = new dat.GUI();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg")
});

//const controls = new OrbitControls(camera, renderer.domElement)



const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

const gltfLoader = new GLTFLoader();


renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(50);
//camera.position.setY(100);

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

const geometry = new THREE.SphereGeometry(10, 32, 32);
const material = new THREE.MeshPhongMaterial();
material.map    = THREE.ImageUtils.loadTexture('img/earth_night.jpg');

const earthmesh = new THREE.Mesh(geometry, material);

scene.add( earthmesh );

gui.add(earthmesh.rotation, 'x').min(0).max(10);

/*let mainObj;
gltfLoader.load(
    'models/wonderful_world/scene.gltf',
    function ( gltf ) {

        scene.add( gltf.scene );
        mainObj = gltf.scene;

    },
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) {
        console.log( 'An error happened', error );
    }
);*/


function animate() {
    requestAnimationFrame(animate);

    //torus.rotation.x += 0.001;

    //camera.position.z += 0.1;
    renderer.render(scene, camera);
    //spotLight.position.x += 0.1;
    //mainObj.position.x = perlin.generatePerlinNoise(480, 480)[0]/2;

}

animate();