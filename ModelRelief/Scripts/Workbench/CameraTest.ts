// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE                   from 'three'
import * as dat    from 'dat-gui'

import {CameraSettings, Camera}     from 'Camera'
import {DepthBufferFactory}         from 'DepthBufferFactory'
import {Graphics}                   from 'Graphics'
import {Loader}                     from 'Loader'
import {Logger, ConsoleLogger}      from 'Logger'
import {MathLibrary}                from 'Math'
import {MeshViewer}                 from "MeshViewer"
import {Services}                   from 'Services'
import {TrackballControls}          from 'TrackballControls'
import {UnitTests}                  from 'UnitTests'
import {Viewer}                     from 'Viewer'

    /**
     * Create a bounding box mesh.
     * @param object Target object.
     * @param color Color of bounding box mesh.
     */
    function createBoundingBox (object : THREE.Object3D, color : number) : THREE.Mesh {

        let boundingBox : THREE.Box3 = new THREE.Box3();
        boundingBox = boundingBox.setFromObject(object);
        
        let material = new THREE.MeshPhongMaterial( {color : color, opacity : 1.0, wireframe : true});       
        let boundingBoxMesh : THREE.Mesh = Graphics.createBoundingBoxMeshFromBoundingBox(boundingBox.getCenter(), boundingBox, material);

        return boundingBoxMesh;
    }
/**
 * @class
 * CameraWorkbench
 */
export class CameraViewer extends Viewer {

    populateScene() {

        let triad = Graphics.createWorldAxesTriad(new THREE.Vector3(), 1, 0.25, 0.25);
        this._scene.add(triad);

        let box : THREE.Mesh = Graphics.createBoxMesh(new THREE.Vector3(1, 1, -2), 1, 2, 2, new THREE.MeshPhongMaterial({color : 0xff0000}));
        box.rotation.set(Math.random(), Math.random(), Math.random());
        box.updateMatrix();

        let boxClone = Graphics.cloneAndTransformObject(box, new THREE.Matrix4());
        this.model.add(boxClone);

        let sphere : THREE.Mesh = Graphics.createSphereMesh(new THREE.Vector3(4, 2, -1), 1, new THREE.MeshPhongMaterial({color : 0x00ff00}));
        this.model.add(sphere);
    }
    
     /**
     * Initialize the viewer camera
     */
    initializeDefaultCameraSettings () : CameraSettings {

        let settings : CameraSettings = {

            position:       new THREE.Vector3(0.0, 0.0, 20.0),
            target:         new THREE.Vector3(0, 0, 0),
            near:            2.0,
            far:            50.0,
            fieldOfView:    37                                  // https://www.nikonians.org/reviews/fov-tables
        };

        return settings;    
    }
}

/**
 * @class
 * ViewerControls
 */
class ViewerControls {

    nearClippingPlane  : number;
    farClippingPlane   : number;
    fieldOfView        : number;

    showBoundingBoxes : () => void;
    setClippingPlanes : () => void;

    constructor(camera: THREE.PerspectiveCamera, showBoundingBoxes : () => any, setClippingPlanes : () => any) {

        this.nearClippingPlane    = camera.near;
        this.farClippingPlane     = camera.far;
        this.fieldOfView          = camera.fov;

        this.showBoundingBoxes = showBoundingBoxes;
        this.setClippingPlanes  = setClippingPlanes;
    }
}

/**
 * @class
 * App
 */
export class App {
    
    _logger         : ConsoleLogger;
    _loader         : Loader;
    _viewer         : CameraViewer;
    _viewerControls : ViewerControls;

    /**
     * @constructor
     */
    constructor() {
    }

    /**
     * Set the camera clipping planes to the model extents in View coordinates.
     */
    setClippingPlanes() {

        let model                    : THREE.Group   = this._viewer.model;
        let cameraMatrixWorldInverse : THREE.Matrix4 = this._viewer.camera.matrixWorldInverse;

        // clone model (and geometry!)
        let modelView = Graphics.cloneAndTransformObject(model, cameraMatrixWorldInverse);
        let boundingBoxView = Graphics.getBoundingBoxFromObject(modelView);

        // The bounding box is world-axis aligned. 
        // INv View coordinates, the camera is at the origin.
        // The bounding near plane is the maximum Z of the bounding box.
        // The bounding far plane is the minimum Z of the bounding box.
        let nearPlane = -boundingBoxView.max.z;
        let farPlane  = -boundingBoxView.min.z;

        this._viewerControls.nearClippingPlane = nearPlane;
        this._viewerControls.farClippingPlane  = farPlane;

        this._viewer.camera.near = nearPlane;
        this._viewer.camera.far  = farPlane;

        // WIP: Or this._viewer.updateCamera()?
        this._viewer.camera.updateProjectionMatrix();
    }

