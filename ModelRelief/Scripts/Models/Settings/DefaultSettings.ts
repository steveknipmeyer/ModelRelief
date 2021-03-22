// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {ContentType, HttpLibrary, MethodType, ServerEndPoints } from "Scripts/System/Http";
import {DefaultCameraSettings} from "Scripts/Models/Settings/DefaultCameraSettings";

/**
 * @description DefaultSettings
 * @export
 * @class DefaultSettings
 */
export class DefaultSettings  {

    public static camera: DefaultCameraSettings;

    /**
     * @description Initialize the default settings from the common JSON file used to share settings between the front end (FE) and back end (BE).
     * @static
     */
    public static async initialize(): Promise<void> {

        // Populate the shared settings from the JSON file.
        const endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiSettingsDefault}`;
        const result = await HttpLibrary.submitHttpRequestAsync(endPoint, MethodType.Get, ContentType.Json, null);
        const defaultSettings = JSON.parse(result.contentString);

        DefaultSettings.camera = new DefaultCameraSettings();
        DefaultSettings.camera.initialize(defaultSettings);
    }
}
