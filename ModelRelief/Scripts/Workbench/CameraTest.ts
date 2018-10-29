// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as dat from "dat-gui";
import * as THREE from "three";

import {Graphics, ObjectNames} from "Scripts/Graphics/Graphics";
import {IThreeBaseCamera} from "Scripts/Graphics/IThreeBaseCamera";
import {Loader} from "Scripts/ModelLoaders/Loader";
import {CameraFactory} from "Scripts/Models/Camera/CameraFactory";
import {PerspectiveCamera} from "Scripts/Models/Camera/PerspectiveCamera";
import {ElementAttributes, ElementIds} from "Scripts/System/Html";
import {ILogger} from "Scripts/System/Logger";
import {Services} from "Scripts/System/Services";
import {UnitTests} from "Scripts/UnitTests/UnitTests";
import {Viewer} from "Scripts/Viewers/Viewer";

/**
 * @description CameraWorkbench
 * @export
 * @class CameraViewer
 * @extends {Viewer}
 */
export class CameraViewer extends Viewer {

    public populateScene() {

        const triad = Graphics.createWorldAxesTriad(new THREE.Vector3(), 10, 2.5, 2.5);
        this.scene.add(triad);

        const box: THREE.Mesh = Graphics.createBoxMesh(new THREE.Vector3(40, 60, -20), 10, 20, 20, new THREE.MeshPhongMaterial({color : 0xff0000}));
        box.rotation.set(Math.random(), Math.random(), Math.random());
        box.updateMatrixWorld(true);
        this.modelGroup.add(box);

        const sphere: THREE.Mesh = Graphics.createSphereMesh(new THREE.Vector3(-30, 100, -10), 10, new THREE.MeshPhongMaterial({color : 0x00ff00}));
        this.modelGroup.add(sphere);
    }
}

/**
 * @description ViewerControls
 * @class ViewerControls
 */
class ViewerControls {

    public showBoundingBoxes: () => void;
    public setClippingPlanes: () => void;
    public roundtripCamera: () => void;

