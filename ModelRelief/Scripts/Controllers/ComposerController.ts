// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'
import * as Dto    from "DtoModels";

import { assert }                             from 'chai';
import { Camera }                             from "Camera"
import { CameraHelper }                       from "CameraHelper"
import { ComposerView }                       from "ComposerView"
import { DepthBuffer }                        from "DepthBuffer"
import { DepthBufferFactory }                 from "DepthBufferFactory"
import { EventManager, EventType, MREvent }   from 'EventManager'
import { ElementAttributes, ElementIds }      from "Html"
import { ContentType, HttpLibrary, 
         MethodType, ServerEndPoints }        from "Http"
import { StandardView }                       from "ICamera"
import { Mesh }                               from "Mesh"
import { MeshTransform }                      from 'MeshTransform'
import { MeshViewer }                         from "MeshViewer"
import { Model3d }                            from "Model3d"
import { ModelViewer }                        from "ModelViewer"
import { UnitTests }                          from 'UnitTests';

/**
 * @description ComposerViewSettings
 * @class ComposerViewSettings
 */
class ComposerViewSettings {

    meshTransform    : MeshTransform;

    generateRelief  : () => void;
    saveRelief      : () => void;
    /**
     * Creates an instance of ComposerViewSettings.
     * @param {() => any} generateRelief 
     * @param {() => any} saveRelief 
     */
    constructor(meshtransform : MeshTransform, generateRelief: () => any, saveRelief: () => any) {

        this.meshTransform = meshtransform;
        
        this.generateRelief = generateRelief;
        this.saveRelief     = saveRelief;
    }
}

/**
 * @description Composer Controller
 * @export
 * @class ComposerController
 */
export class ComposerController {

    static DefaultReliefDimensions : number  = 512;             // relief dimensions

    _composerView         : ComposerView;                       // application view
    _composerViewSettings : ComposerViewSettings;               // UI settings

    _reliefWidthPixels  : number;                               // relief width
    _reliefHeightPixels : number;                               // relief height 

    _initialMeshGeneration: boolean = true;

    /**
     * Creates an instance of ComposerController.
     * @param {ComposerView} composerView Composer view.
     */
    constructor(composerView : ComposerView) {  

        this._composerView = composerView;

        this.initialize();
    }

//#region Properties

    /**
     * @description Active ModelViewer.
     * @readonly
     * @type {ModelViewer}
     */
    get modelViewer() : ModelViewer {
        return this._composerView._modelView.modelViewer;
    }

    /**
     * @description Active MeshViewer.
     * @readonly
     * @type {MeshViewer}
     */
    get meshViewer() : MeshViewer {
        return this._composerView._meshView.meshViewer;
    }

    /**
     * @description Active Model3d.
     * @readonly
     * @type {Model3d}
     */
    get activeModel3d() : Model3d {
        return this._composerView.mesh.depthBuffer.model3d;
    }

    /**
     * @description Active Mesh.
     * @readonly
     * @type {Mesh}
     */
    get activeMesh() : Mesh {
        return this._composerView.mesh;
    }

    /**
     * @description Active MeshTransform.
     * @readonly
     * @type {MeshTransform}
     */
    get activeMeshTransform() :MeshTransform {
        return this._composerView.mesh.meshTransform;
    }

    /**
     * @description Active DepthBuffer.
     * @readonly
     * @type {DepthBuffer}
     */
    get activeDepthBuffer() :DepthBuffer {
        return this._composerView.mesh.depthBuffer;
    }

    /**
     * @description Active Camera.
     * @readonly
     * @type {Camera}
     */
    get activeDepthBufferCamera() : Camera {
        return this._composerView.mesh.depthBuffer.camera;
    }

//#endregion

//#region Event Handlers
    /**
     * @description Event handler for new model.
     * @param {MREvent} event NewModel event.
     * @param {THREE.Group} modelGroup Newly loaded model.
     */
    onNewModel(event: MREvent, modelGroup: THREE.Group) {

        // model camera = depth buffer camera (default clipping planes)
        let modelViewCamera = this.activeDepthBufferCamera.viewCamera.clone();
        modelViewCamera.near = Camera.DefaultNearClippingPlane;
        modelViewCamera.far  = Camera.DefaultFarClippingPlane;
        modelViewCamera.updateProjectionMatrix();
        this.modelViewer.camera = modelViewCamera;

        this.meshViewer.setCameraToStandardView(StandardView.Top);
    }

