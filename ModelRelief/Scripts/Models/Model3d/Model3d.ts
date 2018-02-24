// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto          from 'DtoModels'

import { Camera }        from 'Camera';
import { Model3dFormat } from 'IModel3d';
import { FileModel }     from 'FileModel';
import { Project }       from 'Project'
import { Services }      from 'Services'

/**
 * @description Represents a 3D model.
 * @export
 * @class Model3d
 */
export class Model3d extends FileModel<Model3d> {

    format: Model3dFormat;

    // Navigation Properties
    projectId : number;
    project   : Project;

    cameraId : number;
    camera   : Camera;

    /**
     * @constructor
     */
    constructor() {

        super({
            name: 'Model3d', 
            description: 'Model3d',
        });
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
        return Model3d.fromDtoModel(model3dModel);
    }   

    /**
     * @description Constructs an instance from a DTO model.
     * @returns {Model3d} 
     */
    static fromDtoModel(dtoModel3d : Dto.Model3d) : Model3d {

        // constructor
        let model3d = new Model3d ();

        model3d.id          = dtoModel3d.id;
        model3d.name        = dtoModel3d.name;
        model3d.description = dtoModel3d.description;       

        model3d.format      = dtoModel3d.format;              

        model3d.projectId   = dtoModel3d.projectId;       
        model3d.cameraId    = dtoModel3d.cameraId;       

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
            
            projectId       : this.projectId,
            cameraId        : this.cameraId,
        });

        return model3d;
    }        
}
