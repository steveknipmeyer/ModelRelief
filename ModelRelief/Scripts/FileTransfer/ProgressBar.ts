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

    private _progressBar: HTMLDivElement;

    /**
     * Creates an instance of ProgressBar.
     */
    constructor(progressBarId: string) {
        this._progressBar = document.getElementById(progressBarId) as HTMLDivElement;
    }

    /**
     * @description Initialize the ProgressBar.
     */
    public initialize(): void {
        this.update(0);
        this.enable(false);
    }

    /**
     * @description Make the ProgressBar visible or hidden.
     * @param {boolean} enable
     */
    public enable(enable: boolean): void {

        this._progressBar.style.visibility = enable ? "visible" : "hidden";
    }

    /**
     * @description Update the ProgressBar with the current percentage complete.
     * @param {number} percentComplete
     */
    public update(percentComplete: number): void {
        percentComplete = Math.round(percentComplete);
        $("#progressBar").attr("aria-valuenow", percentComplete).css("width", percentComplete);
        $("#progressBar").html(percentComplete + "%");
    }
}