    /**
     * Show the clipping planes of the model in View and World coordinates.
     */
    showBoundingBoxes() {

        let model                    : THREE.Group   = this._viewer.model;
        let cameraMatrixWorld        : THREE.Matrix4 = this._viewer.camera.matrixWorld;
        let cameraMatrixWorldInverse : THREE.Matrix4 = this._viewer.camera.matrixWorldInverse;

        // remove existing BoundingBox
        model.remove(model.getObjectByName(Graphics.BoundingBoxName));

        // clone model (and geometry!)
        let modelView =  Graphics.cloneAndTransformObject(model, cameraMatrixWorldInverse);

        // clear entire scene
        Graphics.removeObjectChildren(model, false);

        model.add(modelView);

        let boundingBoxView = createBoundingBox(modelView, 0xff00ff);
        model.add(boundingBoxView);

        // transform model back from View to World
        let modelWorld =  Graphics.cloneAndTransformObject(modelView, cameraMatrixWorld);
        model.add(modelWorld);

        // transform bounding box back from View to World
        let boundingBoxWorld =  Graphics.cloneAndTransformObject(boundingBoxView, cameraMatrixWorld);
        model.add(boundingBoxWorld);
    }

    /**
     * Initialize the view settings that are controllable by the user
     */
    initializeViewerControls() {

        let scope = this;

        this._viewerControls = new ViewerControls(this._viewer.camera, this.showBoundingBoxes.bind(this), this.setClippingPlanes.bind(this));

        // Init dat.gui and controls for the UI
        var gui = new dat.GUI({
            autoPlace: false,
            width: 320
        });
        let settingsDiv = document.getElementById('settingsControls');
        settingsDiv.appendChild(gui.domElement);
        var folderOptions = gui.addFolder('Camera Options');

        // Near Clipping Plane
        let minimum  =   0;
        let maximum  = 100;
        let stepSize =   0.1;
        let controlNearClippingPlane = folderOptions.add(this._viewerControls, 'nearClippingPlane').name('Near Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();
        controlNearClippingPlane .onChange (function (value) {

            scope._viewer.camera.near = value;
            scope._viewer.camera.updateProjectionMatrix();
        }.bind(this));

        // Far Clipping Plane
        minimum  =   1;
        maximum  = 500;
        stepSize =   0.1;
        let controlFarClippingPlane = folderOptions.add(this._viewerControls, 'farClippingPlane').name('Far Clipping Plane').min(minimum).max(maximum).step(stepSize).listen();;
        controlFarClippingPlane .onChange (function (value) {

            scope._viewer.camera.far = value;
            scope._viewer.camera.updateProjectionMatrix();
        }.bind(this));

        // Field of View
        minimum  = 25;
        maximum  = 75;
        stepSize =  1;
        let controlFieldOfView= folderOptions.add(this._viewerControls, 'fieldOfView').name('Field of View').min(minimum).max(maximum).step(stepSize).listen();;
        controlFieldOfView .onChange (function (value) {

            scope._viewer.camera.fov = value;
            scope._viewer.camera.updateProjectionMatrix();
        }.bind(this));

        // Show Bounding Boxes
        let controlShowBoundingBoxes = folderOptions.add(this._viewerControls, 'showBoundingBoxes').name('Show Bounding Boxes');

        // Clipping Planes
        let controlSetClippingPlanes = folderOptions.add(this._viewerControls, 'setClippingPlanes').name('Set Clipping Planes');

        folderOptions.open();
    }

    /**
     * Main
     */
    run () {
        this._logger = Services.consoleLogger;
        
        // Viewer    
        this._viewer = new CameraViewer('viewerCanvas');
        
        // UI Controls
        this.initializeViewerControls();
    }
}

let app = new App;
app.run();
