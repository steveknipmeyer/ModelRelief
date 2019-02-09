// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";
import {DefaultCameraSettings} from "Scripts/Models/Camera/DefaultCameraSettings";
import {ElementIds} from "Scripts/System/Html";
import {SystemSettings} from "Scripts/System/SystemSettings";

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
    public static async initialize(): Promise<boolean> {

        // verify WebGL
        if (!WEBGL.isWebGLAvailable()) {
            const warning = WEBGL.getWebGLErrorMessage();
            document.getElementById(ElementIds.Root).appendChild(warning);
            return false;
        }

        // shared Camera settings with backend
        await DefaultCameraSettings.initialize();

        // shared System settings with backend
        await SystemSettings.initialize();

        return true;
        }
}
