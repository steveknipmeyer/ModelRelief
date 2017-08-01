﻿"use strict";

import * as THREE               from 'three'
import {TrackballControls}      from 'TrackballControls'

var renderer            : THREE.WebGLRenderer;
var postRenderer        : THREE.WebGLRenderer;
var controls            : TrackballControls;
var scene               : THREE. Scene;
var postScene           : THREE.Scene;
var camera              : THREE.PerspectiveCamera;
var postCamera          : THREE.OrthographicCamera;

var modelCanvas         : HTMLCanvasElement;

var target              : THREE.WebGLRenderTarget;
var depthBufferCanvas   : HTMLCanvasElement;

var supportsExtensions   : boolean = true;

enum Resolution {
    viewModel          = 512,
    viewDepthBuffer    = 512,
    textureDepthBuffer = 512
}

init();
animate();

function verifyExtensions(renderer : THREE.WebGLRenderer) : boolean {
    
    if (!renderer.extensions.get('WEBGL_depth_texture')) 
        return false;

    return true;
}

function init() {

    // Model Renderer
    modelCanvas = initializeCanvas('model3D', Resolution.viewModel);
    renderer = new THREE.WebGLRenderer( {canvas : modelCanvas});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(Resolution.viewModel, Resolution.viewModel);

    supportsExtensions = verifyExtensions(renderer);

    // DepthBuffer Renderer
    depthBufferCanvas = initializeCanvas('depthBufferCanvas', Resolution.viewDepthBuffer);
    postRenderer = new THREE.WebGLRenderer({ canvas: depthBufferCanvas });
    postRenderer.setPixelRatio(window.devicePixelRatio);
    postRenderer.setSize(Resolution.viewDepthBuffer, Resolution.viewDepthBuffer);

    // click handler
    depthBufferCanvas.onclick = probe;

    camera = new THREE.PerspectiveCamera(70, Resolution.viewModel / Resolution.viewModel, 0.01, 50);
    camera.position.z = -4;

    controls = new TrackballControls(camera, renderer.domElement);

    // Create a multi render target
    target = new THREE.WebGLRenderTarget(Resolution.viewDepthBuffer, Resolution.viewDepthBuffer);
    target.texture.format           = THREE.RGBFormat;
    target.texture.minFilter        = THREE.NearestFilter;
    target.texture.magFilter        = THREE.NearestFilter;
    target.texture.generateMipmaps  = false;

    target.stencilBuffer            = false;

    target.depthBuffer              = true;
    target.depthTexture             = new THREE.DepthTexture(Resolution.textureDepthBuffer, Resolution.textureDepthBuffer);
    target.depthTexture.type        = THREE.UnsignedShortType;

    // Our scene
    scene = new THREE.Scene();
    setupScene();

    // Setup post-processing step
    setupPost();

    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);
}

function setupPost() {

    // Setup post processing stage

    let left: number      =  -1;
    let right: number     =   1;
    let top: number       =   1;
    let bottom: number    =  -1;
    let near: number      =   0;
    let far: number       =   1;
    postCamera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);

    var postMaterial = new THREE.ShaderMaterial({
        
        vertexShader:   MR.shaderSource['DepthBufferVertexShader'],
        fragmentShader: MR.shaderSource['DepthBufferFragmentShader'],

        uniforms: {
            designColor :   { value: 0xC0C090},
            cameraNear  :   { value: camera.near },
            cameraFar   :   { value: camera.far },
            tDiffuse    :   { value: target.texture },
            tDepth      :   { value: target.depthTexture }
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

    let directionalLight1 = new THREE.DirectionalLight(0xC0C0C0);
    directionalLight1.position.set(-100, -50, 100);
    scene.add(directionalLight1);
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

    let aspect : number = Resolution.viewModel / Resolution.viewModel;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    renderer.setSize(Resolution.viewModel, Resolution.viewModel);

    // size target DepthTexture
    var depthBufferPixelRatio = postRenderer.getPixelRatio();
    target.setSize(depthBufferCanvas.width * depthBufferPixelRatio, depthBufferCanvas.height * depthBufferPixelRatio);
    postRenderer.setSize(depthBufferCanvas.width, depthBufferCanvas.height);
}

function probe() {

    // https://github.com/mrdoob/three.js/issues/9513   
    var imageBuffer =  new Uint16Array(Resolution.viewDepthBuffer * Resolution.viewDepthBuffer * 2);
    postRenderer.readRenderTargetPixels(target, 0, 0, Resolution.viewDepthBuffer, Resolution.viewDepthBuffer, imageBuffer);
}

function initializeCanvas(id : string, resolution : number) : HTMLCanvasElement {
    
    let canvas : HTMLCanvasElement = <HTMLCanvasElement> document.querySelector(`#${id}`);
    if (!canvas)
        {
        console.error(`Canvas element id = ${id} not found`);
        return null;
        }

    // render dimensions    
    canvas.width  = resolution;
    canvas.height = resolution;

    // DOM element dimensions (may be different than render dimensions)
    canvas.style.width  = `${resolution}px`;
    canvas.style.height = `${resolution}px`;

    return canvas;
}

function animate() {

    if (!supportsExtensions) 
        return;

    requestAnimationFrame(animate);
    controls.update();

    // render scene into target
    renderer.render(scene, camera);

    // render post FX
    postRenderer.render(scene, camera, target);
    postRenderer.render(postScene, postCamera);
}