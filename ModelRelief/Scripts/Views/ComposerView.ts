// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE  from 'three' 
import * as dat    from 'dat-gui'
import * as Dto    from "DtoModels";

import { ComposerController }                 from "ComposerController"
import { DepthBufferView }                    from "DepthBufferView"
import { EventType, MREvent, EventManager }   from 'EventManager'
import { HtmlLibrary, ElementIds }            from "Html"
import { Loader }                             from 'Loader'
import { ILogger, ConsoleLogger }             from 'Logger'
import { Mesh }                               from "Mesh"
import { MeshView }                           from "MeshView"
import { MeshViewer }                         from "MeshViewer"
import { ModelView }                          from "ModelView"
import { ModelViewer }                        from "ModelViewer"
import { OBJLoader }                          from "OBJLoader"
import { Services }                           from 'Services'
import { TestModel }                          from 'TestModelLoader'
import { Viewer }                             from "Viewer"

// defined in HTML page
declare var composerMeshModel: Dto.Mesh;

/**
 * @description Represents the UI view used to compose a relief.
 * @export
 * @class ComposerView
 */
export class ComposerView {

    mesh                        : Mesh;
    
    _containerId                : string;

    _meshView                   : MeshView;
    _modelView                  : ModelView;
    _depthBufferView            : DepthBufferView;

    _composerController         : ComposerController;
    
    /** Default constructor
     * @class ComposerView
     * @constructor
     */ 
    constructor(containerId : string) {  

        this._containerId = containerId;    

        this.initialize();
    } 

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
     * @description Gets the DebpthBufferView.
     * @readonly
     * @type {string}
     */
    get depthBufferView(): DepthBufferView {

        return this._depthBufferView;
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
    private initializeMeshModel() : Promise<Mesh>{
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

    /**
     * @description Performs initialization.
     */
    initialize() {

        Services.defaultLogger.addInfoMessage('ModelRelief started');

        // initialize context
        this.initializeMeshModel().then((mesh) => {

            this.mesh = mesh;

            // Mesh View
            this._meshView = new MeshView(ElementIds.MeshView, this.mesh);

            // Model View
            this._modelView = new ModelView(ElementIds.ModelView, this.mesh.depthBuffer.model3d); 

            // DepthBuffer View
            this._depthBufferView = new DepthBufferView(ElementIds.DepthBufferView, this.mesh.depthBuffer); 

            // Composer Controller 
            this._composerController = new ComposerController(this);

            // Test Models
            let loader = new Loader();
            loader.loadParametricTestModel(TestModel.Checkerboard).then((modelGroup : THREE.Group) => {
                this._modelView.modelViewer.setModelGroup(modelGroup);
            });

            // load models; model event handlers now initialized
//            this._modelView.modelViewer.loadModelAsync().then(() => {});
            this._meshView.meshViewer.loadModelAsync().then(() => {});
        });
    }
    
//#endregion
}
