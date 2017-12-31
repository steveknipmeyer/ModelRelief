// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {Logger}                 from 'Logger'
import {Services}               from 'Services'

/**
 * @description Timer record.
 * @interface TimerEntry
 */
interface TimerEntry {

    startTime : number;
    indent    : string;
}

/**
 * StopWatch
 * General debugger timer.
 * @class
 */
export class StopWatch {
    
    static precision : number = 3;

    _logger            : Logger;
    _name              : string;

    _events            : any;
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
    /**
     * @description Returns the mumber of pending events.
     * @readonly
     * @type {number}
     */
    get eventCount () : number {

        return Object.keys(this._events).length;
    }

    /**
     * @description Returns the current indent level.
     * @readonly
     * @type {string}
     */
    get indentPrefix(): string {

        let indent: string = '    ';
        return indent.repeat(this.eventCount);
    }
            
//#endregion

    /**
     * @description Resets the timer.
     */
    mark(event : string) : string {

        let startMilliseconds : number = Date.now();
        let indentPrefix      : string = this.indentPrefix;
        let timerEntry        : TimerEntry = { startTime: startMilliseconds, indent : indentPrefix};
        this._events[event] = timerEntry;

        this._logger.addMessage(`${indentPrefix}${event}`);

        return event;
    }

    /**
     * @description Logs the elapsted time.
     */
    logElapsedTime(event : string) {

        let timerElapsedTime   : number = Date.now();
        let eventElapsedTime   : number = (timerElapsedTime - (<number> (this._events[event].startTime))) / 1000;
        let elapsedTimeMessage : string = eventElapsedTime.toFixed(StopWatch.precision);
        let indentPrefix       : string = this._events[event].indent;

        this._logger.addInfoMessage(`${indentPrefix}${event} : ${elapsedTimeMessage} sec`);

        // remove event from log
        delete this._events[event];
    }
//#endregion
}
