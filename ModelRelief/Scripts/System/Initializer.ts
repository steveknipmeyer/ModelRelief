// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";
import {WebGLDetector} from "Scripts/Graphics/WebGLDetector";
import {Defaults} from "Scripts/Models/Settings/Defaults";

import {ElementIds} from "Scripts/System/Html";
import {SettingsManager} from "Scripts/System/SettingsManager";
import {Services} from "Scripts/System/Services";

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

        // shared Camera settings
        await Defaults.initialize();

        // user settings
        await SettingsManager.initialize();

        // logging
        Services.consoleLogger.loggingEnabled = SettingsManager.userSettings.loggingEnabled;
        Services.htmlLogger.loggingEnabled = SettingsManager.userSettings.loggingEnabled;

        return true;
    }
}
