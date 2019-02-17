// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

/**
 * @description JSON system settings.
 * @interface ISystemSettings
 */
export interface ISystemSettings {

    LoggingEnabled: boolean;
    DevelopmentUI: boolean;
}

/**
 * @description SystemSettings
 * @export
 * @class SystemSettings
 */
export class SystemSettings  {
    public static loggingEnabled: boolean;
    public static developmentUI: boolean;
}
