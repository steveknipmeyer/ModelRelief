// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'

import {StandardView}                       from "Camera"
import {ComposerView}                       from "ComposerView"
import {DepthBufferFactory, Relief}         from "DepthBufferFactory"
import {EventManager, EventType, MREvent}   from 'EventManager'
import {ElementAttributes, ElementIds}      from "Html"
import {HttpLibrary, ServerEndPoints}       from "Http"
import {Logger, ConsoleLogger}              from 'Logger'
import {Graphics}                           from "Graphics"
import {ModelViewer}                        from "ModelViewer"
import {OBJExporter}                        from "OBJExporter"
import {ReliefSettings}                     from 'Relief'
import {Services}                           from 'Services'

/**
 * @class
 * ComposerViewSettings
 */
class ComposerViewSettings {

    meshSettings    : ReliefSettings;

    generateRelief  : () => void;
    saveRelief      : () => void;

    constructor(generateRelief: () => any, saveRelief: () => any) {

        this.meshSettings = {
            width                  : 100.0,
            height                 : 100.0,    
            depth                  :   5.0,    
    
            tauThreshold           : 1.0,    
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
    generateRelief() : void { 

        // pixels
        let width = 512;
        let height = width / this._composerView.modelView.modelViewer.aspectRatio;
        let factory = new DepthBufferFactory({ width: width, height: height, model: this._composerView.modelView.modelViewer.model, camera: this._composerView.modelView.modelViewer.camera, addCanvasToDOM: false });

        this._relief = factory.generateRelief({});

        this._composerView._meshView.meshViewer.setModel(this._relief.mesh);
        if (this._initialMeshGeneration) {
            this._composerView._meshView.meshViewer.fitView();
            this._initialMeshGeneration = false;
        }
       
        // Services.consoleLogger.addInfoMessage('Relief generated');
    }

    /**
     * Saves the relief to a disk file.
     */
    postMesh(): void {

        let exportTag = Services.timer.mark('Export OBJ');
        let exporter = new OBJExporter();
        let result = exporter.parse(this._relief.mesh);

        let postUrl = `${window.location.protocol}//${window.location.host}/${ServerEndPoints.ApiMeshes}`;

        let fileMetadata = {
            name : 'mesh.obj',
            description : 'Mesh Description',
            format : 1,
        };
        HttpLibrary.postFile (postUrl, result, fileMetadata);
        Services.timer.logElapsedTime(exportTag);
    }        

    /**
     * Saves the depth buffer to a disk file.
     */
    postDepthBuffer(): void {

        // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
        let exportTag = Services.timer.mark('Export DepthBuffer');

        let postUrl = `${window.location.protocol}//${window.location.host}/${ServerEndPoints.ApiDepthBuffers}`;
        
        let fileMetadata = {
            name : 'depthbuffer.raw',
            description : 'DepthBuffer Description',
            format : 1,
        };
        HttpLibrary.postFile (postUrl, this._relief.depthBuffer, fileMetadata);
        Services.timer.logElapsedTime(exportTag);
    }        
        
    /**
     * Saves the relief to a disk file.
     */
    saveRelief(): void {

        this.postMesh();
        this.postDepthBuffer();
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

        this._composerViewSettings = new ComposerViewSettings(this.generateRelief.bind(this), this.saveRelief.bind(this));

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
        let controlMeshWidth  = dimensionsOptions.add(this._composerViewSettings.meshSettings, 'width').name('Width').min(minimum).max(maximum).step(stepSize).listen();
        let controlMeshHeight = dimensionsOptions.add(this._composerViewSettings.meshSettings, 'height').name('Height').min(minimum).max(maximum).step(stepSize).listen();
        let controlMeshDepth  = dimensionsOptions.add(this._composerViewSettings.meshSettings, 'depth').name('Depth').min(minimum).max(maximum).step(stepSize).listen();
        
        let reliefProcessingOptions = composerViewOptions.addFolder('Relief Processing');
        minimum  =    0.0;
        maximum  =    1.0;
        stepSize =    0.1;

        // Relief Processing Parameters
        let controlTauThreshold        = reliefProcessingOptions.add(this._composerViewSettings.meshSettings, 'tauThreshold').name('Tau Threshold').min(minimum).max(maximum).step(stepSize).listen();
        let controlSigmaGaussianBlur   = reliefProcessingOptions.add(this._composerViewSettings.meshSettings, 'sigmaGaussianBlur').name('Sigma Gaussian Blur').min(minimum).max(maximum).step(stepSize).listen();
        let controlSigmaGaussianSmooth = reliefProcessingOptions.add(this._composerViewSettings.meshSettings, 'sigmaGaussianSmooth').name('Sigma Gaussian Smooth').min(minimum).max(maximum).step(stepSize).listen();
        let controlLamdaLinearScaling  = reliefProcessingOptions.add(this._composerViewSettings.meshSettings, 'lambdaLinearScaling').name('Lambda Linear Scaling').min(minimum).max(maximum).step(stepSize).listen();
        
        // Generate Relief
        let controlGenerateRelief = reliefProcessingOptions.add(this._composerViewSettings, 'generateRelief').name('Generate Relief');

        // Save Relief
        let controlSaveRelief = reliefProcessingOptions.add(this._composerViewSettings, 'saveRelief').name('Save Relief');

        composerViewOptions.open();
        dimensionsOptions.open();
        reliefProcessingOptions.open();
    }    
}
