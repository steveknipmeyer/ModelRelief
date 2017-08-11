"use strict";

import * as THREE               from 'three'

import {DepthBufferFactory}     from 'DepthBufferFactory'
import {Graphics}               from 'Graphics'
import {Logger, HTMLLogger}     from 'Logger'
import {MathLibrary}            from 'Math'
import {MeshPreviewViewer}      from "MeshPreviewViewer"
import {Services}               from 'Services'
import {TrackballControls}      from 'TrackballControls'
import {UnitTests}              from 'UnitTests'
import {Viewer}                 from "Viewer"

var modelCanvas         : HTMLCanvasElement;
var modelRenderer       : THREE.WebGLRenderer;
var modelCamera         : THREE.PerspectiveCamera;
var modelControls       : TrackballControls;
var modelScene          : THREE.Scene;
var modelRoot           : THREE.Group;

var cameraZPosition     : number = 4
var cameraNearPlane     : number = 2;
var cameraFarPlane      : number = 10.0;
var fieldOfView         : number = 37;              // https://www.nikonians.org/reviews/fov-tables

enum Resolution {
    viewModel = 768,
}

/**
 * Setup the primary model scene.
 */
function setupModelScene() {

    modelScene = new THREE.Scene();
    modelRoot = new THREE.Group();
    modelScene.add(modelRoot);

    setupTorusScene();
//  setupSphereScene();
//  setupBoxScene();

    initializeLighting(modelScene);
    initializeModelHelpers(modelScene, null, false);
}

/**
 * Initialize the primary model view.
 */
function initializeModelRenderer() {

    modelCanvas = initializeCanvas('modelCanvas', Resolution.viewModel);
    modelRenderer = new THREE.WebGLRenderer( {canvas : modelCanvas});
    modelRenderer.setPixelRatio(window.devicePixelRatio);
    modelRenderer.setSize(Resolution.viewModel, Resolution.viewModel);

    modelCamera = new THREE.PerspectiveCamera(fieldOfView, Resolution.viewModel / Resolution.viewModel, cameraNearPlane, cameraFarPlane);
    modelCamera.position.z = cameraZPosition;

    modelControls = new TrackballControls(modelCamera, modelRenderer.domElement);
    
    setupModelScene();
}

/**
 * Initialize the application.
 */
function initialize() {
    
    initializeModelRenderer();

    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);
}

/**
 * Updates a renderer properties.
 * Event handler called on window resize.
 * @param renderer Renderer to update.
 * @param width Width of the renderer.
 * @param height Height of the renderer.
 * @param camera Renderer's camera.
 */
function updateViewOnWindowResize(renderer : THREE.Renderer, width : number, height : number, camera? : THREE.PerspectiveCamera) {

    let aspect : number = width / height;
    if (camera) {
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
    }
    renderer.setSize(width, height);
}

/**
 * Event handler called on window resize.
 */
function onWindowResize() {

    updateViewOnWindowResize(modelRenderer, Resolution.viewModel, Resolution.viewModel, modelCamera);
}

/**
 * Adds lighting to the scene.
 * param theScene Scene to add lighting.
 */
function initializeLighting(theScene : THREE.Scene) {

    let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    theScene.add(ambientLight);

    let directionalLight1 = new THREE.DirectionalLight(0xffffff);
    directionalLight1.position.set(4, 4, 4);
    theScene.add(directionalLight1);
}

 /**
  * Adds helpers to the scene to visualize camera, coordinates, etc. 
  * @param scene Scene to annotate.
  * @param camera Camera to construct helper (may be null).
  * @param addAxisHelper Add a helper for the cartesian axes.
  */
function initializeModelHelpers(scene : THREE.Scene, camera : THREE.Camera, addAxisHelper : boolean) {

    if (camera) {
        let cameraHelper = new THREE.CameraHelper(camera );
        cameraHelper.visible = true;
        scene.add(cameraHelper);
    }

    if (addAxisHelper) {
        let axisHelper = new THREE.AxisHelper(2);
        axisHelper.visible = true;
        scene.add(axisHelper);
    }
}
/**
 * Adds a torus to a scene.
 * @param scene Target scene.
 */
