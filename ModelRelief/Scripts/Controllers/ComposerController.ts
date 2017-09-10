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
import {DepthBufferFactory}                 from "DepthBufferFactory"
import {EventManager, EventType, MREvent}   from 'EventManager'
import {Loader}                             from 'Loader'
import {Logger, ConsoleLogger}              from 'Logger'
import {MeshViewer}                         from "MeshViewer"
import {ModelViewer}                        from "ModelViewer"
import {OBJLoader}                          from "OBJLoader"
import {Services}                           from 'Services'
import {Viewer}                             from "Viewer"
    
export class ComposerController {  

    _composerView            : ComposerView;

    /** Default constructor
     * @class ModelReliefController
     * @param composerView Mesh generation event.
     * @constructor
     */
    constructor(composerView : ComposerView) {  

        this._composerView = composerView;
        this.initialize();
    }

//#region Initialization
    /**
     * Initialziation.
     */
    initialize() {

        this._composerView._modelView.modelViewer.eventManager.addEventListener(EventType.NewModel, this.onNewModel.bind(this));
    }
//#endregion

//#region Event Handlers
    /**
     * Event handler for mesh generation.
     * @param event Mesh generation event.
     * @param mesh Newly-generated mesh.
     */
    onMeshGenerate (event : MREvent, mesh : THREE.Mesh) {

    }

    /**
     * Event handler for new model.
     * @param event NewModel event.
     * @param model Newly loaded model.
     */
    onNewModel (event : MREvent, model : THREE.Group) {
        
        this._composerView._modelView.modelViewer.setCameraToStandardView(StandardView.Front);              
        this._composerView._meshView.meshViewer.setCameraToStandardView(StandardView.Top);       
    }
//#endregion
}
