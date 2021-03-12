
// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";
import {ElementIds} from "Scripts/System/Html";

/**
 * @description Layout
 * @export
 * @class Layout
 */
export class Layout {

    /**
     * Creates an instance of Layout.
     */
    constructor() {
        // NOP
    }

    /**
     * @description Initialize the Project Select control.
     * @private
     * @param {string} elementId HTML element Id
     */
    private initializeProjectControl(elementId: string): void {

        // const control = document.querySelector(`#${elementId} > div.dropdown-menu`) as HTMLDivElement;
        const control = document.querySelector(`#${elementId}`) as HTMLDivElement;

        control.addEventListener("click", (clickEvent: MouseEvent) => {
            const target = clickEvent.target as HTMLAnchorElement;
            console.log(target.innerText);
        });
    }

    /**
     * @description Initialize the _Layout controls.
     * @private
     */
    private initializeControls(): void {
        this.initializeProjectControl(ElementIds.ProjectDropDown);
    }

    /**
     * @description Main
     */
    public main(): void {
        const currentdate = new Date();
        const datetime = "Last Sync: " + currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
        console.log (datetime);

        this.initializeControls();
    }
}

const layout = new Layout();
layout.main();