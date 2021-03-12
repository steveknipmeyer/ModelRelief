
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
     * @description Initialize the Project control.
     * @private
     * @param {string} elementId HTML element Id
     */
    private initializeProjectControl(elementId: string): void {
        const projectItems = document.querySelectorAll(`#${elementId} > a.dropdown-item`);
        for (let index = 0;  index < projectItems.length; index++) {
            const projectItem = projectItems[index];
            projectItem.addEventListener("click", (clickEvent: MouseEvent) => {
                const target = clickEvent.target as HTMLElement;
                const projectName = target.innerText;
                const projectUrl = `/projects/details?name=${projectName}&relations=models`;
                window.location.href = projectUrl;
            });
        }
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

        this.initializeControls();
    }
}

const layout = new Layout();
layout.main();