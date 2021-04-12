// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

// import {SettingsManager} from "Scripts/System/SettingsManager";

/**
 * @description Diagnostic logging.
 * @export
 * @interface Logger
 */
export interface ILogger {

    loggingEnabled: boolean;

    addErrorMessage(errorMessage: string);
    addWarningMessage(warningMessage: string);
    addInfoMessage(infoMessage: string);
    addMessage(infoMessage: string, style?: string);

    addEmptyLine();

    clearLog();
}

/**
 * @description Logging message class.
 * @enum {number}
 */
enum MessageClass {
    Error   = "logError",
    Warning = "logWarning",
    Info    = "logInfo",
    None    = "logNone",
}

/**
 * Console logging
 * @class
 */
export class ConsoleLogger implements ILogger {

    private _defaultStyle: string = "";

    public loggingEnabled: boolean;

    /**
     * @constructor
     */
    constructor() {
        this._defaultStyle = "font-family : monospace; color : white; font-size : 12px";
    }

    /**
     * Construct a general message and add to the log.
     * @param message Message text.
     * @param messageClass Message class.
     * @param style Optional style.
     */
    public addMessageEntry(message: string, messageClass: MessageClass, style: string = this._defaultStyle): void {
        if (!this.loggingEnabled)
            return;

        const prefix = "MR: ";
        const logMessage = `${prefix}${message}`;

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
                style = style || "color: #ffffff";
                console.log("%c " + logMessage, style);
                break;
        }
    }

    /**
     * Add an error message to the log.
     * @param errorMessage Error message text.
     */
    public addErrorMessage(errorMessage: string): void {

        this.addMessageEntry(errorMessage, MessageClass.Error);
    }

    /**
     * Add a warning message to the log.
     * @param warningMessage Warning message text.
     */
    public addWarningMessage(warningMessage: string): void {

        this.addMessageEntry(warningMessage, MessageClass.Warning);
    }

    /**
     * Add an informational message to the log.
     * @param infoMessage Information message text.
     */
    public addInfoMessage(infoMessage: string): void {

        this.addMessageEntry(infoMessage, MessageClass.Info);
    }

    /**
     * Add a message to the log.
     * @param message Information message text.
     * @param style Optional style.
     */
    public addMessage(message: string, style?: string): void {

        this.addMessageEntry(message, MessageClass.None, style);
    }

    /**
     * Adds an empty line
     */
    public addEmptyLine(): void {

        console.log("");
    }

    /**
     * Clears the log output
     */
    public clearLog(): void {

        console.clear();
    }
}


/**
 * HTML logging
 * @class
 */
export class HTMLLogger implements ILogger {

    public loggingEnabled: boolean;

    public rootId: string;
    public rootElementTag: string;
    public rootElement: HTMLElement;

    public messageTag: string;
    public baseMessageClass: string;

    /**
     * @constructor
     */
    constructor() {

        this.rootId         = "loggerRoot";
        this.rootElementTag = "ul";

        this.messageTag       = "li";
        this.baseMessageClass = "logMessage";

        this.rootElement = document.querySelector(`#${this.rootId}`) as HTMLElement;
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
    public addMessageElement(message: string, messageClass?: string): HTMLElement {
        if (!this.loggingEnabled)
            return;

        const messageElement = document.createElement(this.messageTag);
        messageElement.innerHTML = message;

        messageElement.className   = `${this.baseMessageClass} ${messageClass ? messageClass : ""}`;

        this.rootElement.appendChild(messageElement);

        return messageElement;
    }

    /**
     * Add an error message to the log.
     * @param errorMessage Error message text.
     */
    public addErrorMessage(errorMessage: string): void {

        this.addMessageElement(errorMessage, MessageClass.Error);
    }

    /**
     * Add a warning message to the log.
     * @param warningMessage Warning message text.
     */
    public addWarningMessage(warningMessage: string): void {

        this.addMessageElement(warningMessage, MessageClass.Warning);
    }

    /**
     * Add an informational message to the log.
     * @param infoMessage Information message text.
     */
    public addInfoMessage(infoMessage: string): void {

        this.addMessageElement(infoMessage, MessageClass.Info);
    }

    /**
     * Add a message to the log.
     * @param message Information message text.
     * @param style Optional CSS style.
     */
    public addMessage(message: string, style?: string): void {

        const messageElement = this.addMessageElement(message);
        if (style)
            messageElement.style.cssText = style;
    }

    /**
     * Adds an empty line
     */
    public addEmptyLine(): void {

        // https://stackoverflow.com/questions/5140547/line-break-inside-a-list-item-generates-space-between-the-lines
//      this.addMessage('<br/><br/>');
        this.addMessage(".");
    }

    /**
     * Clears the log output
     */
    public clearLog(): void {

        // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
        while (this.rootElement.firstChild) {
            this.rootElement.removeChild(this.rootElement.firstChild);
        }
    }
}
