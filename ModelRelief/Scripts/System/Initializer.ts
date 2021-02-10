// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";
import {WebGLDetector} from "Scripts/Graphics/WebGLDetector";
import {DefaultCameraSettings} from "Scripts/Models/Camera/DefaultCameraSettings";
import {ElementIds} from "Scripts/System/Html";
import {ContentType, HttpLibrary, MethodType} from "Scripts/System/Http";
import {ISystemSettings, SystemSettings} from "Scripts/System/SystemSettings";

/**
 * @description CameraSettings
 * @export
 * @class CameraSettings
 */
export class Initializer  {

    /**
     * @description Initialize the system settings variables.
     * @private
     * @static
     * @returns {Promise<void>}
     */
    private static async initializeSystemSettings(): Promise<void> {

        // Populate the shared settings from the JSON file.
        const endPoint = `${HttpLibrary.HostRoot}settings/type/system`;
        const result = await HttpLibrary.submitHttpRequestAsync(endPoint, MethodType.Get, ContentType.Json, null);
        const systemSettings: ISystemSettings = JSON.parse(result.contentString) as unknown as ISystemSettings;

        SystemSettings.loggingEnabled = systemSettings.LoggingEnabled;
        SystemSettings.developmentUI  = systemSettings.DevelopmentUI;
    }

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
        await this.initializeSystemSettings();

        return true;
    }
}
