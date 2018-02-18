// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {ILogger, ConsoleLogger, HTMLLogger}  from 'Logger'
import {StopWatch}                           from 'StopWatch'

/**
 * Services
 * General runtime support
 * @class
 */
export class Services {

    static consoleLogger : ConsoleLogger = new ConsoleLogger();
    static htmlLogger    : HTMLLogger    = new HTMLLogger();
    static defaultLogger: ILogger        = Services.consoleLogger;

    static timer: StopWatch = new StopWatch('Master', Services.defaultLogger);
    
    /**
     * @constructor
     */
    constructor() {
    }
}
