﻿// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import * as dat from "dat-gui";
import * as Dto from "Scripts/Api/V1/Models/DtoModels";
import * as THREE from "three";

import {Loader} from "Scripts/ModelLoaders/Loader";
import {BaseCamera} from "Scripts/Models/Camera/BaseCamera";
import {CameraFactory} from "Scripts/Models/Camera/CameraFactory";
import {CameraHelper} from "Scripts/Models/Camera/CameraHelper";
import {DefaultCameraSettings} from "Scripts/Models/Camera/DefaultCameraSettings";
import {PerspectiveCamera} from "Scripts/Models/Camera/PerspectiveCamera";
import {DepthBuffer} from "Scripts/Models/DepthBuffer/DepthBuffer";
import {DepthBufferFactory} from "Scripts/Models/DepthBuffer/DepthBufferFactory";
import {Mesh} from "Scripts/Models/Mesh/Mesh";
import {MeshTransform} from "Scripts/Models/MeshTransform/MeshTransform";
import {Model3d} from "Scripts/Models/Model3d/Model3d";
import {NormalMap} from "Scripts/Models/NormalMap/NormalMap";
import {NormalMapFactory} from "Scripts/Models/NormalMap/NormalMapFactory";
import {ElementAttributes, ElementIds} from "Scripts/System/Html";
import {ILogger} from "Scripts/System/Logger";
import {Services} from "Scripts/System/Services";
import {SystemSettings} from "Scripts/System/SystemSettings";
import {UnitTests} from "Scripts/UnitTests/UnitTests";
import {DepthBufferViewer} from "Scripts/Viewers/DepthBufferViewer";
import {InputControllerHelper} from "Scripts/Viewers/InputControllerHelper";
import {MeshViewer} from "Scripts/Viewers/MeshViewer";
import {ModelViewer} from "Scripts/Viewers/ModelViewer";
import {NormalMapViewer} from "Scripts/Viewers/NormalMapViewer";
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
        this.saveRelief = saveRelief;
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
     * @param {number} minimum Minimum value of control.
     * @param {number} maximum Maximum value of control.
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

    // Static
    public static DefaultReliefDimensions: number = 512;           // relief dimensions

    // Public
    public _composerView: ComposerView;                             // application view
    public _composerViewSettings: ComposerViewSettings;             // UI settings

    public _reliefWidthPixels: number;                              // relief width
    public _reliefHeightPixels: number;                             // relief height

    // Protected
    protected _logger: ILogger;

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
     * @description Active DepthBufferViewer.
     * @readonly
     * @type {DepthBufferViewer}
     */
    get depthBufferViewer(): DepthBufferViewer {
        return this._composerView._depthBufferView.depthBufferViewer;
    }

    /**
     * @description Active NormalMapViewer.
     * @readonly
     * @type {NormalMapViewer}
     */
    get normalMapViewer(): NormalMapViewer {
        return this._composerView._normalMapView.normalMapViewer;
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
     * @description Active NormalMap.
     * @readonly
     * @type {NormalMap}
     */
    get activeNormalMap(): NormalMap {
        return this._composerView.mesh.normalMap;
    }

    /**
     * @description Gets the active relief camera.
     * @type {BaseCamera}
     */
    get activeMeshReliefCamera(): BaseCamera {
        return this._composerView.mesh.depthBuffer.camera;
    }
    /**
     * @description Sets the active relief camera.
     */
    set activeMeshReliefCamera(camera: BaseCamera) {
        this._composerView.mesh.depthBuffer.camera = camera;
        this._composerView.mesh.normalMap.camera = camera;
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

        // NormalMap
        const normalMapModel: Dto.NormalMap = await this.updateNormalMapAsync();

        // MeshTransform
        const meshTransformModel: Dto.MeshTransform = await this.updateMeshTransformAsync();

        // Mesh
        const meshModel: Dto.Mesh = await this.updateMeshAsync();

        // Mesh graphics
        const loader = new Loader();
        const meshGraphics = await loader.loadMeshAsync(this.activeMesh);

        this.meshViewer.setModelGroup(meshGraphics);

        this._logger.addMessage("Mesh generated");
    }

    /**
     * @description Updates the Camera.
     * @returns {Promise<Dto.Camera>}
     */
    public async updateCameraAsync(): Promise<Dto.Camera> {

        // copy view camera so we can optimize clipping planes
        const modelViewCameraClone = this.modelViewer.camera.clone(true);
        this.activeMeshReliefCamera = CameraFactory.constructFromViewCamera(this.activeMeshReliefCamera, modelViewCameraClone, this.activeMeshReliefCamera.project);
        this.activeMeshReliefCamera.finalizeClippingPlanes(this.modelViewer.modelGroup);

        // update
        const reliefCameraModel: Dto.Camera = await this.activeMeshReliefCamera.toDtoModel().putAsync();
        return reliefCameraModel;
    }

    /**
     * @description Updates the DepthBuffer.
     * @returns {Promise<Dto.DepthBuffer>}
     */
    public async updateDepthBufferAsync(): Promise<Dto.DepthBuffer> {

        // generate new DepthBuffer from active Camera
        const canvasElement = this._composerView.depthBufferView.depthBufferViewer.canvas;
        const factory = new DepthBufferFactory({canvas: canvasElement, width: this._reliefWidthPixels, height: this._reliefHeightPixels, modelGroup: this.modelViewer.modelGroup, camera: this.activeMeshReliefCamera});
        const factoryDepthBuffer = await factory.createDepthBufferAsync();

        // metadata
        this.activeDepthBuffer.camera = this.activeMeshReliefCamera;
        this.activeDepthBuffer.width = this._reliefWidthPixels;
        this.activeDepthBuffer.height = this._reliefHeightPixels;

        // The DepthBuffer is not synchronized because of changes to its dependent objects (e.g. Camera).
        // Do not allow the (currently unimplemented) FileGenerateRequest to be queued because POST will update the object.
        this.activeDepthBuffer.fileIsSynchronized = false;
        let depthBufferModel: Dto.DepthBuffer = await this.activeDepthBuffer.toDtoModel().putAsync();

        // file
        this.activeDepthBuffer.depths = factoryDepthBuffer.depths;
        depthBufferModel = await depthBufferModel.postFileAsync(this.activeDepthBuffer.depths);

        // viewer
        this.depthBufferViewer.imageModel = this.activeDepthBuffer;

        return depthBufferModel;
    }

    /**
     * @description Updates the NormalMap.
     * @returns {Promise<Dto.NormalMap>}
     */
    public async updateNormalMapAsync(): Promise<Dto.NormalMap> {

        // generate new NormalMap from active Camera
        const canvasElement = this._composerView._normalMapView.normalMapViewer.canvas;
        const factory = new NormalMapFactory({canvas: canvasElement, width: this._reliefWidthPixels, height: this._reliefHeightPixels, modelGroup: this.modelViewer.modelGroup, camera: this.activeMeshReliefCamera});
        const factoryNormalMap = await factory.createNormalMapAsync();

        // metadata
        this.activeNormalMap.camera = this.activeMeshReliefCamera;
        this.activeNormalMap.width = this._reliefWidthPixels;
        this.activeNormalMap.height = this._reliefHeightPixels;

        // The NormalMap is not synchronized because of changes to its dependent objects (e.g. Camera).
        // Do not allow the (currently unimplemented) FileGenerateRequest to be queued because POST will update the object.
        this.activeNormalMap.fileIsSynchronized = false;
        let normalMapModel: Dto.NormalMap = await this.activeNormalMap.toDtoModel().putAsync();

        // file
        this.activeNormalMap.rgbaArray = factoryNormalMap.rgbaArray;
        normalMapModel = await normalMapModel.postFileAsync(this.activeNormalMap.rgbaArray);

        // viewer
        this.normalMapViewer.imageModel = this.activeNormalMap;

        return normalMapModel;
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
    public saveReliefDebug() {
        CameraHelper.debugCameraProperties(this.modelViewer.camera, this.modelViewer.modelGroup, "saveRelief");
        InputControllerHelper.debugInputControllerProperties(this.modelViewer.name, this.modelViewer.controls, this.modelViewer.scene, this.modelViewer.camera);
    }

    /**
     * @description Saves the relief.
     */
    public saveRelief() {
        // WIP: Save the Mesh as an OBJ format file?
        // It may be more efficient to maintain Meshes in raw format since the size is substantially smaller.

        if (this.modelViewer.camera instanceof THREE.PerspectiveCamera) {

            UnitTests.cameraRoundTrip();

            const camera = new PerspectiveCamera({}, this.modelViewer.camera);
            const cameraModel = camera.toDtoModel();
            CameraFactory.constructFromDtoModelAsync(cameraModel).then((cameraRoundtrip) => {
                const perspectiveCameraRoundTrip = cameraRoundtrip.viewCamera as THREE.PerspectiveCamera;
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
        this._logger = Services.defaultLogger;

        // overall dimensions
        this._reliefWidthPixels = ComposerController.DefaultReliefDimensions;
        this._reliefHeightPixels = this._reliefWidthPixels / this.modelViewer.aspectRatio;

        // ModelViewer camera = DepthBuffer camera (used to generate active mesh)
        this.initializeModelViewerCamera();
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
        let controlSettings: ControlSettings = null;

        // Mesh Dimensions
        let dimensionsOptions: dat.GUI = null;
        if (SystemSettings.developmentUI) {
            dimensionsOptions = composerViewOptions.addFolder("Mesh Dimensions");
            controlSettings = new ControlSettings(1.0, 1000.0, 1.0);

            const controlMeshWidth = dimensionsOptions.add(this._composerViewSettings.meshTransform, "width").name("Width").min(controlSettings.minimum).max(controlSettings.maximum).step(controlSettings.stepSize);
            const controlMeshHeight = dimensionsOptions.add(this._composerViewSettings.meshTransform, "height").name("Height").min(controlSettings.minimum).max(controlSettings.maximum).step(controlSettings.stepSize);
            const controlMeshDepth = dimensionsOptions.add(this._composerViewSettings.meshTransform, "depth").name("Depth").min(controlSettings.minimum).max(controlSettings.maximum).step(controlSettings.stepSize);
        }

        // Relief Processing Parameters
        const reliefProcessingOptions = composerViewOptions.addFolder("Relief Processing");

        controlSettings = new ControlSettings(0.0, 10.0, 0.1);
        const controlGaussianThreshold = reliefProcessingOptions.add(this._composerViewSettings.meshTransform, "gradientThreshold").name("Gradient Threshold").min(controlSettings.minimum).max(controlSettings.maximum).step(controlSettings.stepSize);

        if (SystemSettings.developmentUI) {
            controlSettings = new ControlSettings(0.0, 100.0, 0.1);
            const controlAttenuationFactor = reliefProcessingOptions.add(this._composerViewSettings.meshTransform, "attenuationFactor").name("Attenuation Factor").min(controlSettings.minimum).max(controlSettings.maximum).step(controlSettings.stepSize);
        }

        controlSettings = new ControlSettings(0.0, 1.0, 0.1);
        const controlAttenuationDecay = reliefProcessingOptions.add(this._composerViewSettings.meshTransform, "attenuationDecay").name("Attenuation Decay").min(controlSettings.minimum).max(controlSettings.maximum).step(controlSettings.stepSize);

        controlSettings = new ControlSettings(0.0, 10.0, 0.1);
        const controlUnsharpGaussianLow = reliefProcessingOptions.add(this._composerViewSettings.meshTransform, "unsharpGaussianLow").name("Gaussian Low").min(controlSettings.minimum).max(controlSettings.maximum).step(controlSettings.stepSize);

        if (SystemSettings.developmentUI) {
            controlSettings = new ControlSettings(0.0, 10.0, 0.1);
            const controlUnsharpGaussianHigh = reliefProcessingOptions.add(this._composerViewSettings.meshTransform, "unsharpGaussianHigh").name("Gaussian High").min(controlSettings.minimum).max(controlSettings.maximum).step(controlSettings.stepSize);
        }

        controlSettings = new ControlSettings(0.0, 10.0, 0.1);
        const controlUnsharpHighFrequencyScale = reliefProcessingOptions.add(this._composerViewSettings.meshTransform, "unsharpHighFrequencyScale").name("High Frequency Scale").min(controlSettings.minimum).max(controlSettings.maximum).step(controlSettings.stepSize);

        controlSettings = new ControlSettings(0.0, 1.0, 0.01);
        const controlP1 = reliefProcessingOptions.add(this._composerViewSettings.meshTransform, "p1").name("Scale (%)").min(controlSettings.minimum).max(controlSettings.maximum).step(controlSettings.stepSize);

        // Generate Relief
        const controlGenerateRelief = reliefProcessingOptions.add(this._composerViewSettings, "generateRelief").name("Generate Relief");

        // Save Relief
        if (SystemSettings.developmentUI) {
            const controlSaveRelief = reliefProcessingOptions.add(this._composerViewSettings, "saveRelief").name("Save Relief");
        }

        composerViewOptions.open();
        reliefProcessingOptions.open();

        if (SystemSettings.developmentUI)
            dimensionsOptions.open();
    }

    /**
     * @description Initialize the ModelViewer camera.
     * The camera is set to match the DepthBuffer camera used to generate the active mesh.
     * @private
     */
    private initializeModelViewerCamera() {

        // model camera = relief camera (default clipping planes)
        const modelViewCamera = this.activeMeshReliefCamera.viewCamera.clone();

        // WIP: Set far plane based on model extents to avoid clipping
        const boundingPlanes = this.activeMeshReliefCamera.getBoundingClippingPlanes(this.modelViewer.modelGroup);

        modelViewCamera.near = DefaultCameraSettings.NearClippingPlane;
        modelViewCamera.far = DefaultCameraSettings.FarClippingPlane;
        modelViewCamera.updateProjectionMatrix();

        this.modelViewer.camera = modelViewCamera;
    }
}