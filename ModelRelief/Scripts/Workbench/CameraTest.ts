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
import {Graphics, ObjectNames}      from 'Graphics'
import {ElementAttributes}             from "Html"
import {Loader}                     from 'Loader'
import {Logger, ConsoleLogger}      from 'Logger'
import {MathLibrary}                from 'Math'
import {MeshViewer}                 from "MeshViewer"
import {Services}                   from 'Services'
import {TrackballControls}          from 'TrackballControls'
import {UnitTests}                  from 'UnitTests'
import {Viewer}                     from 'Viewer'


export interface CameraSettings {
    position:       THREE.Vector3;        // location of camera
    target:         THREE.Vector3;        // target point
    near:           number;               // near clipping plane
    far:            number;               // far clipping plane
    fieldOfView:    number;               // field of view
}

/**
 * @class
 * CameraWorkbench
 */
export class CameraViewer extends Viewer {

    populateScene() {

        let triad = Graphics.createWorldAxesTriad(new THREE.Vector3(), 1, 0.25, 0.25);
        this._scene.add(triad);

        let box : THREE.Mesh = Graphics.createBoxMesh(new THREE.Vector3(4, 6, -2), 1, 2, 2, new THREE.MeshPhongMaterial({color : 0xff0000}));
        box.rotation.set(Math.random(), Math.random(), Math.random());
        box.updateMatrixWorld(true);
        this.model.add(box);

        let sphere : THREE.Mesh = Graphics.createSphereMesh(new THREE.Vector3(-3, 10, -1), 1, new THREE.MeshPhongMaterial({color : 0x00ff00}));
        this.model.add(sphere);
    }   
}

/**
 * @class
 * ViewerControls
 */
class ViewerControls {

    showBoundingBoxes : () => void;
    setClippingPlanes : () => void;

    constructor(camera: THREE.PerspectiveCamera, showBoundingBoxes : () => any, setClippingPlanes : () => any) {

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
        let boundingBoxView: THREE.Box3 = Graphics.getTransformedBoundingBox(model, cameraMatrixWorldInverse);        

        // The bounding box is world-axis aligned. 
        // INv View coordinates, the camera is at the origin.
        // The bounding near plane is the maximum Z of the bounding box.
        // The bounding far plane is the minimum Z of the bounding box.
        let nearPlane = -boundingBoxView.max.z;
        let farPlane  = -boundingBoxView.min.z;

        this._viewer._cameraControls._cameraSettings.nearClippingPlane = nearPlane;
        this._viewer._cameraControls._cameraSettings.farClippingPlane  = farPlane;

        this._viewer.camera.near = nearPlane;
        this._viewer.camera.far  = farPlane;

        this._viewer.camera.updateProjectionMatrix();
    }

    /**
     * Create a bounding box mesh.
     * @param object Target object.
     * @param color Color of bounding box mesh.
     */
    createBoundingBox (object : THREE.Object3D, color : number) : THREE.Mesh {
        
            let boundingBox : THREE.Box3 = new THREE.Box3();
            boundingBox = boundingBox.setFromObject(object);
            
            let material = new THREE.MeshPhongMaterial( {color : color, opacity : 1.0, wireframe : true});       
            let boundingBoxMesh : THREE.Mesh = Graphics.createBoundingBoxMeshFromBoundingBox(boundingBox.getCenter(), boundingBox, material);
        
            return boundingBoxMesh;
        }
    
    /**
     * Show the clipping planes of the model in View and World coordinates.
     */
    showBoundingBoxes() {

        let model                    : THREE.Group   = this._viewer.model;
        let cameraMatrixWorld        : THREE.Matrix4 = this._viewer.camera.matrixWorld;
        let cameraMatrixWorldInverse : THREE.Matrix4 = this._viewer.camera.matrixWorldInverse;

        // remove existing BoundingBoxes and model clone (View coordinates)
        Graphics.removeAllByName(this._viewer._scene, ObjectNames.BoundingBox);
        Graphics.removeAllByName(this._viewer._scene, ObjectNames.ModelClone);
        
        // clone model (and geometry!)
        let modelView  =  Graphics.cloneAndTransformObject(model, cameraMatrixWorldInverse);
        modelView.name = ObjectNames.ModelClone;
        model.add(modelView);

        let boundingBoxView : THREE.Mesh = this.createBoundingBox(modelView, 0xff00ff);
        model.add(boundingBoxView);

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
            width: ElementAttributes.DatGuiWidth
        });
            
        let settingsDiv = document.getElementById('settingsControls');
        settingsDiv.appendChild(gui.domElement);
        var folderOptions = gui.addFolder('CameraTest Options');

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
        this._viewer = new CameraViewer('CameraViewer', 'viewerCanvas');
        
        // UI Controls
        this.initializeViewerControls();
    }
}

let app = new App;
app.run();
