// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto     from 'DtoModels'

import { HttpLibrary, ServerEndPoints } from 'Http'
import { Model }                        from 'Model'
import { IModel }                       from 'IModel'
import { Services }                     from 'Services'

/**
 * @description Represents a user project.
 * @export
 * @class Project
 * @extends {Model}
 */
export class Project extends Model {

    /**
     * @constructor
     * Creates an instance of Camera.
     * @param {IModel} parameters IModel properties.
     */
    constructor(parameters: IModel) {

        parameters.name        = parameters.name        || "Project"; 
        parameters.description = parameters.description || "Project";
        
        super(parameters);

        this.initialize();                
    }        

    /**
     * @description Perform setup and initialization.
     */
    initialize(): void {

    }

    /**
     * @description Returns a Project instance through an HTTP query of the Id.
     * @static
     * @param {number} id Project Id.
     * @returns {Promise<Project>} 
     */
    static async fromIdAsync(id : number ) : Promise<Project> {
        
        if (!id)
            return undefined;

        let project = new Dto.Project ({
            id : id
        });
        let projectModel = await project.getAsync();
        return Project.fromDtoModel(projectModel);
    }   

    /**
     * @description Constructs an instance from a DTO model.
     * @returns {Project} 
     */
    static fromDtoModel(dtoProject : Dto.Project) : Project {

        // constructor
        let project = new Project ({
            id          : dtoProject.id,
            name        : dtoProject.name,
            description : dtoProject.description,       
        });

        return project;
    }

    /**
     * @description Returns a DTO Project from the instance.
     * @returns {Dto.Project} 
     */
    toDtoModel() : Dto.Project {

        let project = new Dto.Project({
            id              : this.id,
            name            : this.name,
            description     : this.description,    
        });

        return project;
    }        
}