    /**
     * @description Generates a relief from the current model camera.
     * @returns {Promise<void>} 
     */
    async generateReliefAsync() : Promise<void> { 

        // Camera
        let cameraModel: Dto.Camera = await this.updateCameraAsync();
        
        // DepthBufffer
        let depthBufferModel: Dto.DepthBuffer = await this.updateDepthBufferAsync();

        // MeshTransform
        let meshTransformModel: Dto.MeshTransform = await this.updateMeshTransformAsync();

        // Mesh
        let meshModel: Dto.Mesh = await this.updateMeshAsync();

        // Mesh graphics
        let meshGraphics = await this.activeMesh.constructGraphicssAsync();

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
    async updateCameraAsync(): Promise<Dto.Camera> {

        // copy view camera so we can optimize clipping planes
        let modelViewCameraClone = this.modelViewer.camera.clone(true);
        CameraHelper.finalizeClippingPlanes(modelViewCameraClone, this.modelViewer.modelGroup);
        this.activeDepthBufferCamera.viewCamera = modelViewCameraClone;

        // update
        let depthBufferCameraModel : Dto.Camera = await this.activeDepthBufferCamera.toDtoModel().putAsync();

        return depthBufferCameraModel; 
    }        
    
    /**
     * @description Updates the DepthBuffer.
     * @returns {Promise<Dto.DepthBuffer>} 
     */
    async updateDepthBufferAsync(): Promise<Dto.DepthBuffer> {

        // generate new DepthBuffer from active Camera
        let canvasElement = this._composerView.depthBufferView.depthBufferViewer.canvas;
        let factory = new DepthBufferFactory({ canvas : canvasElement, width: this._reliefWidthPixels, height: this._reliefHeightPixels, modelGroup: this.modelViewer.modelGroup, camera: this.activeDepthBufferCamera});
        let factoryDepthBuffer = await factory.createDepthBufferAsync();

        // metadata
        this.activeDepthBuffer.width  = this._reliefWidthPixels;
        this.activeDepthBuffer.height = this._reliefHeightPixels;
        let depthBufferModel : Dto.DepthBuffer = await this.activeDepthBuffer.toDtoModel().putAsync();

        // file
        this.activeDepthBuffer.depths = factoryDepthBuffer.depths;
        depthBufferModel = await depthBufferModel.postFileAsync(this.activeDepthBuffer.depths);
        
        return depthBufferModel;
    }        

    /**
     * @description Updates the MeshTransform.
     * @returns {Promise<Dto.MeshTransform>} 
     */
    async updateMeshTransformAsync(): Promise<Dto.MeshTransform> {

        let updatedMeshTransform = await this.activeMeshTransform.toDtoModel().putAsync();

        return updatedMeshTransform;
    }        

    /**
     * @description Updates the Mesh.
     * @returns {Promise<Dto.Mesh>} 
     */
    async updateMeshAsync(): Promise<Dto.Mesh> {

        this.activeMesh.fileIsSynchronized = true;

        let updateMeshModel = this.activeMesh.toDtoModel().putAsync();

        return updateMeshModel;
    }        
        
    /**
     * @description Saves the relief.
     */
    saveRelief() {

        // WIP: Save the Mesh as an OBJ format file?
        // It may be more efficient to maintain Meshes in raw format since the size is substantially smaller.

        // WIP: Randomly generated cameras do not rountrip the matrix property. However, cameras created and manipulated through views work fine.
        // UnitTests.cameraRoundTrip();

        let camera = new Camera({}, this.modelViewer.camera);
        let cameraModel = camera.toDtoModel();
        Camera.fromDtoModelAsync(cameraModel).then((cameraRoundtrip) => {

            UnitTests.comparePerspectiveCameras(camera.viewCamera, cameraRoundtrip.viewCamera);

            this.modelViewer.camera = cameraRoundtrip.viewCamera;
        });
    }

    //#endregion

    /**
     * @description Initialization.
     */
    initialize() {

        this.modelViewer.eventManager.addEventListener(EventType.NewModel, this.onNewModel.bind(this));

        // overall dimensions
        this._reliefWidthPixels  = ComposerController.DefaultReliefDimensions;    
        this._reliefHeightPixels = this._reliefWidthPixels / this.modelViewer.aspectRatio;

        this.initializeUIControls();
    }
    
    /**
     * @description Initialize the view settings that are controllable by the user
     */
    initializeUIControls() {

        let scope = this;

        this._composerViewSettings = new ComposerViewSettings(this.activeMeshTransform, this.generateReliefAsync.bind(this), this.saveRelief.bind(this));

        // Init dat.gui and controls for the UI
        let gui = new dat.GUI({
            autoPlace: false,
            width: ElementAttributes.DatGuiWidth
        });
        gui.domElement.id = ElementIds.ComposerControls;

        let containerDiv = document.getElementById(this._composerView.containerId);
        containerDiv.appendChild(gui.domElement);
        let minimum     : number;
        let maximum     : number;
        let stepSize    : number;

        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        //                                                                   ModelRelief                                                                //      
        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        let composerViewOptions = gui.addFolder('Composer Options');

        let dimensionsOptions = composerViewOptions.addFolder('Mesh Dimensions');
        minimum  =    1.0;
        maximum  = 1000.0;
        stepSize =    1.0;

        // Mesh Dimensions
        let controlMeshWidth  = dimensionsOptions.add(this._composerViewSettings.meshTransform, 'width').name('Width').min(minimum).max(maximum).step(stepSize).listen();
        let controlMeshHeight = dimensionsOptions.add(this._composerViewSettings.meshTransform, 'height').name('Height').min(minimum).max(maximum).step(stepSize).listen();
        let controlMeshDepth  = dimensionsOptions.add(this._composerViewSettings.meshTransform, 'depth').name('Depth').min(minimum).max(maximum).step(stepSize).listen();
        
        let reliefProcessingOptions = composerViewOptions.addFolder('Relief Processing');
        minimum  =    0.0;
        maximum  =    1.0;
        stepSize =    0.1;

        // Relief Processing Parameters
        let controlTau                 = reliefProcessingOptions.add(this._composerViewSettings.meshTransform, 'tau').name('Tau Threshold').min(minimum).max(maximum).step(stepSize).listen();
        let controlSigmaGaussianBlur   = reliefProcessingOptions.add(this._composerViewSettings.meshTransform, 'sigmaGaussianBlur').name('Sigma Gaussian Blur').min(minimum).max(maximum).step(stepSize).listen();
        let controlSigmaGaussianSmooth = reliefProcessingOptions.add(this._composerViewSettings.meshTransform, 'sigmaGaussianSmooth').name('Sigma Gaussian Smooth').min(minimum).max(maximum).step(stepSize).listen();
        let controlLamdaLinearScaling  = reliefProcessingOptions.add(this._composerViewSettings.meshTransform, 'lambdaLinearScaling').name('Lambda Linear Scaling').min(minimum).max(maximum).step(stepSize).listen();
        
        // Generate Relief
        let controlGenerateRelief = reliefProcessingOptions.add(this._composerViewSettings, 'generateRelief').name('Generate Relief');

        // Save Relief
        let controlSaveRelief = reliefProcessingOptions.add(this._composerViewSettings, 'saveRelief').name('Save Relief');

        composerViewOptions.open();
        dimensionsOptions.open();
        reliefProcessingOptions.open();
    }    
}
