// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

import {Logger}                 from 'Logger'
import {Services}               from 'Services'

/**
 * StopWatch
 * General debugger timer.
 * @class
 */
export class StopWatch {
    
    static precision : number = 2;

    _logger            : Logger;
    _name              : string;

    _events            : {};
    _baselineTime      : number;
    
    /**
     * @constructor
     * @param {string} timerName Timer identifier
     * @param {Logger} logger Logger
     * N.B. Logger is passed as a constructor parameter because StopWatch and Service.consoleLogger are static Service properties.
     */
    constructor(timerName : string, logger : Logger) {

        this._logger = logger;
        this._name   = timerName;
        this._events  = {}
        this._baselineTime = Date.now();
    }

//#region Properties
//#endregion

    /**
     * @description Resets the timer.
     */
    mark(event : string) {

        let startMilliseconds : number = Date.now();
        this._events[event] = startMilliseconds;
        this._logger.addInfoMessage(`${event} : mark`);       
    }

    /**
     * @description Logs the elapsted time.
     */
    logElapsedTime(event : string) {

        let timerElapsedTime   : number = Date.now();
        let eventElapsedTime   : number = (timerElapsedTime - (<number> (this._events[event]))) / 1000;
        let elapsedTimeMessage : string = eventElapsedTime.toFixed(StopWatch.precision);

        this._logger.addInfoMessage(`${event} : ${elapsedTimeMessage} sec`);

        // remove event from log
        delete this._events[event];
    }
//#endregion
}
