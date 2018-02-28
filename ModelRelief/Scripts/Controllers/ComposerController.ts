// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'
import * as Dto    from "DtoModels";

import {assert}                             from 'chai';
import {Camera}                             from "Camera"
import {CameraHelper}                       from "CameraHelper"
import {ComposerView}                       from "ComposerView"
import {DepthBuffer}                        from "DepthBuffer"
import {DepthBufferFactory}                 from "DepthBufferFactory"
import {EventManager, EventType, MREvent}   from 'EventManager'
import {ElementAttributes, ElementIds}      from "Html"
import {ContentType, HttpLibrary, 
        MethodType, ServerEndPoints}        from "Http"
import {StandardView}                       from "ICamera"
import {DepthBufferFormat}                  from 'IDepthBuffer'
import {MeshFormat}                         from 'IMesh'
import {ILogger, ConsoleLogger}             from 'Logger'
import {Graphics}                           from "Graphics"
import {Mesh}                               from "Mesh"
import {MeshTransform}                      from 'MeshTransform'
import {ModelViewer}                        from "ModelViewer"
import {OBJExporter}                        from "OBJExporter"
import {Services}                           from 'Services'
import {UnitTests}                          from 'UnitTests';

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

    _composerView         : ComposerView;                       // application view
    _composerViewSettings : ComposerViewSettings;               // UI settings

    _initialMeshGeneration: boolean = true;

    /**
     * Creates an instance of ComposerController.
     * @param {ComposerView} composerView Composer view.
     */
    constructor(composerView : ComposerView) {  

        this._composerView = composerView;

        this.initialize();
    }

