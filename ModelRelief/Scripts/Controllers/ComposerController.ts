// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as dat from "dat-gui";
import * as Dto from "Scripts/Api/V1/Models/DtoModels";
import * as THREE from "three";

import {Loader} from "Scripts/ModelLoaders/Loader";
import {BaseCamera} from "Scripts/Models/Camera/BaseCamera";
import {CameraFactory} from "Scripts/Models/Camera/CameraFactory";
import {CameraHelper} from "Scripts/Models/Camera/CameraHelper";
import {CameraSettings} from "Scripts/Models/Camera/Camerasettings";
import {PerspectiveCamera} from "Scripts/Models/Camera/PerspectiveCamera";
import {DepthBuffer} from "Scripts/Models/DepthBuffer/DepthBuffer";
import {DepthBufferFactory} from "Scripts/Models/DepthBuffer/DepthBufferFactory";
import {Mesh} from "Scripts/Models/Mesh/Mesh";
import {MeshTransform} from "Scripts/Models/MeshTransform/MeshTransform";
import {Model3d} from "Scripts/Models/Model3d/Model3d";
import {ElementAttributes, ElementIds} from "Scripts/System/Html";
import {UnitTests} from "Scripts/UnitTests/UnitTests";
import {InputControllerHelper} from "Scripts/Viewers/InputControllerHelper";
import {MeshViewer} from "Scripts/Viewers/MeshViewer";
import {ModelViewer} from "Scripts/Viewers/ModelViewer";
import {ComposerView} from "Scripts/Views/ComposerView";

/**
 * @description ComposerViewSettings
 * @class ComposerViewSettings
 */
class ComposerViewSettings {

    public meshTransform: MeshTransform;

    public generateRelief: () => void;
    public saveRelief: () => void;
    /**
     * Creates an instance of ComposerViewSettings.
     * @param {() => any} generateRelief
     * @param {() => any} saveRelief
     */
    constructor(meshtransform: MeshTransform, generateRelief: () => any, saveRelief: () => any) {

        this.meshTransform = meshtransform;

        this.generateRelief = generateRelief;
        this.saveRelief     = saveRelief;
    }
}

/**
 * @description Range of a UI control.
 * @class ControlSettings
 */
class ControlSettings {

    public minimum: number;
    public maximum: number;
    public stepSize: number;

    /**
     * Creates an instance of ControlSettings.
     * @param {number} minimum Minimim value of control.
     * @param {number} maximum Maximim value of control.
     * @param {number} stepSize Step size of control.
     */
    constructor(minimum: number, maximum: number, stepSize: number) {
        this.minimum = minimum;
        this.maximum = maximum;
        this.stepSize = stepSize;
    }
}

/**
 * @description Composer Controller
 * @export
 * @class ComposerController
 */
export class ComposerController {

    public static DefaultReliefDimensions: number  = 512;           // relief dimensions

    public _composerView: ComposerView;                             // application view
    public _composerViewSettings: ComposerViewSettings;             // UI settings

    public _reliefWidthPixels: number;                              // relief width
    public _reliefHeightPixels: number;                             // relief height

    public _initialMeshGeneration: boolean = true;

    /**
     * Creates an instance of ComposerController.
     * @param {ComposerView} composerView Composer view.
     */
    constructor(composerView: ComposerView) {

        this._composerView = composerView;

        this.initialize();
    }

//#region Properties

    /**
     * @description Active ModelViewer.
     * @readonly
     * @type {ModelViewer}
     */
    get modelViewer(): ModelViewer {
        return this._composerView._modelView.modelViewer;
    }

    /**
     * @description Active MeshViewer.
     * @readonly
     * @type {MeshViewer}
     */
    get meshViewer(): MeshViewer {
        return this._composerView._meshView.meshViewer;
    }

    /**
     * @description Active Model3d.
     * @readonly
     * @type {Model3d}
     */
    get activeModel3d(): Model3d {
        return this._composerView.mesh.depthBuffer.model3d;
    }

    /**
     * @description Active Mesh.
     * @readonly
     * @type {Mesh}
     */
    get activeMesh(): Mesh {
        return this._composerView.mesh;
    }

    /**
     * @description Active MeshTransform.
     * @readonly
     * @type {MeshTransform}
     */
    get activeMeshTransform(): MeshTransform {
        return this._composerView.mesh.meshTransform;
    }

