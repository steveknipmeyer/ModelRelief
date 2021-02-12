// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";
import {ContentType, HttpLibrary, MethodType} from "Scripts/System/Http";
import {ISettings} from "Scripts/Api/V1/Interfaces/ISettings";
import {Settings} from "Scripts/Models/Settings/Settings";

/**
 * @description SettingsManager
 * @export
 * @class SettingsManager
 */
export class SettingsManager  {

    public static userSettings: Settings = new Settings();

    /**
     * @description Initialize the system settings variables.
     * @private
     * @static
     * @returns {Promise<void>}
     */
    public static async initialize(): Promise<void> {

        // Populate the shared settings from the JSON file.
        const endPoint = `${HttpLibrary.HostRoot}settings/type/user`;
        const result = await HttpLibrary.submitHttpRequestAsync(endPoint, MethodType.Get, ContentType.Json, null);
        const settings: ISettings = JSON.parse(result.contentString) as unknown as ISettings;

        this.userSettings.LoggingEnabled = settings.LoggingEnabled;
        this.userSettings.DevelopmentUI = settings.DevelopmentUI;

        this.userSettings.ModelViewerExtendedControls = settings.ModelViewerExtendedControls;
        this.userSettings.MeshViewerExtendedControls = settings.MeshViewerExtendedControls;
        this.userSettings.ExtendedCameraControls = settings.ExtendedCameraControls;

        this.userSettings.DepthBufferViewVisible = settings.DepthBufferViewVisible;
        this.userSettings.NormalMapViewVisible = settings.NormalMapViewVisible;
    }
}
