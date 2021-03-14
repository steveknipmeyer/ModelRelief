// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import * as dat from "dat.gui";
import * as THREE from "three";

import {IThreeBaseCamera} from "Scripts/Graphics/IThreeBaseCamera";
import {Loader} from "Scripts/ModelLoaders/Loader";
import {TestModel} from "Scripts/ModelLoaders/TestModelLoader";
import {ElementAttributes, ElementIds} from "Scripts/System/Html";
import {Initializer} from "Scripts/System/Initializer";
import {ILogger} from "Scripts/System/Logger";
import {Services} from "Scripts/System/Services";
import {UnitTests} from "Scripts/UnitTests/UnitTests";
import {ModelView} from "Scripts/Views/ModelView";
import {Model3d} from "Scripts/Models/Model3d/Model3d";
import {Viewer} from "Scripts/Viewers/Viewer";

/**
 * @description ViewerControls
 * @class ViewerControls
 */
class ViewerControls {
    private _viewer: Viewer;

    /**
     * Creates an instance of ViewerControls.
     * @param {Viewer} viewer Viewer.
     */
    constructor(viewer: Viewer) {
        this._viewer = viewer;
    }

    public randomizedRoundTripCamera(): void {
        UnitTests.randomizedRoundTripCamera();
    }
    public roundTripCamera(): void {
        UnitTests.roundTripCamera(this._viewer);
    }

    public roundTripCameraMatrixCopy(): void {
        UnitTests.roundTripCameraMatrixCopy(this._viewer);
    }
    public roundTripCameraMatrixReconstruction(): void {
        UnitTests.roundTripCameraMatrixReconstruction(this._viewer);
    }

    public debugCamera(): void {
        UnitTests.debugCamera(this._viewer);
    }
    public debugInputController(): void {
        UnitTests.debugInputController(this._viewer);
    }

}

/**
 * @description Test application.
 * @export
 * @class CameraTest
 */
class CameraTest {

    public _logger: ILogger;
    public _loader: Loader;
    public _modelView: ModelView;
    public _viewerControls: ViewerControls;

    /**
     * Creates an instance of CameraTest.
     */
    constructor() {
        this._loader = new Loader();
    }


    /**
     * @description Initialize the view settings that are controllable by the user
     */
    public initializeViewerControls(): void {

        this._viewerControls = new ViewerControls(this._modelView.modelViewer);

        // Init dat.gui and controls for the UI
        const gui = new dat.GUI({
            autoPlace: false,
            width: ElementAttributes.DatGuiWidth,
        });
        gui.domElement.id = ElementIds.CameraTestControls;

        const settingsDiv = document.getElementById("cameraTestControls");
        settingsDiv.appendChild(gui.domElement);

        const roundTripOptions = gui.addFolder("Round Trip");
        // Randomized Round Trip Camera
        roundTripOptions.add(this._viewerControls, "randomizedRoundTripCamera").name("Random");
        // Roundtrip Camera
        roundTripOptions.add(this._viewerControls, "roundTripCamera").name("DTO");
        // Round Trip Camera Matrix Copy
        roundTripOptions.add(this._viewerControls, "roundTripCameraMatrixCopy").name("Matrix Copy");
        // Round Trip Camera Matrix Reconstruction
        roundTripOptions.add(this._viewerControls, "roundTripCameraMatrixReconstruction").name("Matrix Reconstruction");
        roundTripOptions.open();

        const debugOptions = gui.addFolder("Debug");
        // Debug Camera
        debugOptions.add(this._viewerControls, "debugCamera").name("Camera");
        // Debug InputController
        debugOptions.add(this._viewerControls, "debugInputController").name("InputController");
        debugOptions.open();
    }

    /**
     * @description Main
     */
    public run(): void {
        this._logger = Services.htmlLogger;
        UnitTests.logger = this._logger;

        Initializer.initialize().then((status: boolean) => {

            // Model View
            const testModel: Model3d = new Model3d();
            this._modelView = new ModelView(ElementIds.ModelView, testModel);

            const modelLoadedPromise: Promise<THREE.Group> = this._loader.loadParametricTestModelAsync(TestModel.Torus);
            modelLoadedPromise.then((theModel: THREE.Group) => {
                this._modelView.modelViewer.setModelGroup(theModel);
                this._modelView.modelViewer.fitView();

                // start render loop
                this._modelView.modelViewer.animate();
            });

            // UI Controls
            this.initializeViewerControls();
        });
    }
}

const cameraTest = new CameraTest();
cameraTest.run();
