// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";

import {DtoModel} from "Scripts/Api/V1/Base/DtoModel";
import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {IProject} from "Scripts/Api/V1/Interfaces/IProject";
import {ISettings} from "Scripts/Api/V1/Interfaces/ISettings";
import {HttpLibrary, ServerEndPoints} from "Scripts/System/Http";
/**
 * Concrete implementation of IProject.
 * @class
 */
export class DtoProject extends DtoModel<DtoProject> implements IProject {

    // Navigation Properties
    public settingsId: number;
    public settings: ISettings;

    /**
     * Creates an instance of a Project.
     * @param {DtoProject} parameters
     */
    constructor(parameters: IProject = {}) {

        super(parameters);

        this.endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiProjects}`;

        const {
            // Navigation Properties
            settingsId,
            settings,
        } = parameters;

        // Navigation Properties
        this.settingsId = settingsId;
        this.settings = settings;
    }

    /**
     * @description Constructs an instance of a Project.
     * @param {IModel} parameters : DtoProject
     * @returns {DtoProject}
     */
    public factory(parameters: IModel): DtoProject {
        return new DtoProject(parameters);
    }
}
