// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";
import {Logger, ConsoleLogger, HTMLLogger}  from 'Logger'
         
/**
 * Services
 * General runtime support
 * @class
 */
export class Services {

    static consoleLogger : ConsoleLogger = new ConsoleLogger();
    static htmlLogger    : HTMLLogger    = new HTMLLogger();
    
    /**
     * @constructor
     */
    constructor() {
    }
}
