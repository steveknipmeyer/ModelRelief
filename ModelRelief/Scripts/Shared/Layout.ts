
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

    public session: ISession;

    /**
     * Creates an instance of Layout.
     */
    constructor() {
        // NOP
    }

    /**
     * @description Initialize the session settings.
     * @static
     * @returns {Promise<void>}
     */
    public async initializeSession(): Promise<void> {

        // Populate the session settings from the JSON file.
        const endPoint = `${HttpLibrary.HostRoot}${ServerEndPoints.ApiSettingsSession}`;
        const result = await HttpLibrary.submitHttpRequestAsync(endPoint, MethodType.Get, ContentType.Json, null);
        const session = new DtoSession(JSON.parse(result.contentString));

        this.session = session;
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
     * @description Initialize the _Layout.
     * @private
     */
    private async initializeaAsync(): Promise<void> {
        await this.initializeSession();
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