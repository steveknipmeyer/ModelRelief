// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {DtoCamera} from "Scripts/Api/V1/Models/DtoCamera";
import {DtoDepthBuffer} from "Scripts/Api/V1/Models/DtoDepthBuffer";
import {DtoMesh} from "Scripts/Api/V1/Models/DtoMesh";
import {DtoMeshTransform} from "Scripts/Api/V1/Models/DtoMeshTransform";
import {DtoNormalMap} from "Scripts/Api/V1/Models/DtoNormalMap";
import {Loader} from "Scripts/ModelLoaders/Loader";
import {BaseCamera} from "Scripts/Models/Camera/BaseCamera";
import {CameraFactory} from "Scripts/Models/Camera/CameraFactory";
import {CameraHelper} from "Scripts/Models/Camera/CameraHelper";
import {Defaults} from "Scripts/Models/Settings/Defaults";
import {DepthBuffer} from "Scripts/Models/DepthBuffer/DepthBuffer";
import {DepthBufferFactory} from "Scripts/Models/DepthBuffer/DepthBufferFactory";
import {Mesh} from "Scripts/Models/Mesh/Mesh";
import {MeshTransform} from "Scripts/Models/MeshTransform/MeshTransform";
import {Model3d} from "Scripts/Models/Model3d/Model3d";
import {NormalMap} from "Scripts/Models/NormalMap/NormalMap";
import {NormalMapFactory} from "Scripts/Models/NormalMap/NormalMapFactory";
import {ElementIds} from "Scripts/System/Html";
import {ILogger} from "Scripts/System/Logger";
import {Services} from "Scripts/System/Services";
import {DepthBufferViewer} from "Scripts/Viewers/DepthBufferViewer";
import {MeshViewer} from "Scripts/Viewers/MeshViewer";
import {ModelViewer} from "Scripts/Viewers/ModelViewer";
import {NormalMapViewer} from "Scripts/Viewers/NormalMapViewer";
import {ComposerView} from "Scripts/Views/ComposerView";
import {StandardView} from "Scripts/Api/V1/Interfaces/ICamera";
import {DtoModel} from "Scripts/Api/V1/Base/DtoModel";
import {DtoModel3d} from "Scripts/Api/V1/Models/DtoModel3d";

/**
 * @description ComposerViewSettings
 * @class ComposerViewSettings
 */
class ComposerViewSettings {

    public meshTransform: MeshTransform;

