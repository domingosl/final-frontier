import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


const loader = new GLTFLoader();
let rocket;

module.exports.load = (onLoaded) => new Promise((resolve, reject) => {

    loader.load(
        'assets/rocket/scene.gltf',
        function (gltf) {
            onLoaded("rocket");
            rocket = gltf.scene;
            resolve(gltf);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.log(error);
            reject(error);
        }
    )

});

module.exports.animate = () => {

    if(!rocket) return;

    rocket.position.x += 0.00025 * Math.sin(Date.now() * 0.03);
    rocket.position.y += 0.005;
}
