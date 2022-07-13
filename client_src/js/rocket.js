import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


const loader = new GLTFLoader();

module.exports.load = (onLoaded) => new Promise((resolve, reject) => {

    loader.load(
        'assets/rocket/scene.gltf',
        function (gltf) {
            onLoaded("rocket");
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


