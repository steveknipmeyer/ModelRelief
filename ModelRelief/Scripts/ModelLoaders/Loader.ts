// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";
import * as THREE from "three";

import {MeshFormat} from "Scripts/Api/V1/Interfaces/IMesh";
import {Model3dFormat} from "Scripts/Api/V1/Interfaces/IModel3d";
import {FileModel} from "Scripts/Api/V1/Models/FileModel";
import {ObjectNames} from "Scripts/Graphics/Graphics";
import {IMeshGenerateParameters} from "Scripts/Graphics/Mesh3d";
import {OBJLoader} from "Scripts/ModelLoaders/OBJLoader";
import {SinglePrecisionLoader} from "Scripts/ModelLoaders/SinglePrecisionLoader";
import {TestModel, TestModelLoader} from "Scripts/ModelLoaders/TestModelLoader";
import {Mesh} from "Scripts/Models/Mesh/Mesh";
import {Model3d} from "Scripts/Models/Model3d/Model3d";
import {ILogger} from "Scripts/System/Logger";
import {Services} from "Scripts/System/Services";

const testModelColor = "#558de8";

/**
 * @description Represents the model loader used to create Mesh objects from files.
 * @export
 * @class Loader
 */
export class Loader {

    // Private
    private _logger: ILogger;

    /** Default constructor
     * @class Loader
     * @constructor
     */
    constructor() {
        this._logger = Services.defaultLogger;
    }

    /**
     * @description Loads a mesh based on the model type.
     * @param {FileModel} fileModel Model to load.
     * @returns {Promise<THREE.Group>}
     */
    public async loadModelAsync(fileModel: FileModel): Promise<THREE.Group> {

        // Model3d
        if (fileModel instanceof Model3d)
            return await this.loadModel3dAsync(fileModel);

        // Mesh
        if (fileModel instanceof Mesh)
            return await this.loadMeshAsync(fileModel);

        this._logger.addErrorMessage(`Logger: invalid FileModel type = ${typeof(fileModel)}`);
   }

    /**
     * @description Loads a mesh from a Model3d.
     * @param {Model3d} model Model to load.
     * @returns {Promise<THREE.Group>}
     */
    public async loadModel3dAsync(model: Model3d): Promise<THREE.Group> {

        let modelGroup: THREE.Group = new THREE.Group();
        modelGroup.name = ObjectNames.ModelGroup;
        switch (model.format) {

            case Model3dFormat.OBJ:
                modelGroup = await this.loadOBJModelAsync(model);
                break;

            default:
                this._logger.addErrorMessage(`Logger: invalid Model3d type = ${model.format}`);
                break;
        }
        return modelGroup;
    }

    /**
     * @description Loads a mesh from a Mesh.
     * @param {Mesh} mesh Mesh to load.
     * @returns {Promise<THREE.Group>}
     */
    public async loadMeshAsync(mesh: Mesh): Promise<THREE.Group> {

        let meshGroup: THREE.Group = new THREE.Group();
        meshGroup.name = ObjectNames.MeshGroup;

        const byteArray: Uint8Array = await mesh.toDtoModel().getFileAsync();
        const floatArray = new Float32Array(byteArray.buffer);

        const depthBuffer = mesh.depthBuffer;
        const meshParameters: IMeshGenerateParameters = {
            name : mesh.name,
        };
        const bufferExtents = new THREE.Vector2(depthBuffer.width, depthBuffer.height);
        const meshExtents: THREE.Vector2 = depthBuffer.camera.getNearPlaneExtents();

        // NOOP default transform
        let transformer = (value: number) => value;

        // override transformer
        switch (mesh.format) {

            case MeshFormat.SDB:
                transformer = depthBuffer.normalizedToModelDepth.bind(depthBuffer);
                break;

            case MeshFormat.SFP:
                // N.B. Solver returns a grid scaled according to the DepthBuffer dimensions (pixels). Only the Z coordinates are returned so the XY dimensions are implicity the DepthBuffer pixel units.
                //      However, the Mesh construction logic will build the grid in real world model units so a conversion is required to map the Z values to real world units.
                const scaleFactor = meshExtents.x / depthBuffer.width;
                transformer = (value: number) => scaleFactor * value;
                break;

            case MeshFormat.DDB:
            case MeshFormat.DFP:
            default:
                this._logger.addErrorMessage(`Logger: invalid Mesh type = ${mesh.format}`);
                return meshGroup;
        }

        const loader = new SinglePrecisionLoader(meshParameters, floatArray, transformer, bufferExtents, meshExtents);
        meshGroup = await loader.loadModelAsync();

        return meshGroup;
    }

    // region Model3d
    /**
     * @description Loads a model based on the model name and path embedded in the HTML page.
     * @param {FileModel} fileModel Model to load.
     * @returns {Promise<THREE.Group>}
     */
    public async loadOBJModelAsync(fileModel: FileModel): Promise<THREE.Group> {

        const modelFile = await fileModel.toDtoModel().getFileAsStringAsync();

        const objLoader = () => new Promise<THREE.Group>((resolve, reject) => {

            const manager = new THREE.LoadingManager();
            const loader  = new OBJLoader(manager);

            resolve(loader.parse(modelFile));
        });

        const modelGroup: THREE.Group = await objLoader();
        return modelGroup;
    }

    /**
     * @description Loads a parametric test model.
     * @param modelType Test model type (Sphere, Box, etc.)
     * @returns {Promise<THREE.Group>}
     */
    public async loadParametricTestModelAsync(modelType: TestModel): Promise<THREE.Group> {

        const loader = new TestModelLoader();
        return loader.loadModelAsync(modelType);
    }
    // endregion
}
