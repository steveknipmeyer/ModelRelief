// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {DtoModel} from "Scripts/Api/V1/Base/DtoModel";
import {ISession} from "Scripts/Api/V1/Interfaces/ISession";
import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {IProject} from "Scripts/Api/V1/Interfaces/IProject";
import {ContentType, HttpLibrary, MethodType, ServerEndPoints} from "Scripts/System/Http";

/**
 * Concrete implementation of ISession.
 * @class
 */
export class DtoSession extends DtoModel<DtoSession> implements ISession {

    public static endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiSettingsSession}`;

    // Navigation Properties
    public projectId: number;
    public project: IProject;

    /**
     * Creates an instance of Session.
     * @param {ISession} parameters
     */
    constructor(parameters: ISession = {}) {

        super(parameters);

        const {
            // Navigation Properties
            projectId,
            project,

        } = parameters;

        // Navigation Properties
        this.projectId = projectId;
        this.project = project;
    }

    /**
     * @description Constructs an instance of Session.
     * @param {IModel} parameters : DtoSession
     * @returns {DtoSession}
     */
    public factory(parameters: IModel): DtoSession {
        return new DtoSession(parameters);
    }

    /**
     * @description Update the Session in the database.
     * @return {*}  {Promise<bool>}
     */
    public async update(): Promise<boolean> {

        const updatedModelJSON = JSON.stringify(this);
        const result = await this.submitRequestAsync(DtoSession.endPoint, MethodType.Put, ContentType.Json, updatedModelJSON);
        const updatedModel = await result.modelAsync() as DtoSession;

        if (!result.response.ok)
            return false;

        // update references
        this.project = updatedModel.project;

        return true;
    }

    /**
     * @description Initialize the session settings.
     * @static
     * @returns {Promise<DtoSession>}
     */
    public static async initialize(): Promise<DtoSession> {

        const result = await HttpLibrary.submitHttpRequestAsync(this.endPoint, MethodType.Get, ContentType.Json, null);
        const sessionObject = await result.stringAsync();
        const session = new DtoSession(JSON.parse(sessionObject));
        return session;
    }
}
