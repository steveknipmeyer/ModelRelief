// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {ElementAttributes, ElementIds} from "Scripts/System/Html";
import {SystemSettings} from "Scripts/System/SystemSettings";
import {ModelViewer} from "Scripts/Viewers/ModelViewer";

/**
 * @class
 * ModelViewer Settings
 */
class ModelViewerSettings {

    public displayGrid: boolean;

    constructor() {

        this.displayGrid    = true;
    }
}

/**
 * ModelViewer UI Controls.
 */
export class ModelViewerControls {

    private _modelViewer: ModelViewer;                               // associated viewer
    private _modelViewerSettings: ModelViewerSettings;               // UI settings

    /**
     * Creates an instance of ModelViewerControls.
     * @param {ModelViewer} modelViewer
     */
    constructor(modelViewer: ModelViewer) {

        this._modelViewer = modelViewer;

        // UI Controls
        this.initializeControls();
    }

//#region Event Handlers
//#endregion

    /**
     * Initialize the view settings that are controllable by the user.
     */
    public initializeControls() {

        this._modelViewerSettings = new ModelViewerSettings();
    }
}
