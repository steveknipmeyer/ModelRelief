// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {IThreeBaseCamera} from "Scripts/Graphics/IThreeBaseCamera";
import {ElementIds} from "Scripts/System/Html";
import {Initializer} from "Scripts/System/Initializer";
import {ILogger} from "Scripts/System/Logger";
import {Services} from "Scripts/System/Services";

/**
 * @description Settings Editor
 * @export
 * @class Editor
 */
class Editor {

    public _logger: ILogger;

    /**
     * Creates an instance of Editor.
     */
    constructor() {
    }

    /**
     * @description Initialize a checkbox control.
     * @private
     * @param {string} elementId HTML Id of checkbox control.
`     * @param {string} propertyName Setting property name.
     */
    private initializeCheckboxControl(elementId: string, propertyName: string): void {

        const control = document.querySelector(`#${elementId}`) as HTMLInputElement;
        const checked = window.localStorage[propertyName] === "true" ? true : false;
        control.checked = checked;

        control.addEventListener("change", (changeEvent) => {
            window.localStorage[propertyName] = control.checked ? "true" : "false";
        });
    }

    /**
     * @description Initialize the editor controls
     */
    public initializeControls(): void {

        this.initializeCheckboxControl(ElementIds.ExtendedCameraControls, ElementIds.ExtendedCameraControls);
    }

    /**
     * @description Main
     */
    public run(): void {
        this._logger = Services.htmlLogger;

        Initializer.initialize().then((status: boolean) => {

            // UI Controls
            this.initializeControls();
        });
        // Viewer
    }
}

const editor = new Editor();
editor.run();
