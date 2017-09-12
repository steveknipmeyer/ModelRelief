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
import {Logger, ConsoleLogger}              from 'Logger'
import {Graphics}                           from "Graphics"
import {ModelViewer}                        from "ModelViewer"
import {OBJExporter}                        from "OBJExporter"
import {Services}                           from 'Services'

/**
 * @class
 * ComposerViewSettings
 */
class ComposerViewSettings {

    _width                   : number;               // width of mesh (model units)
    _height                  : number;               // height of mesh (model units)
    _depth                   : number;               // depth of mesh (model units)

    _tauThreshold            : number;               // attenutation
    _sigmaGaussianBlur       : number;               // Gaussian blur
    _sigmaGaussianSmooth     : number;               // Gaussian smoothing
    _lambdaLinearScaling     : number;               // scaling

    generateRelief          : () => void;
    saveRelief              : () => void;

    constructor(generateRelief: () => any, saveRelief: () => any) {

        this._width                  = 100.0;
        this._height                 = 100.0;    
        this._depth                  =   5.0;    

        this._tauThreshold           = 1.0;    
        this._sigmaGaussianBlur      = 1.0;    
        this._sigmaGaussianSmooth    = 1.0;    
        this._lambdaLinearScaling    = 1.0;    
            
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
    saveMesh(): void {
        let exportTag = Services.timer.mark('Export OBJ');
        let exporter = new OBJExporter();
        let result = exporter.parse(this._relief.mesh);

        let request = new XMLHttpRequest();

        let viewerUrl = window.location.href;
        let postUrl = viewerUrl.replace('Viewer', 'SaveMesh');
        request.open("POST", postUrl, true);
        request.onload = function (oEvent) {
            // uploaded...
        };

        let blob = new Blob([result], { type: 'text/plain' });
        request.send(blob)

        Services.timer.logElapsedTime(exportTag);
    }        

    /**
     * Saves the depth buffer to a disk file.
     */
    saveDepthBuffer(): void {

        // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
        let exportTag = Services.timer.mark('Export DepthBuffer');

        let request = new XMLHttpRequest();

        let viewerUrl = window.location.href;
        let postUrl = viewerUrl.replace('Viewer', 'SaveDepthBuffer');
        request.open("POST", postUrl, true);       
        request.onload = function (oEvent) {
            // uploaded...
        };

        request.send(this._relief.depthBuffer);

        Services.timer.logElapsedTime(exportTag);
    }        
        
    /**
     * Saves the relief to a disk file.
     */
    saveRelief(): void {

        this.saveMesh();
        this.saveDepthBuffer();
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
        let controlMeshWidth  = dimensionsOptions.add(this._composerViewSettings, '_width').name('Width').min(minimum).max(maximum).step(stepSize).listen();
        let controlMeshHeight = dimensionsOptions.add(this._composerViewSettings, '_height').name('Height').min(minimum).max(maximum).step(stepSize).listen();
        let controlMeshDepth  = dimensionsOptions.add(this._composerViewSettings, '_depth').name('Depth').min(minimum).max(maximum).step(stepSize).listen();
        
        let reliefProcessingOptions = composerViewOptions.addFolder('Relief Processing');
        minimum  =    0.0;
        maximum  =    1.0;
        stepSize =    0.1;

        // Relief Processing Parameters
        let controlTauThreshold        = reliefProcessingOptions.add(this._composerViewSettings, '_tauThreshold').name('Tau Threshold').min(minimum).max(maximum).step(stepSize).listen();
        let controlSigmaGaussianBlur   = reliefProcessingOptions.add(this._composerViewSettings, '_sigmaGaussianBlur').name('Sigma Gaussian Blur').min(minimum).max(maximum).step(stepSize).listen();
        let controlSigmaGaussianSmooth = reliefProcessingOptions.add(this._composerViewSettings, '_sigmaGaussianSmooth').name('Sigma Gaussian Smooth').min(minimum).max(maximum).step(stepSize).listen();
        let controlLamdaLinearScaling  = reliefProcessingOptions.add(this._composerViewSettings, '_lambdaLinearScaling').name('Lambda Linear Scaling').min(minimum).max(maximum).step(stepSize).listen();
        
        // Generate Relief
        let controlGenerateRelief = reliefProcessingOptions.add(this._composerViewSettings, 'generateRelief').name('Generate Relief');

        // Save Relief
        let controlSaveRelief = reliefProcessingOptions.add(this._composerViewSettings, 'saveRelief').name('Save Relief');

        composerViewOptions.open();
        dimensionsOptions.open();
        reliefProcessingOptions.open();
    }    
}
