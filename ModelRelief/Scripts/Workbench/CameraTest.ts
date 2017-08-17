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

        let box : THREE.Mesh = Graphics.createBoxMesh(new THREE.Vector3(-1, 1, -2), 1, 2, 2, new THREE.MeshPhongMaterial({color : 0xff0000}));
        this.model.add(box);

        let sphere : THREE.Mesh = Graphics.createSphereMesh(new THREE.Vector3(2, -1, 1), 1, new THREE.MeshPhongMaterial({color : 0x00ff00}));
        this.model.add(sphere);
    }
    
     /**
     * Initialize the viewer camera
     */
    initializeDefaultCameraSettings () : CameraSettings {

        let settings : CameraSettings = {

            position:       new THREE.Vector3(0.0, 0.0, 6.0),
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

        // remove existing BB
        let sceneModel : THREE.Group = this._viewer.model;
        sceneModel.remove(sceneModel.getObjectByName(Graphics.BoundingBoxName));

        let modelBoundingBox : THREE.Box3 = Graphics.getBoundingBoxFromObject(this._viewer.model);

        let cameraMatrixWorldInverse : THREE.Matrix4 = this._viewer.camera.matrixWorldInverse;
        modelBoundingBox.applyMatrix4(this._viewer.camera.matrixWorldInverse);
        
        let material = new THREE.MeshPhongMaterial( {color : 0xff00ff, opacity : 1.0, wireframe : true});       
        let boundingBox = Graphics.createBoundingBoxMeshFromBox(modelBoundingBox.getCenter(), modelBoundingBox, material);
        
        // rotate to align with camera line
        let cameraRotationMatrix : THREE.Matrix4 = new THREE.Matrix4();
        cameraRotationMatrix.extractRotation(this._viewer.camera.matrix);
        boundingBox.applyMatrix(cameraRotationMatrix);

        // add new
        sceneModel.add(boundingBox);
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
