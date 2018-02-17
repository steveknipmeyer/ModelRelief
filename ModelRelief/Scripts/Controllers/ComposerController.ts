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
import {ModelViewer}                        from "ModelViewer"
import {OBJExporter}                        from "OBJExporter"
import {MeshTransform}                      from 'MeshTransform'
import {Services}                           from 'Services'
import {UnitTests}                          from 'UnitTests';

/**
 * @class
 * ComposerViewSettings
 */
class ComposerViewSettings {

    meshTransform    : MeshTransform;

    generateRelief  : () => void;
    saveRelief      : () => void;

    constructor(generateRelief: () => any, saveRelief: () => any) {

        this.meshTransform = {
            width                  : 100.0,
            height                 : 100.0,    
            depth                  :   5.0,    

            tau                    : 1.0,    
            sigmaGaussianBlur      : 1.0,    
            sigmaGaussianSmooth    : 1.0,    
            lambdaLinearScaling    : 1.0,
        }
            
        this.generateRelief = generateRelief;
        this.saveRelief     = saveRelief;
    }
}

/**
 * Composer Controller
 */    
export class ComposerController {

    _composerView         : ComposerView;                       // application view
    _composerViewSettings : ComposerViewSettings;               // UI settings

    _initialMeshGeneration: boolean = true;
    
    /** Default constructor
     * @class ComposerViewControls
     * @constructor
     */
    constructor(composerView : ComposerView) {  

        this._composerView = composerView;

        this.initialize();
    }

//#region Event Handlers
    /**
     * Event handler for new model.
     * @param event NewModel event.
     * @param model Newly loaded model.
     */
    onNewModel(event: MREvent, model: THREE.Group) {

        this._composerView._modelView.modelViewer.setCameraToStandardView(StandardView.Front);
        this._composerView._meshView.meshViewer.setCameraToStandardView(StandardView.Top);
    }

    /**
     * Generates a relief from the current model camera.
     */
    async generateReliefAsync() : Promise<void> { 

        // overall dimensions
        let reliefWidthPixels  = 512;    
        let reliefHeightPixels = reliefWidthPixels / this._composerView.modelView.modelViewer.aspectRatio;

        // Model
        // WIP: Connect the active THREE.Mesh to a Model3d model.
        
        // Camera
        let cameraModel: Dto.Camera = await this.postCameraAsync();
        
        // DepthBufffer(Model, Camera) 
        let depthBufferModel: Dto.DepthBuffer = await this.postDepthBufferAsync(cameraModel, reliefWidthPixels, reliefHeightPixels);

        // MeshTransform
        let meshTransformModel: Dto.MeshTransform = await this.postMeshTransformAsync();

        // Mesh(DepthBuffer, MeshTransform)
        let meshModel: Dto.Mesh = await this.postMeshAsync(depthBufferModel, meshTransformModel);

        // Mesh file generation
        meshModel.fileIsSynchronized = true;
        await meshModel.putAsync();

        // Mesh file
        let depthBufferBytes: Uint8Array = await meshModel.getFileAsync();

        // construct DepthBufffer from Mesh raw file
        let camera = Camera.fromDtoModel(cameraModel);
        let depthBuffer = new DepthBuffer(depthBufferBytes, reliefWidthPixels, reliefHeightPixels, camera.viewCamera);
        
        // Mesh graphics
        let mesh = new Mesh({ width: reliefWidthPixels, height: reliefHeightPixels, depthBuffer: depthBuffer});
        let meshGraphics = await mesh.constructGraphicssAsync({});

        this._composerView._meshView.meshViewer.setModel(meshGraphics);
        if (this._initialMeshGeneration) {
            this._composerView._meshView.meshViewer.fitView();
            this._initialMeshGeneration = false;
        }
    }

    /**
     * Saves the Camera.
     */
    async postCameraAsync(): Promise<Dto.Camera> {

        // copy view camera so we can optimize clipping planes
        let viewCameraClone = this._composerView.modelView.modelViewer.camera.clone(true);
        CameraHelper.finalizeClippingPlanes(viewCameraClone, this._composerView.modelView.modelViewer.model);

        let camera = new Camera(viewCameraClone);
        let cameraModel = camera.toDtoModel();

        var newModel = await cameraModel.postAsync();

        return newModel; 
    }        
    
    /**
     * Saves the DepthBuffer.
     */
    async postDepthBufferAsync(camera : Dto.Camera, widthPixels: number, heightPixels: number): Promise<Dto.DepthBuffer> {

        let depthBufferCamera = Camera.fromDtoModel(camera);
        let factory = new DepthBufferFactory({ width: widthPixels, height: heightPixels, model: this._composerView.modelView.modelViewer.model, camera: depthBufferCamera.viewCamera, addCanvasToDOM: false });

        let depthBuffer = factory.createDepthBuffer();

        let depthBufferModel = new Dto.DepthBuffer({
            name:       'DepthBuffer.raw',
            description:'DepthBuffer Description',
            width:      widthPixels,
            height:     heightPixels,            
            format:     DepthBufferFormat.RAW,
            cameraId:   camera.id,
        });
        var newModel = await depthBufferModel.postFileAsync(depthBuffer.depths);
        
        return newModel;
    }        

    /**
     * Saves the MeshTransform.
     */
    async postMeshTransformAsync(): Promise<Dto.MeshTransform> {

        let meshTransform = new Dto.MeshTransform(this._composerViewSettings.meshTransform);
        meshTransform.name = 'DynamicMeshTransform';
        var newModel = await meshTransform.postAsync();

        return newModel;
    }        

    /**
     * Saves the Mesh.
     */
    async postMeshAsync(depthBuffer : Dto.DepthBuffer, meshTransform : Dto.MeshTransform): Promise<Dto.Mesh> {

        let mesh = new Dto.Mesh({
            name:           'DynamicMesh',
            format:         MeshFormat.RAW,
            description:    'Mesh Description',
            depthBufferId:  depthBuffer.id,
            meshTransformId:meshTransform.id,
        });
        var newModel = await mesh.postAsync();

        return newModel;
    }        
        
    /**
     * Saves the relief.
     */
    saveRelief(): void {

        // WIP: Save the Mesh as an OBJ format file?
        // It may be more efficient to maintain Meshes in raw format since the size is substantially smaller.

        // WIP: Randomly generated cameras do not rountrip the matrix property. However, cameras created and manipulated through views work fine.
        // UnitTests.cameraRoundTrip();

        let camera = new Camera(this._composerView.modelView._modelViewer.camera);
        let cameraModel = camera.toDtoModel();
        let cameraRoundtrip = Camera.fromDtoModel(cameraModel);
        UnitTests.comparePerspectiveCameras(camera.viewCamera, cameraRoundtrip.viewCamera);

        this._composerView.modelView._modelViewer.camera = cameraRoundtrip.viewCamera;
    }

    //#endregion

    /**
     * Initialization.
     */
    initialize() {

        this._composerView._modelView.modelViewer.eventManager.addEventListener(EventType.NewModel, this.onNewModel.bind(this));

        this.initializeUIControls();
    }
    
    /**
     * Initialize the view settings that are controllable by the user
     */
    initializeUIControls() {

        let scope = this;

        this._composerViewSettings = new ComposerViewSettings(this.generateReliefAsync.bind(this), this.saveRelief.bind(this));

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
