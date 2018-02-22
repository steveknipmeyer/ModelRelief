// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as Dto    from 'DtoModels'

import {Services}  from 'Services'

/**
 * @description Represents a user project.
 * @export
 * @class Project
 */
export class Project extends Dto.Model<Project> {

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
