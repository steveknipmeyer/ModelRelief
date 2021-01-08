// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE from "three";

import {FileModel} from "Scripts/Api/V1/Models/FileModel";
import {Model3d} from "Scripts/Models/Model3d/Model3d";
import {EventType} from "Scripts/System/EventManager";
import {Viewer} from "Scripts/Viewers/Viewer";

const ObjectNames = {
    Grid :  "Grid",
};

/**
 * @description Represents a graphic viewer for a 3D model.
 * @export
 * @class ModelViewer
 * @extends {Viewer}
 */
export class ModelViewer extends Viewer {

    public model3d: Model3d;                                      // active Model3d

    /**
     * Creates an instance of ModelViewer.
     * @param {string} name Viewer name.
     * @param {string} viewContainerId Container of the view. The view holds the controls.
     * @param {string} modelCanvasId HTML element to host the viewer.
     * @param {FileModel} model Model to load.
     */
    constructor(name: string, viewContainerId: string, modelCanvasId: string, model: FileModel) {

        super (name, viewContainerId, modelCanvasId, model);

        this.model3d = model as Model3d;
    }

//#region Properties
    /**
     * @description Sets the graphics of the model viewer.
     * @param {THREE.Group} modelGroup Graphics group to set.
     */
    public setModelGroup(modelGroup: THREE.Group): void {

        // Call base class property via super
        // https://github.com/Microsoft/TypeScript/issues/4465
        super.setModelGroup(modelGroup);

        // dispatch NewModel event
        this.eventManager.dispatchEvent(this, EventType.NewModel, modelGroup);
    }

//#endregion

//#region Initialization
    /**
     * @description Populate scene.
     */
    public populateScene(): void {

        super.populateScene();

        const helper = new THREE.GridHelper(300, 30, 0x86e6ff, 0x999999);
        helper.name = ObjectNames.Grid;
        this.scene.add(helper);
    }

    /**
     * @description General initialization.
     */
    public initialize(): void {

        super.initialize();
    }

    /**
     * @description UI controls initialization.
     */
    public initializeUIControls(): void {

        super.initializeUIControls();
    }
//#endregion

//#region Scene
    /**
     * @description Display the reference grid.
     * @param {boolean} visible
     */
    public displayGrid(visible: boolean): void {

        const gridGeometry: THREE.Object3D = this.scene.getObjectByName(ObjectNames.Grid);
        gridGeometry.visible = visible;
        this._logger.addInfoMessage(`Display grid = ${visible}`);
    }
//#endregion
}
