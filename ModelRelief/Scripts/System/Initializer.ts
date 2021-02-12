// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";
import {WebGLDetector} from "Scripts/Graphics/WebGLDetector";
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
        const detector = new WebGLDetector();
        if (!detector.isWebGLAvailable()) {
            const warning = detector.getWebGLErrorMessage();
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
