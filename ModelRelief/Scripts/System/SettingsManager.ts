// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";
import {ContentType, HttpLibrary, MethodType, ServerEndPoints} from "Scripts/System/Http";
import {ISettings} from "Scripts/Api/V1/Interfaces/ISettings";
import {DtoSettings} from "Scripts/Api/V1/Models/DtoSettings";

/**
 * @description SettingsManager
 * @export
 * @class SettingsManager
 */
export class SettingsManager  {

    public static userSettings: ISettings;

    /**
     * @description Initialize the system settings variables.
     * @private
     * @static
     * @returns {Promise<void>}
     */
    public static async initialize(): Promise<void> {

        // Populate the shared settings from the JSON file.
        const endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiSettingsUser}`;
        const result = await HttpLibrary.submitHttpRequestAsync(endPoint, MethodType.Get, ContentType.Json, null);
        const settings = new DtoSettings(JSON.parse(result.contentString));

        this.userSettings = settings;
    }
}
