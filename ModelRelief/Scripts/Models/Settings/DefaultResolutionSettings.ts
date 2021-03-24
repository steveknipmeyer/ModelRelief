// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

/**
 * @description DefaultResolutionSettings
 * @export
 * @class DefaultResolutionSettings
 */
export class DefaultResolutionSettings  {

    public image: number;

    /**
     * Creates an instance of DefaultResolutionSettings.
     */
    constructor() {
        // NOP
    }

    /**
     * @description Initialize the default resolution settings from the common JSON file used to share settings between the front end (FE) and back end (BE).
     * @static
     */
    // N.B. defaultSettings is dynamic (and intentially un-typed) as it assigned from the JSON settings
    //eslint-disable-next-line
    public async initialize(defaultSettings): Promise<void> {

        this.image = defaultSettings.Resolution.Image;
    }
}
