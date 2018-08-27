// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import {ILogger}                 from 'Logger'
import {Services}                from 'Services'

// defined in Edit HTML page
declare var timingEnabled: boolean;

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
    static keySuffixDelimiter: string = '@';

    _logger            : ILogger;
    _name              : string;

    _events            : any;
    _baselineTime      : number;
    
    /**
     * @constructor
     * @param {string} timerName Timer identifier
     * @param {ILogger} logger Logger
     * N.B. Logger is passed as a constructor parameter because StopWatch and Service.consoleLogger are static Service properties.
     */
    constructor(timerName : string, logger : ILogger) {

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
     * @description Returns the friendly form of the event key excluding the unique suffix.
     */
    friendlyKey (key: string) : string {
        var friendlyKey = key.split(StopWatch.keySuffixDelimiter)[0];
        return friendlyKey;
    }

    /**
     * @description Adds an entry to the timer stack.
     */
    mark(event : string) : string {
        if (!timingEnabled)    
            return;

        let startMilliseconds : number = Date.now();
        let indentPrefix      : string = this.indentPrefix;
        let timerEntry        : TimerEntry = { startTime: startMilliseconds, indent : indentPrefix};

        // N.B. Ensure uniqueness of key in events dictionary. Minificaiton will collapse class names.
        var date = Date.now();
        event += ` ${StopWatch.keySuffixDelimiter}${date}`;
        this._events[event] = timerEntry;

        this._logger.addMessage(`${indentPrefix}${this.friendlyKey(event)}`);

        return event;
    }

    /**
     * @description Logs the elapsted time.
     */
    logElapsedTime(event : string) {

        if (!timingEnabled)    
            return;

            let timerElapsedTime   : number = Date.now();
        let eventElapsedTime   : number = (timerElapsedTime - (<number> (this._events[event].startTime))) / 1000;
        let elapsedTimeMessage : string = eventElapsedTime.toFixed(StopWatch.precision);
        let indentPrefix       : string = this._events[event].indent;

        this._logger.addMessage(`${indentPrefix}${this.friendlyKey(event)} : ${elapsedTimeMessage} sec`);

        // remove event from log
        delete this._events[event];
    }
//#endregion
}
