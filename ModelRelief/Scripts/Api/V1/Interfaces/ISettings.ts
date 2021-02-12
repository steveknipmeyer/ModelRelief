// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

/**
 * @description Settings collection.
 * @interface ISettings
 */
export interface ISettings {

    LoggingEnabled: boolean;
    DevelopmentUI: boolean;

    ModelViewerExtendedControls: boolean;
    MeshViewerExtendedControls: boolean;
    ExtendedCameraControls: boolean;

    DepthBufferViewVisible: boolean;
    NormalMapViewVisible: boolean;
}


