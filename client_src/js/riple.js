import {
    PlaneBufferGeometry,
    TextureLoader,
    MeshBasicMaterial,
    DoubleSide,
    Mesh,
    Vector3,
} from "three";

const GlobalConfig = {
    earthRadius: 5
}

import wavePng from "../../img/wave.png";
import pointPng from "../../img/point.png";

export const rippleProto = (position) => {

    const cityGeometry = new PlaneBufferGeometry(1, 1);
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(wavePng);

    const cityWaveMaterial = new MeshBasicMaterial({
        color: 0x22ffcc,
        map: texture,
        transparent: true,
        opacity: 1.0,
        side: DoubleSide,
        depthWrite: false,
    });

    const pointTexture = textureLoader.load(pointPng);
    const cityPointMaterial = new MeshBasicMaterial({
        color: 0xffc300,
        map: pointTexture,
        transparent: true,
        depthWrite: false
    });

    const cityWaveMesh = new Mesh(cityGeometry, cityWaveMaterial);
    const cityMesh = new Mesh(cityGeometry, cityPointMaterial);

    let size = GlobalConfig.earthRadius * 0.004;
    cityMesh.scale.set(size, size, size);

    size = GlobalConfig.earthRadius * 0.01;
    cityWaveMesh.size = size;
    cityWaveMesh.scale.set(size, size, size);
    cityWaveMesh._s = Math.random() + 1.0;

    cityWaveMesh.position.set(position.x, position.y, position.z);
    cityMesh.position.set(position.x, position.y, position.z)


    const coordVec3 = new Vector3(position.x, position.y, position.z).normalize();

    const meshNormal = new Vector3(0, 0, 1);

    cityWaveMesh.quaternion.setFromUnitVectors(meshNormal, coordVec3);
    cityMesh.quaternion.setFromUnitVectors(meshNormal, coordVec3);

    return {cityWaveMesh, cityMesh};
};


export const cityWaveAnimate = (marker) => {

    const mesh = marker.cityWaveMesh;

    mesh._s += 0.007;
    mesh.scale.set(
        mesh.size * mesh._s,
        mesh.size * mesh._s,
        mesh.size * mesh._s
    );
    if (mesh._s <= 1.5) {
        mesh.material.opacity = (mesh._s - 1) * 2;
    } else if (mesh._s > 1.5 && mesh._s <= 2) {
        mesh.material.opacity = 1 - (mesh._s - 1.5) * 2;
    } else {
        mesh._s = 1.0;
    }

};