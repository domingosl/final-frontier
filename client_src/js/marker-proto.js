import * as THREE from 'three';

module.exports = {
    latLongToVector3: function latLongToVector3(latitude, longitude, radius, height) {
        const phi = (latitude) * Math.PI / 180;
        const theta = (longitude - 180) * Math.PI / 180;

        const x = -(radius + height) * Math.cos(phi) * Math.cos(theta);
        const y = (radius + height) * Math.sin(phi);
        const z = (radius + height) * Math.cos(phi) * Math.sin(theta);

        return new THREE.Vector3(x, y, z);
    },
    marker: function marker(size, color, vector3Position) {
        let markerGeometry = new THREE.SphereGeometry(size);
        let markerMaterial = new THREE.MeshLambertMaterial({
            color: color
        });
        let markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);
        markerMesh.position.copy(vector3Position);

        return markerMesh;
    }
}