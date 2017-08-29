// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";
         
export interface MREvent {

    type    : EventType;
    target  : any;
}

export enum EventType {

    None,
    NewModel,
    MeshGenerate
}

type Listener = (event: MREvent, ...args : any[]) => void;
type ListenerArray = Listener[][];  // Listener[][EventType];

/**
 * Event Manager
 * General event management and dispatching.
 * @class
 */
export class EventManager {

    _listeners : ListenerArray;
    
    /**
    /*
     * Creates EventManager object. It needs to be called with '.call' to add the functionality to an object.
     * @constructor
     */
    constructor() {
    }

    /**
     * Adds a listener to an event type.
     * @param type The type of the event that gets added.
     * @param listener The listener function that gets added.
     */
    addEventListener(type: EventType, listener: (event: MREvent, ...args : any[]) => void ): void {

        if (this._listeners === undefined) {
            this._listeners = [];
            this._listeners[EventType.None] = [];
        }            
        
        let listeners = this._listeners;

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
     * Checks whether a listener is registered for an event.
     * @param type The type of the event to check.
     * @param listener The listener function to check..
     */
    hasEventListener(type: EventType, listener: (event: MREvent, ...args : any[]) => void): boolean {

        // no events     
        if (this._listeners === undefined) 
            return false;
        
        let listeners = this._listeners;

        // event exists and listener registered => true
        return listeners[type] !== undefined && listeners[type].indexOf(listener) !== - 1;       
    }
    
    /**
     * Removes a listener from an event type.
     * @param type The type of the event that gets removed.
     * @param listener The listener function that gets removed.
     */
    removeEventListener(type: EventType, listener: (event: MREvent, ...args : any[]) => void): void {

        // no events; do nothing
        if (this._listeners === undefined ) 
            return;
        
        let listeners = this._listeners;
        let listenerArray = listeners[type];

        if (listenerArray !== undefined ) {

            let index = listenerArray.indexOf(listener);

            // remove if found
            if (index !== -1) {

                listenerArray.splice(index, 1);
            }
        }
    }
    
    /**
     * Fire an event type.
     * @param target Event target.
     * @param type The type of event that gets fired.
     */
    dispatchEvent(target : any, eventType : EventType, ...args : any[]): void {

        // no events defined; do nothing
        if (this._listeners === undefined) 
            return;
        
        let listeners     = this._listeners;       
        let listenerArray = listeners[eventType];

        if (listenerArray !== undefined) {
            
            let theEvent = {
                type   : eventType,         // type
                target : target             // set target to instance triggering the event
            }
            
            // duplicate original array of listeners
            let array = listenerArray.slice(0);

            let length = array.length;
            for (let index = 0 ; index < length; index++) {

                array[index](theEvent, ...args); 
            }
        }
    }
}
