// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {DtoModel} from "Scripts/Api/V1/Base/DtoModel";
import {ISession} from "Scripts/Api/V1/Interfaces/ISession";
import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {HttpLibrary, ServerEndPoints} from "Scripts/System/Http";

/**
 * Concrete implementation of ISession.
 * @class
 */
export class DtoSession extends DtoModel<DtoSession> implements ISession {

    public projectId: number;

    /**
     * Creates an instance of Session.
     * @param {DtoSession} parameters
     */
    constructor(parameters: ISession = {}) {

        super(parameters);

        this.endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiSettingsSession}`;

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
}
