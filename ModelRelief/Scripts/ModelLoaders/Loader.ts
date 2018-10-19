// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE                           from 'three';

import {Model3dFormat}                      from 'IModel3d';
import {FileModel}                          from 'FileModel'
import {MeshFormat}                         from 'IMesh';
import {ILogger}                            from 'Logger';
import {Mesh}                               from 'Mesh';
import {IMeshGenerateParameters}             from 'Mesh3d';
import {Model3d}                            from 'Model3d';
import {OBJLoader}                          from 'OBJLoader';
import {Services}                           from 'Services';
import {SinglePrecisionLoader}              from 'SinglePrecisionLoader';
import {TestModelLoader, TestModel}         from 'TestModelLoader';


const testModelColor = '#558de8';

/**
 * @description Represents the model loader used to create Mesh objects from files.
 * @export
 * @class Loader
 */
export class Loader {

    // Private
    _logger         : ILogger;

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
    async loadModelAsync (fileModel : FileModel) : Promise<THREE.Group> {

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
    async loadModel3dAsync (model : Model3d) : Promise<THREE.Group> {

        let modelGroup : THREE.Group = new THREE.Group();
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
    async loadMeshAsync (mesh : Mesh) : Promise<THREE.Group> {

        let modelGroup : THREE.Group = new THREE.Group();

        let byteArray : Uint8Array = await mesh.toDtoModel().getFileAsync();
        let floatArray = new Float32Array(byteArray.buffer);

        let depthBuffer = mesh.depthBuffer;
        let meshParameters : IMeshGenerateParameters = {
            name : mesh.name
        }
        let bufferExtents = new THREE.Vector2(depthBuffer.width, depthBuffer.height);
        let meshExtents : THREE.Vector2 = depthBuffer.camera.getNearPlaneExtents()

        // NOOP default transform
        let transformer = (value : number) => {return value;};

        // override transformer
        switch (mesh.format) {

            case MeshFormat.SDB:
                transformer = depthBuffer.normalizedToModelDepth.bind(depthBuffer);
                break;

            case MeshFormat.SFP:
                // N.B. Solver returns a grid scaled according to the DepthBuffer dimensions (pixels). Only the Z coordinates are returned so the XY dimensions are implicity the DepthBuffer pixel units.
                //      However, the Mesh construction logic will build the grid in real world model units so a conversion is required to map the Z values to real world units.
                let scaleFactor = meshExtents.x / depthBuffer.width;
                transformer = (value : number) => {return scaleFactor * value;};
                break;

            case MeshFormat.DDB:
            case MeshFormat.DFP:
            default:
                this._logger.addErrorMessage(`Logger: invalid Mesh type = ${mesh.format}`);
                return modelGroup;
        }

        let loader = new SinglePrecisionLoader(meshParameters, floatArray, transformer, bufferExtents, meshExtents);
        modelGroup = await loader.loadModelAsync();

        return modelGroup;
    }

    //region Model3d
    /**
     * @description Loads a model based on the model name and path embedded in the HTML page.
     * @param {FileModel} fileModel Model to load.
     * @returns {Promise<THREE.Group>}
     */
    async loadOBJModelAsync (fileModel : FileModel) : Promise<THREE.Group> {

        let modelFile = await fileModel.toDtoModel().getFileAsStringAsync();

        let objLoader = () => new Promise<THREE.Group>((resolve, reject) => {

            let manager = new THREE.LoadingManager();
            let loader  = new OBJLoader(manager);

            resolve(loader.parse(modelFile));
        });

        let modelGroup : THREE.Group = await objLoader();
        return modelGroup;
    }

    /**
     * @description Loads a parametric test model.
     * @param modelType Test model type (Sphere, Box, etc.)
     * @returns {Promise<THREE.Group>}
     */
    async loadParametricTestModel (modelType : TestModel) : Promise<THREE.Group>{

        let loader = new TestModelLoader();
        return loader.loadModelAsync(modelType);
    }
    //endregion
}
