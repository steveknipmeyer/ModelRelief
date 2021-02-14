// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE from "three";

import {StandardView} from "Scripts/Api/V1/Interfaces/ICamera";
import {DtoMesh} from "Scripts/Api/V1/Models/DtoMesh";
import {Loader} from "Scripts/ModelLoaders/Loader";
import {TestModel} from "Scripts/ModelLoaders/TestModelLoader";
import {Mesh} from "Scripts/Models/Mesh/Mesh";
import {EventManager, EventType} from "Scripts/System/EventManager";
import {ElementIds} from "Scripts/System/Html";
import {Services} from "Scripts/System/Services";
import {DepthBufferView} from "Scripts/Views/DepthBufferView";
import {MeshView} from "Scripts/Views/MeshView";
import {ModelView} from "Scripts/Views/ModelView";
import {NormalMapView} from "Scripts/Views/NormalMapView";

// defined in Edit HTML page
declare let composerMeshModel: DtoMesh;

/**
 * @description Represents the UI view used to compose a relief.
 * @export
 * @class ComposerView
 */
export class ComposerView {

    public mesh: Mesh;

    public _containerId: string;

    public _meshView: MeshView;
    public _modelView: ModelView;
    public _depthBufferView: DepthBufferView;
    public _normalMapView: NormalMapView;

    // Private
    private _eventManager: EventManager = null;

    //#region Properties
    /**
     * @description Gets the Container Id.
     * @readonly
     * @type {string}
     */
    get containerId(): string {

        return this._containerId;
    }

    /**
     * @description Gets the ModelView.
     * @readonly
     * @type {string}
     */
    get modelView(): ModelView {

        return this._modelView;
    }

    /**
     * @description Gets the MeshView.
     * @readonly
     * @type {string}
     */
    get meshView(): MeshView {

        return this._meshView;
    }

    /**
     * @description Gets the DepthBufferView.
     * @readonly
     * @type {string}
     */
    get depthBufferView(): DepthBufferView {

        return this._depthBufferView;
    }

    /**
     * @description Gets the Event Manager.
     * @readonly
     * @type {EventManager}
     */
    get eventManager(): EventManager {

        return this._eventManager;
    }

    /** Default constructor
     * @class ComposerView
     * @constructor
     */
    constructor(containerId: string) {

        this._containerId = containerId;
        this._eventManager = new EventManager();

        this.initialize();
    }

    /**
     * @description Performs initialization.
     */
    public initialize(): void {

        Services.defaultLogger.addInfoMessage("ModelRelief started");

        // initialize context
        this.initializeMeshModel().then((mesh) => {

            this.mesh = mesh;
            const model3d = this.mesh.depthBuffer.model3d;
            const depthBuffer = this.mesh.depthBuffer;
            const normalMap = this.mesh.normalMap;

            // Mesh View
            this._meshView = new MeshView(ElementIds.MeshView, this.mesh);

            // Model View
            this._modelView = new ModelView(ElementIds.ModelView, model3d);

            // DepthBuffer View
            this._depthBufferView = new DepthBufferView(ElementIds.DepthBufferView, depthBuffer);

            // NormalMap View
            this._normalMapView = new NormalMapView(ElementIds.NormalMapView, normalMap);

            // load models; model event handlers in Viewers now initialized
            const useTestModels = false;
            const loader = new Loader();

            // Model
            let modelLoadedPromise: Promise<THREE.Group>;
            if (useTestModels) {
                modelLoadedPromise = loader.loadParametricTestModelAsync(TestModel.Checkerboard);
            } else {
                modelLoadedPromise = loader.loadModel3dAsync(model3d);
            }
            modelLoadedPromise.then ((theModel: THREE.Group) => {
                this._modelView.modelViewer.setModelGroup(theModel);
            });

            // Mesh
            const meshLoadedPromise = loader.loadMeshAsync(this.mesh).then((theMesh: THREE.Group) => {
                this._meshView.meshViewer.setModelGroup (theMesh);
                this._meshView.meshViewer.setCameraToStandardView(StandardView.Top);

                // mesh available; start render loop
                this._meshView.meshViewer.animate();
                // this._meshView.meshViewer.enableProgressBar(false);
            });

            Promise.all([modelLoadedPromise, meshLoadedPromise]).then(() => {
                // dispatch ComposerViewInitialized event
                this.eventManager.dispatchEvent(this, EventType.ComposerViewInitialized);
            });
        });
    }

    //#endregion

    //#region Event Handlers
    //#endregion

    //#region Initialization
    /**
     * @description Initializes the Composer context.
     *  The JSON DTO objects are hydrated into full instances.
     *  Defaults are created where necessary.
     * @private
     */
    private initializeMeshModel(): Promise<Mesh> {
        /*
            Mesh
                DepthBuffer
                    Model3d
                        Camera (= DepthBuffer.Camera)
                    Camera
                MeshTransform
        */
        return Mesh.fromDtoModelAsync(composerMeshModel);
    }

//#endregion
}