function setupTorusScene() {

    // Setup some geometries
    let geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 64);
    let material = new THREE.MeshPhongMaterial({ color: 0xb35bcc });

    let count = 50;
    let scale = 5;

    for (let i = 0; i < count; i++) {

        let r = Math.random() * 2.0 * Math.PI;
        let z = (Math.random() * 2.0) - 1.0;
        let zScale = Math.sqrt(1.0 - z * z) * scale;

        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            Math.cos(r) * zScale,
            Math.sin(r) * zScale,
            z * scale
        );
        mesh.rotation.set(Math.random(), Math.random(), Math.random());

       modelRoot.add(mesh);
    }
}

/**
 * Adds a test sphere to a scene.
 * @param scene Target scene.
 */
function setupSphereScene() {

    // geometry
    let radius   : number = 2;
    let segments : number = 64;
    let geometry = new THREE.SphereGeometry(radius, segments, segments);

    let material = new THREE.MeshPhongMaterial({ color: 0xb35bcc });

    let mesh = new THREE.Mesh(geometry, material);
    let center : THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0);
    mesh.position.set(center.x, center.y, center.z);

    modelRoot.add(mesh);
}

/**
 * Add a test box to a scene.
 * @param scene Target scene.
 */
function setupBoxScene() {

    // box
    let dimensions : number = 2.0
    let width  : number = dimensions;
    let height : number = dimensions;
    let depth  : number = dimensions;

    let geometry : THREE.Geometry = new THREE.BoxGeometry(width, height, depth);
    let material : THREE.Material = new THREE.MeshPhongMaterial({ color: 0xffffff });

    let mesh = new THREE.Mesh(geometry, material);
    let center : THREE.Vector3 = new THREE.Vector3(0.0, 0.0, 0.0);
    mesh.position.set(center.x, center.y, center.z);

    modelRoot.add(mesh);
}

/**
 * Adds a backgroun plane at the origin.
 * @param scene Target scene.
 */
function addBackgroundPlane () {

    // background plane
    let width  = 4;
    let height = 4;

    let geometry = new THREE.PlaneGeometry(width, height);
    let material = new THREE.MeshPhongMaterial({ color: 0x5555cc });

    let mesh = new THREE.Mesh(geometry, material);
    let center = new THREE.Vector3(0.0, 0.0, 0.0);
    mesh.position.set(center.x, center.y, center.z);

    modelRoot.add(mesh);
}

/**
 * Constructs a WebGL target canvas.
 * @param id DOM id for canvas.
 * @param resolution Resolution (square) for canvas.
 */
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

/**
 * Animation loop.
 */
function animate() {

    requestAnimationFrame(animate);

    modelControls.update();
    modelRenderer.render(modelScene, modelCamera); 
}

// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

var logger              : Logger;
var CameraButtonId      : string = 'camera';
var modelViewer         : Viewer;
var meshPreviewViewer   : MeshPreviewViewer;

function initializeModelViewer() {

//  modelViewer = new Viewer();

    initialize();
    animate();
}

function initializeMeshPreviewViewer() {
    
    meshPreviewViewer = new MeshPreviewViewer();
}

/**
 *  Event handler to create depth buffers.
 */
function takePhotograph() {

    let size = 768;
    let factory = new DepthBufferFactory({width : size, height : size, model : modelRoot, camera : modelCamera});
    
    let previewMesh : THREE.Mesh = factory.meshGenerate({modelWidth : 2, camera : modelCamera});

    Graphics.removeSceneObjectChildren(meshPreviewViewer.scene, meshPreviewViewer.root, false);
    meshPreviewViewer.root.add(previewMesh);
}

function main() {

    logger = Services.htmlLogger;       

    initializeModelViewer();
    initializeMeshPreviewViewer();

    let cameraButton = (<HTMLInputElement> document.querySelector(`#${CameraButtonId}`)).onclick = takePhotograph;
}

main();

takePhotograph();
