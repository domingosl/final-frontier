import * as THREE from 'three';

module.exports =  camera => ({
    sphere: function (size) {
        let sphere = new THREE.SphereGeometry(size, 32, 32);

        return sphere;
    },
    material: function (options) {
        let material = new THREE.MeshPhongMaterial();
        if (options) {
            for (var property in options) {
                material[property] = options[property];
            }
        }

        return material;
    },
    glowMaterial: function (intensity, fade, color) {
        // Custom glow shader from https://github.com/stemkoski/stemkoski.github.com/tree/master/Three.js
        let glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                'c': {
                    type: 'f',
                    value: intensity
                },
                'p': {
                    type: 'f',
                    value: fade
                },
                glowColor: {
                    type: 'c',
                    value: new THREE.Color(color)
                },
                viewVector: {
                    type: 'v3',
                    value: camera.position
                }
            },
            vertexShader: `
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize( normalMatrix * normal );
          vec3 vNormel = normalize( normalMatrix * viewVector );
          intensity = pow( c - dot(vNormal, vNormel), p );
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`
            ,
            fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() 
        {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4( glow, 1.0 );
        }`
            ,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        return glowMaterial;
    },
    texture: function (material, property, uri, onLoaded) {
        let textureLoader = new THREE.TextureLoader();
        textureLoader.crossOrigin = true;
        textureLoader.load(
            uri,
            function (texture) {
                material[property] = texture;
                material.needsUpdate = true;
                typeof onLoaded === 'function' && onLoaded(uri);
            }
        );
    }
});