//#region Event Handlers
    /**
     * @description Event handler for new model.
     * @param {MREvent} event NewModel event.
     * @param {THREE.Group} modelGroup Newly loaded model.
     */
    onNewModel(event: MREvent, modelGroup: THREE.Group) {

        // model camera = depth buffer camera (default clipping planes)
        let modelViewCamera = this._composerView._mesh.depthBuffer.camera.viewCamera.clone();
        modelViewCamera.near = Camera.DefaultNearClippingPlane;
        modelViewCamera.far  = Camera.DefaultFarClippingPlane;
        this._composerView._modelView.modelViewer.camera = modelViewCamera;

        this._composerView._meshView.meshViewer.setCameraToStandardView(StandardView.Top);
    }

    /**
     * @description Generates a relief from the current model camera.
     * @returns {Promise<void>} 
     */
    async generateReliefAsync() : Promise<void> { 

        // overall dimensions
        let reliefWidthPixels  = 512;    
        let reliefHeightPixels = reliefWidthPixels / this._composerView.modelView.modelViewer.aspectRatio;
       
        // Camera
        let cameraModel: Dto.Camera = await this.updateCameraAsync();
        
        // DepthBufffer
        let depthBufferModel: Dto.DepthBuffer = await this.updateDepthBufferAsync(cameraModel, reliefWidthPixels, reliefHeightPixels);

        // MeshTransform
        let meshTransformModel: Dto.MeshTransform = await this.updateMeshTransformAsync();

        // Mesh
        let meshModel: Dto.Mesh = await this.updateMeshAsync();

        // Mesh graphics
        let mesh = await Mesh.fromDtoModelAsync(meshModel);
        let meshGraphics = await mesh.constructGraphicssAsync();

        this._composerView._meshView.meshViewer.setModelGroup(meshGraphics);
        if (this._initialMeshGeneration) {
            this._composerView._meshView.meshViewer.fitView();
            this._initialMeshGeneration = false;
        }
    }

    /**
     * @description Updates the Camera.
     * @returns {Promise<Dto.Camera>} 
     */
    async updateCameraAsync(): Promise<Dto.Camera> {

        let depthBufferCamera : Camera = this._composerView._mesh.depthBuffer.camera;

        // copy view camera so we can optimize clipping planes
        let modelViewCameraClone = this._composerView.modelView.modelViewer.camera.clone(true);
        CameraHelper.finalizeClippingPlanes(modelViewCameraClone, this._composerView.modelView.modelViewer.modelGroup);
        depthBufferCamera.viewCamera = modelViewCameraClone;

        // update
        let depthBufferCameraModel : Dto.Camera = await depthBufferCamera.toDtoModel().putAsync();

        return depthBufferCameraModel; 
    }        
    
    /**
     * @description Updates the DepthBuffer.
     * @param {Dto.Camera} camera Perspective camera.
     * @param {number} widthPixels Width of buffer.
     * @param {number} heightPixels Hight of buffer.
     * @returns {Promise<Dto.DepthBuffer>} 
     */
    async updateDepthBufferAsync(camera : Dto.Camera, widthPixels: number, heightPixels: number): Promise<Dto.DepthBuffer> {

        // generate new DB 
        let depthBufferCamera = await Camera.fromDtoModelAsync(camera);
        let factory = new DepthBufferFactory({ width: widthPixels, height: heightPixels, modelGroup: this._composerView.modelView.modelViewer.modelGroup, camera: depthBufferCamera, addCanvasToDOM: false });
        let factoryDepthBuffer = await factory.createDepthBufferAsync();

        // metadata: no change to Camera or Model Ids
        let depthBuffer = this._composerView._mesh.depthBuffer;
        depthBuffer.width  = widthPixels;
        depthBuffer.height = heightPixels;
        let depthBufferModel : Dto.DepthBuffer = await depthBuffer.toDtoModel();
        depthBufferModel = await depthBufferModel.putAsync();

        // file
        depthBufferModel = await depthBufferModel.postFileAsync(factoryDepthBuffer.depths);
        
        return depthBufferModel;
    }        

    /**
     * @description Updates the MeshTransform.
     * @returns {Promise<Dto.MeshTransform>} 
     */
    async updateMeshTransformAsync(): Promise<Dto.MeshTransform> {

        let meshTransform = this._composerViewSettings.meshTransform;
        var updatedModel = await meshTransform.toDtoModel().putAsync();

        return updatedModel;
    }        

    /**
     * @description Updates the Mesh.
     * @returns {Promise<Dto.Mesh>} 
     */
    async updateMeshAsync(): Promise<Dto.Mesh> {

        let mesh = this._composerView._mesh;
        mesh.fileIsSynchronized = true;

        let meshModel = this._composerView._mesh.toDtoModel();
        let updatedMesh = await meshModel.putAsync();

        return updatedMesh;
    }        
        
    /**
     * @description Saves the relief.
     */
    saveRelief() {

        // WIP: Save the Mesh as an OBJ format file?
        // It may be more efficient to maintain Meshes in raw format since the size is substantially smaller.

        // WIP: Randomly generated cameras do not rountrip the matrix property. However, cameras created and manipulated through views work fine.
        // UnitTests.cameraRoundTrip();

        let camera = new Camera({}, this._composerView.modelView._modelViewer.camera);
        let cameraModel = camera.toDtoModel();
        Camera.fromDtoModelAsync(cameraModel).then((cameraRoundtrip) => {

            UnitTests.comparePerspectiveCameras(camera.viewCamera, cameraRoundtrip.viewCamera);

            this._composerView.modelView._modelViewer.camera = cameraRoundtrip.viewCamera;
        });
    }

    //#endregion

    /**
     * @description Initialization.
     */
    initialize() {

        this._composerView._modelView.modelViewer.eventManager.addEventListener(EventType.NewModel, this.onNewModel.bind(this));

        this.initializeUIControls();
    }
    
    /**
     * @description Initialize the view settings that are controllable by the user
     */
    initializeUIControls() {

        let scope = this;

        let meshTransform = this._composerView._mesh.meshTransform;
        this._composerViewSettings = new ComposerViewSettings(meshTransform, this.generateReliefAsync.bind(this), this.saveRelief.bind(this));

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
