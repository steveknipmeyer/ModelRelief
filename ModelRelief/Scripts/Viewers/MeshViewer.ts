// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";

import {FileModel} from "Scripts/Models/Base/FileModel";
import {Graphics} from "Scripts/Graphics/Graphics";
import {Mesh3d} from "Scripts/Graphics/Mesh3d";
import {Mesh} from "Scripts/Models/Mesh/Mesh";
import {Viewer} from "Scripts/Viewers/Viewer";
import * as THREE from "three";

/**
 * @description Graphics viewer for a Mesh.
 * @export
 * @class MeshViewer
 * @extends {Viewer}
 */
export class MeshViewer extends Viewer {

    // Public
    public mesh: Mesh;                                        // active Mesh

    /**
     * Creates an instance of MeshViewer.
     * @param {string} name Viewer name.
     * @param {string} viewContainerId Container of the view. The view holds the controls.
     * @param {string} previewCanvasId HTML canvas element to host the viewer.
     * @param {FileModel} model Model to load.
     */
    constructor(name: string, viewContainerId: string, previewCanvasId: string, model?: FileModel) {

        super(name, viewContainerId, previewCanvasId, model);

        this.mesh = model as Mesh;
    }

//#region Properties
//#endregion

//#region Initialization
    /**
     * @description Populate scene.
     */
    public populateScene(): void {

        const height = 1;
        const width  = 1;
        const mesh = Graphics.createPlaneMesh(new THREE.Vector3(), height, width, new THREE.MeshPhongMaterial(Mesh3d.DefaultMeshPhongMaterialParameters));
        mesh.rotateX(-Math.PI / 2);

        this.root.add(mesh);
    }

    /**
     * @description Adds lighting to the scene.
     */
    public initializeLighting(): void {

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff);
        directionalLight1.position.set(4, 4, 4);
        this.scene.add(directionalLight1);
    }

    /**
     * @description UI controls initialization.
     */
    public initializeUIControls(): void {

        super.initializeUIControls();
    }
//#endregion
}
