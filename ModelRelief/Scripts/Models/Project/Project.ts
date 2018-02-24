// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto     from 'DtoModels'

import { Model }    from 'Model'
import { Services } from 'Services'

/**
 * @description Represents a user project.
 * @export
 * @class Project
 */
export class Project extends Model<Project> {

    /**
     * @constructor
     */
    constructor() {
        super({
            name: 'Project', 
            description: 'Project',
        });
    }

    /**
     * @description Returns a Project instance through an HTTP query of the Id.
     * @static
     * @param {number} id Project Id.
     * @returns {Promise<Project>} 
     */
    static async fromId(id : number ) : Promise<Project> {
        
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
        let project = new Project ();

        project.id          = dtoProject.id;
        project.name        = dtoProject.name;
        project.description = dtoProject.description;       

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
