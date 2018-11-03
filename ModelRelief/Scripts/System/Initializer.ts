// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";
import {CameraSettings} from "Scripts/Models/Camera/CameraSettings";

/**
 * @description CameraSettings
 * @export
 * @class CameraSettings
 */
export class Initializer  {

    /**
     * @description Performs system initialization.
     * @static
     */
    public static initialize() {

        // shared Camera settings with backend
        CameraSettings.initialize();
        }
}