    /**
     * Creates an instance of ViewerControls.
     * @param {IThreeBaseCamera} camera Camera.
     * @param {() => any} showBoundingBoxes Function to create and show the bounding boxes.
     * @param {() => any} setClippingPlanes Function to set the clipping planes to the extents of the model.
     * @param {() => any} roundtripCamera Function to test roundtripping a camera through a
     */
    constructor(camera: IThreeBaseCamera, showBoundingBoxes: () => any, setClippingPlanes: () => any, roundtripCamera: () => any) {

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

    public _logger: ILogger;
    public _loader: Loader;
    public _viewer: CameraViewer;
    public _viewerControls: ViewerControls;

    /**
     * Creates an instance of App.
     */
    constructor() {
    }

    /**
     * @description Set the camera clipping planes to the model extents in View coordinates.
     */
    public setClippingPlanes() {

        const modelGroup: THREE.Group   = this._viewer.modelGroup;
        const cameraMatrixWorldInverse: THREE.Matrix4 = this._viewer.camera.matrixWorldInverse;

        // clone model (and geometry!)
        const boundingBoxView: THREE.Box3 = Graphics.getTransformedBoundingBox(modelGroup, cameraMatrixWorldInverse);

        // The bounding box is world-axis aligned.
        // In View coordinates, the camera is at the origin.
        // The bounding near plane is the maximum Z of the bounding box.
        // The bounding far plane is the minimum Z of the bounding box.
        const nearPlane = -boundingBoxView.max.z;
        const farPlane  = -boundingBoxView.min.z;
        this._viewer.camera.near = nearPlane;
        this._viewer.camera.far  = farPlane;

        this._viewer.camera.updateProjectionMatrix();
    }

    /**
     * @description Create a bounding box mesh.
     * @param {THREE.Object3D} object Target object.
     * @param {number} color Color of bounding box mesh.
     * @returns {THREE.Mesh}
     */
    public createBoundingBox(object: THREE.Object3D, color: number): THREE.Mesh {

            let boundingBox: THREE.Box3 = new THREE.Box3();
            boundingBox = boundingBox.setFromObject(object);

            const material = new THREE.MeshPhongMaterial( {color, opacity : 1.0, wireframe : true});
            const boundingBoxMesh: THREE.Mesh = Graphics.createBoundingBoxMeshFromBoundingBox(boundingBox.getCenter(), boundingBox, material);

            return boundingBoxMesh;
        }

    /**
     * @description Show the clipping planes of the model in View and World coordinates.
     */
    public showBoundingBoxes() {

        const modelGroup: THREE.Group   = this._viewer.modelGroup;
        const cameraMatrixWorld: THREE.Matrix4 = this._viewer.camera.matrixWorld;
        const cameraMatrixWorldInverse: THREE.Matrix4 = this._viewer.camera.matrixWorldInverse;

        // remove existing BoundingBoxes and model clone (View coordinates)
        Graphics.removeAllByName(this._viewer.scene, ObjectNames.BoundingBox);
        Graphics.removeAllByName(this._viewer.scene, ObjectNames.ModelClone);

        // clone model (and geometry!)
        const modelView  =  Graphics.cloneAndTransformObject(modelGroup, cameraMatrixWorldInverse);
        modelView.name = ObjectNames.ModelClone;
        this._viewer.scene.add(modelView);

        const boundingBoxView: THREE.Mesh = this.createBoundingBox(modelView, 0xff00ff);
        this._viewer.scene.add(boundingBoxView);

        // transform bounding box back from View to World
        const boundingBoxWorld =  Graphics.cloneAndTransformObject(boundingBoxView, cameraMatrixWorld);
        this._viewer.scene.add(boundingBoxWorld);
    }

    /**
     * @description Roundtrip a PerspectiveCamera through the DTO model.
     */
    public roundtripCameraX()  {

        // https://stackoverflow.com/questions/29221795/serializing-camera-state-in-threejs

        const originalCamera = this._viewer.camera as THREE.PerspectiveCamera;
        const originalCameraMatrixArray = originalCamera.matrix.toArray();

        const newCamera = new THREE.PerspectiveCamera();
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
    public roundtripCameraY()  {

        // https://stackoverflow.com/questions/29221795/serializing-camera-state-in-threejs

        const originalCamera = this._viewer.camera as THREE.PerspectiveCamera;

        const position    = new THREE.Vector3();
        const quaternion  = new THREE.Quaternion();
        const scale       = new THREE.Vector3();
        let up          = new THREE.Vector3();
        originalCamera.matrix.decompose(position, quaternion, scale);
        up = originalCamera.up;

        const newCamera = new THREE.PerspectiveCamera();
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
    public roundtripCameraZ()  {

        // https://stackoverflow.com/questions/29221795/serializing-camera-state-in-threejs
        const camera = new PerspectiveCamera({}, this._viewer.camera as THREE.PerspectiveCamera);
        const cameraModel = camera.toDtoModel();
        CameraFactory.constructFromDtoModelAsync(cameraModel).then((cameraRoundtrip) => {

            const perspectiveCameraRoundTrip = cameraRoundtrip as PerspectiveCamera;
            const distortCamera = false;
            if (distortCamera) {
                const deltaPosition: THREE.Vector3 = new THREE.Vector3();
                deltaPosition.copy(cameraRoundtrip.viewCamera.position);
                const delta = 0.5;
                cameraRoundtrip.viewCamera.position.set(deltaPosition.x + delta, deltaPosition.y, deltaPosition.z);
            }
            this._viewer.camera = cameraRoundtrip.viewCamera;

            UnitTests.comparePerspectiveCameras(camera.viewCamera, perspectiveCameraRoundTrip.viewCamera);
        });
    }

    /**
     * @description Initialize the view settings that are controllable by the user
     */
    public initializeViewerControls() {

        const scope = this;

        this._viewerControls = new ViewerControls(this._viewer.camera, this.showBoundingBoxes.bind(this), this.setClippingPlanes.bind(this), this.roundtripCameraZ.bind(this));

        // Init dat.gui and controls for the UI
        const gui = new dat.GUI({
            autoPlace: false,
            width: ElementAttributes.DatGuiWidth,
        });
        gui.domElement.id = ElementIds.CameraTestControls;

        const settingsDiv = document.getElementById("settingsControls");
        settingsDiv.appendChild(gui.domElement);
        const folderOptions = gui.addFolder("CameraTest Options");

        // Show Bounding Boxes
        const controlShowBoundingBoxes = folderOptions.add(this._viewerControls, "showBoundingBoxes").name("Show Bounding Boxes");

        // Clipping Planes
        const controlSetClippingPlanes = folderOptions.add(this._viewerControls, "setClippingPlanes").name("Set Clipping Planes");

        // Roundtrip Camera
        const roundTripCamera = folderOptions.add(this._viewerControls, "roundtripCamera").name("Roundtrip Camera");

        folderOptions.open();
    }

    /**
     * @description Main.
     */
    public run() {
        this._logger = Services.defaultLogger;

        // Viewer
        this._viewer = new CameraViewer("CameraViewer", "viewerCanvas");

        // UI Controls
        this.initializeViewerControls();
    }
}

const app = new App();
app.run();
