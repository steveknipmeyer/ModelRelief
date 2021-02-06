// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

export enum ElementIds {

    Root                = "rootContainer",
    ComposerView        = "composerView",
    ModelView           = "modelView",
    ModelCanvas         = "modelCanvas",
    MeshView            = "meshView",
    MeshCanvas          = "meshCanvas",
    DepthBufferView     = "depthBufferView",
    DepthBufferCanvas   = "depthBufferCanvas",
    NormalMapView       = "normalMapView",
    NormalMapCanvas     = "normalMapCanvas",

    CameraControls              = "cameraControls",
    ComposerControls            = "composerControls",
    DepthBufferViewerControls   = "depthBufferViewerControls",
    MeshViewerControls          = "meshViewerControls",
    ModelViewerControls         = "modelViewerControls",
    NormalMapViewerControls     = "normalMapViewerControls",

    ProgressBar                 = "progressBar",

    GradientThresholdEnabled    = "gradientThresholdEnabled",
    GradientThreshold           = "gradientThreshold",
    AttenuationEnabled          = "attenuationEnabled",
    AttenuationFactor           = "attenuationFactor",
    UnsharpMaskingEnabled       = "unsharpMaskingEnabled",
    UnsharpGaussianLow          = "unsharpGaussianLow",
    UnsharpHighFrequencyScale   = "unsharpHighFrequencyScale",
    SilhouetteEnabled           = "silhouetteEnabled",
    SilhouetteEdgeWidth         = "silhouetteEdgeWidth",
    MeshScale                   = "meshScale",

    GenerateMesh                = "generateMesh",

    // Workbench
    CameraTestControls  = "cameraTestControls",
}

export enum ElementClasses {

    StandardViewButton = "standardViewButton",
    StandardViewMenu   = "standardViewMenu",
    FitViewButton      = "fitViewButton",
}

export const ElementAttributes = {

    DatGuiWidth :  256,
};

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
        // NOP
    }
}
