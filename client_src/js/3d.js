import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap';
import { rippleProto, cityWaveAnimate } from "./riple";
import * as rocket from './rocket';
import * as iss from './iss';

module.exports.init = async (onLoaded) => {

    let stopEarthRotation = false;

// Scene, Camera, Renderer
    let renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("bg"),
        alpha: true,
        antialias: true
    });

    let scene = new THREE.Scene();
    let aspect = window.innerWidth / window.innerHeight;
    let camera = new THREE.PerspectiveCamera(45, aspect, 0.001, 1500);
    let cameraRotation = 0;

    const orbitControls = new OrbitControls(camera, renderer.domElement)

// Lights
    let spotLight = new THREE.SpotLight(0xffffff, 1, 0, 10, 2);
    const light = new THREE.AmbientLight( 0x777777 ); // soft white light
    scene.add( light );

// Texture Loader
    let textureLoader = new THREE.TextureLoader();

// Planet Proto
    let planetProto = require('./planet-prototype')(camera);

    let createPlanet = function (options) {
        // Create the planet's Surface
        let surfaceGeometry = planetProto.sphere(options.surface.size);
        let surfaceMaterial = planetProto.material(options.surface.material);
        let surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);

        // Create the planet's Atmosphere
        let atmosphereGeometry = planetProto.sphere(options.surface.size + options.atmosphere.size);
        let atmosphereMaterialDefaults = {
            side: THREE.DoubleSide,
            transparent: true
        }
        let atmosphereMaterialOptions = Object.assign(atmosphereMaterialDefaults, options.atmosphere.material);
        let atmosphereMaterial = planetProto.material(atmosphereMaterialOptions);
        let atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);

        // Create the planet's Atmospheric glow
        let atmosphericGlowGeometry = planetProto.sphere(options.surface.size + options.atmosphere.size + options.atmosphere.glow.size);
        let atmosphericGlowMaterial = planetProto.glowMaterial(options.atmosphere.glow.intensity, options.atmosphere.glow.fade, options.atmosphere.glow.color);
        let atmosphericGlow = new THREE.Mesh(atmosphericGlowGeometry, atmosphericGlowMaterial);

        // Nest the planet's Surface and Atmosphere into a planet object
        let planet = new THREE.Object3D();
        surface.name = 'surface';
        atmosphere.name = 'atmosphere';
        atmosphericGlow.name = 'atmosphericGlow';
        planet.add(surface);
        planet.add(atmosphere);
        planet.add(atmosphericGlow);

        // Load the Surface's textures
        for (let textureProperty in options.surface.textures) {

            const loader = new THREE.TextureLoader();

            planetProto.texture(
                surfaceMaterial,
                textureProperty,
                options.surface.textures[textureProperty],
                options.onLoaded
            );
        }

        // Load the Atmosphere's texture
        for (let textureProperty in options.atmosphere.textures) {
            planetProto.texture(
                atmosphereMaterial,
                textureProperty,
                options.atmosphere.textures[textureProperty],
                options.onLoaded
            );
        }

        return planet;
    };

    let earth = createPlanet({
        surface: {
            size: 0.5,
            material: {
                bumpScale: 0.05,
                specular: new THREE.Color(0x001111),
                shininess: 0
            },
            textures: {
                map: '/img/earth002-min.png',
                bumpMap: '/img/earth001-bump-min.jpg',
                specularMap: '/img/earth001-specular-min.jpg'
            }
        },
        atmosphere: {
            size: 0.003,
            material: {
                opacity: 0.2
            },
            textures: {
                map: '/img/earthcloudmap-min.jpg',
                alphaMap: '/img/earthcloudmaptrans-min.jpg'
            },
            glow: {
                size: 0.02,
                intensity: 0.75,
                fade: 4,
                color: 0x414141
            }
        },
        onLoaded
    });

    let activeMarker;

// Marker Proto
    let markerProto = require('./marker-proto');

    window.earth = earth;
//stopEarthRotation = true;


    /*rocket.load().then(el => {
        el.scene.scale.set(0.0001,0.0001,0.0001);
        el.scene.position.y = -0.5;
        el.scene.position.z = 0.6;
        scene.add(el.scene); }).catch(e => console.log("ERR", e));*/

    let issScene;
    iss.load(onLoaded).then(el => {

        el.scene.scale.set(0.0001,0.0001,0.0001);
        el.scene.position.y = 0.6;
        el.scene.position.z = 0.5;
        el.scene.rotation.x = 0.5;

        issScene = el.scene;
        const earthSurface = earth.getObjectByName('surface');
        earthSurface.add(el.scene);

    }).catch(e => console.log("ERR", e));



    let cameraAnimating = false;
