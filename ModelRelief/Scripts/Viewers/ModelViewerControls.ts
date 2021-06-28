// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";

import * as dat from "dat.gui";
import {ElementAttributes, ElementIds} from "Scripts/System/Html";
import {SettingsManager} from "Scripts/System/SettingsManager";
import {ModelViewer} from "Scripts/Viewers/ModelViewer";

/**
 * @class
 * ModelViewer Settings
 */
class ModelViewerSettings {

    public displayGrid: boolean;

    constructor() {

        this.displayGrid = true;
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
        if (SettingsManager.userSettings.modelViewerExtendedControls)
            this.initializeControls();
    }

    //#region Event Handlers
    //#endregion

    /**
     * Initialize the view settings that are controllable by the user
     */
    public initializeControls(): void {

        this._modelViewerSettings = new ModelViewerSettings();

        // Init dat.gui and controls for the UI
        const gui = new dat.GUI({
            autoPlace: false,
            width: ElementAttributes.DatGuiWidth,
        });
        gui.domElement.id = ElementIds.ModelViewerControls;

        // insert controls <after> Viewer container; class 'container-fluid' impacts layout
        const viewContainerDiv = document.getElementById(this._modelViewer.viewContainerId);
        viewContainerDiv.parentNode.insertBefore(gui.domElement, viewContainerDiv.nextSibling);

        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        //                                                                   ModelViewer                                                                //
        // ---------------------------------------------------------------------------------------------------------------------------------------------//
        const modelViewerOptions = gui.addFolder("ModelViewer Options");

        // Grid
        const controlDisplayGrid = modelViewerOptions.add(this._modelViewerSettings, "displayGrid").name("Display Grid");
        controlDisplayGrid.onChange((value: boolean) => {

            this._modelViewer.displayGrid(value);
        });
        modelViewerOptions.open();
    }
}