    /**
     * @description Active DepthBuffer.
     * @readonly
     * @type {DepthBuffer}
     */
    get activeDepthBuffer(): DepthBuffer {
        return this._composerView.mesh.depthBuffer;
    }

    /**
     * @description Gets the active DepthBuffer camera.
     * @type {BaseCamera}
     */
    get activeDepthBufferCamera(): BaseCamera {
        return this._composerView.mesh.depthBuffer.camera;
    }
    /**
     * @description Sets the active DepthBuffer camera.
     */
    set activeDepthBufferCamera(camera: BaseCamera) {
        this._composerView.mesh.depthBuffer.camera = camera;
    }

//#endregion

//#region Event Handlers
    /**
     * @description Generates a relief from the current model camera.
     * @returns {Promise<void>}
     */
    public async generateReliefAsync(): Promise<void> {

        // Camera
        const cameraModel: Dto.Camera = await this.updateCameraAsync();

        // DepthBufffer
        const depthBufferModel: Dto.DepthBuffer = await this.updateDepthBufferAsync();

        // MeshTransform
        const meshTransformModel: Dto.MeshTransform = await this.updateMeshTransformAsync();

        // Mesh
        const meshModel: Dto.Mesh = await this.updateMeshAsync();

        // Mesh graphics
        const loader = new Loader();
        const meshGraphics = await loader.loadMeshAsync(this.activeMesh);

        this.meshViewer.setModelGroup(meshGraphics);
        if (this._initialMeshGeneration) {
            this.meshViewer.fitView();
            this._initialMeshGeneration = false;
        }
    }

    /**
     * @description Updates the Camera.
     * @returns {Promise<Dto.Camera>}
     */
    public async updateCameraAsync(): Promise<Dto.Camera> {

        // copy view camera so we can optimize clipping planes
        const modelViewCameraClone = this.modelViewer.camera.clone(true);
        this.activeDepthBufferCamera = CameraFactory.constructFromViewCamera(this.activeDepthBufferCamera, modelViewCameraClone);
        this.activeDepthBufferCamera.finalizeClippingPlanes(this.modelViewer.modelGroup);

        // update
        const depthBufferCameraModel: Dto.Camera = await this.activeDepthBufferCamera.toDtoModel().putAsync();

        return depthBufferCameraModel;
    }

    /**
     * @description Updates the DepthBuffer.
     * @returns {Promise<Dto.DepthBuffer>}
     */
    public async updateDepthBufferAsync(): Promise<Dto.DepthBuffer> {

        // generate new DepthBuffer from active Camera
        const canvasElement = this._composerView.depthBufferView.depthBufferViewer.canvas;
        const factory = new DepthBufferFactory({ canvas : canvasElement, width: this._reliefWidthPixels, height: this._reliefHeightPixels, modelGroup: this.modelViewer.modelGroup, camera: this.activeDepthBufferCamera});
        const factoryDepthBuffer = await factory.createDepthBufferAsync();

        // metadata
        this.activeDepthBuffer.camera = this.activeDepthBufferCamera;
        this.activeDepthBuffer.width  = this._reliefWidthPixels;
        this.activeDepthBuffer.height = this._reliefHeightPixels;

        // The DepthBuffer is not synchronized because of changes to its dependent objects (e.g. Camera).
        // Do not allow the (currently unimplemented) FileGenerateRequest to be queued because POST will update the object.
        this.activeDepthBuffer.fileIsSynchronized = false;
        let depthBufferModel: Dto.DepthBuffer = await this.activeDepthBuffer.toDtoModel().putAsync();

        // file
        this.activeDepthBuffer.depths = factoryDepthBuffer.depths;
        depthBufferModel = await depthBufferModel.postFileAsync(this.activeDepthBuffer.depths);

        return depthBufferModel;
    }

    /**
     * @description Updates the MeshTransform.
     * @returns {Promise<Dto.MeshTransform>}
     */
    public async updateMeshTransformAsync(): Promise<Dto.MeshTransform> {

        const updatedMeshTransform = await this.activeMeshTransform.toDtoModel().putAsync();

        return updatedMeshTransform;
    }