// Place Marker
    const placeMarker = function (options) {

        removeMarker();
        stopEarthRotation = true;
        cameraAnimating = true;

        const earthSurface = earth.getObjectByName('surface');
        const earthAtmosphere = earth.getObjectByName('atmosphere');

        let position = markerProto.latLongToVector3(options.lunchSite.position.latitude, options.lunchSite.position.longitude, 0.5, 0.005);


        const marker = rippleProto(position);

        earthSurface.add(marker.cityWaveMesh);
        earthSurface.add(marker.cityMesh);

        gsap.to(earthSurface.rotation, {
            duration: 3,
            y: - (options.lunchSite.position.longitude + 90) * Math.PI / 180,
            //ease: 'power3.inOut'
        });

        gsap.to(earthAtmosphere.rotation, {
            duration: 3,
            y: - (options.lunchSite.position.longitude + 90) * Math.PI / 180,
            //ease: 'power3.inOut'
        });

        gsap.to(camera.position, {
            duration: 2,
            y: 0.5 * Math.sin(options.lunchSite.position.latitude * Math.PI / 180),
            z: 2,
            //ease: 'power3.inOut'
        });


        gsap.to(camera.position, {
            delay: 2,
            duration: 3,
            z: 1.0,
            ease: 'power3.inOut'
        });

        setTimeout(()=> {
            drawCurve(options.lunchSite.position, options.landingPosition);
        },3000);

        if(!options.landingPosition) {

            window.camera = camera;

            gsap.to(camera.position, {
                delay: 5,
                duration: 5,
                ease: 'power3.inOut',
                x: issScene.position.x - 0.082,
                y: issScene.position.y,
                z: issScene.position.z + 0.007,

            });
        }

        setTimeout(() => cameraAnimating = false, 5000);

        activeMarker = marker;

    }

    const removeMarker = () => {

        if(!activeMarker) return;

        const es = earth.getObjectByName('surface');

        es.remove(activeMarker.cityWaveMesh);
        es.remove(activeMarker.cityMesh);
        es.remove(currentCurve.line);

        activeMarker = null;
    }



// Galaxy
    let galaxyGeometry = new THREE.SphereGeometry(2, 32, 32);
    let galaxyMaterial = new THREE.MeshBasicMaterial({
        side: THREE.BackSide
    });
    let galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);

// Load Galaxy Textures
    textureLoader.crossOrigin = true;
    textureLoader.load(
        '/img/starfield.png',
        function (texture) {
            galaxyMaterial.map = texture;
            scene.add(galaxy);
        }
    );


    let currentCurve;

    function drawCurve(_a, _b, i) {

        const earthSurface = earth.getObjectByName('surface');

        let curvature = 0.95;

        const a = markerProto.latLongToVector3(_a.latitude, _a.longitude, 0.5, 0);
        let b;

        if(_b) {
            b = markerProto.latLongToVector3(_b.latitude, _b.longitude, 0.5, 0);
            curvature = 0.95;
        }
        else {
            b = issScene.position;
            curvature = 0.3;
        }

        const distance = a.clone().sub(b).length();

        let mid = a.clone().lerp(b, 0.5);
        const midLength = mid.length();
        mid.normalize();
        mid.multiplyScalar(midLength + distance * curvature);

        let normal = new THREE.Vector3().subVectors(a, b);
        normal.normalize();

        const midStart = mid.clone().add(normal.clone().multiplyScalar(distance * 0.25));
        const midEnd = mid.clone().add(normal.clone().multiplyScalar(distance * -0.25));

        let splineCurveA = new THREE.CubicBezierCurve3(a, a, midStart, mid);
        let splineCurveB = new THREE.CubicBezierCurve3(mid, midEnd, b, b);

        let points = splineCurveA.getPoints(100);
        points = points.splice(0, points.length - 1);
        points = points.concat(splineCurveB.getPoints(100));
        //points.push(center);

        let lineGeometry = new THREE.BufferGeometry();
        let positions = new Float32Array(points.length * 3);
        for (let ii = 0; ii < points.length; ii++) {
            positions[ii * 3] = points[ii].x;
            positions[ii * 3 + 1] = points[ii].y;
            positions[ii * 3 + 2] = points[ii].z;
        }
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        lineGeometry.setDrawRange(0, 0);



        const lineMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color(0x5e5df0),
            linewidth: 2,
            opacity: 0.7,
            transparent: true });


        let line = new THREE.Line(lineGeometry, lineMaterial);
        line.currentPoint = 0;

        curvePoint = 0;
        currentCurve = { geometry: lineGeometry, line };

        earthSurface.add(line);
        return line;
    }

    window.drawCurve = drawCurve;



// Scene, Camera, Renderer Configuration
//renderer.setSize(window.innerWidth, window.innerHeight);


    camera.position.set(1, 1, 1);
    orbitControls.enabled = false;

    scene.add(camera);
    scene.add(spotLight);
    scene.add(earth);

// Light Configurations
    spotLight.position.set(2, 0, 1);

// Mesh Configurations
    earth.receiveShadow = true;
    earth.castShadow = true;
    earth.getObjectByName('surface').geometry.center();

// On window resize, adjust camera aspect ratio and renderer size
    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    camera.position.y = 0;
    camera.position.x = 2 * Math.sin(cameraRotation);
    camera.position.z = 2 * Math.cos(cameraRotation);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.lookAt(earth.position);


    let curvePoint = 0;
    let render = function () {

        if(!stopEarthRotation)
            earth.getObjectByName('surface').rotation.y += 1 / 32 * 0.01;

        earth.getObjectByName('atmosphere').rotation.y += 1 / 16 * 0.005;

        galaxy.rotation.y -= 0.0001;

        if(issScene)
            issScene.rotation.y += 0.0001;

        if(currentCurve && curvePoint <= 200)
            currentCurve.geometry.setDrawRange(0, curvePoint++);


        //if (cameraAutoRotation) {
        //cameraRotation += cameraRotationSpeed;
        //}

        activeMarker && cityWaveAnimate(activeMarker);


        requestAnimationFrame(render);
        renderer.render(scene, camera);
    };

    render();

    return { placeMarker, cameraAnimating };
}