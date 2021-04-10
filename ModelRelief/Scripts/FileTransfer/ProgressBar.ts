// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

/**
 * @description Progress bar for monitoring percentage completion of an operation.
 * @export
 * @class ProgressBar
 */
export class ProgressBar {
    private static _index = 0;

    private _progressBar: HTMLElement;

    /**
     * Creates an instance of ProgressBar.
     * @param {string} containerId HTML container to hold the ProgressBar.
     * @param {string} templateId Id of template ProgressBar.
     */
    constructor(containerId: string, templateId: string) {

        this.initialize(containerId, templateId);
    }

    /**
     * @description Initialize the ProgressBar.
     * @param {string} containerId HTML container to hold the ProgressBar.
     * @param {string} templateId Id of template ProgressBar.
     */
    public initialize(containerId: string, templateId: string): void {

        const container = document.getElementById(containerId) as HTMLElement;
        const template = document.getElementById(templateId).cloneNode(true) as HTMLElement;

        this._progressBar = container.appendChild(template);
        this._progressBar.id = `progressBar${ProgressBar._index++}`;
        this._progressBar.hidden = false;

        this.update(0);
        this.enable(false);
    }

    /**
     * @description Make the ProgressBar visible or hidden.
     * @param {boolean} enable
     */
    public enable(enable: boolean): void {

        this._progressBar.style.visibility = enable ? "visible" : "hidden";
        this.update(0);
    }

    /**
     * @description Update the ProgressBar with the current percentage complete.
     * @param {number} percentComplete
     */
    public update(value: number): void {

        const percentComplete: string = Math.round(value).toString();
        this._progressBar.setAttribute("aria-valuenow", percentComplete);
        this._progressBar.style.width = `${percentComplete}%`;
        this._progressBar.innerHTML = `${percentComplete}%`;
    }
}
