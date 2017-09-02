// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";
import {Logger, ConsoleLogger, HTMLLogger}  from 'Logger'
import {StopWatch}                          from 'StopWatch'
/**
 * Services
 * General runtime support
 * @class
 */
export class Services {

    static consoleLogger : ConsoleLogger = new ConsoleLogger();
    static htmlLogger    : HTMLLogger    = new HTMLLogger();
    static timer         : StopWatch     = new StopWatch('Master', Services.consoleLogger);
    
    /**
     * @constructor
     */
    constructor() {
    }
}
