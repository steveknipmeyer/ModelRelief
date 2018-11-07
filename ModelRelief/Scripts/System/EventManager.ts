// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

/**
 * @description System event.
 * @export
 * @interface MREvent
 */
export interface IMREvent {

    eventType: EventType;
    target: any;
}

/**
 * @description System event type.
 *
 * @export
 * @enum {number}
 */
export enum EventType {

    None,
    NewModel,                                   // Viewer: new model loaded
    ViewerCameraProperties,                     // Viewer: Camera property change
    ViewerCameraStandardView,                   // Viewer: Camera oriented in StandardView
    ComposerViewInitialized,                    // ComposerView: ModelViewer, MeshViewer initialized
}

type Listener = (event: IMREvent, ...args: any[]) => void;
type ListenerArray = Listener[][];  // Listener[][EventType];

/**
 * @description General event management and dispatching.
 * @export
 * @class EventManager
 */
export class EventManager {

    public _listeners: ListenerArray;

    /**
     * Creates an instance of EventManager.
     * Creates EventManager object. It needs to be called with '.call' to add the functionality to an object.
     */
    constructor() {
    }

    /**
     * @description Adds a listener to an event type.
     * @param {EventType} type The type of the event that gets added.
     * @param {(event: IMREvent, ...args : any[]) => void} listener The listener function that gets added.
     */
    public addEventListener(type: EventType, listener: (event: IMREvent, ...args: any[]) => void ): void {

        if (this._listeners === undefined) {
            this._listeners = [];
            this._listeners[EventType.None] = [];
        }

        const listeners = this._listeners;

        // event does not exist; create
        if (listeners[type] === undefined) {

            listeners[type] = [];
        }

        // do nothing if listener registered
        if (listeners[type].indexOf(listener) === -1) {

            // add new listener to this event
            listeners[type].push(listener);
        }
    }

    /**
     * @description Checks whether a listener is registered for an event.
     * @param {EventType} type
     * @param {(event: IMREvent, ...args : any[]) => void} listener
     * @returns {boolean}
     */
    public hasEventListener(type: EventType, listener: (event: IMREvent, ...args: any[]) => void): boolean {

        // no events
        if (this._listeners === undefined)
            return false;

        const listeners = this._listeners;

        // event exists and listener registered => true
        return listeners[type] !== undefined && listeners[type].indexOf(listener) !== - 1;
    }

    /**
     * @description Removes a listener from an event type.
     * @param {EventType} type
     * @param {(event: IMREvent, ...args : any[]) => void} listener
     * @returns {void}
     */
    public removeEventListener(type: EventType, listener: (event: IMREvent, ...args: any[]) => void): void {

        // no events; do nothing
        if (this._listeners === undefined )
            return;

        const listeners = this._listeners;
        const listenerArray = listeners[type];

        if (listenerArray !== undefined ) {

            const index = listenerArray.indexOf(listener);

            // remove if found
            if (index !== -1) {

                listenerArray.splice(index, 1);
            }
        }
    }

    /**
     * @description Fire an event type.
     * @param {*} theTarget Event target.
     * @param {EventType} theEventType The type of event that gets fired.
     * @param {...any[]} args Arguments for event.
     * @returns {void}
     */
    public dispatchEvent(theTarget: any, theEventType: EventType, ...args: any[]): void {

        // no events defined; do nothing
        if (this._listeners === undefined)
            return;

        const listeners     = this._listeners;
        const listenerArray = listeners[theEventType];

        if (listenerArray !== undefined) {

            const theEvent: IMREvent = {
                eventType: theEventType,       // type
                target:    theTarget,          // instance triggering the event
            };

            // duplicate original array of listeners
            const array = listenerArray.slice(0);

            const length = array.length;
            for (let index = 0 ; index < length; index++) {

                array[index](theEvent, ...args);
            }
        }
    }
}
