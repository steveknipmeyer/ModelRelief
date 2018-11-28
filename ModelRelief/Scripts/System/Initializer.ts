// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";
import {DefaultCameraSettings} from "Scripts/Models/Camera/DefaultCameraSettings";
import {ElementIds} from "Scripts/System/Html";

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

        return true;
        }
}
