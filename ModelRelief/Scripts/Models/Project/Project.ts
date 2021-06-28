// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";

import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {DtoProject} from "Scripts/Api/V1/Models/DtoProject";
import {Model} from "Scripts/Models/Base/Model";

/**
 * @description Represents a user project.
 * @export
 * @class Project
 * @extends {Model}
 */
export class Project extends Model {

    /**
     * @description Returns a Project instance through an HTTP query of the Id.
     * @static
     * @param {number} id Project Id.
     * @returns {Promise<Project>}
     */
    public static async fromIdAsync(id: number ): Promise<Project> {

        if (!id)
            return undefined;

        const project = new DtoProject ({
            id,
        });
        const projectModel = await project.getAsync();
        return Project.fromDtoModel(projectModel);
    }

    /**
     * @description Constructs an instance from a DTO model.
     * @returns {Project}
     */
    public static fromDtoModel(dtoProject: DtoProject): Project {

        // constructor
        const project = new Project ({
            id          : dtoProject.id,
            name        : dtoProject.name,
            description : dtoProject.description,
        });

        return project;
    }

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
    public initialize(): void {
        // NOP
    }

    /**
     * @description Returns a DTO Project from the instance.
     * @returns {DtoProject}
     */
    public toDtoModel(): DtoProject {

        const project = new DtoProject({
            id              : this.id,
            name            : this.name,
            description     : this.description,
        });

        return project;
    }
}
