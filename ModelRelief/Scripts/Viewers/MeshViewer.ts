// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {FileModel} from "Scripts/Api/V1/Models/FileModel";
import {Graphics} from "Scripts/Graphics/Graphics";
import {Mesh3d} from "Scripts/Graphics/Mesh3d";
import {Mesh} from "Scripts/Models/Mesh/Mesh";
import {MeshViewerControls} from "Scripts/Viewers/MeshViewerControls";
import {Viewer} from "Scripts/Viewers/Viewer";
import * as THREE from "three";

/**
 * @description Graphics viewer for a Mesh.
 * @export
 * @class MeshViewer
 * @extends {Viewer}
 */
export class MeshViewer extends Viewer {

    public mesh: Mesh;                                        // active Mesh

    // Private
    private _meshViewerControls: MeshViewerControls;            // UI controls

    /**
     * Creates an instance of MeshViewer.
     * @param {string} name Viewer name.
     * @param {string} previewCanvasId HTML element to host the viewer.
     * @param {FileModel} model Model to load.
     */
    constructor(name: string, previewCanvasId: string, model?: FileModel) {

        super(name, previewCanvasId, model);

        this.mesh = model as Mesh;
    }

//#region Properties
//#endregion

//#region Initialization
    /**
     * @description Populate scene.
     */
    public populateScene() {

        const height = 1;
        const width  = 1;
        const mesh = Graphics.createPlaneMesh(new THREE.Vector3(), height, width, new THREE.MeshPhongMaterial(Mesh3d.DefaultMeshPhongMaterialParameters));
        mesh.rotateX(-Math.PI / 2);

        this._root.add(mesh);
    }

    /**
     * @description Adds lighting to the scene.
     */
    public initializeLighting() {

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff);
        directionalLight1.position.set(4, 4, 4);
        this.scene.add(directionalLight1);
    }

    /**
     * @description UI controls initialization.
     */
    public initializeUIControls() {

        const cameraControlOptions = {
            cameraHelper     : false,
            fieldOfView      : false,
            clippingControls : false,
        };
        super.initializeUIControls(cameraControlOptions);
        this._meshViewerControls = new MeshViewerControls(this);
    }
//#endregion
}
