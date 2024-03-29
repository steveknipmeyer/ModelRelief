﻿// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";

export enum ElementIds {
    // Home
    SubmitContactForm   = "submitContactForm",
    ReCAPTCHA           = "recaptcha",

    // NavBar
    ProjectMenuLabel    = "projectMenuLabel",
    ProjectMenu         = "projectMenu",

    // Composer
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

    BusyBar                     = "busyBar",

    // File Transfer
    UploadForm                  = "uploadForm",
    FileButton                  = "fileButton",
    DropArea                    = "dropArea",
    ProgressBarTemplate         = "progressBarTemplate",
    FormProgressBarContainer    = "formProgressBarContainer",
    DropProgressBarContainer    = "dropProgressBarContainer",

    // MeshTransform
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

    // Settings
    ExtendedCameraControls     = "extendedCameraControls",

    // Workbench
    CameraTestControls  = "cameraTestControls",
}

export enum ElementClasses {

    FitViewButton      = "fitViewButton",
    Highlight          = "highlight",
    StandardViewButton = "standardViewButton",
    StandardViewMenu   = "standardViewMenu",
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
