
// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";
import {ContentType, HttpLibrary, MethodType, ServerEndPoints} from "Scripts/System/Http";
import {ElementIds} from "Scripts/System/Html";
import {ISession} from "Scripts/Api/V1/Interfaces/ISession";
import {DtoSession} from "Scripts/Api/V1/Models/DtoSession";
/**
 * @description Layout
 * @export
 * @class Layout
 */
export class Layout {

    public session: DtoSession;

    /**
     * Creates an instance of Layout.
     */
    constructor() {
        // NOP
    }

    /**
     * @description Initialize the Project control.
     * @private
     * @param {string} menuLabelId HTML element Id
     * @param {string} menuId HTML element Id
     */
    private initializeProjectControl(menuLabelId: string, menuId: string): void {

        const projectMenuLabel:HTMLElement = document.querySelector(`#${menuLabelId}`);
        const projectMenuItems:NodeListOf<HTMLElement> = document.querySelectorAll(`#${menuId} > a.dropdown-item`);
        for (let index = 0;  index < projectMenuItems.length; index++) {

            const projectMenuItem = projectMenuItems[index];
            const projectId = parseInt(projectMenuItem.dataset.projectid);

            // New Project
            if (!projectId)
                continue;

            // update menu label if active Project
            if (projectId == this.session.projectId) {
                projectMenuLabel.innerText = projectMenuItem.innerText;
            }

            // click handler
            projectMenuItem.addEventListener("click", (clickEvent: MouseEvent) => {

                const target = clickEvent.target as HTMLElement;
                const projectName = target.innerText;
                const id = parseInt(target.dataset.projectid);

                this.session.projectId = id;
                this.session.project = null;
                this.session.update().then(() => {

                    projectMenuLabel.innerText = projectName;

                    // const projectUrl = `/projects/details?name=${projectName}&relations=models`;
                    const projectUrl = "/meshes";
                    window.location.href = projectUrl;
                });
            });
        }
    }

    /**
     * @description Initialize the _Layout controls.
     * @private
     */
    private initializeControls(): void {
        this.initializeProjectControl(ElementIds.ProjectMenuLabel, ElementIds.ProjectMenu);
    }

    /**
     * @description Initialize the _Layout.
     * @private
     */
    private async initializeaAsync(): Promise<void> {

        this.session = await DtoSession.initialize();
        this.initializeControls();
    }

    /**
     * @description Main
     */
    public main(): void {

        (async () => {
            await this.initializeaAsync();
        })();
    }
}

const layout = new Layout();
layout.main();
