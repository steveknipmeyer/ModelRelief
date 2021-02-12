// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";
import {ContentType, HttpLibrary, MethodType} from "Scripts/System/Http";

/**
 * @description JSON system settings.
 * @interface ISystemSettings
 */
export interface ISystemSettings {

    LoggingEnabled: boolean;
    DevelopmentUI: boolean;

    ModelViewerExtendedControls: boolean;
    MeshViewerExtendedControls: boolean;
    ExtendedCameraControls: boolean;

    DepthBufferViewVisible: boolean;
    NormalMapViewVisible: boolean;
    }

/**
 * @description SystemSettings
 * @export
 * @class SystemSettings
 */
export class SystemSettings  {
    public static loggingEnabled: boolean;
    public static developmentUI: boolean;

    public static modelViewerExtendedControls: boolean;
    public static meshViewerExtendedControls: boolean;

    public static extendedCameraControls: boolean;
    public static depthBufferViewVisible: boolean;
    public static normalMapViewVisible: boolean;

    /**
     * @description Initialize the system settings variables.
     * @private
     * @static
     * @returns {Promise<void>}
     */
    public static async initialize(): Promise<void> {

        // Populate the shared settings from the JSON file.
        const endPoint = `${HttpLibrary.HostRoot}settings/type/system`;
        const result = await HttpLibrary.submitHttpRequestAsync(endPoint, MethodType.Get, ContentType.Json, null);
        const systemSettings: ISystemSettings = JSON.parse(result.contentString) as unknown as ISystemSettings;

        SystemSettings.loggingEnabled = systemSettings.LoggingEnabled;
        SystemSettings.developmentUI = systemSettings.DevelopmentUI;

        SystemSettings.modelViewerExtendedControls = systemSettings.ModelViewerExtendedControls;
        SystemSettings.meshViewerExtendedControls = systemSettings.MeshViewerExtendedControls;
        SystemSettings.extendedCameraControls = systemSettings.ExtendedCameraControls;

        SystemSettings.depthBufferViewVisible = systemSettings.DepthBufferViewVisible;
        SystemSettings.normalMapViewVisible = systemSettings.NormalMapViewVisible;
    }
}