    /**
     * @description Updates the Mesh.
     * @returns {Promise<Dto.Mesh>}
     */
    public async updateMeshAsync(): Promise<Dto.Mesh> {

        // The Mesh is not synchronized because of changes to its dependent objects (Camera, DepthBuffer).
        // Force the Mesh to be re-generated now on the back end.
        this.activeMesh.fileIsSynchronized = true;

        const updateMeshModel = this.activeMesh.toDtoModel().putAsync();

        return updateMeshModel;
    }

    /**
     * @description Saves the relief.
     */
    public saveRelief() {
        CameraHelper.debugCameraProperties(this.modelViewer.camera, this.modelViewer.modelGroup, "saveRelief");
        InputControllerHelper.debugInputControllerProperties(this.modelViewer.name, this.modelViewer.controls, this.modelViewer.scene, this.modelViewer.camera);
    }

    /**
     * @description Saves the relief.
     */
    public saveReliefTest() {
        // WIP: Save the Mesh as an OBJ format file?
        // It may be more efficient to maintain Meshes in raw format since the size is substantially smaller.

        if (this.modelViewer.camera instanceof THREE.PerspectiveCamera) {
            // WIP: Randomly generated cameras do not roundtrip the matrix property. However, cameras created and manipulated through views work fine.
            // UnitTests.cameraRoundTrip();

            const camera = new PerspectiveCamera({}, this.modelViewer.camera);
            const cameraModel = camera.toDtoModel();
            CameraFactory.constructFromDtoModelAsync(cameraModel).then((cameraRoundtrip) => {
                const perspectiveCameraRoundTrip =  cameraRoundtrip.viewCamera as THREE.PerspectiveCamera;
                UnitTests.comparePerspectiveCameras(camera.viewCamera, perspectiveCameraRoundTrip);

                this.modelViewer.camera = cameraRoundtrip.viewCamera;
            });
        }
    }

    //#endregion

    /**
     * @description Initialization.
     */
    public initialize() {

        // overall dimensions
        this._reliefWidthPixels  = ComposerController.DefaultReliefDimensions;
        this._reliefHeightPixels = this._reliefWidthPixels / this.modelViewer.aspectRatio;

        // ModelViewer camera = DepthBuffer camera (used to generate active mesh)
        this.initializeModelViewerCamera();

        // model available; start render loop
        this.modelViewer.animate();

        this.initializeUIControls();
    }

