// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";

import {DtoModel} from "Scripts/Api/V1/Base/DtoModel";
import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {ISettings} from "Scripts/Api/V1/Interfaces/ISettings";
import {HttpLibrary, ServerEndPoints} from "Scripts/System/Http";
/**
 * Concrete implementation of ISettings.
 * @class
 */
export class DtoSettings extends DtoModel<DtoSettings> implements ISettings {

    public loggingEnabled: boolean;
    public developmentUI: boolean;

    public modelViewerExtendedControls: boolean;
    public meshViewerExtendedControls: boolean;
    public extendedCameraControls: boolean;

    public depthBufferViewVisible: boolean;
    public normalMapViewVisible: boolean;

    /**
     * Creates an instance of a Settings.
     * @param {DtoSettings} parameters
     */
    constructor(parameters: ISettings = {}) {

        super(parameters);

        this.endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiSettings}`;

        const {
            loggingEnabled,
            developmentUI,

            modelViewerExtendedControls,
            meshViewerExtendedControls,
            extendedCameraControls,

            depthBufferViewVisible,
            normalMapViewVisible,

        } = parameters;

        this.loggingEnabled = loggingEnabled;
        this.developmentUI = developmentUI;

        this.modelViewerExtendedControls = modelViewerExtendedControls;
        this.meshViewerExtendedControls = meshViewerExtendedControls;
        this.extendedCameraControls = extendedCameraControls;

        this.depthBufferViewVisible = depthBufferViewVisible;
        this.normalMapViewVisible = normalMapViewVisible;
    }

    /**
     * @description Constructs an instance of a Settings.
     * @param {IModel} parameters : DtoSettings
     * @returns {DtoSettings}
     */
    public factory(parameters: IModel): DtoSettings {
        return new DtoSettings(parameters);
    }
}
