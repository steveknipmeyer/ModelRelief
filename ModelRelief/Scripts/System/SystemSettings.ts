// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import { ContentType, HttpLibrary, MethodType } from "Scripts/System/Http";

/**
 * @description JSON system settings.
 * @interface ISystemSettings
 */
export interface ISystemSettings {

    LoggingEnabled: boolean;
    DevelopmentUI: boolean;
}

/**
 * @description SystemSettings
 * @export
 * @class SystemSettings
 */
export class SystemSettings  {
    public static loggingEnabled: boolean;
    public static developmentUI: boolean;

    /**
     * @description Initialize the system settings from the common JSON file used to share settings between the front end (FE) and back end (BE).
     * @static
     */
    public static async initialize(): Promise<void> {

        // Populate the shared settings from the JSON file.
        const endPoint = `${HttpLibrary.HostRoot}settings/system`;
        const result = await HttpLibrary.submitHttpRequestAsync(endPoint, MethodType.Get, ContentType.Json, null);
        const systemSettings: ISystemSettings = JSON.parse(result.contentString) as unknown as ISystemSettings;

        SystemSettings.loggingEnabled = systemSettings.LoggingEnabled;
        SystemSettings.developmentUI  = systemSettings.DevelopmentUI;
    }
}
