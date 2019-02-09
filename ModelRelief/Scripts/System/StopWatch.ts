
// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {ILogger} from "Scripts/System/Logger";
import {Tools} from "Scripts/System/Tools";

/**
 * @description Timer record.
 * @interface TimerEntry
 */
interface ITimerEntry {

    startTime: number;
    indent: string;
}

/**
 * StopWatch
 * General debugger timer.
 * @class
 */
export class StopWatch {

    public static precision: number = 3;
    public static keySuffixDelimiter: string = "@";

    private _enabled: boolean;
    private _logger: ILogger;
    private _name: string;

    private _events: any;
    private _baselineTime: number;

    /**
     * @constructor
     * @param {string} timerName Timer identifier
     * @param {ILogger} logger Logger
     * N.B. Logger is passed as a constructor parameter because StopWatch and Service.consoleLogger are static Service properties.
     */
    constructor(timerName: string, logger: ILogger) {

        this._enabled = false;
        this._logger = logger;
        this._name   = timerName;
        this._events  = {};
        this._baselineTime = Date.now();
    }

//#region Properties
    /**
     * @description Returns the mumber of pending events.
     * @readonly
     * @type {number}
     */
    get eventCount(): number {

        return Object.keys(this._events).length;
    }

    /**
     * @description Returns the current indent level.
     * @readonly
     * @type {string}
     */
    get indentPrefix(): string {

        const indent: string = "    ";
        return indent.repeat(this.eventCount);
    }

//#endregion
    /**
     * @description Returns the friendly form of the event key excluding the unique suffix.
     */
    public friendlyKey(key: string): string {
        const friendlyKey = key.split(StopWatch.keySuffixDelimiter)[0];
        return friendlyKey;
    }

    /**
     * @description Adds an entry to the timer stack.
     */
    public mark(event: string): string {
        if (!this._enabled)
            return "";

        const startMilliseconds: number = Date.now();
        const indentPrefix: string = this.indentPrefix;
        const timerEntry: ITimerEntry = { startTime: startMilliseconds, indent : indentPrefix};

        // N.B. Ensure uniqueness of key in events dictionary. Minificaiton will collapse class names.
        const suffix = Tools.generatePseudoGUID();
        event += ` ${StopWatch.keySuffixDelimiter}${suffix}`;
        this._events[event] = timerEntry;

        this._logger.addMessage(`${indentPrefix}${this.friendlyKey(event)}`);

        return event;
    }

    /**
     * @description Logs the elapsted time.
     */
    public logElapsedTime(event: string): void {
        if (!this._enabled)
            return;

        const timerElapsedTime: number = Date.now();
        const eventElapsedTime: number = (timerElapsedTime - ((this._events[event].startTime) as number)) / 1000;
        const elapsedTimeMessage: string = eventElapsedTime.toFixed(StopWatch.precision);
        const indentPrefix: string = this._events[event].indent;

        this._logger.addMessage(`${indentPrefix}${this.friendlyKey(event)} : ${elapsedTimeMessage} sec`);

        // remove event from log
        delete this._events[event];
    }
//#endregion
}
