// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {IModel} from "Scripts/Api/V1/Interfaces/IModel";

/**
 * @description Settings collection.
 * @interface ISettings
 */
export interface ISettings extends IModel {

    loggingEnabled?: boolean;
    developmentUI?: boolean;

    modelViewerExtendedControls?: boolean;
    meshViewerExtendedControls?: boolean;
    extendedCameraControls?: boolean;

    depthBufferViewVisible?: boolean;
    normalMapViewVisible?: boolean;
}
