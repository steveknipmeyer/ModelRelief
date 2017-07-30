﻿"use strict";

import * as THREE               from 'three'
import {TrackballControls}      from 'TrackballControls'

var camera, scene, renderer, controls;
var target : THREE.WebGLRenderTarget;
var postScene, postCamera;
var supportsExtension = true;

var depthCanvas        : HTMLCanvasElement;
var depthCanvasContext : CanvasRenderingContext2D;

init();
animate();

function init() {

    renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('canvas') });

    if (!renderer.extensions.get('WEBGL_depth_texture')) {
        supportsExtension = false;
        var element : any = document.querySelector('#error');
        element.style.display = 'block';
        return;
    }

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 50);
    camera.position.z = -4;

    controls = new TrackballControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.rotateSpeed   = 0.35;

    // Create a multi render target with Float buffers
    target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
    target.texture.format           = THREE.RGBFormat;
    target.texture.minFilter        = THREE.NearestFilter;
    target.texture.magFilter        = THREE.NearestFilter;
    target.texture.generateMipmaps  = false;
    target.stencilBuffer            = false;

    target.depthBuffer              = true;
    target.depthTexture             = new THREE.DepthTexture(window.innerWidth, window.innerHeight);
    target.depthTexture.type        = THREE.UnsignedShortType;

    // Our scene
    scene = new THREE.Scene();
    setupScene();

    // Setup post-processing step
    setupPost();

    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);

    depthCanvas        = <HTMLCanvasElement> document.querySelector('#depthBuffer');
    depthCanvasContext = depthCanvas.getContext('2d');
}

function setupPost() {

    // Setup post processing stage
    postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    var postMaterial = new THREE.ShaderMaterial({
        vertexShader: document.querySelector('#post-vert').textContent.trim(),
        fragmentShader: document.querySelector('#post-frag').textContent.trim(),
        uniforms: {
            cameraNear: { value: camera.near },
            cameraFar:  { value: camera.far },
            tDiffuse:   { value: target.texture },
            tDepth:     { value: target.depthTexture }
        }
    });
    var postPlane = new THREE.PlaneGeometry(2, 2);
    var postQuad  = new THREE.Mesh(postPlane, postMaterial);
    postScene = new THREE.Scene();
    postScene.add(postQuad);
}
/**
    * Adds lighting to the scene
    */
function initializeLighting() {

    let ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    let directionalLight1 = new THREE.DirectionalLight(0xC0C090);
    directionalLight1.position.set(-100, -50, 100);
    scene.add(directionalLight1);

    let directionalLight2 = new THREE.DirectionalLight(0xC0C090);
    directionalLight2.position.set(100, 50, -100);
    scene.add(directionalLight2);
}

function setupScene() {

    // Setup some geometries
    var geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 64);
    var material = new THREE.MeshPhongMaterial({ color: 0xb35bcc });

    var count = 50;
    var scale = 5;

    for (var i = 0; i < count; i++) {

        var r = Math.random() * 2.0 * Math.PI;
        var z = (Math.random() * 2.0) - 1.0;
        var zScale = Math.sqrt(1.0 - z * z) * scale;

        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            Math.cos(r) * zScale,
            Math.sin(r) * zScale,
            z * scale
        );
        mesh.rotation.set(Math.random(), Math.random(), Math.random());
        scene.add(mesh);
    }
    initializeLighting();
}

function onWindowResize() {

    var aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    var dpr = renderer.getPixelRatio();
    target.setSize(window.innerWidth * dpr, window.innerHeight * dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {

    if (!supportsExtension) return;

    requestAnimationFrame(animate);
    controls.update();

    // render scene into target
    renderer.render(scene, camera, target);
    renderer.render(scene, camera);

//  depthCanvasContext.drawImage(target.texture.image, 0, 0, depthCanvas.width, depthCanvas.height);

    // render post FX
 // renderer.render(postScene, postCamera);

    
}

