// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

export enum ElementIds {

    Root                = 'rootContainer',
    ComposerView        = 'composerView',
    ModelView           = 'modelView',
    ModelCanvas         = 'modelCanvas',
    MeshView            = 'meshView',
    MeshCanvas          = 'meshCanvas',
    DepthBufferView     = 'depthBufferView',
    DepthBufferCanvas   = 'depthBufferCanvas',

    CameraControls              = 'cameraControls',
    ModelViewerControls         = 'modelViewerControls',
    MeshViewerControls          = 'meshViewerControls',
    DepthBufferViewerControls   = 'depthBufferViewerControls',
    ComposerControls            = 'composerControls',

    // Workbench
    CameraTestControls  = 'cameraTestControls'
}

export let ElementAttributes = {

    DatGuiWidth :  256
}
        
/**
 * HTML Library
 * General HTML and DOM routines
 * @class
 */
export class HtmlLibrary {
    /**
     * @constructor
     */
    constructor() {
    }
}
