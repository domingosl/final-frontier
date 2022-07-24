import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const loader = new GLTFLoader();

module.exports.load = (onLoaded) => new Promise(async (resolve, reject) => {

    loader.load(
        'assets/iss/scene.gltf',
        function (gltf) {
            onLoaded("ISS");
            resolve(gltf);
        },
        (xhr) => {
            //console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.log(error);
            reject(error);
        }
    )

});


