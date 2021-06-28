﻿// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";

import {IModel} from "Scripts/Api/V1/Interfaces/IModel";

export interface IProject extends IModel {

    // Navigation Properties
    settingsId?: number;
    settings?: IProject;
}


