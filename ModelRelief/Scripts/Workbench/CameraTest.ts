// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE                   from 'three'
import {assert}                     from 'chai';        
import * as dat                     from 'dat-gui'

import {Camera}                         from 'Camera'
import {DepthBufferFactory}             from 'DepthBufferFactory'
import {Graphics, ObjectNames}          from 'Graphics'
import {ElementAttributes, ElementIds}  from "Html"
import {Loader}                         from 'Loader'
import {ILogger, ConsoleLogger}         from 'Logger'
import {MathLibrary}                    from 'Math'
import {MeshViewer}                     from "MeshViewer"
import {Services}                       from 'Services'
import {TrackballControls}              from 'TrackballControls'
import {UnitTests}                      from 'UnitTests'
import {Viewer}                         from 'Viewer'
import {Quaternion} from 'three';

/**
 * @description CameraWorkbench
 * @export
 * @class CameraViewer
 * @extends {Viewer}
 */
export class CameraViewer extends Viewer {

    populateScene() {

        let triad = Graphics.createWorldAxesTriad(new THREE.Vector3(), 10, 2.5, 2.5);
        this._scene.add(triad);

        let box : THREE.Mesh = Graphics.createBoxMesh(new THREE.Vector3(40, 60, -20), 10, 20, 20, new THREE.MeshPhongMaterial({color : 0xff0000}));
        box.rotation.set(Math.random(), Math.random(), Math.random());
        box.updateMatrixWorld(true);
        this.modelGroup.add(box);

        let sphere : THREE.Mesh = Graphics.createSphereMesh(new THREE.Vector3(-30, 100, -10), 10, new THREE.MeshPhongMaterial({color : 0x00ff00}));
        this.modelGroup.add(sphere);
    }   
}

/**
 * @description ViewerControls
 * @class ViewerControls
 */
class ViewerControls {

    showBoundingBoxes : () => void;
    setClippingPlanes : () => void;
    roundtripCamera  : () => void;

    /**
     * Creates an instance of ViewerControls.
     * @param {THREE.PerspectiveCamera} camera Perspective camera.
     * @param {() => any} showBoundingBoxes Function to create and show the bounding boxes.
     * @param {() => any} setClippingPlanes Function to set the clipping planes to the extents of the model.
     * @param {() => any} roundtripCamera Function to test roundtripping a camera through a
     */
    constructor(camera: THREE.PerspectiveCamera, showBoundingBoxes : () => any, setClippingPlanes : () => any, roundtripCamera : () => any) {

            this.showBoundingBoxes = showBoundingBoxes;
            this.setClippingPlanes  = setClippingPlanes;
            this.roundtripCamera    = roundtripCamera;
        }
}

/**
 * @description Test application.
 * @export
 * @class App
 */
export class App {
    
    _logger         : ILogger;
    _loader         : Loader;
    _viewer         : CameraViewer;
    _viewerControls : ViewerControls;

    /**
     * Creates an instance of App.
     */
    constructor() {
    }

    /**
     * @description Set the camera clipping planes to the model extents in View coordinates.
     */
    setClippingPlanes() {

        let modelGroup               : THREE.Group   = this._viewer.modelGroup;
        let cameraMatrixWorldInverse : THREE.Matrix4 = this._viewer.camera.matrixWorldInverse;
        
        // clone model (and geometry!)
        let boundingBoxView: THREE.Box3 = Graphics.getTransformedBoundingBox(modelGroup, cameraMatrixWorldInverse);        

        // The bounding box is world-axis aligned. 
        // In View coordinates, the camera is at the origin.
        // The bounding near plane is the maximum Z of the bounding box.
        // The bounding far plane is the minimum Z of the bounding box.
        let nearPlane = -boundingBoxView.max.z;
        let farPlane  = -boundingBoxView.min.z;

        this._viewer.cameraControls.settings.camera.viewCamera.near = nearPlane;
        this._viewer.cameraControls.settings.camera.viewCamera.far  = farPlane;

        this._viewer.camera.updateProjectionMatrix();
    }

    /**
     * @description Create a bounding box mesh.
     * @param {THREE.Object3D} object Target object.
     * @param {number} color Color of bounding box mesh.
     * @returns {THREE.Mesh} 
     */
    createBoundingBox (object : THREE.Object3D, color : number) : THREE.Mesh {
        
            let boundingBox : THREE.Box3 = new THREE.Box3();
            boundingBox = boundingBox.setFromObject(object);
            
            let material = new THREE.MeshPhongMaterial( {color : color, opacity : 1.0, wireframe : true});       
            let boundingBoxMesh : THREE.Mesh = Graphics.createBoundingBoxMeshFromBoundingBox(boundingBox.getCenter(), boundingBox, material);
        
            return boundingBoxMesh;
        }
    