    /**
     * @description Initialize the view settings that are controllable by the user
     */
    public initializeUIControls() {

        const scope = this;

        this._composerViewSettings = new ComposerViewSettings(this.activeMeshTransform, this.generateReliefAsync.bind(this), this.saveRelief.bind(this));

        // Init dat.gui and controls for the UI
        const gui = new dat.GUI({
            autoPlace: false,
            width: ElementAttributes.DatGuiWidth,
        });
        gui.domElement.id = ElementIds.ComposerControls;

        const containerDiv = document.getElementById(this._composerView.containerId);
        containerDiv.appendChild(gui.domElement);
        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        //                                                                   ModelRelief                                                                //
        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        const composerViewOptions = gui.addFolder("Composer Options");

        const dimensionsOptions = composerViewOptions.addFolder("Mesh Dimensions");
        let controlSettings = new ControlSettings(1.0, 1000.0, 1.0);

        // Mesh Dimensions
        const controlMeshWidth  = dimensionsOptions.add(this._composerViewSettings.meshTransform, "width").name("Width").min(controlSettings.minimum).max(controlSettings.maximum).step(controlSettings.stepSize).listen();
        const controlMeshHeight = dimensionsOptions.add(this._composerViewSettings.meshTransform, "height").name("Height").min(controlSettings.minimum).max(controlSettings.maximum).step(controlSettings.stepSize).listen();
        const controlMeshDepth  = dimensionsOptions.add(this._composerViewSettings.meshTransform, "depth").name("Depth").min(controlSettings.minimum).max(controlSettings.maximum).step(controlSettings.stepSize).listen();

        const reliefProcessingOptions = composerViewOptions.addFolder("Relief Processing");

        // Relief Processing Parameters
        controlSettings = new ControlSettings(0.0, 10.0, 0.1);
        const controlGaussianThreshold = reliefProcessingOptions.add(this._composerViewSettings.meshTransform, "gradientThreshold").name("Gradient Threshold").min(controlSettings.minimum).max(controlSettings.maximum).step(controlSettings.stepSize).listen();

        controlSettings = new ControlSettings(0.0, 100.0, 0.1);
        const controlAttenuationFactor = reliefProcessingOptions.add(this._composerViewSettings.meshTransform, "attenuationFactor").name("Attenuation Factor").min(controlSettings.minimum).max(controlSettings.maximum).step(controlSettings.stepSize).listen();

        controlSettings = new ControlSettings(0.0, 1.0, 0.1);
        const controlAttenuationDecay = reliefProcessingOptions.add(this._composerViewSettings.meshTransform, "attenuationDecay").name("Attenuation Decay").min(controlSettings.minimum).max(controlSettings.maximum).step(controlSettings.stepSize).listen();

        controlSettings = new ControlSettings(0.0, 10.0, 0.1);
        const controlUnsharpGaussianLow = reliefProcessingOptions.add(this._composerViewSettings.meshTransform, "unsharpGaussianLow").name("Gaussian Low").min(controlSettings.minimum).max(controlSettings.maximum).step(controlSettings.stepSize).listen();

        controlSettings = new ControlSettings(0.0, 10.0, 0.1);
        const controlUnsharpGaussianHigh = reliefProcessingOptions.add(this._composerViewSettings.meshTransform, "unsharpGaussianHigh").name("Gaussian High").min(controlSettings.minimum).max(controlSettings.maximum).step(controlSettings.stepSize).listen();

        controlSettings = new ControlSettings(0.0, 10.0, 0.1);
        const controlUnsharpHighFrequencyScale  = reliefProcessingOptions.add(this._composerViewSettings.meshTransform, "unsharpHighFrequencyScale").name("High Frequency Scale").min(controlSettings.minimum).max(controlSettings.maximum).step(controlSettings.stepSize).listen();

        controlSettings = new ControlSettings(0.0, 1.0, 0.01);
        const controlP1  = reliefProcessingOptions.add(this._composerViewSettings.meshTransform, "p1").name("P1").min(controlSettings.minimum).max(controlSettings.maximum).step(controlSettings.stepSize).listen();

        controlSettings = new ControlSettings(0.0, 10.0, 0.1);
        const controlP2  = reliefProcessingOptions.add(this._composerViewSettings.meshTransform, "p2").name("P2").min(controlSettings.minimum).max(controlSettings.maximum).step(controlSettings.stepSize).listen();

        controlSettings = new ControlSettings(0.0, 1.0, 0.01);
        const controlP3  = reliefProcessingOptions.add(this._composerViewSettings.meshTransform, "p3").name("P3").min(controlSettings.minimum).max(controlSettings.maximum).step(controlSettings.stepSize).listen();

        controlSettings = new ControlSettings(0.0, 1.0, 0.01);
        const controlP4  = reliefProcessingOptions.add(this._composerViewSettings.meshTransform, "p4").name("P4").min(controlSettings.minimum).max(controlSettings.maximum).step(controlSettings.stepSize).listen();

        // Generate Relief
        const controlGenerateRelief = reliefProcessingOptions.add(this._composerViewSettings, "generateRelief").name("Generate Relief");

        // Save Relief
        const controlSaveRelief = reliefProcessingOptions.add(this._composerViewSettings, "saveRelief").name("Save Relief");

        composerViewOptions.open();
        dimensionsOptions.open();
        reliefProcessingOptions.open();
    }

    /**
     * @description Initialize the ModelViewer camera.
     * The camera is set to match the DepthBuffer camera used to generate the active mesh.
     * @private
     */
    private initializeModelViewerCamera() {

        // model camera = depth buffer camera (default clipping planes)
        const modelViewCamera = this.activeDepthBufferCamera.viewCamera.clone();

        // WIP: Set far plane based on model extents to avoid clipping
        const boundingPlanes =  this.activeDepthBufferCamera.getBoundingClippingPlanes(this.modelViewer.modelGroup);

        modelViewCamera.near = CameraSettings.DefaultNearClippingPlane;
        modelViewCamera.far  = CameraSettings.DefaultFarClippingPlane;

        modelViewCamera.updateProjectionMatrix();

        // CameraHelper.debugCameraProperties(modelViewCamera, this.modelViewer.modelGroup, "Before");
        this.modelViewer.camera = modelViewCamera;
        // CameraHelper.debugCameraProperties(this.modelViewer.camera, this.modelViewer.modelGroup, "After");
    }

}
