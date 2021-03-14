// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {DtoModel} from "Scripts/Api/V1/Base/DtoModel";
import {ISession} from "Scripts/Api/V1/Interfaces/ISession";
import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {ContentType, HttpLibrary, MethodType, ServerEndPoints} from "Scripts/System/Http";

/**
 * Concrete implementation of ISession.
 * @class
 */
export class DtoSession extends DtoModel<DtoSession> implements ISession {

    public static endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiSettingsSession}`;

    public projectId: number;

    /**
     * Creates an instance of Session.
     * @param {DtoSession} parameters
     */
    constructor(parameters: ISession = {}) {

        super(parameters);


        const {
            projectId,

        } = parameters;

        this.projectId = projectId;
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
     * @return {*}  {Promise<DtoSession>}
     */
    public async update(): Promise<DtoSession> {

        const updatedModel = JSON.stringify(this);
        const result = await this.submitRequestAsync(DtoSession.endPoint, MethodType.Put, ContentType.Json, updatedModel);

        return this.factory(result.model) as DtoSession;
    }

    /**
     * @description Initialize the session settings.
     * @static
     * @returns {Promise<DtoSession>}
     */
    public static async initialize(): Promise<DtoSession> {

        const result = await HttpLibrary.submitHttpRequestAsync(this.endPoint, MethodType.Get, ContentType.Json, null);
        const session = new DtoSession(JSON.parse(result.contentString));
        return session;
    }
}