    /**
     * Creates an instance of ComposerViewSettings.
     */
    constructor(meshtransform: MeshTransform) {

        this.meshTransform = meshtransform;
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

    // Public
    public _composerView: ComposerView;                                     // application view
    public _composerViewSettings: ComposerViewSettings;                     // UI settings

    public _reliefWidthPixels: number;                                      // relief width
    public _reliefHeightPixels: number;                                     // relief height

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
     * @returns {Promise<boolean>}
     */
    public async generateReliefAsync(): Promise<boolean> {

        // Model
        const model: DtoModel3d = await this.updateModelAsync();

        // Camera
        const cameraModel: DtoCamera = await this.updateCameraAsync();

        // DepthBufffer
        const depthBufferModel: DtoDepthBuffer = await this.updateDepthBufferAsync();

        // NormalMap
        const normalMapModel: DtoNormalMap = await this.updateNormalMapAsync();

        // MeshTransform
        const meshTransformModel: DtoMeshTransform = await this.updateMeshTransformAsync();

        // Mesh
        const meshModel: DtoMesh = await this.updateMeshAsync();
        if (!meshModel.fileIsSynchronized) {
            this._logger.addErrorMessage("An error occurred while generating the new Mesh.");
            return false;
        }

        // Mesh graphics
        const meshLoaded = await this.updateMeshGraphicsAsync();
        if (!meshLoaded) {
            this._logger.addErrorMessage("An error occurred while constructing the Mesh graphics.");
            return false;
        }

        this._logger.addMessage("Mesh generated");
        return true;
    }

    /**
     * @description Updates the Model3d.
     * @returns {Promise<DtoModel3d>}
     */
    public async updateModelAsync(): Promise<DtoModel3d> {

        // preview
        const previewImage = this.modelViewer.base64Image;
        const model: DtoModel3d = await this.activeModel3d.toDtoModel().postPreviewAsync(previewImage);

        return model;
    }

    /**
     * @description Updates the Camera.
     * @returns {Promise<DtoCamera>}
     */
    public async updateCameraAsync(): Promise<DtoCamera> {

        // copy view camera so we can optimize clipping planes
        const modelViewCameraClone = this.modelViewer.camera.clone(true);
        this.activeMeshReliefCamera = CameraFactory.constructFromViewCamera(this.activeMeshReliefCamera, modelViewCameraClone, this.activeMeshReliefCamera.project);
        this.activeMeshReliefCamera.finalizeClippingPlanes(this.modelViewer.modelGroup);

        // update
        const reliefCameraModel: DtoCamera = await this.activeMeshReliefCamera.toDtoModel().putAsync();

        return reliefCameraModel;
    }

    /**
     * @description Updates the DepthBuffer.
     * @returns {Promise<DtoDepthBuffer>}
     */
    public async updateDepthBufferAsync(): Promise<DtoDepthBuffer> {

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
        let depthBufferModel: DtoDepthBuffer = await this.activeDepthBuffer.toDtoModel().putAsync();

        // file
        this.activeDepthBuffer.rgbaArray = factoryDepthBuffer.rgbaArray;
        depthBufferModel = await depthBufferModel.postFileAsync(this.activeDepthBuffer.rgbaArray, true);

        // preview
        const previewImage = this.depthBufferViewer.base64Image;
        depthBufferModel = await depthBufferModel.postPreviewAsync(previewImage);

        // viewer
        this.depthBufferViewer.imageModel = this.activeDepthBuffer;

        return depthBufferModel;
    }

    /**
     * @description Updates the NormalMap.
     * @returns {Promise<DtoNormalMap>}
     */
    public async updateNormalMapAsync(): Promise<DtoNormalMap> {

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
        let normalMapModel: DtoNormalMap = await this.activeNormalMap.toDtoModel().putAsync();

        // file
        this.activeNormalMap.rgbaArray = factoryNormalMap.rgbaArray;
        normalMapModel = await normalMapModel.postFileAsync(this.activeNormalMap.rgbaArray, false);

        // preview
        const previewImage = this.normalMapViewer.base64Image;
        normalMapModel = await normalMapModel.postPreviewAsync(previewImage);

        // viewer
        this.normalMapViewer.imageModel = this.activeNormalMap;

        return normalMapModel;
    }

    /**
     * @description Updates the MeshTransform.
     * @returns {Promise<DtoMeshTransform>}
     */
    public async updateMeshTransformAsync(): Promise<DtoMeshTransform> {

        const updatedMeshTransform = await this.activeMeshTransform.toDtoModel().putAsync();

        return updatedMeshTransform;
    }

    /**
     * @description Updates the Mesh.
     * @returns {Promise<DtoMesh>}
     */
    public async updateMeshAsync(): Promise<DtoMesh> {

        // The Mesh is not synchronized because of changes to its dependent objects (Camera, DepthBuffer).
        // Force the Mesh to be re-generated now on the back end.
        this.activeMesh.fileIsSynchronized = true;

        const updatedMeshModel = await this.activeMesh.toDtoModel().putAsync();

        return updatedMeshModel;
    }

    /**
     * @description Construct the mesh graphics 3D model.
     * @return {*}  {Promise<boolean>}
     */
    public async updateMeshGraphicsAsync(): Promise<boolean> {
        const loader = new Loader();
        try {
            const meshGraphics = await loader.loadMeshAsync(this.activeMesh);
            if (meshGraphics === null)
                return false;

            this.meshViewer.setModelGroup(meshGraphics);
            this.meshViewer.setCameraToStandardView(StandardView.Top);

            // mesh preview
            setTimeout(async () => {
                const previewImage = this.meshViewer.base64Image;
                await this.activeMesh.toDtoModel().postPreviewAsync(previewImage);
            }, 1000);
        }
        catch (exception) {
            this._logger.addErrorMessage(`An exception occurred while constructing the Mesh graphics: ${exception.message}.`);
            return false;
        }
        return true;
    }
    //#endregion

    /**
     * @description Initialization.
     */
    public initialize(): void{
        this._logger = Services.defaultLogger;

        // overall dimensions
        this._reliefWidthPixels = this._composerView.meshView.meshViewer.mesh.width;
        this._reliefHeightPixels = this._reliefWidthPixels / this.modelViewer.aspectRatio;

        // ModelViewer camera = DepthBuffer camera (used to generate active mesh)
        this.initializeModelViewerCamera();
        this.modelViewer.animate();

        this.initializeUIControls();
    }

    /**
     * @description Initialize the view settings that are controllable by the user
     */
    public initializeUIControls(): void {

        this._composerViewSettings = new ComposerViewSettings(this.activeMeshTransform);

        // Settings
        this.initializeCheckboxControl(`${ElementIds.GradientThresholdEnabled}`, this._composerViewSettings.meshTransform, "gradientThresholdEnabled");
        this.initializeSliderControl (`${ElementIds.GradientThreshold}`, this._composerViewSettings.meshTransform, "gradientThreshold");

        this.initializeCheckboxControl(`${ElementIds.AttenuationEnabled}`, this._composerViewSettings.meshTransform, "attenuationEnabled");
        this.initializeSliderControl(`${ElementIds.AttenuationFactor}`, this._composerViewSettings.meshTransform, "attenuationFactor");

        this.initializeCheckboxControl(`${ElementIds.UnsharpMaskingEnabled}`, this._composerViewSettings.meshTransform, "unsharpMaskingEnabled");
        this.initializeSliderControl(`${ElementIds.UnsharpGaussianLow}`, this._composerViewSettings.meshTransform, "unsharpGaussianLow");
        this.initializeSliderControl(`${ElementIds.UnsharpHighFrequencyScale}`, this._composerViewSettings.meshTransform, "unsharpHighFrequencyScale");

        this.initializeCheckboxControl(`${ElementIds.SilhouetteEnabled}`, this._composerViewSettings.meshTransform, "silhouetteEnabled");
        this.initializeSliderControl(`${ElementIds.SilhouetteEdgeWidth}`, this._composerViewSettings.meshTransform, "silhouetteEdgeWidth");

        this.initializeSliderControl(`${ElementIds.MeshScale}`, this._composerViewSettings.meshTransform, "reliefScale");

        // Generate Mesh
        const generateMeshControl = document.querySelector(`#${ElementIds.GenerateMesh}`);
        generateMeshControl.addEventListener("click", async (clickEvent) => {

            this.meshViewer.enableBusyBar(true);
            await this.generateReliefAsync();
            this.meshViewer.enableBusyBar(false);
        });
    }

    /**
     * @description Initialize a range slider control.
     * @private
     * @param {string} elementId HTML Id of range slider.
     * @param {any} setting Setting.
     * @param {string} propertyName Setting property name.
     */
    private initializeSliderControl(elementId: string, setting: any, propertyName: string): void {

        const control = document.querySelector(`#${elementId}`) as HTMLInputElement;

        control.value = setting[propertyName];
        control.addEventListener("change", (changeEvent) => {
            setting[propertyName] = control.value;
        });
    }

    /**
     * @description Initialize a checkbox control.
     * @private
     * @param {string} elementId HTML Id of checkbox control.
     * @param {any} setting Setting.
     * @param {string} propertyName Setting property name.
     */
    private initializeCheckboxControl(elementId: string, setting: any, propertyName: string): void {

        const control = document.querySelector(`#${elementId}`) as HTMLInputElement;

        control.checked = setting[propertyName];
        control.addEventListener("change", (changeEvent) => {
            setting[propertyName] = control.checked;
        });
    }

    /**
     * @description Initialize the ModelViewer camera.
     * The camera is set to match the DepthBuffer camera used to generate the active mesh.
     * @private
     */
    private initializeModelViewerCamera() {

        // unsynchronized (new mesh)? : set mesh relief camera to Top
        if (!this._composerView.meshView.meshViewer.mesh.fileIsSynchronized)
        {
            const modelModelGroup = this.modelViewer.modelGroup;
            const modelViewerAspectRatio = this.modelViewer.aspectRatio;
            this.activeMeshReliefCamera.viewCamera = CameraHelper.getStandardViewCamera(StandardView.Top, this.activeMeshReliefCamera.viewCamera, modelViewerAspectRatio, modelModelGroup);
        }

        // model camera = relief camera (default clipping planes)
        const modelViewCamera = this.activeMeshReliefCamera.viewCamera.clone();

        // WIP: Set far plane based on model extents to avoid clipping
        const boundingPlanes = this.activeMeshReliefCamera.getBoundingClippingPlanes(this.modelViewer.modelGroup);

        modelViewCamera.near = Defaults.camera.nearClippingPlane;
        modelViewCamera.far = Defaults.camera.farClippingPlane;
        modelViewCamera.updateProjectionMatrix();

        this.modelViewer.camera = modelViewCamera;
    }
}
