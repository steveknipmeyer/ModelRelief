// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {ConsoleLogger, HTMLLogger, ILogger} from "Scripts/System/Logger";
import {StopWatch} from "Scripts/System/StopWatch";

/**
 * Services
 * General runtime support
 * @class
 */
export class Services {

    public static consoleLogger: ConsoleLogger = new ConsoleLogger();
    public static htmlLogger: HTMLLogger    = new HTMLLogger();
    public static defaultLogger: ILogger        = Services.consoleLogger;

    public static timer: StopWatch = new StopWatch("Master", Services.defaultLogger);

    /**
     * @constructor
     */
    constructor() {
    }
}