    /**
     * @description Show the clipping planes of the model in View and World coordinates.
     */
    showBoundingBoxes() {

        let modelGroup               : THREE.Group   = this._viewer.modelGroup;
        let cameraMatrixWorld        : THREE.Matrix4 = this._viewer.camera.matrixWorld;
        let cameraMatrixWorldInverse : THREE.Matrix4 = this._viewer.camera.matrixWorldInverse;

        // remove existing BoundingBoxes and model clone (View coordinates)
        Graphics.removeAllByName(this._viewer._scene, ObjectNames.BoundingBox);
        Graphics.removeAllByName(this._viewer._scene, ObjectNames.ModelClone);
        
        // clone model (and geometry!)
        let modelView  =  Graphics.cloneAndTransformObject(modelGroup, cameraMatrixWorldInverse);
        modelView.name = ObjectNames.ModelClone;
        this._viewer.scene.add(modelView);

        let boundingBoxView : THREE.Mesh = this.createBoundingBox(modelView, 0xff00ff);
        this._viewer.scene.add(boundingBoxView);

        // transform bounding box back from View to World
        let boundingBoxWorld =  Graphics.cloneAndTransformObject(boundingBoxView, cameraMatrixWorld);
        this._viewer.scene.add(boundingBoxWorld);
    }

    /**
     * @description Roundtrip a PerspectiveCamera through the DTO model.
     */
    roundtripCameraX ()  {

        // https://stackoverflow.com/questions/29221795/serializing-camera-state-in-threejs

        let originalCamera = this._viewer.camera;
        let originalCameraMatrixArray = originalCamera.matrix.toArray();

        let newCamera = new THREE.PerspectiveCamera();
        newCamera.matrix.fromArray(originalCameraMatrixArray);
        newCamera.up.copy(originalCamera.up);

        // get back position/rotation/scale attributes
        newCamera.matrix.decompose(newCamera.position, newCamera.quaternion, newCamera.scale); 

        newCamera.fov   = originalCamera.fov;
        newCamera.near  = originalCamera.near;
        newCamera.far   = originalCamera.far;

        newCamera.updateProjectionMatrix();

        this._viewer.camera = newCamera;
    }

    /**
     * @description Roundtrip a PerspectiveCamera through the DTO model.
     */
    roundtripCameraY ()  {

        // https://stackoverflow.com/questions/29221795/serializing-camera-state-in-threejs

        let originalCamera = this._viewer.camera;

        let position    = new THREE.Vector3();
        let quaternion  = new THREE.Quaternion();
        let scale       = new THREE.Vector3();
        let up          = new THREE.Vector3();
        originalCamera.matrix.decompose(position, quaternion, scale);
        up = originalCamera.up;

        let newCamera = new THREE.PerspectiveCamera();
        newCamera.matrix.compose(position, quaternion, scale);
        newCamera.up.copy(up);

        // set position/rotation/scale attributes
        newCamera.matrix.decompose(newCamera.position, newCamera.quaternion, newCamera.scale); 

        newCamera.fov   = originalCamera.fov;
        newCamera.near  = originalCamera.near;
        newCamera.far   = originalCamera.far;

        newCamera.updateProjectionMatrix();

        this._viewer.camera = newCamera;
    }

    /**
     * @description Roundtrip a PerspectiveCamera through the DTO model.
     */
    roundtripCameraZ ()  {

        // https://stackoverflow.com/questions/29221795/serializing-camera-state-in-threejs
        let camera = new Camera({}, this._viewer.camera);
        let cameraModel = camera.toDtoModel();
        Camera.fromDtoModelAsync(cameraModel).then(cameraRoundtrip => {

            let distortCamera = false;
            if (distortCamera) {
                let deltaPosition : THREE.Vector3 = new THREE.Vector3();
                deltaPosition.copy(cameraRoundtrip.viewCamera.position);
                let delta = 0.5;
                cameraRoundtrip.viewCamera.position.set(deltaPosition.x + delta, deltaPosition.y, deltaPosition.z);
            }
            this._viewer.camera = cameraRoundtrip.viewCamera;
    
            UnitTests.comparePerspectiveCameras(camera.viewCamera, cameraRoundtrip.viewCamera);
        })
    }

    /**
     * @description Initialize the view settings that are controllable by the user
     */
    initializeViewerControls() {

        let scope = this;

        this._viewerControls = new ViewerControls(this._viewer.camera, this.showBoundingBoxes.bind(this), this.setClippingPlanes.bind(this), this.roundtripCameraZ.bind(this));

        // Init dat.gui and controls for the UI
        var gui = new dat.GUI({
            autoPlace: false,
            width: ElementAttributes.DatGuiWidth
        });
        gui.domElement.id = ElementIds.CameraTestControls;
        
        let settingsDiv = document.getElementById('settingsControls');
        settingsDiv.appendChild(gui.domElement);
        var folderOptions = gui.addFolder('CameraTest Options');

        // Show Bounding Boxes
        let controlShowBoundingBoxes = folderOptions.add(this._viewerControls, 'showBoundingBoxes').name('Show Bounding Boxes');

        // Clipping Planes
        let controlSetClippingPlanes = folderOptions.add(this._viewerControls, 'setClippingPlanes').name('Set Clipping Planes');

        // Roundtrip Camera
        let roundTripCamera = folderOptions.add(this._viewerControls, 'roundtripCamera').name('Roundtrip Camera');

        folderOptions.open();
    }

    /**
     * @description Main.
     */
    run () {
        this._logger = Services.defaultLogger;
        
        // Viewer    
        this._viewer = new CameraViewer('CameraViewer', 'viewerCanvas');
        
        // UI Controls
        this.initializeViewerControls();
    }
}

let app = new App;
app.run();
