// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
"use strict";

/**
 * Logging Interface
 * Diagnostic logging
 */
export interface Logger {
    addErrorMessage (errorMessage : string);
    addWarningMessage (warningMessage : string);
    addInfoMessage (infoMessage : string);
}
         
enum MessageClass {
    Error   = 'logError',
    Warning = 'logWarning',
    Info    = 'logInfo',
}
/**
 * HTML logging
 * @class
 */
export class HTMLLogger implements Logger{
    

    rootId           : string;
    rootElement      : HTMLElement;
    messageTag       : string;
    baseMessageClass : string

    /**
     * @constructor
     */
    constructor(rootElementTag : string, messageTag : string) {
        
        this.rootId = 'loggerRoot'

        this.messageTag = messageTag;
        this.baseMessageClass = 'logMessage';

        this.rootElement = <HTMLElement> document.querySelector(`#${this.rootId}`);
        if (!this.rootElement) {

            this.rootElement = document.createElement(rootElementTag);
            this.rootElement.id = this.rootId;
            document.body.appendChild(this.rootElement);
        }
    }
    /**
     * Construct a general message and append to the log root.
     * @param message Message text.
     * @param messageClass CSS class to be added to message.
     */
    addMessage (message : string, messageClass : string) : HTMLElement {
        
        let messageElement = document.createElement(this.messageTag);
        messageElement.textContent = message;
        messageElement.className   = `${this.baseMessageClass} ${messageClass}`;;

        this.rootElement.appendChild(messageElement);

        return messageElement;
    }

    /**
     * Add an error message to the log.
     * @param errorMessage Error message text.
     */
    addErrorMessage (errorMessage : string) {

        this.addMessage(errorMessage, MessageClass.Error);
    }

    /**
     * Add a warning message to the log.
     * @param warningMessage Warning message text.
     */
    addWarningMessage (warningMessage : string) {

        this.addMessage(warningMessage, MessageClass.Warning);
    }

    /**
     * Add an informational message to the log.
     * @param infoMessage Information message text.
     */
    addInfoMessage (infoMessage : string) {

        this.addMessage(infoMessage, MessageClass.Info);
    }
}
