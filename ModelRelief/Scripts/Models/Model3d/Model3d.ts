// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto          from 'DtoModels'

import { Camera }                       from 'Camera';
import { FileModel }                    from 'FileModel';
import { HttpLibrary, ServerEndPoints } from 'Http'
import { Model3dFormat }                from 'IModel3d';
import { IFileModel }                   from 'IFileModel';
import { Loader }                       from 'Loader';
import { Project }                      from 'Project'
import { Services }                     from 'Services'

/**
 * @description Represents a 3D model.
 * @export
 * @class Model3d
 */
export class Model3d extends FileModel<Model3d> {

    format: Model3dFormat;

    // Navigation Properties
    project   : Project;
    camera   : Camera;

    /**
     * Creates an instance of a Model3d.
     * @param {IFileModel} [parameters={}] FileModel properties.
     */
    constructor(parameters: IFileModel = {}) {

        parameters.name        = parameters.name        || "Model3d"; 
        parameters.description = parameters.description || "Model3d";

        super(parameters);

        this.initialize();        
    }

    /**
     * @description Perform setup and initialization.
     */
    initialize(): void {

        this.endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiModels}`;
    }

    /**
     * @description Returns a Model3d instance through an HTTP query of the Id.
     * @static
     * @param {number} id Model3d Id.
     * @returns {Promise<Model3d>} 
     */
    static async fromIdAsync(id : number ) : Promise<Model3d> {
        
        if (!id)
            return undefined;

        let model3d = new Dto.Model3d ({
            id : id
        });
        let model3dModel = await model3d.getAsync();
        return Model3d.fromDtoModelAsync(model3dModel);
    }   

    /**
     * @description Constructs an instance from a DTO model.
     * @returns {Model3d} 
     */
    static async fromDtoModelAsync(dtoModel3d : Dto.Model3d) : Promise<Model3d> {

        // constructor
        let model3d = new Model3d ({
            id          : dtoModel3d.id,
            name        : dtoModel3d.name,
            description : dtoModel3d.description,       
        });

        model3d.format  = dtoModel3d.format;              

        model3d.project = await Project.fromIdAsync(dtoModel3d.projectId);       
        model3d.camera  = await Camera.fromIdAsync(dtoModel3d.cameraId);       

        return model3d;
    }

    /**
     * @description Returns a DTO Model3d from the instance.
     * @returns {Dto.Model3d} 
     */
    toDtoModel() : Dto.Model3d {

        let model3d = new Dto.Model3d({
            id              : this.id,
            name            : this.name,
            description     : this.description,    

            format          : this.format,              
            
            projectId       : this.project ? this.project.id : undefined,
            cameraId        : this.camera  ? this.camera.id : undefined,
        });

        return model3d;
    }        

    /**
     * @description Constructs a graphics mesh.
     * @returns {Promise<THREE.Group>} 
     */
    async getModelGroupAsync() : Promise<THREE.Group> {

        let loader = new Loader();
        let modelGroup = await loader.loadOBJModelAsync(this);

        return modelGroup;
    }
}
