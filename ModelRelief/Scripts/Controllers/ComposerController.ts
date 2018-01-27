// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'
import * as Dto    from "DtoModels";

import {StandardView}                       from "Camera"
import {ComposerView}                       from "ComposerView"
import {DepthBufferFactory}                 from "DepthBufferFactory"
import {EventManager, EventType, MREvent}   from 'EventManager'
import {ElementAttributes, ElementIds}      from "Html"
import {ContentType, HttpLibrary, 
        MethodType, ServerEndPoints}        from "Http"
import {DepthBufferFormat}                  from 'IDepthBuffer'
import {MeshFormat}                         from 'IMesh'
import {ILogger, ConsoleLogger}             from 'Logger'
import {Graphics}                           from "Graphics"
import {Mesh, Relief}                       from "Mesh"
import {ModelViewer}                        from "ModelViewer"
import {OBJExporter}                        from "OBJExporter"
import {MeshTransform}                      from 'MeshTransform'
import {Services}                           from 'Services'

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
            lambdaLinearScaling    : 1.0    
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
    _relief               : Relief;                             // last relief generation result
    
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

        // DepthBuffer (binary)
        let widthPixels = 512;    
        let heightPixels = widthPixels / this._composerView.modelView.modelViewer.aspectRatio;
        let factory = new DepthBufferFactory({ width: widthPixels, height: heightPixels, model: this._composerView.modelView.modelViewer.model, camera: this._composerView.modelView.modelViewer.camera, addCanvasToDOM: false });
        let depthBuffer = factory.createDepthBuffer();

        // N.B. This step will be last. The mesh (DepthBuffer.Raw) will be acquired by a GET against the Mesh API.    
        //      The Mesh will be constructed from the GET object.
        let mesh = new Mesh({ width: widthPixels, height: heightPixels, depthBuffer: depthBuffer});
        this._relief = await mesh.generateReliefAsync({});

        // Model

        // Camera
        let cameraModel: Dto.Camera = await this.postCameraAsync();
        
        // DepthBufffer(Model, Camera)
        let depthBufferModel: Dto.DepthBuffer = await this.postDepthBufferAsync(cameraModel);

        // MeshTransform
        let meshTransformModel: Dto.MeshTransform = await this.postMeshTransformAsync();

        // Mesh(DepthBuffer, MeshTransform)
        let meshModel: Dto.Mesh = await this.postMeshAsync(depthBufferModel, meshTransformModel);

        // Mesh file generation
        meshModel.fileIsSynchronized = true;
        await meshModel.putAsync();

        this._composerView._meshView.meshViewer.setModel(this._relief.mesh);
        if (this._initialMeshGeneration) {
            this._composerView._meshView.meshViewer.fitView();
            this._initialMeshGeneration = false;
        }
    }

    /**
     * Saves the Camera.
     */
    async postCameraAsync(): Promise<Dto.Camera> {

        let camera = new Dto.Camera({
            name: 'DynamicCamera',
            description: 'Dynamic Camera Description',
            position: new THREE.Vector3(100, 100, 200)
        });
        var newModel = await camera.postAsync();

        return newModel;
    }        
    
    /**
     * Saves the DepthBuffer.
     */
    async postDepthBufferAsync(camera : Dto.Camera): Promise<Dto.DepthBuffer> {


        let depthBuffer = new Dto.DepthBuffer({
            name: 'DepthBuffer.raw',
            description: 'DepthBuffer Description',
            format: DepthBufferFormat.RAW,
            cameraId: camera.id,
        });
        var newModel = await depthBuffer.postFileAsync(this._relief.depthBuffer.depths);

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
            name: 'DynamicMesh',
            format: MeshFormat.RAW,
            description: 'Mesh Description',
            depthBufferId: depthBuffer.id,
            meshTransformId: meshTransform.id,
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
