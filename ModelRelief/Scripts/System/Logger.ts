// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

// defined in Edit HTML page
declare var loggingEnabled: boolean;

/**
 * @description Diagnostic logging.
 * @export
 * @interface Logger
 */
export interface ILogger {
    addErrorMessage (errorMessage : string);
    addWarningMessage (warningMessage : string);
    addInfoMessage (infoMessage : string);
    addMessage (infoMessage : string, style? : string);

    addEmptyLine ();

    clearLog();
}

/**
 * @description Logging message class.
 * @enum {number}
 */
enum MessageClass {
    Error   = 'logError',
    Warning = 'logWarning',
    Info    = 'logInfo',
    None    = 'logNone'
}

/**
 * Console logging
 * @class
 */
export class ConsoleLogger implements ILogger{

    /**
     * @constructor
     */
    constructor() {
    }

    /**
     * Construct a general message and add to the log.
     * @param message Message text.
     * @param messageClass Message class.
     * @param style Optional style.
     */
    addMessageEntry (message : string, messageClass : MessageClass, style? : string) : void {
        if (!loggingEnabled)
            return;

        const prefix = 'MR: ';
        let logMessage = `${prefix}${message}`;

        switch (messageClass) {

            case MessageClass.Error:
                console.error(logMessage);
                break;

            case MessageClass.Warning:
                console.warn(logMessage);
                break;

            case MessageClass.Info:
                console.info(logMessage);
                break;

            case MessageClass.None:
                style = style || 'color: #ffffff';
                console.log('%c ' + logMessage, style);
                break;
        }
    }

    /**
     * Add an error message to the log.
     * @param errorMessage Error message text.
     */
    addErrorMessage (errorMessage : string) {

        this.addMessageEntry(errorMessage, MessageClass.Error);
    }

    /**
     * Add a warning message to the log.
     * @param warningMessage Warning message text.
     */
    addWarningMessage (warningMessage : string) {

        this.addMessageEntry(warningMessage, MessageClass.Warning);
    }

    /**
     * Add an informational message to the log.
     * @param infoMessage Information message text.
     */
    addInfoMessage (infoMessage : string) {

        this.addMessageEntry(infoMessage, MessageClass.Info);
    }

    /**
     * Add a message to the log.
     * @param message Information message text.
     * @param style Optional style.
     */
    addMessage (message : string, style? : string) {

        this.addMessageEntry(message, MessageClass.None, style);
    }

    /**
     * Adds an empty line
     */
    addEmptyLine () {
        
        console.log('');
    }

    /**
     * Clears the log output
     */
    clearLog () {

        console.clear();
    }
}


/**
 * HTML logging
 * @class
 */
export class HTMLLogger implements ILogger{

    rootId           : string;
    rootElementTag   : string;
    rootElement      : HTMLElement;

    messageTag       : string;
    baseMessageClass : string

    /**
     * @constructor
     */
    constructor() {
        
        this.rootId         = 'loggerRoot'
        this.rootElementTag = 'ul';

        this.messageTag       = 'li';
        this.baseMessageClass = 'logMessage';

        this.rootElement = <HTMLElement> document.querySelector(`#${this.rootId}`);
        if (!this.rootElement) {

            this.rootElement = document.createElement(this.rootElementTag);
            this.rootElement.id = this.rootId;
            document.body.appendChild(this.rootElement);
        }
    }
    /**
     * Construct a general message and append to the log root.
     * @param message Message text.
     * @param messageClass CSS class to be added to message.
     */
    addMessageElement (message : string, messageClass? : string) : HTMLElement {
        
        let messageElement = document.createElement(this.messageTag);
        messageElement.textContent = message;

        messageElement.className   = `${this.baseMessageClass} ${messageClass ? messageClass : ''}`;;

        this.rootElement.appendChild(messageElement);

        return messageElement;
    }

    /**
     * Add an error message to the log.
     * @param errorMessage Error message text.
     */
    addErrorMessage (errorMessage : string) {

        this.addMessageElement(errorMessage, MessageClass.Error);
    }

    /**
     * Add a warning message to the log.
     * @param warningMessage Warning message text.
     */
    addWarningMessage (warningMessage : string) {

        this.addMessageElement(warningMessage, MessageClass.Warning);
    }

    /**
     * Add an informational message to the log.
     * @param infoMessage Information message text.
     */
    addInfoMessage (infoMessage : string) {

        this.addMessageElement(infoMessage, MessageClass.Info);
    }

    /**
     * Add a message to the log.
     * @param message Information message text.
     * @param style Optional CSS style.
     */
    addMessage (message : string, style? : string) {

        let messageElement = this.addMessageElement(message);
        if (style)
            messageElement.style.cssText = style;
    }

    /**
     * Adds an empty line
     */
    addEmptyLine () {

        // https://stackoverflow.com/questions/5140547/line-break-inside-a-list-item-generates-space-between-the-lines
//      this.addMessage('<br/><br/>');        
        this.addMessage('.');        
    }

    /**
     * Clears the log output
     */
    clearLog () {

        // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
        while (this.rootElement.firstChild) {
            this.rootElement.removeChild(this.rootElement.firstChild);
        }
    }
}
