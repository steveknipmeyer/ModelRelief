// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE                   from 'three'
import * as dat    from 'dat-gui'

import {Camera}                     from 'Camera'
import {DepthBufferFactory}         from 'DepthBufferFactory'
import {CameraSettings, Graphics}   from 'Graphics'
import {Loader}                     from 'Loader'
import {Logger, ConsoleLogger}      from 'Logger'
import {MathLibrary}                from 'Math'
import {MeshPreviewViewer}          from "MeshPreviewViewer"
import {Services}                   from 'Services'
import {TrackballControls}          from 'TrackballControls'
import {UnitTests}                  from 'UnitTests'
import {Viewer}                     from 'Viewer'

/**
     * Clone and transform an object.
     * @param object Object to clone and transform.
     * @param matrix Transformation matrix.
     */
    function cloneAndTransformObject (object : THREE.Object3D, matrix : THREE.Matrix4) : THREE.Object3D {

        // clone object (and geometry!)
        let objectClone : THREE.Object3D = object.clone();
        objectClone.traverse(object => {
            if (object instanceof(THREE.Mesh))
                object.geometry = object.geometry.clone();
        });

        // transform
        objectClone.applyMatrix(matrix);

        return objectClone;
    }

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

    /**
     * Camera
     */
    get camera () {
        return this._camera;
    }

    populateScene() {

        let triad = Graphics.createWorldAxesTriad(new THREE.Vector3(), 1, 0.25, 0.25);
        this._scene.add(triad);

        let box : THREE.Mesh = Graphics.createBoxMesh(new THREE.Vector3(1, 1, -2), 1, 2, 2, new THREE.MeshPhongMaterial({color : 0xff0000}));
        box.rotation.set(Math.random(), Math.random(), Math.random());
        box.updateMatrix();

        let boxClone = cloneAndTransformObject(box, new THREE.Matrix4());
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
 * App
 */
export class App {
    
    _logger : ConsoleLogger;
    _loader : Loader;
    _viewer : CameraViewer;

    /**
     * @constructor
     */
    constructor() {
    }

    /**
     * Transform the model by camera inverse.
     */
    transformModel() {

        let model                    : THREE.Group = this._viewer.model;
        let cameraMatrixWorld        : THREE.Matrix4 = this._viewer.camera.matrixWorld;
        let cameraMatrixWorldInverse : THREE.Matrix4 = this._viewer.camera.matrixWorldInverse;

        // remove existing BoundingBox
        model.remove(model.getObjectByName(Graphics.BoundingBoxName));

        // clone model (and geometry!)
        let modelView = cloneAndTransformObject(model, cameraMatrixWorldInverse);

        // clear entire scene
        Graphics.removeObjectChildren(model, false);

        model.add(modelView);

        let boundingBoxView = createBoundingBox(modelView, 0xff00ff);
        boundingBoxView.updateMatrix();
        model.add(boundingBoxView);

        // transform model back from View to World
        let modelWorld = cloneAndTransformObject(modelView, cameraMatrixWorld);
        model.add(modelWorld);

        // transform bounding box back from View to World
        let boundingBoxWorld = cloneAndTransformObject(boundingBoxView, cameraMatrixWorld);
        model.add(boundingBoxWorld);
    }

    /**
     * Initialize the view settings that are controllable by the user
     */
    initializeViewerControls() {

        let scope = this;

        class ViewerControls {

            nearClippingPlane  : number;
            farClippingPlane   : number;
            fieldOfView        : number;

            transform : () => void;

            constructor() {

                this.nearClippingPlane    = scope._viewer.camera.near;
                this.farClippingPlane     = scope._viewer.camera.far;
                this.fieldOfView          = scope._viewer.camera.fov;

                this.transform = function() {
                   scope.transformModel();
                };
            }
        }
        let viewerControls = new ViewerControls();

        // Init dat.gui and controls for the UI
        var gui = new dat.GUI({
            autoPlace: false,
            width: 320
        });
        let settingsDiv = document.getElementById('settingsControls');
        settingsDiv.appendChild(gui.domElement);
        var folderOptions = gui.addFolder('Camera Options');

        // Near Clipping Plane
        let minimum  =  0;
        let maximum  = 20;
        let stepSize =  0.1;
        let controlNearClippingPlane = folderOptions.add(viewerControls, 'nearClippingPlane').name('Near Clipping Plane').min(minimum).max(maximum).step(stepSize);
        controlNearClippingPlane .onChange (function (value) {

            scope._viewer.camera.near = value;
            scope._viewer.camera.updateProjectionMatrix();
        }.bind(this));

        // Far Clipping Plane
        minimum  =   1;
        maximum  = 100;
        stepSize =   0.1;
        let controlFarClippingPlane = folderOptions.add(viewerControls, 'farClippingPlane').name('Far Clipping Plane').min(minimum).max(maximum).step(stepSize);;
        controlFarClippingPlane .onChange (function (value) {

            scope._viewer.camera.far = value;
            scope._viewer.camera.updateProjectionMatrix();
        }.bind(this));

        // Field of View
        minimum  = 25;
        maximum  = 75;
        stepSize =  1;
        let controlFieldOfView= folderOptions.add(viewerControls, 'fieldOfView').name('Field of View').min(minimum).max(maximum).step(stepSize);;
        controlFieldOfView .onChange (function (value) {

            scope._viewer.camera.fov = value;
            scope._viewer.camera.updateProjectionMatrix();
        }.bind(this));

        // Transform
        let controlTransform = folderOptions.add(viewerControls, 'transform').name('Transform');

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
