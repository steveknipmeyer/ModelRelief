// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";

import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {IProject} from "Scripts/Api/V1/Interfaces/IProject";

/**
 * @description Session settings.
 * @interface ISession
 */
export interface ISession extends IModel {

    // Navigation Properties
    projectId?: number;
    project?: IProject;
}
